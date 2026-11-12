---
{id: GRP-B3423CE362A6,name: Compact documentation upkeep,type: documentation,extra: {created_at: 2026-11-12T06:19:26.794Z}}
---

# Documentation layout follow-up plan

First compare any moved planning tree with its destination before removing the old copy. Update active root instructions, core documents, design indexes, code comments and rules to point at the new locations. Consolidate useful workflow rules in `.docs/rules/` and retain detailed architecture/design material under `.docs/design/`. Add an automated rejection for `.docs/guidance/` and keep tests for the eight-file docs root, grouped design folders, README indexes and local links. Run the focused Bun test, `bun run structure`, and `task validate`; distinguish failures in this work from known unrelated repository failures. Inspect the final diff and record any remaining limitations before completing the task.
