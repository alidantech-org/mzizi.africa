-- PostgreSQL requires SELECT on columns returned by INSERT ... RETURNING.
-- Keep runtime reads limited to the upload reservation response fields.
GRANT SELECT (id, temp_key, lease_expires_at, expires_at, status) ON filesystem.uploads TO mzizi_database_runtime;
