---
{id: TSK-23787CB0037C,name: "Add acyclic and same-scheme constraints, composite foreign keys and numeric precision",type: task,status: in-progress,priority: medium,created_at: 2026-11-13T07:26:44.852Z,updated_at: 2026-11-13T07:33:06.397Z,order: 4096,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T07:33:06.397Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-23787CB0037C/1794555186399-start,started_at: 2026-11-13T07:33:06.939Z}]}}}
---

# Add acyclic and same-scheme constraints, composite foreign keys and numeric precision

## Goal

Longer parent cycles, supersession across schemes, scheme-aware foreign keys and unit scale precision are still unenforced. This task extends the constraint construct and relations to cover them. The result is judged by the acceptance list below and by the corresponding comment disappearing from reference.ts, with the rule declared in authoring code instead of described in prose.

## Context

- Topic.parent_id, Unit.base_id and Value.supersedes_id only reject self reference through check rules; transitive cycles need a database function or trigger.
- A superseding Value must belong to the same scheme; this needs a composite foreign key or a sameAs constraint.
- Unit scale is a generic number; conversion precision needs a fixed-precision numeric property.
- Builds on the constraint construct from the previous task.

## Acceptance checklist

- [x] Add acyclic and sameAs constraint kinds in the author, IR and engine validation.
- [x] Allow relations to target several fields for composite foreign keys.
- [x] Add a fixed-precision numeric property and use it for Unit scale.
- [x] Lower these in the rust-sql pack and declare them in reference.ts, deleting the matching comments.
- [x] Run formatting and typechecks only; report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only.

## Comments

### 2026-11-13T07:36:13.695Z · PETER IRUNGU

Added acyclic and same-as constraint kinds end to end (author, compiler, engine IR/validation/context, rust-sql trigger and composite FK). Used in reference.ts: SupersessionStaysInScheme, SupersessionAcyclic, BaseUnitAcyclic, TopicParentAcyclic. Unit scale/offset now decimal(38,18). Composite FKs are provided through same-as (unique pk+match plus FK); general multi-field relation targets are NOT added. Edge-table cycles (pattern_dependencies, value_relations) still unenforced. SQL not generated or run.
