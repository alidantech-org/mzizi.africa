---
id: DEC-DATABASE-ACCESS-LIFECYCLE
name: Database access, write lifecycle, and the Dryv generation gap
type: decision
tags: [database, python, rust, dryv, mongo, vector]
---

# Decision: how Python, Rust and (later) NestJS write to the database, and why the client is hand-written

**Date:** 2026-11-13 · **Status:** accepted, verified against the live `mzizix`/`mzizix_operational` databases

## Decision

1. **Only the Rust service holds database credentials.** NestJS, the Python engine, and every other caller reach `mzizi`/`mzizi_operations` only through the Rust service's named HTTP operations (`DEC-DATABASE-FOUNDATION-OWNERSHIP`, reaffirmed here). No caller ever supplies SQL, a table name, or a schema name.
2. **Writes are named operations, mirroring reads.** A write (`CreateFolder`, `CreateJob`, …) is authored in Dryv (`dryv/contracts/apps/database/operations.ts`) with an `.http(...)` facet, authorized and executed inside the Rust service in one transaction, and returns a typed result. The caller never assembles SQL.
3. **The Dryv-generated client path was tried and does not currently work.** The official packs `unit/clients/python-client-sdk` and `unit/backend/axum-backend` exist at the pinned `dryvcode/packs` ref and target exactly this shape (operations with an `http` facet), but both fail to load against the running Dryv engine:
   - `python-client-sdk`: `package.name: Input should be a valid dictionary or instance of PackInputRef` (planner-stage failure).
   - `axum-backend`: `file.exports[].symbols.router: unknown field, undeclared map key, scalar traversal, or invalid []` (template-stage failure).
   Both packs' own READMEs already say verification is deferred while the Dryv engine is under maintenance; this is confirmed, not assumed. The probe added the two packs to `dryv.yaml`, ran `dryv:database:plan`, observed real IR compilation (304→309 records) followed by the pack-specific failures above, then reverted every change. Nothing from the probe is left in the tree.
4. **Until those packs are fixed upstream, the operation handler (Rust) and the client (Python) are hand-written**, but the operation contract is still authored in Dryv first (`FilesystemWrite.CreateFolder`, `source/backend/database` crates `mzizi-db-core`/`mzizi-db-service`, and `source/packages/database_client`). Swapping in generated code later is a drop-in replacement: the contract, the wire shape (camelCase JSON) and the typed models stay the same.
5. **MongoDB and the vector index stay at the port/scaffolding stage** (`StagingStore`, `VectorIndex`), consistent with `ENGINE_JOB_MODEL.md` and `PATTERN_MATCHING.md`. No live Mongo or pgvector instance was available or used.

## Verified end to end

Against the real remote `mzizix` (main) and `mzizix_operational` (operations) databases (`.dev/stack/db-remote.env`), using disposable, fully-cleaned-up fixture rows:

- The Rust service (`mzizi-db-service`) built, ran, and connected to both databases.
- A Python process (`mzizi_database_client.DatabaseClient`, no relation to any engine internals) created a folder over real HTTP, got back a typed, parsed response, and was correctly denied with a typed `Conflict` on a repeat with the same code and a typed `Denied` when the acting account held no grant.
- The row was independently confirmed in Postgres via `psql`, then every fixture row (account, permission, role, role assignment, scope, reference scheme and value, and the created folders) was deleted; both databases were confirmed back to their exact prior row counts.

## Found along the way (not fixed here, tracked separately)

- `mzizi-db-core::auth::authorize::check_permission`'s hand-written SQL does not reference `auth.role_assignments.scope_id`, which is `NOT NULL` with a foreign key to `auth.scopes` in the live schema. The query still runs (it never selects or filters on `scope_id`), but a real permission grant must still supply one; the authorization logic itself does not consider scope at all. This is pre-existing drift between the hand-written authorization query and the current contract-generated schema, not something this task introduced. Worth a follow-up task.
- The current Dryv-authored `filesystem.folders` shape (`id`, `parent_id`, `name`, `code`, `access`, `role_id`, timestamps, `version`) is materially simpler than the shape the legacy `mzizi_engine.filesystem` (Python, raw SQL) assumes (`artifact_role`, `acquisition_class`, `preparation`, `jurisdiction_code`, `description`, `metadata`, …). Migrating the legacy filesystem write path onto the new Rust service is therefore not a client swap; it needs a real schema/data migration decision first. Out of scope here; `TSK-E55B1BC4011A` already tracks this.

## Consequences

- `source/packages/database_client` (`mzizi-database-client`) is a new, pure, HTTP-only Python package: no SQL, no database credential, consumed by the engine (and usable by anything else that needs it) over `httpx` with frozen `pydantic` models.
- `dryv/contracts/apps/database/operations.ts` carries `FilesystemWriteOperations.CreateFolder` as the first authored filesystem write; following writes (upload completion, version registration, access transitions) extend the same module and the same hand-written Rust pattern until generation is viable.
- A follow-up task should periodically retry the two blocked packs against a newer Dryv engine/pack release and, if they pass, replace the hand-written Rust router boilerplate and Python client with generated code without changing the contract.
