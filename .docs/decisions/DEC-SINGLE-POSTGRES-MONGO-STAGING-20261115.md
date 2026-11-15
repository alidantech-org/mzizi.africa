---
{id: DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115,name: One Postgres database for verified data and Mongo for staging,type: decision,tags: [database,postgres,mongo,staging,dryv,owner-order],extra: {status: accepted,ordered_by: project owner,ordered_on: 2026-11-15,supersedes: two-database Main and Operations layout,migrations: not_authorized,deployment: not_authorized}}
---

# One Postgres database for verified data and Mongo for staging

## Decision

The project owner ordered the two-Postgres layout (`mzizi` Main and `mzizi_operations`) replaced by:

- **One PostgreSQL database (`mzizi`)** holding only verified, prevalidated data: accepted facts, source and file records that passed approval, a small set of platform tables, and an append-only **change ledger**.
- **MongoDB as a permanent staging and preparation store** for huge, messy data: crawl information, extracted rows, candidates, AI and human classifications, review work and engine run state. Mongo is never the source of truth for accepted facts.
- **S3** keeps raw source bytes unedited; Main keeps pointers only for files that support accepted facts.

Approval writes to Main, or into the change ledger as a durable, replayable write plan, so human effort survives the loss of Mongo. The Engine API is the only writer to Main. Links from Main back to Mongo are soft references (collection, document id, content hash), never foreign keys.

## Second owner order, same day: no Rust, no database service

The owner then ordered every Rust pack and all Rust code removed, with no database service:

- The Rust crates (service, core, generated models, CLI), the Rust Dryv packs and the Cargo workspace were deleted from this repository. The Rust model and catalogue packs were copied to the Dryv repository (`sdk/_examples/packs/mzizi-rust-models` and `mzizi-rust-catalog`). The SQL pack was renamed `postgres-sql` because it emits SQL only.
- `source/backend/database` is a plain Bun project: `sql/` (generated snapshot), `migrations/` (immutable releases) and `src/` (the CLI: assemble, plan, status, migrate, verify, roles).
- The Python engine and the NestJS API both connect to PostgreSQL directly, each with its own role (`mzizi_engine`, `mzizi_api`) that cannot run DDL. NestJS may write the schemas it owns (authentication, accountability and others); the engine is the only writer of facts promoted from staging.
- The API calls the engine's internal HTTP API and watches engine jobs to expose progress, work and outputs to the frontend.
- Typed Python schemas are required for both Postgres and Mongo; the API needs the Postgres schemas for TypeORM.
- The Dryv gaps that block this are recorded in `.docs/design/data/DRYV_GAPS.md`.

This supersedes DEC-DATABASE-FOUNDATION-OWNERSHIP and the Rust parts of DEC-DATABASE-RELEASE-ASSEMBLY and DEC-DATABASE-ACCESS-LIFECYCLE.

## What changes

- Dryv schema files move from `schemas/mzizi/` and `schemas/operational/` into `schemas/postgres/`; Mongo document contracts live in `schemas/mongo/`.
- The Operations store, its packs and the `mzizi_operations` configuration are removed from Dryv and the Rust service.
- Of the 46 operational tables, the auth (11) and audit (2) tables stay in Postgres for now (trimming auth to six tables is deferred) and a change ledger is to be added; staging, acquisition, engine, management and analytics tables (33) leave Postgres for Mongo.
- Main is compressed to a first vertical slice; schemas outside it stay authored but are not generated until needed.

## Not changed

No existing database, migration release or S3 object is deleted. Migrations and deployment remain unauthorized until a separate cutover plan. Generated SQL, Rust models and migration releases from the old contracts are historical until regenerated.

## Supersedes

The two-store parts of [DEC-CANONICAL-STORES-20261113](DEC-CANONICAL-STORES-20261113.md) and the Operational database scope referenced in the schema redesign catalogue as DEC-OPERATIONAL-DATABASE-20261112. That decision file is not present in `.docs/decisions/`, so the catalogue's links to it are stale and are corrected in the same work. Related: [DEC-DATABASE-FOUNDATION-OWNERSHIP](DEC-DATABASE-FOUNDATION-OWNERSHIP.md).

## Open points

Which of the five deferred auth tables are needed; the exact shape of the change ledger; how Mongo document contracts become Python models; PostGIS storage for geometry.
