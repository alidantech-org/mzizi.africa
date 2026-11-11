-- Auth helpers can mutate grants and bootstrap accounts; never inherit PostgreSQL's PUBLIC EXECUTE default.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA auth FROM PUBLIC;

-- The database service receives only functions needed to resolve identities and evaluate read-only permissions.
GRANT EXECUTE ON FUNCTION auth.ancestors(text,uuid),
  auth.descendants(text,uuid),
  auth.live_grants(uuid,text,text),
  auth.can_platform(uuid,text),
  auth.can_link(uuid,text,text,uuid),
  auth.can(uuid,text,text,uuid),
  auth.can_change(uuid,text,text,uuid,uuid),
  auth.allowed_links(uuid,text,text),
  auth.resolve_identity(text,text)
TO mzizi_database_runtime;
