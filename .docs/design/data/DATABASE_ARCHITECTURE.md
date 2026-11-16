---
id: DOC-DATABASE-ARCHITECTURE-20261115
name: DATABASE_ARCHITECTURE
type: documentation
tags: [database,postgres,mongo,engine,api,dryv,migrations]
---

# Database architecture: one PostgreSQL database, Mongo staging, direct access

**Status: owner order of 15 November 2026 ([DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115](../../decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md)).** The database layer below is built and was run end to end on a scratch PostgreSQL 18 database. The engine and API reconnection, the Mongo contracts and the change ledger are planned and are marked as such. This document supersedes [DATABASE_FOUNDATION](DATABASE_FOUNDATION.md) and [DATABASE_ACCESS_AND_LIFECYCLE](../architecture/DATABASE_ACCESS_AND_LIFECYCLE.md) wherever they describe a Rust service, two PostgreSQL databases, or an exclusive database service.

## The shape

```text
                       ┌────────────── NestJS API ──────────────┐
 browsers, apps ─────► │ TypeORM → PostgreSQL (role mzizi_api)   │
                       │ HTTP ───► Engine API (jobs, progress)   │
                       └───────────────────┬─────────────────────┘
                                           │ internal HTTP
                       ┌───────────────────▼─────────────────────┐
 Temporal worker ────► │ Python engine                           │
                       │ PostgreSQL (role mzizi_engine), Mongo,  │
                       │ S3 (raw bytes), packages (pure)         │
                       └───────────────────┬─────────────────────┘
                                           ▼
             PostgreSQL `mzizi`   ·   MongoDB (staging)   ·   S3 objects

 Administration: `bun run db …` (the Bun CLI in source/backend/database) with an admin role.
```

There is no database service. The engine and the API each hold their own PostgreSQL connection with a dedicated role. Safety comes from PostgreSQL roles and from the engine being the only component that writes promoted domain facts, not from a proxy process.

## What lives where

| Store | Holds | Not in it |
|---|---|---|
| **PostgreSQL `mzizi`** | Verified, prevalidated data: reference, geography, legal, official, governance, politics, finance, civic, source, filesystem metadata; platform auth and audit; later a change ledger | Crawl data, raw extraction rows, candidates, AI scores, job state |
| **MongoDB** (permanent staging, planned contracts) | Huge, messy data for AI and humans to view, classify and check: crawl information, extracted rows, candidates, labels, review work, engine run and event state | Anything that is only true because it is in Mongo; Main never trusts it |
| **S3** | Raw source bytes, unedited; files behind accepted facts | Metadata (it lives in `filesystem` and `source` rows) |

A Postgres record links back to staging with a soft reference (collection, document id, content hash), never a foreign key. Raw crawl data enters Main only when it is correctly placed in an accepted record; the record keeps its source citation and a pointer to the raw file.

## PostgreSQL

- **One database** named `mzizi`, identified by `public.mzizi_target`. Twelve schemas and 94 tables are generated from the Dryv contracts in `dryv/contracts/schemas/postgres/` (verified: 294 foreign keys, 70 unique constraints, 42 checks, 3 exclusion constraints, 282 indexes).
- **Roles.** `mzizi_engine` and `mzizi_api` may read and write every domain schema. They cannot run DDL and cannot read the `public` ledger tables. The administrative role is read only by the CLI (`MZIZI_DB_ADMIN_URL`).
- **Connection strings** (engine and API read their own role; the CLI reads the admin URL): `DATABASE_WRITE_URL` for the engine (the single engine configuration file reads it) and `DATABASE_URL` for the read-only API role, `MZIZI_DB_ADMIN_URL` for the CLI, `MZIZI_DB_ENGINE_PASSWORD` and `MZIZI_DB_API_PASSWORD` when provisioning roles.
- **Write rules.** The engine is the only writer of facts promoted from staging. The API writes the schemas it owns (authentication, accountability read models it persists, audit events it raises). Named operations, not caller-supplied SQL, are the write surface for each side.

## Migrations and the Bun CLI

`source/backend/database` is a plain Bun project: `sql/` holds the generated snapshot, `migrations/` the immutable releases, `src/` the CLI.

| Command | Does |
|---|---|
| `bun run db format [--check]` | Formats generated SQL (sql-formatter, PostgreSQL dialect); a Dryv action runs it after every generation, so the committed snapshot is always formatted |
| `bun run db assemble` | Turns `sql/schema.sql` into `migrations/0001_init.sql` plus a `.snapshot` checksum; refuses a changed snapshot |
| `bun run db plan` / `status` / `verify` | Lists pending releases, shows state, checks checksums and database identity |
| `bun run db migrate` | Applies pending releases under an advisory lock, each in one transaction with its ledger row |
| `bun run db roles` | Provisions the engine and API roles and grants (idempotent; passwords from the environment) |

Limit: releases are immutable and schema evolution releases are not generated, so a changed contract needs a deliberate new stream or a hand-authored release (see [DRYV_GAPS](DRYV_GAPS.md)).

## Planned: change ledger and promotion

Approval writes a durable, append-only **change ledger** row in PostgreSQL (what to write, approver, time, target record, Mongo reference and hash) and then applies it idempotently to the domain tables. If Mongo is lost, the ledger replays into an empty Main. This is the task "Author auth, audit events and the change ledger" in the tracking group; the ledger contract does not exist yet.

## Planned: API to engine and job progress

The API calls the engine's internal HTTP API to start work. The engine records job runs and events in Mongo. The API watches those jobs through the engine (server-sent events or polling) and exposes progress, work and outputs to the frontend. The engine job model is described in [ENGINE_JOB_MODEL](../architecture/ENGINE_JOB_MODEL.md); its persistence moves from the removed database service to Mongo.

## Planned: typed schemas for every runtime

| Runtime | Source | Output | Status |
|---|---|---|---|
| NestJS (TypeORM) | `schemas/postgres` | TypeORM entities | Not bound to the database app yet; the existing modules under `source/backend/api/src/modules` are inherited and are not generated from these contracts |
| Python, Postgres rows | `schemas/postgres` | Frozen Pydantic row models in `source/backend/engine/src/mzizi_engine/api/schemas/<group>/{entities,enums}` | Built (`dryv/packs/python-rows`, `dryv generate --app pgsql`); ruff and strict mypy run as actions |
| Python, Mongo documents | `schemas/mongo` (`runtime`, `staging`) | Pydantic models in `.../api/schemas/<group>/{enums,models}` | Built through the engine app (`dryv/packs/python-api`); no storage facet because Dryv has no Mongo store driver; engine routes in `.../api/routes` and contract tests in `source/backend/engine/tests/api` |

## Known interim breakage

The Rust database service was removed in this change. Code that called a database service has no server until the engine and API are reconnected:

- `source/backend/engine`: `ENGINE_STORE=database_service` (`DATABASE_SERVICE_URL`, `DATABASE_SERVICE_TOKEN`) for accounts, permissions, jobs, events and the outbox; the engine's memory store remains.
- `source/backend/api/src/database/write-database.ts`: `DATABASE_SERVICE_URL` for named writes.
- Direct engine filesystem SQL still needs `ENGINE_FILESYSTEM_LEGACY_DATABASE_URL`.

These are tracked as follow-up tasks; none is silently working.

## Not changed

No existing database, S3 object or committed history was deleted. The earlier databases `mzizi`, `mzizi_dev`, `mzizi_new` and the test databases still exist on the local server; the new release stream targets a fresh database.
