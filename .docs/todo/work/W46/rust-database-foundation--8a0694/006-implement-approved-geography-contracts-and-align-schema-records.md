---
{id: TSK-1B6EBCB8D9A1,name: Implement approved Geography contracts and align schema records,type: task,status: in-progress,priority: medium,created_at: 2026-11-12T12:09:15.356Z,updated_at: 2026-11-12T12:09:21.302Z,order: 6144,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T12:09:21.302Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-1B6EBCB8D9A1/1794485361305-start,started_at: 2026-11-12T12:09:22.054Z}]}}}
---

# Implement approved Geography contracts and align schema records

## Goal

Implement the approved Geography architecture in `dryv/contracts/schemas/mzizi/geography.ts`. The nine approved tables are `features`, `units`, `places`, `names`, `identifiers`, `geometries`, `relationships`, `changes` and `datasets`. `geography.features` is the sole canonical geographic identity registry; Units and Places are one-to-one specializations, and all other geographic facts attach to feature identity or register dataset metadata without duplicating Source or Filesystem ownership. Update the two requested Phase 01 review documents and related current Geography/Reference docs so they match the approved design and implementation.

## Context

The user supplied an explicit approval handoff that supersedes the older candidate inventory in `.docs/_plan/schema-redesign/mzizi-db/phase-01/geography.md`. The user also directed that this document and `.docs/_plan/schema-redesign/mzizi-db/phase-01/reference.md` be updated to record the latest implemented design as approved, and that stale active Geography/Reference documentation be found and corrected. Reference owns modern-country identities and mediates Legal relationships; Geography owns territory features and spatial data. The current Reference contract has `reference.countries` but has no executable Legal bridge, and Geography, Filesystem and Legal are shells. Do not invent their FK targets or a Legal proxy. Dryv must be checked for PostGIS geometry, GiST/spatial indexes, range and other advanced type support; retain exact gaps and keep the contract out of generation where semantics cannot be represented faithfully.

## Acceptance checklist

- [ ] Read repository rules, Task rules, current schema documents, Reference/Filesystem/Legal contracts and the approved Geography handoff.
- [ ] Define exactly the nine approved Geography tables with field descriptions, keys, local relations, referential actions, unique and lookup indexes and supported invariants.
- [ ] Model `features` as the sole canonical identity; make Units and Places feature-key specializations without duplicate identities.
- [ ] Preserve typed dated relationships, feature names and identifiers, geometry version history, geographic transformations and spatial dataset metadata.
- [ ] Integrate countries and controlled values through Reference when executable targets exist; do not create a Geography country or Legal bridge table.
- [ ] Document precise unsupported PostGIS types/indexes and unresolved shell-only cross-schema targets without weakening them or activating incomplete definitions.
- [ ] Update Geography and Reference Phase 01 documents to state current approval, actual table inventory and contract status; search and repair stale active Geography/Reference docs while preserving historical records as historical.
- [ ] Run root Bun typecheck, formatting, targeted Dryv contract checks, Task validation and diff checks. Review generated IR/table inventory and final diff.
- [ ] Do not generate/apply migrations, modify live databases, activate unapproved schema files, or begin Civic implementation.
