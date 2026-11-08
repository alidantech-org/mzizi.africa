---
{id: TSK-7E5E18758D9C,name: Design reference-owned patterns and harden geography,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:27.515Z,updated_at: 2026-11-08T06:46:27.515Z,depends_on: [TSK-3EA8C40B0F60],order: 3072}
---

# 03 — Design reference-owned patterns and harden geography

## Goal

Deliver a precise, understandable and reviewable design for this milestone in the improvements rewrite, preserving useful existing functionality and establishing reliable inputs for the next milestone.

## Context

Depends on reviewed auth and filesystem designs. Review reference and geography together. Shared pattern definitions belong in reference; engine owns execution and runs, filesystem owns complex versioned pattern artifacts, and domain schemas own generated rows. Make jurisdiction categories, schemes and values understandable with scheme-compatible FK constraints. Separate legal jurisdiction, country-root territorial scope, physical location and presence. Support historical and overlapping hierarchies. Patterns create real rows only where researched rules establish existence; unknown occupants/addresses remain gaps and uncertain hypotheses remain job manifests. Plan later file-type and folder seeds here without prematurely generating them.

Inspect current Dryv contracts, generated entities, migration history, runtime readers/writers and existing tests before proposing changes. Distinguish repository evidence from a verified live database audit. For every table specify purpose, columns, SQL types, nullability, defaults, primary keys, foreign keys including cross-schema relationships, unique/check constraints, indexes, deletion behavior and comments. Use KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD decisions with migration mapping; preserve stable IDs, evidence and existing data. Justify temporal/version fields individually. This task is planned design work: creation does not authorize migrations, application changes, deployment or execution of subsequent tasks. Record user design decisions before proposing a coordinated implementation. Work on develop only and do not modify .github. Tasks remain planned until explicitly started.

## Source documentation

- [schema-redesign/reference.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/reference.md)
- [schema-redesign/geography.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/geography.md)
- [data-categories-and-patterns.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/data-categories-and-patterns.md)
- [schema-redesign/legal.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/legal.md)
- [schema-redesign/engine.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/engine.md)

## Acceptance checklist

- [ ] Specify jurisdictions, categories, schemes/values and geography units/relationships/boundary contracts with enforceable keys.
- [ ] Specify reference-owned pattern identity, versions, applicability, dependencies and typed lineage; engine execution interfaces remain explicit.
- [ ] Resolve country-root scope, historical hierarchy, physical-place/contact boundaries and wrong-scheme reference prevention.
- [ ] Show mobile/API query examples and one explainable jurisdiction-to-county-to-office generation example.
- [ ] Define deferred seed/folder generation by jurisdiction/geography, four acquisition classes, migration checks and user decisions.

## Root seed registry requirement — 8 November 2026

All manually/AI-prepared bootstrap inputs now belong under root `seed/`, including baseline auth permissions/roles, global file types and jurisdictions, curated folders, system and jurisdiction patterns, site structures and seed-specific source artifacts. Read [seed registry convention](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md). Preserve global/system/jurisdiction separation; curated `seed/ke/...` inputs are distinct from ignored regeneratable `seed/generated/ke/...` outputs. Manifests map every adopted input to its immutable S3 artifact identity and recognized loader/domain target, natural keys, dependencies, hash and explicit access. Do not create another seed schema or filesystem registry without demonstrated need. Runtime loaders remain under source; Dryv schema contracts remain under dryv.

The clean database target is mzizi_new: schema/data disposal and fresh identities are approved, with no legacy compatibility or migration requirement. Existing S3 objects are not disposable. This task update documents requirements; actual content, manifest runtime support, bulk relocation and application remain gated by the owning implementation task. Folder/type seed production is still deferred until its model and reference/geography prerequisites are ready.

- [ ] Design reference-owned versioned pattern bindings and actual jurisdiction/geography inputs for public and non-public folders, including lazy system logs/{pipeline}/{year}/{month}, run lineage and idempotent concrete output.
