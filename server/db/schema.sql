CREATE TABLE IF NOT EXISTS projects (
  id        SERIAL PRIMARY KEY,
  title     TEXT   NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  problem   TEXT   NOT NULL DEFAULT '',
  summary   TEXT   NOT NULL DEFAULT '',
  tech      TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT   NOT NULL DEFAULT '',
  live_url  TEXT   NOT NULL DEFAULT '',
  repo_url  TEXT   NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL      PRIMARY KEY,
  name       TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email      TEXT        NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  message    TEXT        NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
