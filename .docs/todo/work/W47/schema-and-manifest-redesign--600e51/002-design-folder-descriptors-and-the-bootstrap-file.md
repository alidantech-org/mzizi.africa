---
{id: TSK-343B03055262,name: Design folder descriptors and the bootstrap file,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:53.264Z,updated_at: 2026-11-16T13:49:37.681Z,order: 2048,depends_on: [TSK-9A8E9A0A16B1]}
---

# Design folder descriptors and the bootstrap file

## Goal

Give `_folder.yaml` and `bootstrap.yaml` an explicit schema in `source/schema/seed/`, and reduce the 29 folder files to those that carry real overrides.

## Context

Folder metadata (role, scope, access, acquisition class, preparation, review, seed flag) is inherited by children, but its rules live only in Python in `seed_folders.py`. With the new layout, `scope` and `domain` come from the path (`data/ke/geography/`), so those fields stop being repeated in folder files. `seed/global/auth/bootstrap.yaml` configures the first administrator and has no schema. This task belongs to the schema and manifest redesign group. The owner approved the sources layout on 16 November 2026: schemas live under `source/schema/` in `database/`, `seed/`, `sources/`, `mapping/`, `vocabulary/`, `engine/` and `extraction/`, and seed inputs live under `seed/` in `data/`, `sources/`, `mappings/`, `vocabularies/` and `_fixtures/`. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this task's design in a task comment. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Write the field list for folder descriptors, including defaults, inheritance and allowed values, and which fields are now derived from the path.
- [ ] Design: Decide which of the 29 folder files can be deleted because the root manifest default or the path covers them.
- [ ] Design: Define the bootstrap file's fields and where its secrets must come from.
- [ ] Design: Say where each rule is enforced, and by which module.
- [x] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Add `source/schema/seed/folder.schema.json` and a bootstrap schema.
- [ ] Build, only after approval: Remove redundant `_folder.yaml` files and keep inherited results identical.
- [ ] Build, only after approval: Add tests that compare inherited metadata before and after the cleanup.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
## Progress

Built 16 November 2026: `source/schema/seed/folder.schema.json` (roles, access, preparation, review, authorization required for public, overrides with reasons) and `bootstrap.schema.json` (environment variable names only). The Python vocabulary in `seed_vocabulary.py` (including the hard-coded loader list) is replaced in task 009.

## Comments

### 2026-11-16T14:28:07.257Z · PETER IRUNGU

Design approved by the owner on 16 November 2026 (chat reply to the redesign status). Seed layout kept as designed; exchange schema retired; web vocabulary moves into the seed tree with a real schema; system-managed columns are marked by Dryv's .system() and published as x-managed.
