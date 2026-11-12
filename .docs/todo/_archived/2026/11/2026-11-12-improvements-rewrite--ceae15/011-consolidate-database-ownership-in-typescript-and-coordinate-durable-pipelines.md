---
{id: TSK-DCAFD6D6FEE7,name: Consolidate database ownership in TypeScript and coordinate durable pipelines,type: task,status: archived,priority: medium,created_at: 2026-11-11T14:52:35.333Z,updated_at: 2026-11-12T05:54:24.465Z,order: 9216,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-11T14:55:23.648Z},{from: in-progress,to: archived,at: 2026-11-12T05:54:24.465Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-DCAFD6D6FEE7/1794408923652-start,started_at: 2026-11-11T14:55:25.983Z,end_ref: refs/tracking/TSK-DCAFD6D6FEE7/1794462864467-end,ended_at: 2026-11-12T05:54:24.465Z,summary: {files: 175,insertions: 40850,deletions: 4658}}]}},archived_at: 2026-11-12T05:54:25.705Z}
---

---
{id: TSK-DCAFD6D6FEE7,name: Consolidate database ownership in TypeScript and coordinate durable pipelines,type: task,status: in-progress,priority: medium,created_at: 2026-11-11T14:52:35.333Z,updated_at: 2026-11-11T14:55:23.648Z,order: 9216,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-11T14:55:23.648Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-DCAFD6D6FEE7/1794408923652-start,started_at: 2026-11-11T14:55:25.983Z}]}}}
---

---
{id: TSK-DCAFD6D6FEE7,name: Consolidate database ownership in TypeScript and coordinate durable pipelines,type: task,status: in-progress,priority: medium,created_at: 2026-11-11T14:52:35.333Z,updated_at: 2026-11-11T14:55:23.648Z,order: 9216,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-11T14:55:23.648Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-DCAFD6D6FEE7/1794408923652-start,started_at: 2026-11-11T14:55:25.983Z}]}}}
---

---
{id: TSK-DCAFD6D6FEE7,name: Consolidate database ownership in TypeScript and coordinate durable pipelines,type: task,status: planned,priority: medium,created_at: 2026-11-11T14:52:35.333Z,updated_at: 2026-11-11T14:52:35.333Z,order: 9216}
---

# Consolidate database ownership in TypeScript and coordinate durable pipelines

## Goal
Replace the split database lifecycle in which Dryv generates TypeORM entities while a Python package applies separately maintained SQL and Python services issue direct database writes. Establish one TypeScript database service as the sole application write and migration owner, keep the NestJS product API read only, and run processing capabilities through durable cross-language workflows. The result must be reproducible locally and preserve Mzizi’s evidence, provenance, time, place, and review requirements.

## Context
The current active migration runner is `source/packages/database/src/mzizi_database/migrate.py`; active Python engine and filesystem paths also use `psycopg`. Dryv models currently generate API entities, while `source/schema/database` contains SQL functions and constraints that TypeORM entities alone cannot express. The user authorized a clean rebuild of disposable `mzizi_new`, preservation of all existing S3 artifacts, TypeScript ownership of database writes, read-only TypeORM access in the product API, migration of implemented workflows to Temporal, versioned capability manifests, and a minimal candidate review and promotion path. Handwritten transaction handlers are allowed only inside the one TypeScript database service. Continue only on `develop` and preserve all existing workspace edits.

Keep approved active schemas only; proposed Dryv domains do not become database tables by implication. Keep Python libraries focused on extraction, OCR, scraping, file operations, and other requested capabilities. Do not expose arbitrary SQL or grant workers direct PostgreSQL credentials. Store system manifests under root `seed/` and their validation schemas under `source/schema/`, following `seed/README.md`. Update `.docs/docs/ARCHITECTURE.md` and `.docs/docs/DATA_LIFECYCLE.md` as ownership and execution boundaries change. This task authorizes implementation locally, not deployment.

