---
{id: TSK-04EA661F1645,name: "Develop-only and mandatory Task rules, fix stale docs",type: task,status: completed,priority: medium,created_at: 2026-11-02T04:38:50.935Z,updated_at: 2026-11-02T04:39:11.899Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T04:38:56.549Z},{from: in-progress,to: completed,at: 2026-11-02T04:39:11.899Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-04EA661F1645/1793594336562-start,started_at: 2026-11-02T04:38:56.691Z,end_ref: refs/tracking/TSK-04EA661F1645/1793594351901-end,ended_at: 2026-11-02T04:39:11.900Z,summary: {files: 23,insertions: 201,deletions: 110}}]}},archived_at: 2026-11-04T04:46:53.836Z}
---

# Set up develop-only and mandatory Task rules and fix stale docs

## Goal

Make it a binding repository rule that agents work only on the `develop` branch without inventing branches or worktrees, and that all work is tracked through the Task CLI. Remove stale documentation so the contract matches the real `source/` layout.

## Context

The repository was consolidated so code lives in `source/apps` and `source/backend`, and the Task workspace is `.docs` (see `task.yaml`). AGENTS.md and many documents still reference `.tasks`, top-level `apps/` and `services/`, and documents at `.docs/` root that now sit in `.docs/docs/`. Thirteen documents lacked frontmatter so `task validate` failed. Related guidance: `.docs/rules/task-writing.md` and `.docs/rules/git.md`.

## Acceptance checklist

- [x] Add `.docs/rules/branching-and-task-usage.md` and link it from AGENTS.md, README.md, git rules and guidance documents.
- [x] Correct stale paths (`.tasks`, `apps/`, `services/`, moved document links) across AGENTS.md, README.md and `.docs`.
- [x] Add frontmatter to every document that lacks it and confirm `task validate` passes.
- [x] Review the diff for accidental changes to historical audit content.

## Progress

Work is done directly on develop with no branches or worktrees.
