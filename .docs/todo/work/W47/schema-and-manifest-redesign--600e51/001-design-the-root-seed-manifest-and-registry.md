---
{id: TSK-9A8E9A0A16B1,name: Design the root seed manifest and registry,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:52.924Z,updated_at: 2026-11-16T13:05:52.924Z,order: 1024}
---

# Design the root seed manifest and registry

## Goal

Decide what `seed/manifest.yaml` and its generated lock are for, field by field, so that registering a file can never be mistaken for loading data into PostgreSQL.

## Context

The manifest has about 59 entries. Only 9 target the current database; 45 are marked legacy, 3 evidence only and 2 test only. The `loader` and `target` fields are free text, and the validator checks paths, hashes, dependencies and duplicate key values but not columns. The lock file records hashes and storage keys only. This task is part of the schema and manifest redesign group. Nothing in it is built until the owner has approved the design in a task comment, and the group goal and plan describe how the pieces fit together. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Write a field table for the manifest: keep, rename, remove or add, with the reason for each.
- [ ] Design: Decide whether table seeds are declared by a `table:` field on each entry, and what import settings the entry carries.
- [ ] Design: Define the states a file passes through: registered, validated, imported, and who runs each step.
- [ ] Design: List every current entry and say whether it stays, moves, is archived or is deleted.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Update `source/schema/seed/manifest.schema.json` and `seed/manifest.yaml` to the approved design.
- [ ] Build, only after approval: Keep the lock generated and add a check that it matches the manifest.
- [ ] Build, only after approval: Add tests for the new fields and for rejecting registered files that were never validated.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
