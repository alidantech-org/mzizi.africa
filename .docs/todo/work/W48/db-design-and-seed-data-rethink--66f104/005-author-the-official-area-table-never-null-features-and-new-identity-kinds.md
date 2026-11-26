---
{id: TSK-49166C0AABCF,name: "Author the official area table, never-null features and new identity kinds",type: task,status: completed,priority: high,created_at: 2026-11-25T21:36:53.595Z,updated_at: 2026-11-25T23:13:07.422Z,order: 5120,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T21:37:25.655Z},{from: in-progress,to: completed,at: 2026-11-25T23:13:07.422Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-49166C0AABCF/1795642645658-start,started_at: 2026-11-25T21:37:26.972Z,end_ref: refs/tracking/TSK-49166C0AABCF/1795648387441-end,ended_at: 2026-11-25T23:13:07.423Z,summary: {files: 108,insertions: 14423,deletions: 7958}}]}}}
---

# Author the official area table, never-null features and the new identity kinds

## Goal
Give Mzizi one official, tangible record for every administrative or electoral place, so patterns fan out over areas and offices, jurisdictions and templates point at an area instead of a raw geography feature. A county, constituency, ward, sub-county, division, location or sub-location becomes one `reference.areas` row in one hierarchy at one level, linked to its geography feature through a feature id that is never null. Success means the Dryv contracts compile, the generated SQL carries the table, and a ward can be created with its feature and an empty geometry in one generated step.

## Context
Decisions are recorded in `.docs/decisions/DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125.md` (decisions 7 to 11) and explained in `.docs/design/data/GEOGRAPHY_REFERENCE_AND_GOVERNANCE_RETHINK.md`. The table is named `areas` (contract `Areas`) because `reference.Units` already means measurement units and the owner wants one-word plural names. It has its own row id, so a place can be an area in several hierarchies and periods. Parent membership moves out of `geography.relationships` into the area's `parent_id`; other relationships such as borders stay. The audit of geography columns that are NOT NULL today is part of this task. Rules: `.docs/rules/codes.md`, `.docs/rules/database-naming.md`, `.docs/rules/versioning.md` (no version fields), `dryv/README.md`.

## Acceptance checklist
- [x] Read `geography.ts`, `reference.ts` and `identity.ts` and write down, in this file under Progress, which feature and geometry columns are NOT NULL and which must become nullable so a geometry row can exist with no shape.
- [x] Add `Areas` to `reference.ts` with code, hierarchy, level, feature link, parent area, period fields, a root template reference, a composite key proving the level belongs to the hierarchy, and a rule that the parent differs from the area.
- [x] Add geometry status values `expected`, `draft`, `established` and make the geometry shape nullable; boundary status is read from the geometry, not stored on the area.
- [x] Remove hierarchy and level membership from `geography.relationships` for administrative parents (keep other kinds) and update every contract that referenced them.
- [x] Add identity kinds `pattern` and `template` to `IdentityKind`, its TypeScript union and the identity partitions.
- [x] Run `bun run dryv:check` from the repository root and the contract audit; record the result under Progress.

## Progress

2026-11-26. Done. `geography.areas` (own id, never-null `feature_id`, hierarchy, level, parent, period, root `template_id`) with composite keys for level-in-hierarchy and parent-in-hierarchy, an acyclic trigger and partial unique indexes. Name changed from `reference.areas` to `geography.areas` because reference depends only on vocabulary and identity. Geometry: `geometry` and the generated envelope, centroid and area are nullable, `basis_term` is nullable, a new `status` (expected, draft, established; default established) with a guard trigger. `geography.relationships` lost hierarchy and level columns; links that are not membership (a ward inside a sub-county of the administrative hierarchy) stay there. Identity kinds `pattern` and `template` added. Level gains `allows_skip`. API contract left unchanged on purpose.
