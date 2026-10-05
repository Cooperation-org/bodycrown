import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// Each conversation has a secret token. The browser gets it once, when the
// conversation is created, and sends it as "Authorization: Bearer <token>" on
// every read and write. The database keeps only the SHA-256 of it. The token is
// 256 random bits, so a fast one-way hash is enough; no password stretching.

const TOKEN_BYTES = 32;
// 32 bytes as unpadded base64url is 43 characters. The scheme word is matched exactly: our own frontend
// is the only client, and a strict match leaves nothing to guess at (RFC 7235 would also accept "bearer").
const BEARER = /^Bearer ([A-Za-z0-9_-]{43})$/;

/** A new secret for one conversation. */
export function newToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

/** What the database stores for a token. */
export function hashToken(token: string): Buffer {
  return createHash("sha256").update(token).digest();
}

/** The token in an Authorization header, or null if there is none or it is malformed. */
export function bearerToken(header: string | undefined): string | null {
  const match = BEARER.exec(header ?? "");
  return match ? match[1] : null;
}

/**
 * Whether a request may use a conversation.
 *
 * storedHash is the conversation's hash, or null for one created before tokens
 * existed. presented is the token the request sent, or null.
 *
 * With authRequired, only a matching token passes, and a conversation with no
 * hash is locked. Without it (a short rollout window while browsers still have
 * the old code) a request with no token passes as it used to, but a request that
 * does send a token must still match.
 */
export function mayAccess(
  storedHash: Buffer | null,
  presented: string | null,
  authRequired: boolean,
): boolean {
  if (presented === null) return !authRequired;
  if (storedHash === null) return false;
  const given = hashToken(presented);
  return given.length === storedHash.length && timingSafeEqual(given, storedHash);
}

/** AUTH_REQUIRED is on unless it is exactly "false", so a typo cannot switch it off. */
export function authRequiredFromEnv(env: NodeJS.ProcessEnv): boolean {
  return env.AUTH_REQUIRED !== "false";
}
