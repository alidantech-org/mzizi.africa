---
{id: TSK-7B87B0F9ED6D,name: Design the folder layout and retire stale inputs,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:55.474Z,updated_at: 2026-11-16T13:49:39.799Z,order: 8192,depends_on: [TSK-343B03055262,TSK-DA4793ED6FC2,TSK-0F3E947CAD73,TSK-9631BBC16202]}
---

# Design the folder layout and retire stale inputs

## Goal

Approve the final layout of `seed/` and `source/schema/` and the list of files removed or archived, then perform the moves archive-first.

## Context

The approved target layout is `source/schema/{database,seed,sources,mapping,vocabulary,engine,extraction}` and `seed/{data,sources,mappings,vocabularies,_fixtures}`. `source/schema/contracts/` (target catalogue, foundation query prototype, hand-kept exchange schema), `pipeline/`, the `v1/` folders and the old `web/` and `site/` folders go away. The exchange schema is retired only if the owner agrees nothing needs it. This task belongs to the schema and manifest redesign group. The owner approved the sources layout on 16 November 2026: schemas live under `source/schema/` in `database/`, `seed/`, `sources/`, `mapping/`, `vocabulary/`, `engine/` and `extraction/`, and seed inputs live under `seed/` in `data/`, `sources/`, `mappings/`, `vocabularies/` and `_fixtures/`. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this task's design in a task comment. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Draw the approved before and after tree for both folders.
- [ ] Design: List every file that is deleted, archived or moved, with a reason, including the decision on `exchange.schema.json`.
- [ ] Design: Decide where archived files live and how their history is kept.
- [ ] Design: Order the moves so each moved source passes the new validator before its old file is removed.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Perform the moves in one reviewable change per folder.
- [ ] Build, only after approval: Update every README, design guide and link that mentions a moved path.
- [ ] Build, only after approval: Run the full seed check after each move.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
## Progress

Partly done 16 November 2026: `web/`, `extraction/v1/` and `pipeline/` are gone and `foundation-query` is removed. `site/v1/` and `contracts/` stay until the crawler validator and the exchange decision move; see `source/schema/README.md`.
