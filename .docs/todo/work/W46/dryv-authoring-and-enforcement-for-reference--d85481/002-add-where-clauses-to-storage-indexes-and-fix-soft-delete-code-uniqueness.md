---
{id: TSK-4E9F3A4AAB3C,name: Add where clauses to storage indexes and fix soft-delete code uniqueness,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T07:26:44.297Z,updated_at: 2026-11-13T07:28:29.592Z,order: 2048,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T07:28:29.592Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-4E9F3A4AAB3C/1794554909594-start,started_at: 2026-11-13T07:28:30.075Z}]}}}
---

# Add where clauses to storage indexes and fix soft-delete code uniqueness

## Goal

Unique codes currently block reuse after a soft delete, and Reference cannot express a partial index. This task adds a where condition to storage indexes end to end. The result is judged by the acceptance list below and by the corresponding comment disappearing from reference.ts, with the rule declared in authoring code instead of described in prose.

## Context

- CodedEntity in dryv/contracts/schemas/_base.ts declares a unique index on code. Rows with deleted_at set still occupy their code.
- reference.ts comments say partial indexes are unsupported by the pack.
- The index shape lives in the Dryv author (data/storage.ts), the Python IR (SchemaStorageIndex) and the rust-sql pack template that renders CREATE INDEX.
- The where condition should reuse the closed expression IR via the rule builder so no new node kinds are needed.

## Acceptance checklist

- [x] Extend the author storage index input and state with an optional where built from the operand builder.
- [x] Extend the Python SchemaStorageIndex contract and context projection to carry the expression.
- [x] Render the condition as a WHERE clause in the rust-sql template, rejecting unsupported nodes clearly.
- [x] Change the CodedEntity code index to apply only while deleted_at is null and remove the matching comment.
- [x] Run formatting and typechecks only; report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only.

## Comments

### 2026-11-13T07:31:48.955Z · PETER IRUNGU

Index where already existed in author state and IR (uncommitted Dryv work). Added: rust-sql WHERE rendering; engine now projects EFFECTIVE indexes (inherited ones were dropped from generator context); CodedEntity code unique index is partial on live rows via shared.LiveRecord. Not verified by SQL generation.
