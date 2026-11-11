-- The database service owns filesystem folder creation. Its runtime login may insert rows only;
-- updates and deletes remain unavailable until their corresponding named operations are moved.
GRANT INSERT ON filesystem.folders TO mzizi_database_runtime;
