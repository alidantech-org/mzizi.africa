---
{id: TSK-47365D857BB9,name: Move Dryv schemas into one postgres folder,type: task,status: completed,priority: medium,created_at: 2026-11-15T16:32:02.948Z,updated_at: 2026-11-15T16:32:52.500Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T16:32:09.109Z},{from: in-progress,to: completed,at: 2026-11-15T16:32:52.500Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-47365D857BB9/1794760329112-start,started_at: 2026-11-15T16:32:09.990Z,end_ref: refs/tracking/TSK-47365D857BB9/1794760372502-end,ended_at: 2026-11-15T16:32:52.500Z,summary: {files: 33,insertions: 36,deletions: 35}}]}}}
---

# Move Dryv schemas into one postgres folder

## Goal

Remove the `mzizi/` and `operational/` split under `dryv/contracts/schemas` and place every Postgres schema file in `dryv/contracts/schemas/postgres/`, keeping `_base.ts` and `_shared.ts` at the root. This is a pure move with no behaviour change, so any failure afterwards is mechanical and easy to find.

## Context

Imports use `#/schemas/mzizi/...` and `#/schemas/operational/...` in the schema files, `contracts/apps/database/*.ts`, the check tools under `dryv/tools/`, the Biome globs in `dryv/package.json`, and several documents. The owner decision is DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115. Use `git mv` so history is kept. Do not change table names, namespaces or fields in this task. A `mongo/` folder is created empty for later.

## Acceptance checklist

- [x] All schema files are under `dryv/contracts/schemas/postgres/` and the old `mzizi/` and `operational/` folders no longer exist.
- [x] Every import, script glob, tool path and document link that named the old folders is updated.
- [x] `bun run typecheck` and `bun run database:check` in `dryv/` give the same results as before the move, and any pre-existing failure is reported.
- [x] `git diff --stat` shows renames, not rewritten content.
