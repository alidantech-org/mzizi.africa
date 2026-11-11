-- Named database-service file detail reads; do not expose S3 keys to Python API clients.
GRANT SELECT ON filesystem.file_versions TO mzizi_database_runtime;
GRANT EXECUTE ON FUNCTION filesystem.file_path(uuid) TO mzizi_database_runtime;
