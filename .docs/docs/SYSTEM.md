---
{id: DOC-B84B0063429C,name: SYSTEM,type: documentation}
---

# SYSTEM — Mzizi responsibilities and invariants

Mzizi turns source material into evidence-backed knowledge that people can review and explore. This page describes the active code and the boundaries it is intended to preserve; proposals are not implemented merely because a schema or folder exists.

## Active components

| Path | What it does now |
|---|---|
| `source/apps/www` | Next.js public landing experience. The full public atlas and research catalogue remain planned. |
| `source/apps/web` | Next.js dashboard with a Mzizi `/review` workbench and inherited `/admin` pages that still depend on a legacy `SERVER_URL`. |
| `source/apps/mobile` | Flutter client for the versioned geography endpoints in the NestJS API. |
| `source/backend/api` | NestJS product API for application reads and authorized workflow commands. |
| `source/backend/database` | Bun TypeScript SQL migration/seed CLI and named database-operation service. |
| `source/backend/engine` | Python operational API, jobs, workers and orchestration of reusable capabilities. It is not the product API. |
| `source/backend/pipelines` | Bun TypeScript Temporal worker and internal workflow API. |
| `source/packages/` | Python libraries for source access, scraping, extraction, OCR, filesystem work, manifests and model/tool interfaces. |
| `source/schema/` | Input and exchange schemas plus ordered database SQL. Product API/database contracts are authored in root `dryv/`. |
| root `seed/` | Prepared and versioned system inputs and fixtures. |

There is no standalone intelligence service: `source/packages/agent` provides model and tool interfaces. The Python engine and filesystem package still have some direct PostgreSQL paths. Their project metadata also refers to a `mzizi-database` workspace package that is absent from `source/packages/`; the active database service is TypeScript under `source/backend/database`.

## Responsibility boundaries

- Applications render and submit work through API contracts. They do not define canonical domain rules.
- The NestJS API handles product HTTP contracts, authorization and use cases. It reads through a restricted database role and sends authorized writes to named database-service operations.
- The TypeScript database service owns ordered SQL releases, seed operations, local database administration and named writes. It does not own source acquisition or document extraction.
- The Python engine runs operational jobs and calls packages. The Temporal worker coordinates durable workflow state and invokes the engine.
- Packages provide reusable capabilities; they do not own publisher-specific data or silently publish canonical facts.
- SQL and machine-readable source/pipeline/seed/site shapes live under `source/schema/`. Prepared values live under root `seed/`.

## Evidence lifecycle

```text
raw source artifact
  -> extracted representation
  -> attributable candidate or proposal
  -> validation and human review
  -> accepted, versioned domain data
```

Preserve the raw artifact when creating a derivative. Every meaningful claim should retain its source, method and retrieval context. Record historical validity separately from processing time, and preserve uncertainty, disagreement, aliases and changing boundaries. Model-assisted results are attributable proposals and do not silently become canonical data.

## Current limits

The implementation is in migration. Filesystem metadata and manifest synchronization still include Python database paths; the engine database schema is provisional; the review and source-specific promotion flow is incomplete; and the Python package workspace currently has an unresolved missing-member reference. See [ARCHITECTURE](ARCHITECTURE.md), [DATA_LIFECYCLE](../design/architecture/DATA_LIFECYCLE.md), [MIGRATION](../design/architecture/MIGRATION.md) and [ROADMAP](ROADMAP.md) for boundaries and current work.
