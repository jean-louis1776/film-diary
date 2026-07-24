#!/bin/sh
# Creates a read-only role for the public Node API.
# Runs once on first startup of the postgres container (empty data dir).
set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE ROLE api_reader LOGIN PASSWORD '${API_READER_PASSWORD}';
  GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO api_reader;
  GRANT USAGE ON SCHEMA public TO api_reader;
  -- tables that already exist
  GRANT SELECT ON ALL TABLES IN SCHEMA public TO api_reader;
  -- tables created later by migrations (run as ${POSTGRES_USER})
  ALTER DEFAULT PRIVILEGES FOR ROLE ${POSTGRES_USER} IN SCHEMA public
    GRANT SELECT ON TABLES TO api_reader;
EOSQL
