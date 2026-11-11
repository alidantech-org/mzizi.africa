-- Invoker-security auth.can/can_change use governed link tables to resolve scope.
GRANT USAGE ON SCHEMA filesystem TO mzizi_database_runtime;
GRANT SELECT ON filesystem.folders,filesystem.files TO mzizi_database_runtime;
