CREATE TABLE IF NOT EXISTS resources (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  data        BYTEA         NOT NULL,
  filename    VARCHAR(255)  NOT NULL,
  "mimeType"  VARCHAR(100)  NOT NULL,
  size        INT           NOT NULL,
  "createdAt" TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
