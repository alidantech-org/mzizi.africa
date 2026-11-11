-- Persist exact-version lineage through a named database operation.
-- The service returns the inserted id and exposes no general relation reads.
GRANT INSERT ON filesystem.file_relations TO mzizi_database_runtime;
GRANT SELECT (id) ON filesystem.file_relations TO mzizi_database_runtime;
