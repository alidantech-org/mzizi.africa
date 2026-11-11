-- Transitional, named job/event operations for the Python capability engine.
-- TypeScript remains the sole application writer; engine workers never receive PG credentials.
GRANT SELECT, INSERT, UPDATE ON engine.jobs TO mzizi_database_runtime;
GRANT SELECT, INSERT, UPDATE ON engine.outbox TO mzizi_database_runtime;
REVOKE UPDATE ON engine.events FROM mzizi_database_runtime;
