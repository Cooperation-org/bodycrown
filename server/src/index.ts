import Anthropic from "@anthropic-ai/sdk";
import express, { type NextFunction, type Request, type Response } from "express";
import pg from "pg";
import { authRequiredFromEnv, bearerToken, hashToken, mayAccess, newToken } from "./auth.js";
import { crownieSystemPrompt } from "./crownie.js";
import { clientOptions, complete, fallbackFromEnv, type Provider } from "./llm.js";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

const port = Number(process.env.PORT ?? 8065);
const corsOrigins = new Set(required("CORS_ORIGINS").split(","));
const pool = new pg.Pool({ connectionString: required("DATABASE_URL"), max: 5 });

// Every conversation needs its token. AUTH_REQUIRED=false is only for the short window while
// browsers still run the old code; it is on unless the value is exactly "false".
const authRequired = authRequiredFromEnv(process.env);
if (!authRequired) console.warn("AUTH_REQUIRED=false: requests without a token are still accepted");

// Fail at startup, with a clear message, if migration 002 has not been applied.
try {
  await pool.query("SELECT token_hash FROM visitors LIMIT 0");
} catch (error) {
  if ((error as { code?: string }).code === "42703") {
    throw new Error("visitors.token_hash is missing: run `npm run migrate` first");
  }
  // Anything else (the database is briefly unreachable) is not a reason to stop: requests will fail until it is back.
  console.error("could not check the schema at startup", error);
}

// Primary model answers first; the optional fallback answers only if the primary fails or is slow.
const modelTimeoutMs = Number(process.env.LLM_TIMEOUT_MS ?? 20_000);
const fallbackEnv = fallbackFromEnv(process.env);
const providers: Provider[] = [
  {
    label: "primary",
    model: required("LLM_MODEL"),
    messages: new Anthropic({
      apiKey: required("LLM_API_KEY"),
      baseURL: required("LLM_BASE_URL"),
      ...clientOptions("primary", Boolean(fallbackEnv), modelTimeoutMs),
    }).messages,
  },
];
if (fallbackEnv) {
  providers.push({
    label: "fallback",
    model: fallbackEnv.model,
    messages: new Anthropic({
      apiKey: fallbackEnv.apiKey,
      baseURL: fallbackEnv.baseUrl,
      ...clientOptions("fallback", true, modelTimeoutMs),
    }).messages,
  });
}

const MAX_MESSAGE_CHARS = 2000;
const CONTEXT_MESSAGES = 40;
const NOT_FOUND = { error: "Conversation not found.", code: "conversation_not_found" } as const;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Fixed-window counter per key, in memory. Caps model spend from one browser or one IP. */
function rateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (key: string) => {
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      if (hits.size > 10_000) hits.clear();
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}
const perVisitor = rateLimiter(30, 10 * 60_000);
const perIp = rateLimiter(60, 10 * 60_000);
const newVisitorsPerIp = rateLimiter(10, 60 * 60_000);

const app = express();
// Proxies in front of this server (nginx, then Caddy on the host), so req.ip is the visitor.
app.set("trust proxy", required("TRUSTED_PROXIES").split(","));
app.use(express.json({ limit: "16kb" }));

