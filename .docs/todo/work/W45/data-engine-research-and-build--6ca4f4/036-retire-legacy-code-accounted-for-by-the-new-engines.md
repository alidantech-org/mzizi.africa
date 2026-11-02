---
{id: TSK-4BCA9B212B5D,name: Retire legacy code accounted for by the new engines,type: task,status: planned,priority: medium,created_at: 2026-11-02T09:55:59.826Z,updated_at: 2026-11-02T09:55:59.826Z,due_at: 2027-04-30,order: 36864}
---

# Retire legacy code accounted for by the new engines

## Goal
Remove parts of api-legacy only where MIGRATION.md shows an equivalent responsibility now exists.

## Context
Nothing in api-legacy may be removed until the replacement is real and its data is accounted for. After the Tier B extractors, the imports above and the files service exist, walk the responsibility table, move anything still valuable (tests, domain notes), and delete the rest in small commits. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Walk the MIGRATION.md responsibility table with evidence for each row.
- [ ] Archive notes for anything not carried over.
- [ ] Remove accounted-for modules in small commits with tests green.
- [ ] Update docs, remove stale references.
- [ ] Final inventory of what remains and why.

## Notes
Deleting is the last step, never the first: each removal needs a named replacement and a passing test, and anything uncertain stays and is listed with its reason.
