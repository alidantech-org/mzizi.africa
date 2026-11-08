---
{id: TSK-3EA8C40B0F60,name: Design filesystem tables and existing S3 integration,type: task,status: in-progress,priority: medium,created_at: 2026-11-08T06:46:26.845Z,updated_at: 2026-11-08T09:39:48.836Z,depends_on: [TSK-1AC8F3754DAE,TSK-0F4398B91D38,TSK-A5D7B8F87A9D],order: 2048,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-08T09:39:48.836Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-3EA8C40B0F60/1794130788847-start,started_at: 2026-11-08T09:39:51.343Z}]}}}
---

# 02 — Design filesystem tables and existing S3 integration

## Goal

Deliver a precise, understandable and reviewable design for this milestone in the improvements rewrite, preserving useful existing functionality and establishing reliable inputs for the next milestone.

## Context

Depends on reviewed auth design. Model stores, immutable objects, logical files, versions, folders, variants, attachments and necessary upload/event metadata. Connect to the already deployed SeaweedFS S3-compatible service; do not provision another store. Specify server-side credentials, durable bucket/key references, public-prefix policy, private signed access, hashes, deduplication, retention and explicit inventory of existing objects. Folder capabilities are designed now, but folder trees and file-type seeds are deferred until reference/pattern/geography design. Later patterns and engine usage may generate folders by jurisdiction or geography; folder moves must not rewrite object bytes.

Inspect current Dryv contracts, generated entities, migration history, runtime readers/writers and existing tests before proposing changes. Distinguish repository evidence from a verified live database audit. For every table specify purpose, columns, SQL types, nullability, defaults, primary keys, foreign keys including cross-schema relationships, unique/check constraints, indexes, deletion behavior and comments. Use KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD decisions with a clean initialization plan in mzizi_new; no legacy data/ID preservation or compatibility is required. Existing S3 objects remain protected. Justify temporal/version fields individually. This task is planned design work: creation does not authorize migrations, application changes, deployment or execution of subsequent tasks. Record user design decisions before proposing a coordinated implementation. Work on develop only and do not modify .github. Tasks remain planned until explicitly started.

## Source documentation

- [schema-redesign/filesystem.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/filesystem.md)
- [file-management-and-s3.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/file-management-and-s3.md)
- [source-redesign/12-artifact-lifecycle-and-lineage.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/12-artifact-lifecycle-and-lineage.md)

## Acceptance checklist

- [ ] Audit existing filesystem models and LocalDirectoryStore readers/writers and identify what to retain in the new design; existing schemas/data are disposable and no compatibility is required.
- [ ] Specify exact filesystem constraints, auth references, typed attachments and derivative lineage.
- [ ] Document existing S3 adapter operations, configuration names without secrets, visibility and public/private URL behavior.
- [ ] Explicitly defer file-type seed content and jurisdiction/geography-generated folder hierarchy; define extension interfaces only.
- [ ] Prepare fresh initialization and focused verification plan covering deduplication, private access and immutable evidence.

## Root seed registry requirement — 8 November 2026

All manually/AI-prepared bootstrap inputs now belong under root `seed/`, including baseline auth permissions/roles, global file types and jurisdictions, curated folders, system and jurisdiction patterns, site structures and seed-specific source artifacts. Read [seed registry convention](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md). Preserve global/system/jurisdiction separation; curated `seed/ke/...` inputs are distinct from ignored regeneratable `seed/generated/ke/...` outputs. Manifests map every adopted input to its immutable S3 artifact identity and recognized loader/domain target, natural keys, dependencies, hash and explicit access. Do not create another seed schema or filesystem registry without demonstrated need. Runtime loaders remain under source; Dryv schema contracts remain under dryv.

The clean database target is mzizi_new: schema/data disposal and fresh identities are approved, with no legacy compatibility or migration requirement. Existing S3 objects are not disposable. This task update documents requirements; actual content, manifest runtime support, bulk relocation and application remain gated by the owning implementation task. Folder/type seed production is still deferred until its model and reference/geography prerequisites are ready.

