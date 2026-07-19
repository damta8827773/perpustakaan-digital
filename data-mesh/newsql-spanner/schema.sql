-- Skema relasional master (CockroachDB/Google Spanner). Bahasa: SQL.
CREATE TABLE books (
    id STRING(64) PRIMARY KEY,
    isbn STRING(32) NOT NULL,
    title STRING(256) NOT NULL,
    author STRING(128) NOT NULL,
    category STRING(64) NOT NULL,
    year INT64 NOT NULL,
    stock_total INT64 NOT NULL DEFAULT 0,
    stock_available INT64 NOT NULL DEFAULT 0
);

CREATE TABLE loans (
    id STRING(64) PRIMARY KEY,
    nim STRING(16) NOT NULL,
    book_id STRING(64) NOT NULL REFERENCES books (id),
    borrowed_at TIMESTAMPTZ NOT NULL,
    due_at TIMESTAMPTZ NOT NULL,
    returned_at TIMESTAMPTZ
);

CREATE INDEX loans_by_nim ON loans (nim, borrowed_at DESC);
