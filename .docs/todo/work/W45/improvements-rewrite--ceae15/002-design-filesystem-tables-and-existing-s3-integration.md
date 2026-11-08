---
{id: TSK-3EA8C40B0F60,name: Design filesystem tables and existing S3 integration,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:26.845Z,updated_at: 2026-11-08T06:46:26.845Z,depends_on: [TSK-1AC8F3754DAE],order: 2048}
---

# 02 — Design filesystem tables and existing S3 integration

## Goal

Deliver a precise, understandable and reviewable design for this milestone in the improvements rewrite, preserving useful existing functionality and establishing reliable inputs for the next milestone.

## Context

Depends on reviewed auth design. Model stores, immutable objects, logical files, versions, folders, variants, attachments and necessary upload/event metadata. Connect to the already deployed SeaweedFS S3-compatible service; do not provision another store. Specify server-side credentials, durable bucket/key references, public-prefix policy, private signed access, hashes, deduplication, retention and local-object migration. Folder capabilities are designed now, but folder trees and file-type seeds are deferred until reference/pattern/geography design. Later patterns and engine usage may generate folders by jurisdiction or geography; folder moves must not rewrite object bytes.

Inspect current Dryv contracts, generated entities, migration history, runtime readers/writers and existing tests before proposing changes. Distinguish repository evidence from a verified live database audit. For every table specify purpose, columns, SQL types, nullability, defaults, primary keys, foreign keys including cross-schema relationships, unique/check constraints, indexes, deletion behavior and comments. Use KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD decisions with migration mapping; preserve stable IDs, evidence and existing data. Justify temporal/version fields individually. This task is planned design work: creation does not authorize migrations, application changes, deployment or execution of subsequent tasks. Record user design decisions before proposing a coordinated implementation. Work on develop only and do not modify .github. Tasks remain planned until explicitly started.

## Source documentation

- [schema-redesign/filesystem.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/filesystem.md)
- [file-management-and-s3.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/file-management-and-s3.md)
- [source-redesign/12-artifact-lifecycle-and-lineage.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/12-artifact-lifecycle-and-lineage.md)

## Acceptance checklist

- [ ] Audit existing filesystem models and LocalDirectoryStore readers/writers and preserve IDs, hashes and versions.
- [ ] Specify exact filesystem constraints, auth references, typed attachments and derivative lineage.
- [ ] Document existing S3 adapter operations, configuration names without secrets, visibility and public/private URL behavior.
- [ ] Explicitly defer file-type seed content and jurisdiction/geography-generated folder hierarchy; define extension interfaces only.
- [ ] Prepare migration/reconciliation and verification plan covering deduplication, private access and immutable evidence.
