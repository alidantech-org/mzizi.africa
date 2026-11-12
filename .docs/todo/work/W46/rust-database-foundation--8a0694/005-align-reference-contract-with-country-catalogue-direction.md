---
{id: TSK-7736FBB41D2B,name: Align Reference contract with country catalogue direction,type: task,status: completed,priority: medium,created_at: 2026-11-12T10:55:24.918Z,updated_at: 2026-11-12T11:07:20.125Z,order: 5120,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T10:55:30.341Z},{from: in-progress,to: completed,at: 2026-11-12T10:56:49.986Z},{from: completed,to: in-progress,at: 2026-11-12T11:04:21.927Z},{from: in-progress,to: completed,at: 2026-11-12T11:07:20.125Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-7736FBB41D2B/1794480930344-start,started_at: 2026-11-12T10:55:31.066Z,end_ref: refs/tracking/TSK-7736FBB41D2B/1794481009988-end,ended_at: 2026-11-12T10:56:49.986Z,summary: {files: 1,insertions: 25,deletions: 4}},{base_ref: refs/tracking/TSK-7736FBB41D2B/1794481461937-start,started_at: 2026-11-12T11:04:22.495Z,end_ref: refs/tracking/TSK-7736FBB41D2B/1794481640127-end,ended_at: 2026-11-12T11:07:20.126Z,summary: {files: 1,insertions: 8,deletions: 5}}]}}}
---

# Implement Reference schema tables and country catalogue

## Goal

Author executable Dryv entity definitions for the Reference tables in `dryv/contracts/schemas/mzizi/reference.ts`. Reference owns canonical modern-country identity, shared controlled meanings, measurement units, topics and reviewed pattern definitions. This must produce real storage contracts with fields, primary keys, local relationships, unique and lookup indexes, and explicit invariants, while keeping unresolved cross-schema targets visible and preserving the current database application's import surface.

## Context

The design proposal is `.docs/_plan/schema-redesign/mzizi-db/phase-01/reference.md`; the schema authoring agreement and code-column rule apply. The existing operations entrypoint imports the `vocabulary` group and `vocabularySchemas` for named reads, so those exports must remain compatible while the group is correctly named `reference`. The proposal includes a pattern release artifact link to Filesystem, a geographic-unit link to Geography and a Legal provision link. Those target schemas are still comment-only shells, and Legal bridge ownership remains open. Do not invent proxy entities, alter migrations, generated output or other schema contracts. A shared calendar-date property may be added to `_shared.ts` because schema authoring rules require reusable scalar definitions to live there. Keep the staged schema-redesign checkbook untouched.

## Acceptance checklist

- [x] Define stored Reference entities for countries, schemes, values, measurement units, topics, patterns, pattern versions, pattern bindings and pattern dependencies, with concrete fields, storage names and primary keys.
- [x] Define local Reference foreign keys, delete/update behavior, unique indexes and lookup indexes; add Dryv invariants for positive scale, valid date window and self-reference prevention where supported.
- [x] Use `reference.countries` as the canonical modern-country catalogue with UUID identity and globally unique project `code`; do not add a world row or require country membership universally.
- [x] Keep Geography as owner of spatial units; document the intended `geography.units.country_id` relation and unresolved target until that contract is authored.
- [x] Preserve the `vocabulary` and `vocabularySchemas` compatibility exports consumed by current database operations without changing those consumers.
- [x] Record unresolved Geography, Filesystem and Legal FK targets and Dryv/SQL constraint limitations beside the relevant contracts; do not claim generation readiness or migration.
- [x] Run root Bun typecheck, the available formatter, targeted Dryv database checks, inspect emitted entities and indexes, and review the final diff.

## Progress

The Reference source now emits nine stored entities. The Legal provision and Filesystem artifact references remain typed identifiers pending target contracts; the Geography unit target is also not yet authorable. The Legal bridge remains an open design point as requested. No migrations or generated outputs were changed.

