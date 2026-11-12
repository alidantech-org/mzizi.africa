---
id: DOC-DATABASE-FOUNDATION
name: DATABASE_FOUNDATION
type: documentation
tags: [database, rust, dryv, generation, foundation]
---

# Rust database foundation

The database foundation is a Rust service and administration CLI under `source/backend/database` that is being built to become the exclusive application access boundary for Mzizi's PostgreSQL databases. This document describes the target shape and what the foundation milestone actually implements. The domain modelling principles (separable schemas, reviewed same-database cross-schema foreign keys, provenance in `source`, vocabularies as data) are described in [DATABASE_DESIGN](DATABASE_DESIGN.md); this document describes who owns the databases, how their schemas come into being, and how other systems reach them.

## Status

**Foundation milestone, in progress.** Implemented and verified locally: one `dryv generate` run compiles both authoring sources; the `rust-models` and `rust-sql` packs emit the `mzizi-db-generated` models and per-database schema snapshots; `mzizi-db assemble` turns the snapshots into immutable checksummed releases; both releases apply and verify on a fresh isolated PostgreSQL container; `roles` provisions a DML-only service role; gated integration tests cover fresh apply, rerun, concurrent migrators and checksum refusal. Not yet implemented: `seed` (no reviewed seed set exists; `seed/_fixtures` is test-only), incremental schema-evolution releases, and the service/API cut-over. The database authoring application now composes the ten persisted Main namespaces (Reference, Geography, Legal, Official, Governance, Politics, Civic, Finance, Source and Filesystem) plus the read-only Accountability group, alongside all seven Operations namespaces. Composition and Dryv compilation establish contract connectivity; they do not mean SQL was generated or applied. Existing callers — the NestJS API's current TypeORM paths, the legacy Bun database service, the Python engine — keep working unchanged until later milestones migrate them. Claims below marked *target* are not yet behavior.

## Architecture

```text
Clients → NestJS API ──────────────┐
                                   ├→ Rust database service → mzizi
Python engine and capabilities ────┘                        → mzizi_operations

Dryv contracts → generated Rust models, SQL migration releases and typed HTTP clients
```

Two databases, one access boundary:

| Database | Purpose | Domain schemas |
| --- | --- | --- |
| `mzizi` | canonical domain data | reference, geography, legal, official, governance, politics, civic, finance, source, filesystem (Accountability: read-only, no stored tables) |
| `mzizi_operations` | platform operations | auth, acquisition, engine, staging, analytics, audit, management |

All namespace assignments are registered up front. The current Dryv database application composes the full Main domain contract graph and all seven Operations groups; actual generation remains a separate action. Each database carries a reserved `_mzizi` technical schema for target identity and migration history. Reviewed foreign keys are allowed across schemas **within** one database; relationships across the two databases use typed identifiers, never foreign keys.

### Boundary rules

- The Rust service is (*target*) the only process holding PostgreSQL credentials at runtime. The NestJS API and the Python engine call its named HTTP operations through generated clients; neither receives connection variables.
- Capability packages (`filesystem`, `ocr`, `scraping`, `extraction`, …) never talk to a database. They are libraries invoked by the engine; when their work needs persistence, the engine calls the database service, which persists it in `mzizi_operations`.
- The API asks the engine for capabilities; the engine asks the database service for persistence. No layer skips a level.
- Callers can never supply SQL, table names or schema names. Operations are named, typed, paginated with bounds, and filtered only through declared filters.
- Authorization is enforced inside Rust and fails closed: unknown identities, missing permissions, missing credentials or unavailable authorization state all deny.

## Generation: Dryv owns every schema object

Database schemas, tables, columns and column definitions are **never written by hand**. They are authored as Dryv contracts and generated, exactly as the NestJS API is generated today. The deleted `source/schema/database` location is not recreated: every generated database artefact lives inside `source/backend/database`.

Generation is split into two independent runs:

1. **The normal run** — the legacy entrypoint (`dryv/contracts/apps/main/index.ts`) and packs that generate the NestJS API. Untouched by this work.
2. **The Rust run** — a separate entrypoint, `dryv/contracts/apps/database`, composing the shared schema files under `dryv/contracts/schemas/{mzizi,operational}`, driven by project-owned packs:
   - `dryv/packs/rust-models` emits the `mzizi-db-generated` crate: Rust structs per entity and operation request/response types.
   - `dryv/packs/rust-sql` emits one deterministic schema snapshot per database (`source/backend/database/generated/sql/{main,operations}.sql`). `mzizi-db assemble --target <t>` copies a snapshot to `migrations/<t>/0001_init.sql` when the stream is empty and records its checksum; a later changed snapshot is refused because releases are immutable (see [DEC-DATABASE-RELEASE-ASSEMBLY](../../decisions/DEC-DATABASE-RELEASE-ASSEMBLY.md)). The ledger records each release's SHA-256.

TypeScript and Python HTTP clients come from Dryv's existing client generation pointed at the foundation contracts; no project generator reimplements that. The generated Python client is a plain HTTP client package and must not pose as the missing historical `mzizi-database` workspace member, which remains a tracked gap.

The namespace-to-database lists are pack inputs in `dryv.yaml` that must mirror `dryv/contracts/apps/database/persistence.ts`; `bun run database:assignments` (inside `database:check`) fails on drift. Pack-side validation (inside the templates) rejects: schemas not assigned to a database, foreign keys that would cross databases, and definitions the foundation's type/constraint support does not cover. Generation is deterministic — repeated runs produce identical artefacts — and never applies schema changes itself.

## The Rust workspace

```text
source/backend/database/
├── Cargo.toml                 workspace
├── crates/
│   ├── mzizi-db-core/         config, two bounded SQLx pools, typed ids,
│   │                          fail-closed auth, named domain operations (all SQL)
│   ├── mzizi-db-generated/    rust-models pack output; never hand-edited
│   ├── mzizi-db-service/      Axum HTTP service, default port 3303
│   └── mzizi-db-cli/          admin binary: plan, migrate, status, verify, roles, seed
├── migrations/{main,operations}/   rust-sql pack output; immutable once committed
└── tests/                     migration, auth and reference integration tests
```

- **SQLx, not an ORM.** Compile-time-checked queries against the generated schema; the schema is owned by Dryv, so an ORM that wants to own it is the wrong tool.
- **Two pools, separate credentials.** Main and operations each get a bounded `sqlx::PgPool`; limits and credentials are independent. Administrative credentials are loaded only by the CLI binary; the service binary cannot run DDL.
- **Migrations serialize.** The CLI takes a per-database advisory lock, applies a release and writes its `public.mzizi_migrations` ledger entry in the same transaction, and refuses changed checksums or a target whose identity does not match.
- **Observability without leakage.** Health and readiness endpoints, request IDs, structured errors and logs that never contain credentials or sensitive payloads.

## Transition

The legacy Bun TypeScript service in the same folder keeps its current behavior and port `3301`; the Rust service runs on a separately configurable port defaulting to `3303`. The foundation targets a fresh, isolated local PostgreSQL instance containing `mzizi` and `mzizi_operations`; existing development databases and object storage are preserved, and the milestone ships no destructive reset command. Remaining caller migrations are tracked in the task workspace; nothing in this document claims full cutover.
