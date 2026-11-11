DO $$ BEGIN CREATE ROLE mzizi_api_reader NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE ROLE mzizi_database_runtime NOLOGIN; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

GRANT USAGE ON SCHEMA auth,engine,filesystem,geography,legal,reference,audit TO mzizi_api_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA auth,engine,filesystem,geography,legal,reference,audit TO mzizi_api_reader;

GRANT USAGE ON SCHEMA auth,engine,audit TO mzizi_database_runtime;
GRANT SELECT,INSERT ON audit.comments,audit.evidence,audit.decisions TO mzizi_database_runtime;
GRANT SELECT,INSERT,UPDATE ON engine.runs,engine.pipeline_releases,engine.pipeline_commands,engine.pipeline_reviews,engine.events TO mzizi_database_runtime;
GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA engine TO mzizi_database_runtime;
GRANT EXECUTE ON FUNCTION auth.resolve_identity(text,text) TO mzizi_database_runtime;
GRANT EXECUTE ON FUNCTION auth.can_platform(uuid,text) TO mzizi_database_runtime;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

COMMENT ON ROLE mzizi_api_reader IS 'Read-only application role for the NestJS API.';
COMMENT ON ROLE mzizi_database_runtime IS 'Named-operation runtime role. Cannot create schema objects or execute migrations.';
