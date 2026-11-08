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
| `source/backend/engine/data` | Target owner for discovery, ingestion, and extraction. |
| `source/backend/engine/database` | Target owner for migrations, seeds, imports, and database lifecycle. Holds the neutral-model test fixtures (`fixtures/neutral-model`: Kenya and South Africa); system seeds live in root `seed/`. |
| `source/backend/files` | Target owner for raw and derived evidence artifact custody. |
| `source/backend/intelligence` | Target owner for reviewable AI/tool-assisted classification and evaluation. |
| `.docs` | Task workspace (`task.yaml` points here): product docs in `docs/`, `rules/`, `guidance/`, `decisions/`, `handoffs/`, and `todo/` task groups. |

All code lives under `source/`. Older docs and diagrams showing top-level `apps/` and `services/` mean `source/apps/` and `source/backend/`.

The target product API is NestJS. Confirm actual service/package presence before planning implementation work; do not infer that a target directory exists just because it appears in architecture documentation.

## Root seed registry

`seed/` owns curated/manual/AI-prepared bootstrap artifacts, global auth/file-type/jurisdiction definitions, system rules, jurisdiction folders and site-structure/pattern payloads. See [seed registry](../../seed/README.md) for the target directory contract, manifests and S3 mapping. Existing fixture directories listed above describe the legacy layout; their system-seed payloads must be classified and relocated during rewrite adoption, with runtime loaders updated together. Loader implementation remains under `source/` and canonical Dryv schema contracts under `dryv/`. This documentation change does not relocate runtime payloads.

## Manifest-driven input contracts (2026-11-08)

The user requires source-neutral API/site acquisition via versioned api.structure.yaml and website manifests under root seed/, backed by DB source identities and approved release bindings. All system input-artifact schemas (seed/folder manifests, site/API structures, mappings, patterns and consumed JSON/YAML/CSV shapes) belong under source/schema/. Generic runtime packages stay under source/backend; publisher/country specifics belong in manifest/DB data. Dryv database/API authoring remains under dryv/ with explicit export ownership where contracts overlap. Follow [the detailed source requirements](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/source.md#2026-11-08--manifest-driven-api-and-website-sources-user-direction) for conflict-safe DB/YAML editing, pinned releases, learning/review and legacy extractor retirement. This documents future source/pipeline work, not a claim that manifest-driven runtime support is complete.
