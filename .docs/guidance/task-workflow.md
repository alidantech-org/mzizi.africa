---
{id: DOC-4B5C3D1F30BB,name: Task Workflow Guidance,type: documentation}
---

# Task Workflow Guidance

Using Task is mandatory: plan, start, check off, document and complete every piece of work with the CLI. See `.docs/rules/branching-and-task-usage.md`.

- One Task activity should describe one reviewable outcome and include acceptance criteria.
- Assign work to a Task group (`task group create` if none fits) covering the relevant `source/` area.
- Use `planned` before work starts, `in-progress` while active, `blocked` only for a concrete dependency, and `completed` only after acceptance criteria are met.
- Set dependencies only when a predecessor genuinely blocks the work; parallel activities should remain independent.
- Put design notes, evidence, and validation results in the task body or linked project document. Keep the group plan as sequencing guidance, not a substitute for task status.
- Reassess scope after inventory/audit activities rather than creating speculative implementation details.