## Acceptance checklist
- [ ] Inventory every active PostgreSQL writer, migration/seed command, auth query, table/function/index/trigger, and caller; mark existing behavior for replacement without modifying unrelated ongoing work.
- [ ] Pin and check Bun, Dryv engine, packs, TypeORM, and Temporal toolchain versions; use Bun for all JavaScript and TypeScript runtime commands and reconcile Dryv against approved active schemas.
- [ ] Generate TypeORM entities, contracts, Python transport clients/models, and all representable PostgreSQL schema objects from Dryv and project packs; represent unsupported PostgreSQL features in validated Dryv-owned definitions and fail generation on omissions.
- [ ] Generate immutable migration snapshots from a fresh scratch database; include SQL, checksums, explicit rename/removal/backfill review, serialized application, migration status, and drift checks. Keep synchronization and startup migrations disabled.

- [ ] Create one TypeScript database backend service and administrative CLI for migration, seed, status, integrity, authorization, filesystem metadata, pipeline records, candidate review, and canonical promotion.
- [ ] Grant the NestJS API SELECT-only PostgreSQL access and route all its audit writes through named database-service operations.
- [ ] Replace Python `psycopg` writes, authorization queries, seed loaders, outbox persistence, and filesystem registration with generated typed clients. Workers receive no PostgreSQL credentials; migrations run only through administrative credentials.
- [ ] Rebuild and verify only `mzizi_new`; preserve existing S3 artifacts and seed inputs under the repository’s root seed convention.

- [ ] Create a TypeScript pipeline service, Temporal workflows, replay-safe workflow definitions, durable outbox dispatch, stable run IDs, idempotent activities, cancellation, progress events, retry/heartbeat/checkpoint handling, and authorization propagation.
- [ ] Migrate all active engine jobs and processing capabilities to Temporal workers. Separate I/O and CPU-heavy Python worker pools while keeping one Python engine project and reusable packages.
- [ ] Define and validate a safe versioned manifest format with typed capability inputs, dependencies, output bindings, bounded condition/iteration/parallelism, retry/timeout policy, and review gates. Reject executable code, SQL, shell commands, and unregistered capabilities. Pin active runs to immutable approved manifest and capability versions; detect conflicting manifest edits.
- [ ] Persist immutable results, evidence references, candidate revisions, validation findings, review decisions, and promotion receipts. Implement atomic, version-checked promotion only for approved active-domain adapters; AI/tool results remain proposals.
- [ ] Preserve raw/derived files in object storage and implement retry-safe reserve, transfer, verify, and finalize flows through the filesystem capability and database-service metadata operations.
- [ ] Update API contracts and application consumers for asynchronous run submission, run/job status, resumable progress, cancellation, candidate review, and promotion.

- [ ] Provide a reproducible local service stack with PostGIS, persistent development Temporal, and local object storage, plus one documented start, reset-`mzizi_new`, seed, status, and shutdown workflow.
- [ ] Demonstrate generated-output stability, fresh database migration parity including PostgreSQL-specific objects, privilege isolation, duplicate submission/retry/crash recovery, manifest pinning, evidence-preserving PDF/OCR review, and upload recovery.
- [ ] Update architecture, lifecycle, API boundary, setup, and relevant toolchain documentation; ensure no live deployment or `.github/**` changes occur.
- [ ] Run applicable focused implementation checks and `task validate`; report precisely what passed, failed, or remains blocked before marking the task complete.

## Progress
Implementation is underway on `develop`; existing workspace changes are being preserved. The TypeScript database service now owns the local migration ledger, can checksum-adopt the former Python ledger, applies named SQL snapshots, and exposes named audit/auth/pipeline operations. Local `mzizi_new` was rebuilt through that service and has 16 applied migrations; auth and reference seeds are repeatable. A runtime-role check against the running local service verified `auth.resolve-identity` and pipeline outbox claim operations after the auth read grant was added. API/database/pipeline typechecks and Python engine compileall passed in the prior increment; Dryv's existing consistency check and local database status also passed. These checks do not establish full parity or acceptance.