app.use((req: Request, res: Response, next: NextFunction) => {
  // Conversations are private: nothing here may be kept by a browser or a proxy cache.
  res.setHeader("Cache-Control", "no-store");
  const origin = req.headers.origin;
  if (origin && corsOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

/**
 * Whether this request may use the conversation in its URL. An unknown id, a missing or wrong
 * token, and another conversation's token all give the same answer, so a caller cannot tell
 * which ids exist.
 */
async function mayUseConversation(req: Request, id: string) {
  if (!UUID.test(id)) return false;
  const { rows } = await pool.query<{ token_hash: Buffer | null }>(
    "SELECT token_hash FROM visitors WHERE id = $1",
    [id],
  );
  if (rows.length !== 1) return false;
  const presented = bearerToken(req.headers.authorization);
  const allowed = mayAccess(rows[0].token_hash, presented, authRequired);
  if (allowed && presented === null) console.warn("request without a token accepted (AUTH_REQUIRED=false)");
  return allowed;
}

app.get("/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ ok: true });
});

app.post("/visitors", async (req, res) => {
  if (!newVisitorsPerIp(req.ip ?? "")) {
    res.status(429).json({ error: "Too many new conversations. Please try again later." });
    return;
  }
  // The token is returned once and only its hash is kept, so a database reader cannot use it.
  const token = newToken();
  const { rows } = await pool.query<{ id: string }>(
    "INSERT INTO visitors (token_hash) VALUES ($1) RETURNING id",
    [hashToken(token)],
  );
  res.status(201).json({ id: rows[0].id, token });
});

app.get("/visitors/:id/messages", async (req, res) => {
  if (!(await mayUseConversation(req, req.params.id))) {
    res.status(404).json(NOT_FOUND);
    return;
  }
  const { rows } = await pool.query(
    "SELECT id, speaker, text FROM messages WHERE visitor_id = $1 ORDER BY id",
    [req.params.id],
  );
  res.json({ messages: rows });
});

app.post("/visitors/:id/messages", async (req, res) => {
  // Lower case, so the two spellings of one id share one rate-limit bucket.
  const visitorId = req.params.id.toLowerCase();
  // Authorise before using the body, so a stranger learns nothing about the conversation. (A body the
  // parser rejects is answered earlier, by the error handler, and says nothing about any conversation.)
  if (!(await mayUseConversation(req, visitorId))) {
    res.status(404).json(NOT_FOUND);
    return;
  }
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    res.status(400).json({ error: "Message is empty." });
    return;
  }
  if (text.length > MAX_MESSAGE_CHARS) {
    res.status(400).json({ error: `Messages can be up to ${MAX_MESSAGE_CHARS} characters.` });
    return;
  }
  if (!perVisitor(visitorId) || !perIp(req.ip ?? "")) {
    res.status(429).json({ error: "Let's slow down for a moment. Try again in a few minutes." });
    return;
  }

  const { rows: history } = await pool.query<{ speaker: string; text: string }>(
    `SELECT speaker, text FROM (
       SELECT id, speaker, text FROM messages WHERE visitor_id = $1 ORDER BY id DESC LIMIT $2
     ) recent ORDER BY id`,
    [visitorId, CONTEXT_MESSAGES],
  );
  const conversation: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.speaker === "her" ? "user" : "assistant",
    content: m.text,
  }));
  // The model API needs the conversation to start with the user.
  while (conversation[0]?.role === "assistant") conversation.shift();
  conversation.push({ role: "user", content: text });

  let reply: string;
  try {
    const answer = await complete(providers, crownieSystemPrompt, conversation);
    reply = answer.reply;
    // Which model wrote this one; never the message text.
    console.log(`reply written by ${answer.provider}`);
  } catch (error) {
    console.error("all model providers failed", error);
    res.status(502).json({ error: "Crownie couldn't answer just now. Please try again." });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("INSERT INTO messages (visitor_id, speaker, text) VALUES ($1, 'her', $2)", [
      visitorId,
      text,
    ]);
    const { rows } = await client.query(
      "INSERT INTO messages (visitor_id, speaker, text) VALUES ($1, 'crownie', $2) RETURNING id, speaker, text",
      [visitorId, reply],
    );
    await client.query("COMMIT");
    res.json({ reply: rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // A request the body parser rejects (too large, not valid JSON) is the caller's mistake, not a server fault.
  const status = (error as { status?: number }).status;
  if (status === 413) {
    res.status(413).json({ error: `Messages can be up to ${MAX_MESSAGE_CHARS} characters.` });
    return;
  }
  if (status === 400) {
    res.status(400).json({ error: "That request could not be read." });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

app.listen(port, "127.0.0.1", () => console.log(`bodycrown server on 127.0.0.1:${port}`));
