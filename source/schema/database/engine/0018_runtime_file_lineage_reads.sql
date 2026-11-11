-- Lineage is exposed only through the authorized named read operation.
GRANT SELECT (relation, engine_job_id, created_at) ON filesystem.file_relations TO mzizi_database_runtime;
