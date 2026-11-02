---
{id: DOC-1C377D1FAAA5,name: Repository Map,type: documentation}
---

# Repository Map

| Path | Responsibility |
| --- | --- |
| `source/apps/www` | Public-facing atlas, heritage, history, and exploration site. |
| `source/apps/web` | Research dashboard (formerly `apps/dashboard`): research and evidence stewardship workflows. |
| `source/apps/mobile` | Flutter mobile application and embedded Cesium map. |
| `.docs/docs/geography-api-contract.md` | Mobile geography API contract. |
| `source/backend/api` | NestJS product API (read-mostly), generated from `dryv/` plus hand-written use cases, auth and read helpers. |
| `dryv/` | Dryv contracts (TypeScript), project packs and contract tooling; the semantic source of the API. `dryv.yaml` at the repository root pins the engine and packs and maps output into `source/backend/api`. |
| `source/backend/api-legacy` | Legacy Python/FastAPI behavior, schema, migrations, seeds, and migration input. |
| `source/backend/data-engine` | Target owner for discovery, ingestion, and extraction. |
| `source/backend/db-engine` | Target owner for migrations, seeds, imports, and database lifecycle. Holds the neutral-model fixtures (`fixtures/neutral-model`: Kenya and South Africa). |
| `source/backend/files` | Target owner for raw and derived evidence artifact custody. |
| `source/backend/intelligence` | Target owner for reviewable AI/tool-assisted classification and evaluation. |
| `.docs` | Task workspace (`task.yaml` points here): product docs in `docs/`, `rules/`, `guidance/`, `decisions/`, `handoffs/`, and `todo/` task groups. |

All code lives under `source/`. Older docs and diagrams showing top-level `apps/` and `services/` mean `source/apps/` and `source/backend/`.

The target product API is NestJS. Confirm actual service/package presence before planning implementation work; do not infer that a target directory exists just because it appears in architecture documentation.
