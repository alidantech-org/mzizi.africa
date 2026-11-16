---
{id: TSK-343B03055262,name: Design folder descriptors and the bootstrap file,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:53.264Z,updated_at: 2026-11-16T13:05:59.960Z,order: 2048,depends_on: [TSK-9A8E9A0A16B1]}
---

# Design folder descriptors and the bootstrap file

## Goal

Give `_folder.yaml` and `bootstrap.yaml` an explicit, versioned schema, and reduce the 29 folder files to those that carry real overrides.

## Context

Folder metadata (role, scope, access, acquisition class, preparation, review, seed flag) is inherited by children, but its rules live only in Python in `seed_folders.py`. Many folder files repeat their parent. `seed/global/auth/bootstrap.yaml` configures the first administrator and has no schema. This task is part of the schema and manifest redesign group. Nothing in it is built until the owner has approved the design in a task comment, and the group goal and plan describe how the pieces fit together. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Write the field list for folder descriptors, including defaults, inheritance and which values are allowed.
- [ ] Design: Decide which of the 29 folder files can be deleted because the root manifest default covers them.
- [ ] Design: Define the bootstrap file's fields and where its secrets must come from.
- [ ] Design: Say where each rule is enforced, and by which module.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Add `source/schema/seed/folder.schema.json` and a bootstrap schema.
- [ ] Build, only after approval: Remove redundant `_folder.yaml` files and keep inherited results identical.
- [ ] Build, only after approval: Add tests that compare inherited metadata before and after the cleanup.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
