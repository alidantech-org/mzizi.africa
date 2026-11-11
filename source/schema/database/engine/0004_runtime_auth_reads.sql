-- Authorization functions are invoker-security functions; runtime callers need their underlying read set.
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO mzizi_database_runtime;