- [ ] Specify global file_types and extension aliases, concrete folders, files/versions and object references with exact PK/FK/type/nullability/uniqueness rules; distinguish format from document role.
- [ ] Document fixed Kenyan folder CSV and global file-type CSV contracts, system/jurisdiction pattern inputs, explicit access classes and stable code resolution; do not generate production seed rows yet.
- [ ] Define staged manifest validation, immutable S3 registration, fresh bootstrap dependency handling, parameterized seed application and recovery across non-transactional S3/DB operations.
- [ ] Build on the completed seed relocation (task `TSK-0F4398B91D38`, inventory in `.docs/docs/SEED_RELOCATION_INVENTORY.md`): derive the global file-type CSV and extension aliases from the authoritative `seed/global/reference/media-formats.json`, and keep one authoritative payload per output.

## Folder-level provenance and access requirements (added after the seed relocation, 8 November 2026)

The seed consolidation task (`TSK-0F4398B91D38`) moved the real system seeds under root `seed/`, recorded origin and access in `_folder.yaml` descriptors and prepared `seed/manifest.yaml` plus a generated `seed/manifest.lock.json` (per file: SHA-256, effective metadata, the descriptor each field was resolved from, historical `relocated_from` path, mapping S3 key, `upload_status: not_uploaded`). Nothing is uploaded or registered. This task must turn that contract into the filesystem design; the rules and tool behavior are specified in `seed/README.md` and implemented for validation in `source/backend/engine/database/src/seed-manifest.ts`.

- [ ] Model folder-level source, preparation and access metadata (role, acquisition class, preparation method, access class, scope, review state) with deterministic inheritance: nearest explicit folder value per field, more specific deeper folders, per-file override only when explicit and justified, missing access defaults to non-public, missing origin classification is flagged before registration, no inference from names such as generated or public, public access requires explicit authorization and a nested folder cannot silently weaken a parent's enforced restriction.
- [ ] Record effective provenance when a seed artifact is registered: seed flag, effective acquisition class and preparation method, the folder or manifest definition each field was resolved from, manifest release and artifact checksum, source input references, generator/model/tool information (never fabricated; unknown stays unknown and flagged for review), intended access class and the durable S3 object reference.
- [ ] Keep current folder placement and access separate from immutable historical origin: moving a file or reclassifying a folder must not rewrite the registered preparation provenance, and each has its own lifecycle and audit trail.
- [ ] Link files to concrete folders and file types, enforce S3 prefix consistency with effective access (only `public/` is anonymous; `restricted/`, `private/`, `internal/` and all other prefixes are private), and treat the access of a seed artifact separately from the records or folders it generates.
- [ ] Specify generation of jurisdiction and system folders from reference-owned patterns (`seed/system/patterns`, `seed/<jurisdiction>/patterns`), preview before apply, idempotent concrete folder creation, and no implicit deletion of folders or objects.

These items stay planned: filesystem implementation is not authorized until the user starts this milestone.

## 2026-11-08 — Package-first rewrite direction

