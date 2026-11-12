# Backend

The active backend has four separately owned projects:

| Directory | Responsibility | Guide |
|---|---|---|
| [`api/`](api/README.md) | NestJS product HTTP API. Reads product data and submits authorized write commands. | [`api/README.md`](api/README.md) |
| [`database/`](database/README.md) | Bun TypeScript SQL migration/seed CLI and named database-operation service. | [`database/README.md`](database/README.md) |
| [`engine/`](engine/README.md) | Python operational API, workers and orchestration of reusable capabilities. | [`engine/README.md`](engine/README.md) |
| [`pipelines/`](pipelines/README.md) | Bun TypeScript Temporal worker and durable workflow API. | [`pipelines/README.md`](pipelines/README.md) |

Shared Python libraries live in [`../packages/`](../packages/README.md), input schemas and SQL in [`../schema/`](../schema/README.md), and prepared system inputs in [`../../seed/`](../../seed/README.md). The root command runner and local service setup are documented in [`../../scripts/README.md`](../../scripts/README.md).

The service migration is partial: the Python engine and filesystem package still contain direct PostgreSQL paths for some operations. The Python workspace also references a `mzizi-database` package that is not currently present under `source/packages/`; the active database service is the TypeScript project in `database/`.

Former Python API and engine implementations are archived and non-executable under `.docs/_archives/2026-11-08-rewrite-snapshot/`.