Major requirements remain incomplete: Dryv is not yet authoritative for all active schemas or PostgreSQL extensions; the Python engine and filesystem still contain direct PostgreSQL clients for run/job persistence, filesystem records, authorization fallback, and manifest synchronization; Python database and migration packages remain installed; Temporal and the product API still need end-to-end caller integration; result artifact lineage, candidate revision validation, canonical promotion, and recoverable object-store transfer are incomplete; and a reproducible local Temporal/object-store stack is not yet supplied. Keep the acceptance checkboxes open until each requirement is implemented and verified. Preserve S3 and limit local database rebuilds to `mzizi_new`.

## Comments

### 2026-11-11T15:06:46.757Z · PETER IRUNGU

Implemented the first TS database CLI increment, service registry entry, Temporal worker scaffold, and a v1 pipeline manifest schema/example. Database/pipelines typecheck and cutover are being worked through; Python and API writers remain active.

### 2026-11-11T15:13:20.464Z · PETER IRUNGU

Created active Codex goal for full migration. Replaced direct pg migration runner with TypeORM-managed migration classes and transactional checksum ledger; local mzizi_new guard retained; database service typecheck passes. Remaining cutovers still active.

### 2026-11-11T15:17:37.600Z · PETER IRUNGU

2026-11-11: Added the TypeScript database service's first named audit operations and routed API comment, evidence, and review-decision writes through its HTTP client. The API retains target/parent checks on its read connection. Replaced direct TypeORM migration API usage with TypeORM-managed immutable SQL migration classes, a local mzizi_new guard, advisory lock, and checksums. API, database, and pipeline TypeScript projects typecheck. Python engine still has active PostgreSQL access (filesystem, auth, job store, seed sync); migration generation from Dryv, remaining DB operations, durable Temporal orchestration, review/promotion, and local stack are outstanding. No migration/reset was run.

### 2026-11-11T15:21:06.072Z · PETER IRUNGU

2026-11-11: Added named auth.resolve-identity and auth.can-platform operations to the TS DB service plus a Python HTTP authority client. The engine can use it via DATABASE_SERVICE_URL/TOKEN, with a legacy DB fallback retained to preserve existing local behavior until engine job and filesystem persistence are migrated. API, DB, pipeline typechecks and Python engine compileall pass. Updated architecture/lifecycle and API service docs. Full ownership cutover remains incomplete.

### 2026-11-11T15:55:51.032Z · PETER IRUNGU

2026-11-11: Verified the TypeScript DB service under the local runtime login: auth.resolve-identity and pipeline command claim both work with the restrictive runtime grants on mzizi_new. Added pinned local infra compose for persistent Temporal CLI development server and loopback-only S3-compatible SeaweedFS, plus infra:up/down root commands and startup/reset documentation. MinIO upstream image pull failed because the public image is no longer available; switched the local test endpoint to SeaweedFS. Verified Temporal UI and S3 endpoint respond, Temporal state file is on its named volume and Temporal UI recovers after container restart. Focused checks passed: Dryv contract check (588 schemas/230 operations), database/API/pipeline typechecks, scripts tests (15), Python compileall, task validate, git diff --check, and structure. No Dryv DB schema generation, Python direct-DB removal, full Temporal/API integration, candidate promotion, or object transfer recovery has been completed; Task remains active.

### 2026-11-11T16:04:32.099Z · PETER IRUNGU

2026-11-11: Added the first deterministic Dryv-to-database generation path. `bun run db generate` compiles the pinned Dryv IR, resolves inherited entity fields, captures storage namespace/table, types, nullability, relations, indexes and primary keys into a stable schema catalog, and fails on unsupported property references or invalid indexes. `bun run db schema-check` verifies exact regeneration; it is now part of `bun run dryv:check`. `bun run db plan` compares entity table names against current ordered SQL migrations without mutating the DB. Current evidence: 124 Dryv persistent entities vs 49 SQL tables and only 11 same-name matches; this is a material reconciliation gap, so no migration DDL was emitted or applied. Updated architecture/lifecycle docs and scripts docs. TypeScript database typecheck, schema generation/check, Dryv checks, `task validate`, structure, and diff whitespace checks pass. The migration plan remains active.