The user authorizes structure/package extraction and historical archiving now. Target: reusable capabilities under source/packages/, one Python orchestrator/API project under source/backend/engine/, preserved NestJS product API relocated to source/apps/api/, input schemas in source/schema/, and prepared inputs in seed/. Archive old engine/data, engine/database and api-legacy under .docs/_archives/<dated-rewrite-snapshot>/ after preserving active auth rewrite work; remove obsolete backend/files and backend/intelligence active scaffolds. Follow [the controlling structure and publication requirements](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/independent-data-pipelines.md#2026-11-08--approved-package-first-layout-and-single-python-engine).

Filesystem package APIs must support seed manifest/folder provenance, registry upload and hash deduplication, immutable releases and conflict-safe updates to explicitly non-versioned logical items. Keep evidence/run snapshots immutable. This authorization covers restructuring foundations, not all later schema/source/pipeline features. Update all active build/Dryv/auth consumers and maintain focused checks. Existing S3 objects remain protected. Historical paths above are superseded for the rewrite as the local agent carries out the relocation.

- [ ] Integrate the approved source/packages and Python engine contracts; remove active dependencies on archived implementations and preserve working auth/resource authorization.
- [ ] Use the filesystem package for seed registry publication, deduplication, provenance and explicitly non-versioned current-item updates without mutating pinned releases.

## Implementation authorized — 8 November 2026 (supersedes the design-only framing and earlier object/type proposals)

The user authorized end-to-end implementation: schema in `mzizi_new`, the shared filesystem package, authorized engine endpoints, a synchronization command, seed integration and focused verification. Latest decisions, superseding earlier proposals: explicit file versioning (`filesystem.file_versions` hold the S3 key, hash, size, extension and content type directly; no separate objects table; several versions may reference one physical content-addressed key and that key is never deleted while any retained reference exists); no file-type or extension tables (normalized extension and MIME stored on the version, validated against the shared catalog `seed/global/reference/media-formats.json`); eight tables only: `folders`, `files`, `file_versions`, `tags`, `taggings`, `extractions`, `extraction_files`, `uploads`; per-file retention policy (`preserve_history` or `replace_current`) with pinned content always preserved; extraction lineage through exact file versions with input/output roles and no single-source or processed columns; paths derived from the folder hierarchy, never stored; access through the scoped RBAC model (`filesystem` namespace, folder scope targets); old `.data` artifacts relocated to the ignored `seed/generated/legacy-artifacts/` subtree except credential-bearing material and the explicitly excluded `.data/raw`.

- [x] Document and apply the seven-table schema (folders, files, file_versions, tags, taggings, file_relations, uploads) and the paths view in `mzizi_new` (exact types, nullability, defaults, keys, constraints, indexes, deletion behavior), with folder inheritance, cycle and sibling-name rules, current-version integrity and tagging and file-relation constraints, verified by fresh initialization.
- [x] Implement the filesystem package: streaming hashing, content-addressed keys, deduplication inside compatible access boundaries, PostgreSQL and in-memory repositories, versioned and replace-current policies, conditional updates, pinned-content protection, access transitions, uploads with lease-aware cleanup, and extraction registration.
- [x] Provide the documented synchronization command with preview and apply, manifest-selected trees and files, parent-first folder creation, stable identities, include/exclude rules, interrupted-run recovery and no implicit remote deletion; expose authorized engine endpoints; check permissions through the auth schema.
- [x] Integrate the root seed manifest and relocate the inventoried `.data` artifacts (excluding `.data/raw`) with classified folders and manifests; keep credential-bearing files non-public and out of ordinary publication.
- [x] Verify with focused mocked tests, a bounded live S3 check when credentials are configured, document actual outcomes honestly, update schema docs and the source/pipeline tasks, run `task validate`, commit and push to `develop`.

## Progress and findings (2026-11-08)

**Implemented.** Schema `filesystem` (8 tables, derivation functions, views, deferred integrity triggers) in `source/schema/database/filesystem/0001_filesystem.sql`, documented column by column in `.docs/docs/FILESYSTEM_SCHEMA.md`; package `source/packages/filesystem` (repository, service, sync, uploads, lineage, transitions, downloads, authorizer, livecheck); engine endpoints under `/v1/filesystem` and capability `filesystem.sync`; command `uv run mzizi-filesystem` (`sync`, `tree`, `cleanup-uploads`, `transition-access`, `live-check`); auth seed extended (`filesystem` namespace, scope target and governed tables on folders, role `filesystem_manager`); sync manifest schema in `source/schema/filesystem`; seed manifest lock now plans content-addressed keys; `.data` relocated to `seed/generated/legacy-artifacts` with `seed/manifests/legacy-artifacts.yaml` and `.docs/docs/DATA_DIR_INVENTORY.md`; `.data/raw` excluded (planner and database refuse it). Tests: `uv run pytest source` (filesystem, engine and database suites against `mzizi_new` with a mocked S3 store).

**Verification limits.** The Claude session had no `S3_*` variables, so no live S3 upload, read, deduplication check or seed publication has run; mocked-S3 tests and store-level stubs passed. See the final report for the exact status.

## Final state (2026-11-08, later)

- Seven tables plus the `paths` view; derivation is `file_relations` (extractions moved out of the filesystem to the engine). Identity columns are all named `code` and follow `.docs/rules/code-columns.md` (hierarchical, derived from root codes).
- Live S3 verified against the configured endpoint (bounded live check passed; presign step skipped without `S3_PUBLIC_ENDPOINT`). Seeds (107 files), security files (6) and legacy artifacts (18,167 files) were published through `mzizi-filesystem sync`; `.data` was removed after verification; `.data/raw` was deleted unpublished on the user's instruction.
- Environment values live only in the root `.env`; security files are read with `mzizi-filesystem secure-get`.
- Verification: `uv run pytest -q source` 175 passed; API auth specs 148 passed.
