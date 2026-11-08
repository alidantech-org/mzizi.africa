---
{id: TSK-3EA8C40B0F60,name: Design filesystem tables and existing S3 integration,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:26.845Z,updated_at: 2026-11-08T06:46:26.845Z,depends_on: [TSK-1AC8F3754DAE],order: 2048}
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
- [ ] Inventory scattered real system seeds and their consumers for later root relocation; test-only fixtures are explicitly classified and no duplicate authoritative payloads remain after adoption.
