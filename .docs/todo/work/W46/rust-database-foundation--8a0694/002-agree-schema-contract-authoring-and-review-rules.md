---
{id: TSK-52BC741A0D7E,name: Agree schema contract authoring and review rules,type: task,status: in-progress,priority: medium,created_at: 2026-11-12T07:42:04.137Z,updated_at: 2026-11-12T07:44:28.419Z,order: 2048,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T07:44:28.419Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-52BC741A0D7E/1794469468422-start,started_at: 2026-11-12T07:44:29.264Z}]}}}
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
- [ ] Record the user's agreement or requested revisions before treating the proposed conventions as accepted.

## Progress

This is a planning and agreement task. Completing the draft does not approve a schema or authorize generation. Existing foundation changes belong to their original work and must remain intact. The implementation task can adopt the conventions once the user agrees on them; any later schema review must identify the exact approved objects and remaining gaps.

## Comments

### 2026-11-12T07:46:09.105Z · PETER IRUNGU

Drafted .docs/rules/schema-contract-authoring.md and .docs/_plan/schema-redesign/contract-authoring.md and linked them from the catalogue. The conventions remain proposed; no schema approval, contract changes or generation were performed. Task validation reports the same pre-existing broken website-contract link in .docs/_plan/source-redesign/README.md seen before editing. Agreement acceptance item remains open for user review.
