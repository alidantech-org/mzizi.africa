---
{id: TSK-7B87B0F9ED6D,name: Design the folder layout and retire stale inputs,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:55.474Z,updated_at: 2026-11-16T13:06:01.670Z,order: 8192,depends_on: [TSK-343B03055262,TSK-DA4793ED6FC2,TSK-0F3E947CAD73,TSK-9631BBC16202]}
---

# Design the folder layout and retire stale inputs

## Goal

Approve the final layout of `seed/` and `source/schema/`, and the list of files removed or archived, before anything moves.

## Context

The seed tree mixes data, crawler recipes, policy files, old importer mappings and fixtures. The proposal under review groups by purpose: data, sites, rules and test fixtures. `source/schema/` has stale files such as the target catalogue, the foundation query prototype and the old pipeline manifest. This task is part of the schema and manifest redesign group. Nothing in it is built until the owner has approved the design in a task comment, and the group goal and plan describe how the pieces fit together. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Draw the approved before and after tree for both folders.
- [ ] Design: List every file that is deleted, archived or moved, with a reason.
- [ ] Design: Decide how history is kept for archived files.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Perform the moves in one reviewable change per folder.
- [ ] Build, only after approval: Update every README, design guide and link that mentions a moved path.
- [ ] Build, only after approval: Run the full seed check after each move.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
