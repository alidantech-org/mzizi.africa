-- Upload session metadata is reserved through the database owner; Python handles only S3 transfer and verification.
GRANT INSERT ON filesystem.uploads TO mzizi_database_runtime;