### 2026-11-11T16:18:39.983Z · PETER IRUNGU

2026-11-11: Updated the TypeScript pipeline service to use Bun for dev, compiled start, build, and typecheck; removed the Node version pin and tsx dependency, switched its TypeScript declarations to Bun types, and forced Dryv CLI compiler/doctor invocations through Bun. Added `bun run verify:bun-runtime`, which starts a temporary worker for the actual runPipeline workflow and activity against local Temporal. It passed under Bun 1.4.2. The compiled service also bundles the compiled workflow path correctly and reached RUNNING under Bun; fixed the previous `dist/workflows.ts` path bug. Dryv doctor now reports runtime bun and `/home/alidante/.bun/bin/bun`. Known Temporal SDK warning: Bun lacks v8.promiseHooks.createHook so promise stack trace collection is disabled. Checks passed: Dryv/database catalog checks, pipeline typecheck/build, scripts tests (15), task validate, diff check. The goal remains active and most schema reconciliation/Python cutover/promotion acceptance work is still outstanding.

### 2026-11-11T16:21:08.299Z · PETER IRUNGU

2026-11-11: Confirmed the repository has no Node launcher or .node-version pin for TypeScript services. The pipeline package now uses @types/bun and Bun for all scripts; build output is git-ignored. Added a runner regression assertion that all non-Python services use Bun for both dev and start. Final Bun increment checks passed: TypeScript Temporal runPipeline smoke under local Temporal, compiled worker enters RUNNING, Dryv doctor reports Bun 1.4.2, Dryv/database catalog checks pass, pipeline typecheck/build pass, runner suite 16/16, structure, task validate, and diff check. Temporal's Bun warning is limited to unavailable promise stack capture. Wider database ownership and workflow acceptance remains open.

### 2026-11-11T16:23:59.443Z · PETER IRUNGU

2026-11-11: Kept Bun as the required and exclusive TypeScript runtime. Removed the database service’s unnecessary @types/node dependency; its scripts already launch with Bun and its TypeScript config uses Bun types. Database service typecheck passes. Dryv catalog plan still correctly blocks DDL because 124 Dryv entities reconcile with only 11 of 49 SQL tables.

### 2026-11-11T16:25:28.839Z · PETER IRUNGU

2026-11-11: Bun-only correction verified again. `bun run typecheck` passes all 8 projects; `bun run dryv:check` passes and Dryv doctor reports Bun 1.4.2; Temporal workflow and activity execute successfully under Bun using the local Temporal server. The SDK reports its Bun limitation for promise stack trace collection. Removed @types/node from the TypeScript database service. Overall migration remains active; catalog reconciliation and Python database access are still unfinished.

### 2026-11-11T16:48:27.854Z · PETER IRUNGU

2026-11-11: Moved filesystem authorization checks behind named TypeScript auth operations (can-link, can-record, can-change, can-platform), granted the runtime role only the required reads, and removed Python auth’s direct-PostgreSQL fallback. Provisioned local database_runtime/api_reader logins; `db verify` now checks the API has no app-table mutation privileges and the runtime cannot create schema or write migration history. Added pipeline manifests to the root seed manifest and a proposal-only `db seed pipelines <actor-uuid>` command. Python filesystem integration setup now expects the TypeScript-migrated schema instead of invoking the Python migrator. Verification: all 8 TypeScript/Python project typechecks pass; Dryv check passes; `db verify` passes on mzizi_new; scoped auth operations pass against the DB through a Bun service connected as database_runtime; 21 engine/filesystem tests pass; seed manifest validation and `task validate` pass. Remaining major gaps: Dryv/SQL reconciliation, Python metadata/job/seed writers, full Temporal/API caller cutover, evidence promotion, and full fresh-database parity.

### 2026-11-11T16:52:17.712Z · PETER IRUNGU

