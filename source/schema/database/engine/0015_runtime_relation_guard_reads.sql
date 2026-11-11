-- The relation cycle guard reads existing endpoints while checking the new edge.
-- Grant only those columns plus the inserted id returned by the named operation.
GRANT SELECT (id, source_version_id, derived_version_id) ON filesystem.file_relations TO mzizi_database_runtime;
