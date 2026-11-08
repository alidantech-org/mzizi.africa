---
{id: TSK-0B9CCF587F64,name: Design source custody and website data against agreed schemas,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:28.867Z,updated_at: 2026-11-08T06:46:28.867Z,depends_on: [TSK-D6949284672E],order: 5120}
---

# 05 — Design source custody and website data against agreed schemas

## Goal

Deliver a precise, understandable and reviewable design for this milestone in the improvements rewrite, preserving useful existing functionality and establishing reliable inputs for the next milestone.

## Context

Depends on reviewed destination schemas from task 04. Only now finalize detailed source and website design, using known destination records and filesystem contracts. Distinguish publisher, publication, site/URL, retrieval capture, stored version, extraction and attributed claim. Compare keeping or consolidating website/source tables without assuming a merge. Preserve raw evidence, licenses, locators, collection assessments and versioned Markdown derivatives. Define deduplication and meaningful-change semantics without treating a changed hash as proof of a changed real-world fact. Carry the agreed schema naming and hard-FK policy into this design.

Inspect current Dryv contracts, generated entities, migration history, runtime readers/writers and existing tests before proposing changes. Distinguish repository evidence from a verified live database audit. For every table specify purpose, columns, SQL types, nullability, defaults, primary keys, foreign keys including cross-schema relationships, unique/check constraints, indexes, deletion behavior and comments. Use KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD decisions with migration mapping; preserve stable IDs, evidence and existing data. Justify temporal/version fields individually. This task is planned design work: creation does not authorize migrations, application changes, deployment or execution of subsequent tasks. Record user design decisions before proposing a coordinated implementation. Work on develop only and do not modify .github. Tasks remain planned until explicitly started.

## Source documentation

- [schema-redesign/source.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/source.md)
- [source-redesign/01-current-inventory-and-boundaries.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/01-current-inventory-and-boundaries.md)
- [source-redesign/02-source-schema-and-human-review.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/02-source-schema-and-human-review.md)
- [source-redesign/03-discovery-links-and-site-memory.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/03-discovery-links-and-site-memory.md)
- [source-redesign/04-structures-templates-and-extraction.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/04-structures-templates-and-extraction.md)
- [source-redesign/06-incremental-change-dedup.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/06-incremental-change-dedup.md)
- [source-redesign/11-tool-integration-and-contracts.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/11-tool-integration-and-contracts.md)
- [source-redesign/12-artifact-lifecycle-and-lineage.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/12-artifact-lifecycle-and-lineage.md)
- [site-structure-and-markdown-extraction.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/site-structure-and-markdown-extraction.md)

## Acceptance checklist

- [ ] Audit source/website tables and actual use, then explicitly decide keep/merge/rename/split with complete column specifications.
- [ ] Specify captures, publications, files, extraction outputs and typed claim evidence relationships against agreed domains.
- [ ] Define discovery boundaries, source assessment, preservation, content hashes and incremental change contracts.
- [ ] Map concrete source artifacts and fields to exact domain destinations, documenting abstention and disagreement behavior.
- [ ] Prepare compatibility/migration plan and user-reviewed contracts for the final pipeline design.

## Root seed registry requirement — 8 November 2026

All manually/AI-prepared bootstrap inputs now belong under root `seed/`, including baseline auth permissions/roles, global file types and jurisdictions, curated folders, system and jurisdiction patterns, site structures and seed-specific source artifacts. Read [seed registry convention](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md). Preserve global/system/jurisdiction separation; curated `seed/ke/...` inputs are distinct from ignored regeneratable `seed/generated/ke/...` outputs. Manifests map every adopted input to its immutable S3 artifact identity and recognized loader/domain target, natural keys, dependencies, hash and explicit access. Do not create another seed schema or filesystem registry without demonstrated need. Runtime loaders remain under source; Dryv schema contracts remain under dryv.

