---
{id: TSK-7ED801464BFD,name: Design independent pipelines for agreed data destinations,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:29.468Z,updated_at: 2026-11-08T06:46:29.468Z,depends_on: [TSK-0B9CCF587F64],order: 6144}
---

# 06 — Design independent pipelines for agreed data destinations

## Goal

Deliver a precise, understandable and reviewable design for this milestone in the improvements rewrite, preserving useful existing functionality and establishing reliable inputs for the next milestone.

## Context

Depends on reviewed source design and all destination schema designs, tasks 01-05. Design pipelines around exact data needs and relationships, not a generic engine rewrite. Reuse the existing queue, extractors, storage adapters and controlled promotion where appropriate. Separate workflow, reusable package, worker and orchestrator. Define shared scheduling, source admission, retries, leases, idempotency, resource budgets, caching and cancellation. Reference owns patterns; engine applies them. Schedule-driven, source-change and manual refresh triggers share execution machinery. Defer new brokers, vector services, custom ML and topology choices unless evidence justifies them.

Inspect current Dryv contracts, generated entities, migration history, runtime readers/writers and existing tests before proposing changes. Distinguish repository evidence from a verified live database audit. For every table specify purpose, columns, SQL types, nullability, defaults, primary keys, foreign keys including cross-schema relationships, unique/check constraints, indexes, deletion behavior and comments. Use KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD decisions with migration mapping; preserve stable IDs, evidence and existing data. Justify temporal/version fields individually. This task is planned design work: creation does not authorize migrations, application changes, deployment or execution of subsequent tasks. Record user design decisions before proposing a coordinated implementation. Work on develop only and do not modify .github. Tasks remain planned until explicitly started.

## Source documentation

- [independent-data-pipelines.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/independent-data-pipelines.md)
- [data-categories-and-patterns.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/data-categories-and-patterns.md)
- [schema-redesign/engine.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/engine.md)
- [source-redesign/09-pipelines-autonomy-and-decisions.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/09-pipelines-autonomy-and-decisions.md)
- [source-redesign/10-prior-art-and-build-vs-reuse.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/10-prior-art-and-build-vs-reuse.md)
- [source-redesign/11-tool-integration-and-contracts.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/11-tool-integration-and-contracts.md)
- [source-redesign/13-benchmarks-and-research-questions.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/13-benchmarks-and-research-questions.md)

## Acceptance checklist

- [ ] Map each proposed pipeline input, step and output to exact agreed tables, pattern versions, source artifacts and review policy.
- [ ] Specify reusable package boundaries and independently runnable workers with one coordinated queue/admission boundary.
- [ ] Define concurrency-safe promotion, retries/resume, deduplication, lineage, freshness and affected-dependency invalidation.
- [ ] Plan county leadership proof with preserved evidence and a second independent workload to verify isolation and bounded concurrency.
- [ ] Document baseline comparisons, measurable acceptance checks, deployment alternatives and staged implementation tasks for later explicit authorization.

## Root seed registry requirement — 8 November 2026

All manually/AI-prepared bootstrap inputs now belong under root `seed/`, including baseline auth permissions/roles, global file types and jurisdictions, curated folders, system and jurisdiction patterns, site structures and seed-specific source artifacts. Read [seed registry convention](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md). Preserve global/system/jurisdiction separation; curated `seed/ke/...` inputs are distinct from ignored regeneratable `seed/generated/ke/...` outputs. Manifests map every adopted input to its immutable S3 artifact identity and recognized loader/domain target, natural keys, dependencies, hash and explicit access. Do not create another seed schema or filesystem registry without demonstrated need. Runtime loaders remain under source; Dryv schema contracts remain under dryv.

The clean database target is mzizi_new: schema/data disposal and fresh identities are approved, with no legacy compatibility or migration requirement. Existing S3 objects are not disposable. This task update documents requirements; actual content, manifest runtime support, bulk relocation and application remain gated by the owning implementation task. Folder/type seed production is still deferred until its model and reference/geography prerequisites are ready.

- [ ] Design shared manifest loading, code/foreign-key resolution, preview/apply/replay, artifact upload verification and dependency ordering for root seed inputs without an independent competing queue or seed runtime.

## Manifest-driven source requirement — 8 November 2026

Design execution of websites and APIs as first-class sources, with api.structure.yaml and website structures prepared under root seed/. Source-specific knowledge must move from Python extractors into versioned manifests and DB configuration. Preserve generic parsing/standards/protocol packages; prohibit country/publisher branches and per-source engine modules. The full controlling requirements, input-schema catalog, DB/YAML synchronization, manifest contract, current-module inventory and acceptance cases are in [source design](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/source.md#2026-11-08--manifest-driven-api-and-website-sources-user-direction).

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

Pipelines register every artifact (downloaded, converted, extracted, derived) through the filesystem package so hashing, deduplication, verified upload and provenance snapshots are uniform. Extraction steps record `filesystem.extractions` rows linking exact input and output file versions with capability and tool versions and a configuration hash; engine runs and jobs link by `engine_run_id` and `engine_job_id` while scheduling, retries and cancellation stay in the engine schema. Processing status per operation is derived from extraction history, never stored as a flag. Engine endpoints for the filesystem exist under `/v1/filesystem` with folder-scoped authorization from the `auth` schema; SSE events for filesystem changes and the NestJS callback for registered artifacts are still to be designed with the pipeline contracts.
