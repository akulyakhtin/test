CREATE TABLE IF NOT EXISTS songs (
  id          UUID          PRIMARY KEY,
  name        VARCHAR(500),
  artist      VARCHAR(500),
  album       VARCHAR(500),
  duration    VARCHAR(10),
  year        VARCHAR(4),
  "createdAt" TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
