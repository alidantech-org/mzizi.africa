---
{id: TSK-77BBDF45760E,name: Move planning library and finish documentation rules,type: task,status: completed,priority: medium,created_at: 2026-11-12T06:19:30.810Z,updated_at: 2026-11-12T06:24:52.607Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T06:19:34.566Z},{from: in-progress,to: completed,at: 2026-11-12T06:24:52.607Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-77BBDF45760E/1794464374567-start,started_at: 2026-11-12T06:19:35.119Z,end_ref: refs/tracking/TSK-77BBDF45760E/1794464692617-end,ended_at: 2026-11-12T06:24:52.607Z,summary: {files: 49,insertions: 29587,deletions: 29583}}]}},archived_at: 2026-11-12T06:24:53.448Z}
---

# Finish the compact documentation and guidance layout

## Goal

Keep the repository's active documentation small, accurate and easy to navigate. The eight `.docs/docs/` pages explain the product and system at a high level. Technical design belongs in the grouped `.docs/design/` tree, and contributor or agent process belongs in `.docs/rules/`. There should be no parallel `.docs/guidance/` directory, because duplicate instructions become stale and links to removed paths mislead contributors.

## Context

The documentation currency audit was completed, after which the user authorized a new layout and specified that design live directly at `.docs/design`. The first reorganization moved current design guides into six broad topic folders, updated core references and added structural checks. This follow-up closes gaps in that work: obsolete seed inventory references must be removed, active SQL and schema documentation links must point to the new paths, and automated checks must reject reintroducing `.docs/guidance/`. Historical task notes are records of past work and need not be rewritten. Keep the existing improvements proposals unless a current active reference must be corrected; this task is not approval to delete implementation proposals.

## Acceptance checklist

- [x] Remove stale active references to deleted docs and guidance paths, correcting code comments and core instructions where appropriate.
- [x] Ensure contributor and agent workflow instructions are consolidated in `.docs/rules/` and design guidance is under `.docs/design/`.
- [x] Extend the structure policy to reject `.docs/guidance/` and preserve the exact core-document and grouped-design limits.
- [x] Run the focused structure tests and `task validate`; record unrelated pre-existing validation or code-structure failures accurately.
- [x] Confirm `.docs/guidance/` is absent and update this task with the final outcome.

## Comments

### 2026-11-12T06:24:52.368Z · PETER IRUNGU

Completed the user-directed move: verified .docs/improvements and .docs/_plan were byte-for-byte identical (68 files), removed the old path, updated active references, consolidated process guidance in .docs/rules, and added layout/link checks. bun test scripts/mz.test.ts passes 18/18. bun run structure still reports the pre-existing 526-line filesystem_api.py over the 400-line limit. task validate now reports two broken links only in the archived improvements-rewrite group plan; all links in .docs/docs, .docs/design and .docs/_plan pass the new structure scanner. .docs/guidance is absent.
