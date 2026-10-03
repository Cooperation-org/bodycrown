-- A visitor is one browser that opened the Crownie chat. No account yet;
-- when login arrives, a visitor gets linked to a user.
CREATE TABLE visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id bigserial PRIMARY KEY,
  visitor_id uuid NOT NULL REFERENCES visitors (id) ON DELETE CASCADE,
  speaker text NOT NULL CHECK (speaker IN ('her', 'crownie')),
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX messages_visitor_id_idx ON messages (visitor_id, id);
