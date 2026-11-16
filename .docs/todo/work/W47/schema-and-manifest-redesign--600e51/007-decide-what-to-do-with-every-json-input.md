---
{id: TSK-9631BBC16202,name: Decide what to do with every JSON input,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:55.096Z,updated_at: 2026-11-16T13:06:01.391Z,order: 7168,depends_on: [TSK-A9FDBDC9B96C]}
---

# Decide what to do with every JSON input

## Goal

Give each authored JSON file under `seed/` and `source/schema/` a decision: schema, convert to YAML or CSV, move to the database, or archive.

## Context

JSON appears as catalogues, governance and office-holder data, patterns, policy lists, the web vocabulary, fixtures and schemas. Only some have a schema, and the manifest registers them with free-text loaders. This task is part of the schema and manifest redesign group. Nothing in it is built until the owner has approved the design in a task comment, and the group goal and plan describe how the pieces fit together. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: List every JSON file with its owner, its consumer and whether it has a schema.
- [ ] Design: Choose a decision for each file and give the reason.
- [ ] Design: Define which fixtures stay under the test-only folder.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Apply the approved decisions: add schemas, convert or move files.
- [ ] Build, only after approval: Update the manifest entries to match.
- [ ] Build, only after approval: Add a check that no registered JSON file lacks a schema or a consumer.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
