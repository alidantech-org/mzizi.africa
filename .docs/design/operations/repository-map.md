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
│   ├── database/               Bun TypeScript database service and CLI
│   ├── engine/                 Python operational API and capability orchestrator
│   ├── pipelines/              Bun TypeScript Temporal worker and workflow API
│   └── README.md
├── packages/
│   ├── agent/ extraction/ filesystem/ manifest/
│   ├── ocr/ scraping/ source/
│   └── README.md
└── schema/
    ├── contracts/ database/ pipeline/ seed/ site/v1/
    └── README.md
```

## Ownership

| Path | Current code |
|---|---|
| `source/apps/www` | Public Next.js landing experience; full public research routes are planned. |
| `source/apps/web` | Next.js `/review` workbench plus inherited `/admin` pages. The review routes call the NestJS API; legacy admin pages use `SERVER_URL`. |
| `source/apps/mobile` | Flutter geography client that calls `/v1/geography/*` on the NestJS API. |
| `source/backend/api` | NestJS product API. Most contract-facing API types and modules are generated from root `dryv/`; selected use cases, auth and adapters are hand-written. |
| `source/backend/database` | Bun TypeScript migration/seed CLI and internal named database operations. |
| `source/backend/engine` | Python operational API, job lifecycle, workers and package orchestration. |
| `source/backend/pipelines` | Bun TypeScript Temporal workflows, worker and internal command API. |
| `source/packages/*` | Reusable Python capabilities; these are libraries, not separately deployed services. |
| `source/schema/*` | Ordered SQL and JSON Schemas for exchange, pipeline, seed and site inputs. |
| root `dryv/` | Authored API/database contracts and generation/audit tooling. |
| root `seed/` | Prepared system inputs, manifests and fixtures. |
| root `scripts/` | Bun command runner for setup, services, checks, databases and package entry points. |

`source/packages/agent` is provider-neutral model/tool support; no standalone intelligence service exists. There is no `source/packages/database/` directory, although the engine and filesystem Python project metadata still reference `mzizi-database`. The active database service is TypeScript under `source/backend/database`; fresh Python workspace synchronization currently fails on the missing Python workspace member.

Former Python API/data/database implementations are historical and non-executable under `.docs/_archives/2026-11-08-rewrite-snapshot/`. A path in `.docs/_plan/` is a proposal or historical planning reference, not evidence that code exists.

## Local guides

- [Backend](../../../source/backend/README.md)
- [Packages](../../../source/packages/README.md)
- [Schemas](../../../source/schema/README.md)
- [Root commands](../../../scripts/README.md)
- [Architecture](../../docs/ARCHITECTURE.md)