2026-11-11: Closed the PostgreSQL PUBLIC EXECUTE hole for auth mutation functions. Migration engine/0007 revokes auth function execution from PUBLIC and grants the database runtime only identity/scoped-read helpers. `bun run db verify` now checks both table and function privileges; it passes on mzizi_new. Re-ran all 8 project typechecks, scoped-auth HTTP calls through a live Bun database service using database_runtime, and the pipeline seed proposal command against a mock named-operation service. Task remains active: Dryv/SQL reconciliation, direct Python filesystem/job/seed database paths, complete Temporal caller migration, and review/promotion remain.

### 2026-11-11T16:58:28.467Z · PETER IRUNGU

2026-11-11: Continued the Bun-only cutover. Added the TypeScript database operation POST /internal/v1/filesystem/folders with strict field allowlisting, scoped edit/publish checks and transaction validation. Python filesystem folder creation now uses the named service client and fails closed when it is unavailable; test coverage uses a fixture-only service seam. Added migration engine/0008 granting the runtime role folder INSERT only, plus verifier checks that UPDATE/DELETE remain denied. Next: typechecks/tests, apply only to mzizi_new, and continue moving remaining direct-PG filesystem paths.

### 2026-11-11T16:59:35.099Z · PETER IRUNGU

2026-11-11: Added the folder creation endpoint and additive least-privilege migration; Bun database typecheck passed, migration 0008 applied to mzizi_new, and db verify confirmed API read-only/runtime non-admin. A focused test exposed that the auth integration fixture needed the same scoped permission checks; I corrected that test-only service seam and am rerunning focused checks.

### 2026-11-11T17:03:55.322Z · PETER IRUNGU

2026-11-11: Folder creation now runs through the Bun database owner. The live service, connected as database_runtime, denied a null-actor request and successfully created a folder for an authorized local account; I removed the temporary row immediately. The additive 0008 migration is applied only to mzizi_new and the verifier passes. Focused filesystem/auth suite passes 8/8; all eight project typechecks pass; task validate and diff checks pass. Also changed the last direct tsc package scripts to bunx --bun and documented the partial cutover. Remaining task criteria are still substantial (other Python PG paths, Dryv reconciliation, complete Temporal workflow migration, evidence/promotion, fresh schema parity); the Task and goal remain active.

### 2026-11-11T17:20:44.336Z · PETER IRUNGU

2026-11-11: Moved the Python engine’s persistent jobs, events, and callback outbox behind named Bun database-service operations. Removed the Python PostgresStore implementation; ENGINE_STORE now allows only memory or database_service, and generic DATABASE_URL is ignored by the engine. Remaining legacy filesystem routes require a distinct explicit setting. Also moved folder/file detail reads behind the database service with scoped authorization and no S3 key exposure. Additive engine migrations 0009-0011 are applied only to mzizi_new; db verify passes. Live service exercise passed idempotent job submission, ordered events, outbox retry/delivery, plus folder create/read; temporary smoke rows were deleted. Engine suite 23/23, all eight project typechecks, Dryv contract/catalog check, manifest check, task validate, and diff check pass. Full task remains active: filesystem metadata writes/seed sync, all-worker database exclusion, full Temporal caller cutover, Dryv schema reconciliation, review/promotion, and fresh-schema parity remain.

### 2026-11-11T17:29:48.431Z · PETER IRUNGU

Moved upload reservation creation to the TypeScript Bun database service, added immutable migration 0012 for insert-only reservation writes and migration 0013 for scoped SELECT columns required by PostgreSQL INSERT RETURNING. The engine route now asks the database service for metadata then signs an object-store PUT. Live engine→service smoke returned 201; temporary DB reservation was deleted and no object was transferred. bun db status/verify and database typecheck pass; focused engine filesystem tests and production mypy pass; task validate and git diff --check pass. Bun-only runtime confirmed/documented for Temporal worker too. Broader migration remains active: other filesystem writes and manifest sync still use Python DB paths, and Dryv reconciliation, complete Temporal migration, candidate review/promotion and fresh-schema parity remain.

