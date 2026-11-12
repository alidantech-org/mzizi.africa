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
| `source/backend/engine` | The one Python orchestration project: operational API, executor, workers, SSE events and callback outbox (see its README). Orchestrates the packages; never writes domain schemas. |
| `source/packages/` | Reusable Python capability libraries: filesystem, database, source, scraping, extraction, ocr, agent, manifest (see its README). |
| `source/schema/` | System input-artifact schemas (`site/v1`, `contracts`) and the SQL definitions of the rewrite database schemas (`database/auth`, provisional `database/engine`). |
| `seed/` | All prepared seed data, patterns, manifests and test fixtures (`seed/fixtures`). |
| `scripts/` | Thin repository commands calling package APIs. |
| `.docs/_archives/2026-11-08-rewrite-snapshot/` | Historical, non-executable snapshot of the replaced implementations (inherited FastAPI service, old data and database engines, files/intelligence scaffolds) with a relocation inventory. |
| `.docs` | Task workspace (`task.yaml` points here): product docs in `docs/`, `rules/`, `guidance/`, `decisions/`, `handoffs/`, and `todo/` task groups. |

All code lives under `source/`. Older docs and diagrams showing top-level `apps/` and `services/` mean `source/apps/` and `source/backend/`; descriptions of `engine/data`, `engine/database`, `api-legacy`, `files` or `intelligence` refer to the archived implementations (see the archive inventory).

The target product API is NestJS. Confirm actual service/package presence before planning implementation work; do not infer that a target directory exists just because it appears in architecture documentation.

## Root seed registry

`seed/` owns curated/manual/AI-prepared bootstrap artifacts, global auth/file-type/jurisdiction definitions, system rules, jurisdiction folders and site-structure/pattern payloads. See [seed registry](../../seed/README.md) for the target directory contract, manifests and S3 mapping. Existing fixture directories listed above describe the legacy layout; their system-seed payloads must be classified and relocated during rewrite adoption, with runtime loaders updated together. Loader implementation remains under `source/` and canonical Dryv schema contracts under `dryv/`. This documentation change does not relocate runtime payloads.

## Manifest-driven input contracts (2026-11-08)

The user requires source-neutral API/site acquisition via versioned api.structure.yaml and website manifests under root seed/, backed by DB source identities and approved release bindings. All system input-artifact schemas (seed/folder manifests, site/API structures, mappings, patterns and consumed JSON/YAML/CSV shapes) belong under source/schema/. Generic runtime packages stay under source/backend; publisher/country specifics belong in manifest/DB data. Dryv database/API authoring remains under dryv/ with explicit export ownership where contracts overlap. Follow [the detailed source requirements](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/phase-01/source.md#2026-11-08--manifest-driven-api-and-website-sources-user-direction) for conflict-safe DB/YAML editing, pinned releases, learning/review and legacy extractor retirement. This documents future source/pipeline work, not a claim that manifest-driven runtime support is complete.

## 2026-11-08 — Package-first rewrite direction

The user authorizes structure/package extraction and historical archiving now. Target: reusable capabilities under source/packages/, one Python orchestrator/API project under source/backend/engine/, preserved NestJS product API relocated to source/backend/api/, input schemas in source/schema/, and prepared inputs in seed/. Archive old engine/data, engine/database and api-legacy under .docs/_archives/<dated-rewrite-snapshot>/ after preserving active auth rewrite work; remove obsolete backend/files and backend/intelligence active scaffolds. Follow [the controlling structure and publication requirements](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/independent-data-pipelines.md#2026-11-08--approved-package-first-layout-and-single-python-engine).

Filesystem package APIs must support seed manifest/folder provenance, registry upload and hash deduplication, immutable releases and conflict-safe updates to explicitly non-versioned logical items. Keep evidence/run snapshots immutable. This authorization covers restructuring foundations, not all later schema/source/pipeline features. Update all active build/Dryv/auth consumers and maintain focused checks. Existing S3 objects remain protected. Historical paths above are superseded for the rewrite as the local agent carries out the relocation.
