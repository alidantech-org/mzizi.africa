---
{id: DOC-B84B0063429C,name: SYSTEM,type: documentation}
---

# SYSTEM — Mzizi responsibilities and invariants

Mzizi turns source material into evidence-backed knowledge that people can review and explore. This page describes the active code and the boundaries it is intended to preserve; proposals are not implemented merely because a schema or folder exists.

## Active components

| Path | What it does now |
|---|---|
| `source/apps/www` | Next.js public landing experience. The full public atlas and research catalogue remain planned. |
| `source/apps/admin` | Deferred and removed (2026-11-18); `source/apps/dev` is the administrative interface until an admin app is funded. |
| `source/apps/mobile` | Deferred and removed (2026-11-18); the Flutter `source/apps/app` is the mobile app. |
| `source/backend/api` | NestJS product API for application reads and authorized workflow commands. |
| `source/backend/database` | Generated SQL, immutable migrations and the Bun administration CLI for the single PostgreSQL database. Not a service. |
| `source/backend/engine` | Python operational API, jobs, workers and orchestration of reusable capabilities. It is not the product API. |
| `source/packages/` | Python libraries for fetching, scraping, extraction (with OCR), filesystem work and manifests. |
| `source/schema/` | Generated table schemas and engine, seed and source contracts. Product API/database contracts are authored in root `dryv/`. |
| root `seed/` | Prepared and versioned system inputs and fixtures. |

There is no standalone intelligence service: `source/backend/agent/` is a README-only proposal for a future assistive application. The Python engine still has direct PostgreSQL paths for filesystem metadata, behind its own database port; the packages under `source/packages/` hold no database code. Network and browser capabilities may own adapters behind ports. There is no database service: the engine and API connect to PostgreSQL directly, and `source/backend/database` holds the SQL, migrations and CLI.

## Responsibility boundaries

- Applications render and submit work through API contracts. They do not define canonical domain rules.
- The NestJS API handles product HTTP contracts, authorization and use cases. It connects to PostgreSQL with its own role, writes the schemas it owns (such as authentication) and asks the Python engine to run jobs.
- The Bun database CLI owns the generated SQL, ordered immutable releases and role provisioning. It is not a service and does not own source acquisition or document extraction. MongoDB stores crawl activity and the supervised-run ledger. Broader candidate staging and approval are planned.
- The Python engine runs operational jobs and calls packages.
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

The current HTTP executor keeps jobs and events in memory. Supervised spec runs have their own MongoDB ledger. The review and source-specific promotion flow is incomplete. The [developer portal design](../design/architecture/DEVELOPER_PORTAL.md) records the planned shared workflow over HTTP, from saved evidence to draft export. See [ARCHITECTURE](ARCHITECTURE.md), [DATA_LIFECYCLE](../design/architecture/DATA_LIFECYCLE.md), [MIGRATION](../design/architecture/MIGRATION.md) and [ROADMAP](ROADMAP.md) for boundaries and current work.
