-- Scoped authorization checks run through named database-service operations, never ad hoc Python SQL.
GRANT EXECUTE ON FUNCTION auth.can_link(uuid,text,text,uuid) TO mzizi_database_runtime;
GRANT EXECUTE ON FUNCTION auth.can(uuid,text,text,uuid) TO mzizi_database_runtime;
GRANT EXECUTE ON FUNCTION auth.can_change(uuid,text,text,uuid,uuid) TO mzizi_database_runtime;
