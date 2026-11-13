---
{id: TSK-23787CB0037C,name: "Add acyclic and same-scheme constraints, composite foreign keys and numeric precision",type: task,status: planned,priority: medium,created_at: 2026-11-13T07:26:44.852Z,updated_at: 2026-11-13T07:26:44.852Z,order: 4096}
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

- [ ] Add acyclic and sameAs constraint kinds in the author, IR and engine validation.
- [ ] Allow relations to target several fields for composite foreign keys.
- [ ] Add a fixed-precision numeric property and use it for Unit scale.
- [ ] Lower these in the rust-sql pack and declare them in reference.ts, deleting the matching comments.
- [ ] Run formatting and typechecks only; report to the owner.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only.
