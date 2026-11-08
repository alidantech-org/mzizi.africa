---
{id: TSK-3EA8C40B0F60,name: Design filesystem tables and existing S3 integration,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:26.845Z,updated_at: 2026-11-08T08:05:59.578Z,depends_on: [TSK-1AC8F3754DAE,TSK-0F4398B91D38],order: 2048}
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
