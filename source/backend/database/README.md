# TypeScript database service

`source/backend/database` is the Bun TypeScript owner for ordered SQL releases, seed loading, local database administration and named application database operations. SQL definitions live under [`../../schema/database/`](../../schema/README.md); authored API/database contracts live in repository-root [`dryv/`](../../../dryv/README.md).

The CLI supports status, migration, guarded reset of the disposable local `mzizi_new`, auth/reference seed loading, role provisioning, first-admin bootstrap, verification and pipeline-release operations. The internal HTTP service exposes named operations for the API, engine and filesystem callers. Application callers do not submit arbitrary SQL or choose table names.

Run commands through the repository-root runner: `bun run db status`, `bun run db migrate`, `bun run db seed`, `bun run db verify`, or `bun run db help`. The administrative connection is `MZIZI_DATABASE_URL`; the service uses `DATABASE_RUNTIME_URL`; the NestJS API uses a separate read-only `DATABASE_URL`. See [`scripts/README.md`](../../../scripts/README.md) for local setup.

The database cutover is incomplete. Some Python filesystem metadata and manifest-sync paths still connect to PostgreSQL directly. Also, the engine and filesystem Python project metadata references `mzizi-database`, but no such Python workspace member exists in `source/packages/`; the active database project described here is TypeScript.
