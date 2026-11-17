---
{id: DOC-32E1E997FDD0,name: ARCHITECTURE,type: documentation}
---

# ARCHITECTURE — active Mzizi components

The repository has separate application, product API, database, engine, capability and schema projects. These are code ownership boundaries; not every planned workflow or migration is complete.

## Code map

- `source/apps/{www,web,mobile}` — public Next.js experience, research/review dashboard, and Flutter geography client.
- `source/backend/api` — NestJS product API, generated primarily from authored contracts in `dryv/`.
- `source/backend/database` — generated SQL, immutable migrations and the Bun administration CLI for the single PostgreSQL database (not a service).
- `source/backend/engine` — Python operational API, jobs and capability orchestrator.
- `source/packages/{browser,cli,crawler,extraction,fetch,filesystem,manifest,search}` — reusable Python capabilities.
- `source/schema/{database,engine,seed,sources}` — machine-readable input and exchange schemas.
- root `seed/` — prepared system inputs; root `scripts/` — unified command runner.

See the [repository map](../design/operations/repository-map.md) and component READMEs for the exact code responsibilities.

## Request and data ownership

Applications call the NestJS product API. The API enforces authentication and operation policies and connects to PostgreSQL with its own role; it asks the Python engine to run jobs. The engine connects with its own role and is the only writer of facts promoted from staging. The Bun CLI owns migrations. For direct connection and persistence status, see [DATABASE_ARCHITECTURE](../design/data/DATABASE_ARCHITECTURE.md).

The Python engine runs operational jobs and invokes reusable Python packages; there is no separate workflow worker (the former Temporal pipelines project was removed on 2026-11-15). Packages preserve source and processing metadata and emit representations or proposals; they do not define site-specific content or publish canonical data by themselves.

Raw artifact bytes are managed through the filesystem capability and object storage; SQL stores metadata and relationships. Source, extraction, staging/review and accepted domain data remain distinct states. The current implementation still has Python filesystem and manifest-sync database paths, so database write ownership is not fully consolidated.

## Contracts and proposals

Authored API/database contracts live in `dryv/`. Generated table schemas and engine, seed and source input contracts live under `source/schema/`. SQL lives with the database CLI. System input values live under root `seed/`. Design proposals under `.docs/_plan/` describe unapproved or deferred scope; the active code and current contracts determine what is implemented.

The [developer portal](../design/architecture/DEVELOPER_PORTAL.md) is the planned evolution of the existing review workbench. It shares typed engine operations over HTTP with the CLI and future agent. The current developer CLI calls the runtime in process.

## Detailed design

- [Data lifecycle and evidence](../design/architecture/DATA_LIFECYCLE.md)
- [Migration status and boundaries](../design/architecture/MIGRATION.md)
- [Database and filesystem design](../design/data/README.md)
- [Acquisition design](../design/acquisition/README.md)
- [Operations and repository map](../design/operations/README.md)
