---
id: DOC-REPOSITORY-MAP-20261112
name: Active repository map
type: documentation
---

# Active repository map

All maintained application, service, package and schema code is under `source/`. This map describes checked-in directories, not proposals.

```text
source/
├── apps/
│   ├── mobile/                 Flutter geography client
│   ├── web/                    Next.js review and inherited admin dashboard
│   └── www/                    Next.js public landing experience
├── backend/
│   ├── api/                    NestJS product API
│   ├── database/               Bun database CLI, SQL and migrations
│   ├── engine/                 Python operational API and capability orchestrator
│   └── README.md
├── packages/
│   ├── browser/ cli/ crawler/ extraction/
│   ├── fetch/ filesystem/ manifest/ search/
│   └── README.md
└── schema/
    ├── database/ engine/ seed/ sources/
    └── README.md
```

## Ownership

| Path | Current code |
|---|---|
| `source/apps/www` | Public Next.js landing experience; full public research routes are planned. |
| `source/apps/admin` | Deferred and removed (2026-11-18); `source/apps/dev` is the administrative interface until an admin app is funded. |
| `source/apps/{app,web,dev}` | Generated frontends from `dryv/contracts/apps/{app,web,dev}`: the public Flutter app, the public Next.js site and the developer portal. See DEC-FRONTEND-ASSEMBLY-20261117. |
| `source/sdk/{api-ts,api-dart}` | Client SDKs generated from the API contract; apps import them. |
| `source/sdk/ui/{web,flutter}` | Hand-written component libraries the generated screens assemble. |
| `source/apps/mobile` | Deferred and removed (2026-11-18); the Flutter `source/apps/app` is the mobile app. |
| `source/backend/api` | NestJS product API. Most contract-facing API types and modules are generated from root `dryv/`; selected use cases, auth and adapters are hand-written. |
| `source/backend/database` | Bun TypeScript migration and administration CLI, SQL and named database operations. |
| `source/backend/engine` | The Python runtime: `EngineRuntime`, its HTTP front door and executor, PostgreSQL/MongoDB adapters and the vector skeleton. It assembles and runs package capabilities. |
| `source/packages/*` | Reusable Python capabilities; these are libraries, not separately deployed services. |
| `source/schema/*` | Generated table schemas and engine, seed and source inputs. |
| root `dryv/` | Authored API/database contracts and generation/audit tooling. |
| root `seed/` | Prepared system inputs, manifests and fixtures. |
| root `scripts/` | Bun command runner for setup, services, checks, databases and package entry points. |

`source/backend/agent` is a README-only proposal; no intelligence service exists. The Python workspace has no database package: the engine's `persistence/` folder is the one place that opens a database connection (see [ENGINE_PERSISTENCE](../data/ENGINE_PERSISTENCE.md)), and `uv sync --all-packages` resolves cleanly. Database administration is the Bun CLI under `source/backend/database`; there is no database service.

Former Python API/data/database implementations are historical and non-executable under `.docs/_archives/2026-11-08-rewrite-snapshot/`. A path in `.docs/_plan/` is a proposal or historical planning reference, not evidence that code exists.

## Local guides

- [Backend](../../../source/backend/README.md)
- [Packages](../../../source/packages/README.md)
- [Schemas](../../../source/schema/README.md)
- [Root commands](../../../scripts/README.md)
- [Architecture](../../docs/ARCHITECTURE.md)
