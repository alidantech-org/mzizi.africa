import { Client } from "pg";

function assertLocalTarget(connectionString: string): void {
  const url = new URL(connectionString);
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!["localhost", "127.0.0.1", "::1", "postgis"].includes(host) || url.pathname.slice(1) !== "mzizi_new") {
    throw new Error("Database ownership verification is restricted to local mzizi_new");
  }
}

/** Prove the local API role is read-only and the database-service login is non-administrative. */
export async function verifyLocalOwnership(connectionString: string): Promise<void> {
  assertLocalTarget(connectionString);
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const [{ database }] = (await client.query("SELECT current_database() AS database")).rows;
    if (database !== "mzizi_new") throw new Error("Expected mzizi_new");
    const result = await client.query(`SELECT
        pg_has_role('database_runtime','mzizi_database_runtime','member') AS "runtimeMember",
        pg_has_role('api_reader','mzizi_api_reader','member') AS "readerMember",
        (SELECT rolsuper FROM pg_roles WHERE rolname='database_runtime') AS "runtimeSuper",
        (SELECT rolcreatedb FROM pg_roles WHERE rolname='database_runtime') AS "runtimeCreateDb",
        (SELECT rolcreaterole FROM pg_roles WHERE rolname='database_runtime') AS "runtimeCreateRole",
        (SELECT rolsuper FROM pg_roles WHERE rolname='api_reader') AS "readerSuper",
        EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
          WHERE n.nspname IN ('auth','engine','filesystem','geography','legal','reference','audit')
            AND c.relkind IN ('r','p','v','m','f')
            AND (has_table_privilege('api_reader',c.oid,'INSERT') OR has_table_privilege('api_reader',c.oid,'UPDATE')
              OR has_table_privilege('api_reader',c.oid,'DELETE') OR has_table_privilege('api_reader',c.oid,'TRUNCATE'))) AS "readerMutation",
        has_table_privilege('database_runtime','public.mzizi_migration_checksums','INSERT') AS "runtimeMigrationInsert",
        has_schema_privilege('database_runtime','filesystem','CREATE') AS "runtimeSchemaCreate",
        has_table_privilege('database_runtime','engine.pipeline_commands','INSERT') AS "runtimePipelineInsert",
        has_table_privilege('database_runtime','filesystem.folders','INSERT') AS "runtimeFolderInsert",
        has_table_privilege('database_runtime','filesystem.folders','UPDATE') AS "runtimeFolderUpdate",
        has_table_privilege('database_runtime','filesystem.folders','DELETE') AS "runtimeFolderDelete",
        has_table_privilege('database_runtime','engine.jobs','INSERT') AS "runtimeJobInsert",
        has_table_privilege('database_runtime','engine.jobs','UPDATE') AS "runtimeJobUpdate",
        has_table_privilege('database_runtime','engine.jobs','DELETE') AS "runtimeJobDelete",
        has_table_privilege('database_runtime','engine.outbox','INSERT') AS "runtimeOutboxInsert",
        has_table_privilege('database_runtime','engine.outbox','UPDATE') AS "runtimeOutboxUpdate",
        has_table_privilege('database_runtime','engine.outbox','DELETE') AS "runtimeOutboxDelete",
        has_table_privilege('database_runtime','engine.events','UPDATE') AS "runtimeEventUpdate",
        has_table_privilege('database_runtime','filesystem.file_versions','SELECT') AS "runtimeFileVersionRead",
        has_table_privilege('database_runtime','filesystem.uploads','INSERT') AS "runtimeUploadInsert",
        has_table_privilege('database_runtime','filesystem.uploads','SELECT') AS "runtimeUploadSelect",
        has_column_privilege('database_runtime','filesystem.uploads','temp_key','SELECT') AS "runtimeUploadTempKeySelect",
        has_table_privilege('database_runtime','filesystem.uploads','UPDATE') AS "runtimeUploadUpdate",
        has_table_privilege('database_runtime','filesystem.uploads','DELETE') AS "runtimeUploadDelete",
        has_table_privilege('database_runtime','filesystem.file_relations','INSERT') AS "runtimeRelationInsert",
        has_table_privilege('database_runtime','filesystem.file_relations','SELECT') AS "runtimeRelationSelect",
        has_column_privilege('database_runtime','filesystem.file_relations','id','SELECT') AS "runtimeRelationIdSelect",
        has_column_privilege('database_runtime','filesystem.file_relations','source_version_id','SELECT') AS "runtimeRelationSourceSelect",
        has_column_privilege('database_runtime','filesystem.file_relations','derived_version_id','SELECT') AS "runtimeRelationDerivedSelect",
        has_column_privilege('database_runtime','filesystem.file_relations','relation','SELECT') AS "runtimeRelationKindSelect",
        has_column_privilege('database_runtime','filesystem.file_relations','engine_job_id','SELECT') AS "runtimeRelationJobSelect",
        has_column_privilege('database_runtime','filesystem.file_relations','created_at','SELECT') AS "runtimeRelationCreatedSelect",
        has_function_privilege('database_runtime','filesystem.expired_uploads(integer)','EXECUTE') AS "runtimeExpiredUploads",
        has_function_privilege('database_runtime','filesystem.abandon_expired_uploads(integer)','EXECUTE') AS "runtimeAbandonUploads",
        has_function_privilege('database_runtime','filesystem.trim_upload_sessions(integer,integer)','EXECUTE') AS "runtimeTrimUploads",
        has_function_privilege('database_runtime','filesystem.mark_uploads_cleaned(uuid[])','EXECUTE') AS "runtimeMarkUploadsCleaned",
        has_function_privilege('api_reader','filesystem.abandon_expired_uploads(integer)','EXECUTE') AS "readerAbandonUploads",
        has_function_privilege('api_reader','filesystem.trim_upload_sessions(integer,integer)','EXECUTE') AS "readerTrimUploads",
        has_function_privilege('api_reader','filesystem.mark_uploads_cleaned(uuid[])','EXECUTE') AS "readerMarkUploadsCleaned",
        has_function_privilege('database_runtime','filesystem.folder_path(uuid)','EXECUTE') AS "runtimeFolderPath",
        has_function_privilege('database_runtime','filesystem.file_path(uuid)','EXECUTE') AS "runtimeFilePath",
        EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
          WHERE n.nspname='auth' AND p.proname IN ('register_scope_target','register_governed_table','register_namespace','create_role','grant_role','revoke_grant','bootstrap_admin')
            AND (has_function_privilege('api_reader',p.oid,'EXECUTE') OR has_function_privilege('database_runtime',p.oid,'EXECUTE'))) AS "runtimeCanMutateAuth",
        has_function_privilege('api_reader','auth.bootstrap_admin(text,text,text,text)','EXECUTE') AS "readerBootstrap",
        has_function_privilege('database_runtime','auth.resolve_identity(text,text)','EXECUTE') AS "runtimeCanResolveAuth"`);
    const row = result.rows[0] as {
      runtimeMember: boolean; readerMember: boolean; runtimeSuper: boolean; runtimeCreateDb: boolean;
      runtimeCreateRole: boolean; readerSuper: boolean; readerMutation: boolean;
      runtimeMigrationInsert: boolean; runtimeSchemaCreate: boolean; runtimePipelineInsert: boolean;
      runtimeFolderInsert: boolean; runtimeFolderUpdate: boolean; runtimeFolderDelete: boolean;
      runtimeJobInsert: boolean; runtimeJobUpdate: boolean; runtimeJobDelete: boolean;
      runtimeOutboxInsert: boolean; runtimeOutboxUpdate: boolean; runtimeOutboxDelete: boolean; runtimeEventUpdate: boolean;
      runtimeFileVersionRead: boolean; runtimeFolderPath: boolean; runtimeFilePath: boolean;
      runtimeUploadInsert: boolean; runtimeUploadSelect: boolean; runtimeUploadTempKeySelect: boolean; runtimeUploadUpdate: boolean; runtimeUploadDelete: boolean;
      runtimeRelationInsert: boolean; runtimeRelationSelect: boolean; runtimeRelationIdSelect: boolean; runtimeRelationSourceSelect: boolean; runtimeRelationDerivedSelect: boolean;
      runtimeRelationKindSelect: boolean; runtimeRelationJobSelect: boolean; runtimeRelationCreatedSelect: boolean;
      runtimeExpiredUploads: boolean; runtimeAbandonUploads: boolean; runtimeTrimUploads: boolean; readerAbandonUploads: boolean; readerTrimUploads: boolean;
      runtimeMarkUploadsCleaned: boolean; readerMarkUploadsCleaned: boolean;
      runtimeCanMutateAuth: boolean; readerBootstrap: boolean; runtimeCanResolveAuth: boolean;
    } | undefined;
    if (!row) throw new Error("Could not inspect local role privileges");
    const { runtimeMember, readerMember, runtimeSuper, runtimeCreateDb, runtimeCreateRole, readerSuper,
      readerMutation, runtimeMigrationInsert, runtimeSchemaCreate, runtimePipelineInsert, runtimeCanMutateAuth,
      runtimeFolderInsert, runtimeFolderUpdate, runtimeFolderDelete, runtimeJobInsert, runtimeJobUpdate, runtimeJobDelete,
      runtimeOutboxInsert, runtimeOutboxUpdate, runtimeOutboxDelete, runtimeEventUpdate,
      runtimeFileVersionRead, runtimeFolderPath, runtimeFilePath, runtimeUploadInsert, runtimeUploadSelect, runtimeUploadTempKeySelect, runtimeUploadUpdate, runtimeUploadDelete,
      runtimeRelationInsert, runtimeRelationSelect, runtimeRelationIdSelect, runtimeRelationSourceSelect, runtimeRelationDerivedSelect,
      runtimeRelationKindSelect, runtimeRelationJobSelect, runtimeRelationCreatedSelect,
      runtimeExpiredUploads, runtimeAbandonUploads, runtimeTrimUploads, runtimeMarkUploadsCleaned, readerAbandonUploads, readerTrimUploads, readerMarkUploadsCleaned,
      readerBootstrap, runtimeCanResolveAuth } = row;
    const failures: string[] = [];
    if (!runtimeMember) failures.push("database_runtime is not a member of mzizi_database_runtime");
    if (!readerMember) failures.push("api_reader is not a member of mzizi_api_reader");
    if (runtimeSuper || runtimeCreateDb || runtimeCreateRole) failures.push("database_runtime has administrative role attributes");
    if (readerSuper) failures.push("api_reader is a superuser");
    if (readerMutation) failures.push("api_reader has a mutation privilege on an application table");
    if (runtimeMigrationInsert || runtimeSchemaCreate) failures.push("database_runtime can change schema or migration history");
    if (!runtimePipelineInsert) failures.push("database_runtime cannot persist pipeline commands");
    if (!runtimeFolderInsert || runtimeFolderUpdate || runtimeFolderDelete) failures.push("database_runtime folder privileges are not scoped to create-folder operation");
    if (!runtimeJobInsert || !runtimeJobUpdate || runtimeJobDelete || !runtimeOutboxInsert || !runtimeOutboxUpdate || runtimeOutboxDelete || runtimeEventUpdate) {
      failures.push("database_runtime job/outbox privileges are not scoped to named engine operations");
    }
    if (!runtimeFileVersionRead || !runtimeFolderPath || !runtimeFilePath) failures.push("database_runtime cannot serve named filesystem detail reads");
    if (!runtimeUploadInsert || runtimeUploadSelect || !runtimeUploadTempKeySelect || runtimeUploadUpdate || runtimeUploadDelete) failures.push("database_runtime upload reservation privileges are not insert-only with scoped RETURNING reads");
    if (!runtimeRelationInsert || runtimeRelationSelect || !runtimeRelationIdSelect || !runtimeRelationSourceSelect || !runtimeRelationDerivedSelect || !runtimeRelationKindSelect || !runtimeRelationJobSelect || !runtimeRelationCreatedSelect) failures.push("database_runtime file relation privileges are not insert-only with scoped guard/lineage reads");
    if (!runtimeExpiredUploads || !runtimeAbandonUploads || !runtimeTrimUploads || !runtimeMarkUploadsCleaned || readerAbandonUploads || readerTrimUploads || readerMarkUploadsCleaned) failures.push("upload cleanup functions are not restricted to the database runtime role");
    if (runtimeCanMutateAuth || readerBootstrap) failures.push("an application role can execute an auth mutation function");
    if (!runtimeCanResolveAuth) failures.push("database_runtime cannot resolve auth identities");
    if (failures.length) throw new Error(`Local privilege verification failed:\n- ${failures.join("\n- ")}`);
  } finally {
    await client.end();
  }
}