The clean database target is mzizi_new: schema/data disposal and fresh identities are approved, with no legacy compatibility or migration requirement. Existing S3 objects are not disposable. This task update documents requirements; actual content, manifest runtime support, bulk relocation and application remain gated by the owning implementation task. Folder/type seed production is still deferred until its model and reference/geography prerequisites are ready.

## Manifest-driven source requirement — 8 November 2026

Design websites and APIs as first-class sources, with api.structure.yaml and website structures prepared under root seed/. Source-specific knowledge must move from Python extractors into versioned manifests and DB configuration. Preserve generic parsing/standards/protocol packages; prohibit country/publisher branches and per-source engine modules. The full controlling requirements, input-schema catalog, DB/YAML synchronization, manifest contract, current-module inventory and acceptance cases are in [source design](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/source.md#2026-11-08--manifest-driven-api-and-website-sources-user-direction).

- [ ] Specify API and website manifest fields, resource/destination mappings, pagination, secret references, evidence and source-gate bindings using reusable capabilities.
- [ ] Centralize input artifact schemas and validator bindings in source/schema/ for seed/folder manifests, API/site structures, patterns, mappings and consumed JSON/YAML/CSV; reconcile generated exports with Dryv rather than duplicate truth.
- [ ] Specify DB-held source/manifest release identities and immutable YAML artifact FKs, version/hash conflict checks, import/export, reviewed activation and run pinning.
- [ ] Inventory all named legacy extractors/importers; move source facts to seed manifests and identify generic capability gaps before retiring bespoke modules.
- [ ] Prove source-neutral onboarding and replay across multiple APIs/websites/jurisdictions without adding source-specific Python; test invalid manifests, drift, checkpoint errors, authorization and abstention.
- [ ] Document learned manifest proposals, validation/review and reproducible inputs without promising universal extraction or bypassing canonical promotion.

This is a future milestone requirement; keep the task planned and preserve dependency order. No source-specific modules are removed by this documentation change.

## 2026-11-08 — Package-first rewrite direction

The user authorizes structure/package extraction and historical archiving now. Target: reusable capabilities under source/packages/, one Python orchestrator/API project under source/backend/engine/, preserved NestJS product API relocated to source/apps/api/, input schemas in source/schema/, and prepared inputs in seed/. Archive old engine/data, engine/database and api-legacy under .docs/_archives/<dated-rewrite-snapshot>/ after preserving active auth rewrite work; remove obsolete backend/files and backend/intelligence active scaffolds. Follow [the controlling structure and publication requirements](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/independent-data-pipelines.md#2026-11-08--approved-package-first-layout-and-single-python-engine).

Filesystem package APIs must support seed manifest/folder provenance, registry upload and hash deduplication, immutable releases and conflict-safe updates to explicitly non-versioned logical items. Keep evidence/run snapshots immutable. This authorization covers restructuring foundations, not all later schema/source/pipeline features. Update all active build/Dryv/auth consumers and maintain focused checks. Existing S3 objects remain protected. Historical paths above are superseded for the rewrite as the local agent carries out the relocation.

- [ ] Integrate the approved source/packages and Python engine contracts; remove active dependencies on archived implementations and preserve working auth/resource authorization.
- [ ] Use the filesystem package for seed registry publication, deduplication, provenance and explicitly non-versioned current-item updates without mutating pinned releases.

## Filesystem integration interface (recorded 8 November 2026)

The filesystem is implemented (`TSK-3EA8C40B0F60`, `.docs/docs/FILESYSTEM_SCHEMA.md`). Source work must map learned or discovered sources to folders through manifests, resource relationships and approved reference-owned patterns, then register content through the neutral package interface (`FilesystemService.register`, `run_sync` with a sync manifest, `begin_extraction`/`register_output` for extraction lineage with exact file versions). The package contains no Kenya, KNBS, IEBC or per-site logic and must not gain any: publisher, jurisdiction and site identity stay in manifests and database records, and the folder classification (access, role, acquisition class, preparation, seed flag, jurisdiction) is supplied by the caller or inherited from folders. Source evidence must pin the exact file versions it cites (`file_versions.pinned`), and capture access classes must respect the placement-equals-access rule.
