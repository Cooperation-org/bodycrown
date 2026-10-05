// Applies migrations/*.sql in name order, once each. Run with the owner role:
//   MIGRATE_DATABASE_URL=postgresql://<owner_user>@<db-host>/<database> npm run migrate
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";

const dir = fileURLToPath(new URL("../migrations/", import.meta.url));
const client = new pg.Client({ connectionString: process.env.MIGRATE_DATABASE_URL });
await client.connect();
await client.query(
  "CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
);
const applied = new Set(
  (await client.query<{ name: string }>("SELECT name FROM schema_migrations")).rows.map((r) => r.name),
);
for (const name of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
  if (applied.has(name)) continue;
  await client.query("BEGIN");
  await client.query(await readFile(dir + name, "utf8"));
  await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
  await client.query("COMMIT");
  console.log(`applied ${name}`);
}
await client.end();
