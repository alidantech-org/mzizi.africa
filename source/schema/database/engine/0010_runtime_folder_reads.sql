-- Named database-service reads for the Python filesystem HTTP API.
GRANT EXECUTE ON FUNCTION filesystem.folder_path(uuid), filesystem.effective_folder(uuid) TO mzizi_database_runtime;