### 2026-11-11T17:36:11.327Z · PETER IRUNGU

Moved exact-version filesystem lineage inserts out of the Python PostgreSQL repository into internal Bun TypeScript DB command `/internal/v1/filesystem/relations`. The command validates UUID/slugs, verifies both versions exist, checks filesystem.read on the source, preserves duplicate-idempotent insert semantics, and uses runtime insert plus narrowly scoped endpoint/id SELECT grants required by the cycle guard and RETURNING. Applied immutable migrations 0014 and 0015 on mzizi_new. Live DB-service smoke inserted once and returned created=false on repeat; all temporary test files/relations were removed. Engine filesystem tests (3), production mypy, database typecheck, full repository typecheck (8/8), db verify, task validate, and diff check pass. Remaining filesystem mutations and seed sync still use Python DB paths; broader migration remains active.

### 2026-11-11T17:39:18.267Z · PETER IRUNGU

Continued filesystem write/read ownership migration: the Bun database service now records exact-version lineage relations and authorizes download-key reads. Python presigns the object-store URL but no longer queries PostgreSQL for the key. Added immutable migrations 0014/0015 for insert-only lineage writes and scoped endpoint columns required by cycle guards/RETURNING; applied on mzizi_new. Live lineage smoke verified first insert created=true and retry created=false; live engine-to-owner download smoke returned a private presigned URL. Test fixtures were removed and no S3 object was touched. Focused filesystem tests 3 passed; production mypy, full repository typecheck 8/8, DB verify, Task validation, and diff check passed. Bun-only runtime requirement retained. Other filesystem metadata writes, seed sync, Dryv reconciliation, full Temporal cutover, review/promotion, and fresh parity remain.

### 2026-11-11T17:49:30.021Z · PETER IRUNGU

Moved upload cleanup metadata out of Python SQL and behind Bun database operations: preview/abandon expired bounded batches, retry incomplete cleanup, mark object cleanup complete, and trim only eligible terminal sessions. Added SECURITY DEFINER functions with fixed search_path and grants only to database_runtime (no broad uploads UPDATE/DELETE); applied migrations 0016/0017 on mzizi_new. Python retains only private temp object abort/delete. Live disposable DB smoke verified dry run leaves pending status unchanged, injected S3 delete failure remains retryable, second attempt deletes and marks the row cleaned; temporary reservation row removed. Focused engine tests 3 passed, production mypy and all 8 repository typechecks passed; db verify/status and diff check passed. Full `task validate` currently fails on unrelated TSK-744E1FD3DEFB: its timestamped comment section is empty; docs validation remains to be checked separately. Other FS DB writes/seed sync and broad migration remain.

### 2026-11-11T17:52:14.810Z · PETER IRUNGU

Continued filesystem ownership: upload cleanup now uses named Bun database operations for bounded preview/abandon, completion acknowledgement, and metadata trimming; Python retains private S3 abort/delete only. Added SECURITY DEFINER functions with fixed search_path, runtime-only EXECUTE, no broad upload UPDATE/DELETE grants, retryable abandoned/failed sessions, and cleanup_completed_at before trim (migrations 0016/0017). Made multipart abort idempotent when the object store reports the upload is already gone. Added authorized database-service lineage read (recursive ancestry and direct derivatives) with narrow column grants (0018); Python no longer reads lineage SQL in production. Disposable live smoke verified cleanup dry-run, injected deletion failure and immediate successful retry, and engine lineage response; temporary rows/files removed, no S3 objects touched (memory store only). Repo typecheck 8/8, engine filesystem tests 3, engine/package mypy, DB status/verify, docs validation, and diff check passed. Full task validation remains blocked by an unrelated empty comment in TSK-744E1FD3DEFB; its task record was left untouched. Remaining filesystem database paths, seed sync, Dryv reconciliation, Temporal migration, evidence review/promotion, and fresh-schema parity remain.
