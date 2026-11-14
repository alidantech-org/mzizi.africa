---
{id: TSK-7BF20DEB6F9B,name: Use list shorthand for case-only enum maps,type: task,status: completed,priority: medium,created_at: 2026-11-14T05:56:42.470Z,updated_at: 2026-11-14T05:57:30.762Z,order: 16384,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-14T05:57:06.877Z},{from: in-progress,to: completed,at: 2026-11-14T05:57:30.762Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-7BF20DEB6F9B/1794635826887-start,started_at: 2026-11-14T05:57:07.652Z,end_ref: refs/tracking/TSK-7BF20DEB6F9B/1794635850763-end,ended_at: 2026-11-14T05:57:30.762Z,summary: {files: 13,insertions: 196,deletions: 347}}]}}}
---

---
{id: TSK-7BF20DEB6F9B,name: Use list shorthand for case-only enum maps,type: task,status: planned,priority: medium,created_at: 2026-11-14T05:56:42.470Z,updated_at: 2026-11-14T05:56:42.470Z,order: 16384}
---

# Use list shorthand for case-only enum maps

## Goal

Simplify current Mzizi enum declarations where symbolic names express the same words as the serialized values. Pack authors choose output naming conventions and can format the list-derived keys for their target language.

## Context

The Dryv author can derive enum keys directly from arrays of strings. The existing Mzizi definitions commonly use PascalCase names for lower snake case values. These are suitable for array authoring because the pack can choose its own case convention when rendering an identifier. Retain explicit mappings where names intentionally expand or alter an abbreviation. Preserve the exact values that are stored in the database and exposed on the wire. Work against the current schema directory and preserve edits already present in this checkout.

## Acceptance checklist

- [x] Convert case-only members and retain meaningful aliases.
- [x] Verify that the original and rewritten declarations have identical scalar values.
- [x] Pass the focused checks and run generation from the current database app.

The focused smoke test also checks that the database generation command accepts the edited contracts.
