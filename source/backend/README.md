# Backend

The active backend has three separately owned projects, plus a README-only proposal (`agent/`):

| Directory | Responsibility | Guide |
|---|---|---|
| [`api/`](api/README.md) | NestJS product HTTP API. Reads product data and submits authorized write commands. | [`api/README.md`](api/README.md) |
| [`database/`](database/README.md) | Generated SQL, immutable migrations and the Bun administration CLI for the single PostgreSQL database. Not a service. | [`database/README.md`](database/README.md) |
| [`agent/`](agent/README.md) | Proposal only: a future assistive application for AI and LLMs. No code yet. | [`agent/README.md`](agent/README.md) |
| [`engine/`](engine/README.md) | Python operational API, workers and orchestration of reusable capabilities. | [`engine/README.md`](engine/README.md) |

Shared Python libraries live in [`../packages/`](../packages/README.md), input schemas and SQL in [`../schema/`](../schema/README.md), and prepared system inputs in [`../../seed/`](../../seed/README.md). The root command runner and local service setup are documented in [`../../scripts/README.md`](../../scripts/README.md).

The database design is one PostgreSQL database with direct engine and API connections (see [DATABASE_ARCHITECTURE](../../.docs/design/data/DATABASE_ARCHITECTURE.md)). The reconnection of the engine and API is in progress: their former database-service client paths have no server, and the engine's filesystem metadata still uses direct PostgreSQL behind `ports.database.Connection`. The `source/packages/filesystem` package itself is pure and holds no database code.

Former Python API and engine implementations are archived and non-executable under `.docs/_archives/2026-11-08-rewrite-snapshot/`.
