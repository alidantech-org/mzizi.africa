---
{id: TSK-759681C7441F,name: Remove remaining stale layout references,type: task,status: completed,priority: medium,created_at: 2026-11-02T04:43:37.181Z,updated_at: 2026-11-02T04:43:46.007Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T04:43:45.819Z},{from: in-progress,to: completed,at: 2026-11-02T04:43:46.007Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-759681C7441F/1793594625820-start,started_at: 2026-11-02T04:43:45.878Z,end_ref: refs/tracking/TSK-759681C7441F/1793594626010-end,ended_at: 2026-11-02T04:43:46.008Z,summary: {files: 0,insertions: 0,deletions: 0}}]}},archived_at: 2026-11-04T04:46:53.765Z}
---

# Remove remaining stale layout references from docs

## Goal

Finish the documentation cleanup so no document describes the pre-consolidation layout. After this work the README, architecture and documentation-map diagrams, and the READMEs under `source/`, all use the real paths `source/apps/*` and `source/backend/*`.

## Context

The previous task (TSK-04EA661F1645) fixed prose paths but left directory-tree diagrams in README.md, .docs/docs/ARCHITECTURE.md and .docs/docs/README.md showing top-level `apps/` and `services/`. The READMEs in source/ still refer to `apps/dashboard`, `apps/www`, `apps/mobile` and `services/`. See .docs/docs/repository-map.md and .docs/rules/branching-and-task-usage.md. Work happens on develop only.

## Acceptance checklist

- [x] Update the tree diagrams in README.md and ARCHITECTURE.md to the `source/` layout.
- [x] Update the documentation-map diagrams in .docs/docs/README.md to `.docs/docs/`.
- [x] Update the READMEs under source/ to the real paths and fix the broken contract link in the mobile README.
- [x] Run a final grep for stale paths and `task validate`.

## Progress

Started on develop with no branches or worktrees.
