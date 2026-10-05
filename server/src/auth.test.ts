import assert from "node:assert/strict";
import { test } from "node:test";
import { authRequiredFromEnv, bearerToken, hashToken, mayAccess, newToken } from "./auth.js";

test("a new token is 43 URL-safe characters and never repeats", () => {
  const seen = new Set<string>();
  for (let i = 0; i < 200; i++) {
    const token = newToken();
    assert.match(token, /^[A-Za-z0-9_-]{43}$/);
    seen.add(token);
  }
  assert.equal(seen.size, 200);
});

test("the stored hash is 32 bytes, stable, and not the token", () => {
  const token = newToken();
  const hash = hashToken(token);
  assert.equal(hash.length, 32);
  assert.deepEqual(hash, hashToken(token));
  assert.notDeepEqual(hash, hashToken(newToken()));
  assert.ok(!hash.toString("utf8").includes(token));
});

test("bearerToken reads a well-formed header", () => {
  const token = newToken();
  assert.equal(bearerToken(`Bearer ${token}`), token);
});

test("bearerToken rejects anything else", () => {
  const token = newToken();
  for (const header of [
    undefined,
    "",
    token,
    `bearer ${token}`,
    `Basic ${token}`,
    `Bearer ${token} `,
    ` Bearer ${token}`,
    `Bearer ${token}x`,
    `Bearer ${token.slice(1)}`,
    `Bearer ${token.slice(0, 42)}!`,
    `Bearer ${token}\nBearer ${token}`,
    "Bearer ",
  ]) {
    assert.equal(bearerToken(header), null, JSON.stringify(header));
  }
});

test("required: only the matching token gets in", () => {
  const token = newToken();
  const stored = hashToken(token);
  assert.equal(mayAccess(stored, token, true), true);
  assert.equal(mayAccess(stored, newToken(), true), false);
  assert.equal(mayAccess(stored, null, true), false);
});

test("required: a conversation made before tokens existed stays locked", () => {
  assert.equal(mayAccess(null, newToken(), true), false);
  assert.equal(mayAccess(null, null, true), false);
});

test("required: one conversation's token does not open another", () => {
  const mine = newToken();
  const theirs = newToken();
  assert.equal(mayAccess(hashToken(theirs), mine, true), false);
  assert.equal(mayAccess(hashToken(mine), theirs, true), false);
});

test("rollout window: no token passes, a wrong token still fails", () => {
  const token = newToken();
  assert.equal(mayAccess(hashToken(token), null, false), true);
  assert.equal(mayAccess(null, null, false), true);
  assert.equal(mayAccess(hashToken(token), token, false), true);
  assert.equal(mayAccess(hashToken(token), newToken(), false), false);
  assert.equal(mayAccess(null, newToken(), false), false);
});

test("AUTH_REQUIRED is off only for the exact string false", () => {
  assert.equal(authRequiredFromEnv({}), true);
  assert.equal(authRequiredFromEnv({ AUTH_REQUIRED: "true" }), true);
  assert.equal(authRequiredFromEnv({ AUTH_REQUIRED: "false" }), false);
  for (const typo of ["False", "FALSE", "0", "no", "off", " false", "false ", ""]) {
    assert.equal(authRequiredFromEnv({ AUTH_REQUIRED: typo }), true, JSON.stringify(typo));
  }
});
