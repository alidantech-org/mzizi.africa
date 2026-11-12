---
{id: TSK-52BC741A0D7E,name: Agree schema contract authoring and review rules,type: task,status: archived,priority: medium,created_at: 2026-11-12T07:42:04.137Z,updated_at: 2026-11-12T07:56:53.421Z,order: 2048,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T07:44:28.419Z},{from: in-progress,to: completed,at: 2026-11-12T07:56:52.512Z},{from: completed,to: archived,at: 2026-11-12T07:56:53.421Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-52BC741A0D7E/1794469468422-start,started_at: 2026-11-12T07:44:29.264Z,end_ref: refs/tracking/TSK-52BC741A0D7E/1794470212522-end,ended_at: 2026-11-12T07:56:52.512Z,summary: {files: 25,insertions: 1017,deletions: 28}}]}}}
---

# Agree schema contract authoring and review rules

## Goal

Draft and agree the conventions for authoring database schemas as Dryv contracts before continuing the Rust database implementation. The user has requested shared property definitions and reusable rules in `dryv/contracts/schemas/_shared.ts`, with one owning file per schema under `mzizi/` or `operational/`. The result must distinguish agreed database placement from approval of actual tables, fields, relationships and indexes. This task does not approve every schema in the catalogue.

## Context

The schema redesign catalogue assigns twelve Phase 01 schemas to Main and seven schemas to Operations; detailed designs remain proposals. Existing uncommitted foundation work already contains shared, Auth and Reference contract drafts. Preserve that work and record observed discrepancies without treating its presence as approval. The current shared base, code validation, unresolved relations and generator limitations need explicit review. Follow the schema-redesign ownership boundaries, current code-column rule, repository Task workflow and develop-only policy. Keep contributor process under `.docs/rules/` and the review plan under `.docs/_plan/schema-redesign/`. No migrations, schema generation, contract rewrites, archived-code execution or database changes belong to this drafting step.

## Acceptance checklist

- [x] Inspect the catalogue and existing contract drafts; record concrete gaps without changing implementation.
- [x] Draft the shared-property, per-schema definition, header and complete-contract coverage conventions.
- [x] Define explicit partial approval, dependency and generation gates; keep Phase 02 deferred.
- [x] Link the proposed agreement from the schema redesign catalogue and record documentation validation results.
- [x] Record the user's agreement or requested revisions before treating the proposed conventions as accepted.

## Progress

This is a planning and agreement task. Completing the draft does not approve a schema or authorize generation. Existing foundation changes belong to their original work and must remain intact. The implementation task can adopt the conventions once the user agrees on them; any later schema review must identify the exact approved objects and remaining gaps.

## Comments

### 2026-11-12T07:46:09.105Z · PETER IRUNGU

Drafted .docs/rules/schema-contract-authoring.md and .docs/_plan/schema-redesign/contract-authoring.md and linked them from the catalogue. The conventions remain proposed; no schema approval, contract changes or generation were performed. Task validation reports the same pre-existing broken website-contract link in .docs/_plan/source-redesign/README.md seen before editing. Agreement acceptance item remains open for user review.

### 2026-11-12T07:49:21.626Z · PETER IRUNGU

Validation completed: task validate tasks passes; full task validate reports only the baseline broken website-contract link in .docs/_plan/source-redesign/README.md. bun run check fails in existing workspace code: Python stages cannot resolve missing mzizi-database; Dryv imports reference missing schemas/vocabulary.ts; existing formatting checks fail; root documentation test hits the baseline link; API tests have one pipeline-candidate route failure (843 files passed, 7 skipped, 1 failed). No runtime or contract files were changed by this documentation task. Agreement remains pending; four drafting checklist items are complete.

### 2026-11-12T07:55:25.574Z · PETER IRUNGU

User now authorizes creation of all nineteen schema files with grouped candidate-table comments and shared scalar reuse. Schema-local property declarations are allowed only for enums. Implement this refinement without approving candidate table designs or generating migrations.

### 2026-11-12T07:56:52.012Z · PETER IRUNGU

Implemented requested scaffolding: all 19 schema files exist (17 new), with 113 design-dictionary table entries plus the proposed Reference legal bridge, review headers and after-table separators. Preserved existing Auth/Reference drafts. Moved non-enum scalar declarations to shared profiles; issuer/subject reuse one NonEmptyString500 property identity; version/pagination aliases reuse NonNegativeInteger. Updated consumer references and documented the enum-only schema-local rule. Inventory coverage and no-local-scalars assertions pass; Dryv typecheck and git diff --check pass. Root check --only dryv remains blocked by the existing broken documentation link and oversized engine filesystem_api.py (526/400 lines). No generation or database changes performed. Remaining detailed schema reviews are not approved by scaffolding.
