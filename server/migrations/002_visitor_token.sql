-- The secret that protects one conversation. Only the SHA-256 of the token is
-- stored; the token itself is shown to the browser once, when the conversation
-- is created. NULL for conversations created before this migration, which stay
-- locked. Additive and nullable, so the previous server keeps working until it is
-- replaced.
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS token_hash bytea;
