---
id: DOC-DATABASE-ACCESS-AND-LIFECYCLE-20261113
name: DATABASE_ACCESS_AND_LIFECYCLE
type: documentation
tags: [database, python, rust, nestjs, mongo, vector, lifecycle]
---

# Database access, write lifecycle, and the data path from request to saved record

**Status:** the Python-engine-to-Rust write path described here is implemented and verified end to end against the live `mzizix`/`mzizix_operational` databases (`DEC-DATABASE-ACCESS-LIFECYCLE`). The MongoDB staging store and the vector index are still proposals (ports only, no live infrastructure). NestJS's migration onto this same path is not started.

## Who can reach the database, and how

```text
NestJS API ─┐
            ├─► mzizi-db-service (Rust, Axum)  ─► mzizi            (canonical domain data)
Python      │                                  ─► mzizi_operations (auth, acquisition, engine, staging, ...)
engine    ──┘
```

Only `mzizi-db-service` holds PostgreSQL credentials. Everyone else calls its named HTTP operations:

- **Python** (the engine): `mzizi_database_client.DatabaseClient`, an async `httpx` client with frozen `pydantic` models, one method per operation (`create_folder(...)` today).
- **NestJS**: a generated TypeScript client, same operations, same contract (not yet migrated for every route; see `source/backend/api`'s outstanding TypeORM paths).
- **Rust** (the service itself) is the only process with `sqlx::PgPool`s against `mzizi` and `mzizi_operations`, and the only place SQL is written by hand (`mzizi-db-core::domains::*`).

A write is a named operation end to end, never raw SQL from the caller:

```text
caller (Python/NestJS)
  -> typed request model
  -> HTTP POST to a named path (e.g. /v1/filesystem/folders)
  -> Rust: deserialize -> authorize (fail closed) -> one SQL statement in a transaction -> typed row
  -> typed response model
  -> caller
```

This is proven: a Python process created a folder, had a duplicate correctly rejected as a typed `Conflict`, and had an unauthorized attempt correctly rejected as a typed `Denied` — all against the real remote database, with every test row cleaned up afterward. See the decision record for the exact run and what was found along the way (a pre-existing gap between the hand-written authorization query and the live `scope_id` column, and a schema mismatch between the new Dryv-authored `filesystem.folders` and the legacy Python repository's assumptions — both tracked separately, not fixed by this path).

## Why hand-written Rust and Python today, not generated

Dryv has official packs for exactly this (`unit/backend/axum-backend`, `unit/clients/python-client-sdk`), and your project already authors operations with an `http` facet for three cases (`ResolveIdentity`, `CheckPermission`, vocabulary lookup). Both packs were tried against the running Dryv engine and both fail at generation time (see the decision record for the exact errors). Until that's fixed upstream, the operation contract is still authored in Dryv first, and the Rust handler plus the Python client are hand-written to match it exactly — so the eventual swap to generated code changes nothing a caller sees.

## The engine's own persistence and filesystem writes

- **Job/event persistence** already goes through named operations (`mzizi_engine.database_store.DatabaseServiceStore`, calling the database service's `jobs`/`events` endpoints) — this predates this session's work and already proves the pattern for operational state.
- **Filesystem writes** are in two states right now:
  - *New, target shape*: `mzizi_database_client` calling the Rust service's `filesystem.RegisterFolder` (and the write operations that will follow it: upload completion, version registration, access transitions), against the current Dryv-authored `filesystem` schema.
  - *Legacy, transitional*: `mzizi_engine.filesystem` (raw SQL via `mzizi_engine.ports.database`, a psycopg adapter) against the disposable `mzizi_new` database, assuming an older, richer folder shape. Migrating this onto the new path is a schema/data migration decision, not a client swap (`TSK-E55B1BC4011A`), because the two schemas disagree on what a folder even carries.

## NestJS: not yet migrated, same target

NestJS's admin-login and permission checks already call a database service for identity resolution and permission checks (`DatabaseServiceAuthority`, against the legacy Bun service on port 3301, camelCase JSON). The target is the same named-operation pattern, pointed at the Rust service instead: NestJS authenticates and shapes responses for its callers; it never runs SQL itself. This is tracked as follow-on work, not started here.

## Triggering jobs that search and save data

```text
1. NestJS or Temporal (Pipelines) submits a job: POST /v1/jobs {kind: "crawl.plan", input: {...}}
2. Engine Executor runs steps on threads/worker processes:
     fetch (mzizi_fetch)  ->  extract (mzizi_extraction)  ->  stage (Mongo, proposed)  ->  map (typed candidate)
3. The step that produces canonical data calls a named write operation
     (e.g. a future CreateCandidate), through the same DatabaseClient pattern proven here.
4. Rust authorizes, writes inside a transaction, returns the created row.
5. The engine emits progress events -> outbox -> NestJS (SSE) -> the admin's browser.
6. A human (or an AI proposal, same approval rule) reviews the candidate.
7. Acceptance is itself a named write operation that promotes the candidate into the
   accepted, versioned row.
```

Every write in that chain is a named operation; nothing in between is raw SQL, regardless of whether a job was started by NestJS or Temporal.

## MongoDB (proposal, not yet built)

Unchanged from `ENGINE_JOB_MODEL.md`: a `StagingStore` port, used only by the engine, for raw/messy pre-typed documents between extraction and mapping. NestJS and Rust never talk to Mongo directly. Promotion is one-way: engine reads staged documents, maps them to a typed candidate, and writes that candidate through the Rust service. No live Mongo instance was available or used in this session; only the port shape is settled.

## Vector index (proposal, not yet built)

Unchanged from `PATTERN_MATCHING.md`: pgvector inside `mzizi_operations`, behind the same Rust service, as a `VectorIndex` port — not a separate vector database, so embedding queries get the same authorization and transactional boundary as everything else. No live pgvector instance was available or used in this session.

## Open follow-on work

- Fix (or wait on) the two Dryv packs; retry generation without changing the contract.
- Migrate NestJS's remaining direct-database paths onto named operations.
- Decide and execute the legacy-filesystem schema migration before moving `mzizi_engine.filesystem` onto the new path.
- Fix the `scope_id`-blind authorization query found during this work.
- Build the `StagingStore` (Mongo) and `VectorIndex` (pgvector) adapters once there is real traffic shaped enough to need them.
