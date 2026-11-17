---
{id: TSK-1152AF62D4EA,name: Rename the administrative web app to apps/admin,type: task,status: completed,priority: medium,created_at: 2026-11-17T07:34:40.161Z,updated_at: 2026-11-17T07:35:26.974Z,order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T07:34:46.836Z},{from: in-progress,to: completed,at: 2026-11-17T07:35:06.512Z},{from: completed,to: in-progress,at: 2026-11-17T07:35:19.311Z},{from: in-progress,to: completed,at: 2026-11-17T07:35:26.974Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-1152AF62D4EA/1794900886838-start,started_at: 2026-11-17T07:34:47.156Z,end_ref: refs/tracking/TSK-1152AF62D4EA/1794900906514-end,ended_at: 2026-11-17T07:35:06.512Z,summary: {files: 227,insertions: 32,deletions: 32}},{base_ref: refs/tracking/TSK-1152AF62D4EA/1794900919313-start,started_at: 2026-11-17T07:35:19.559Z,end_ref: refs/tracking/TSK-1152AF62D4EA/1794900926975-end,ended_at: 2026-11-17T07:35:26.974Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Rename the administrative web app to apps/admin

## Goal

Free the name `source/apps/web` for the public website by renaming today's Next.js research and review dashboard to `source/apps/admin`. The dashboard is not ready for work yet and is only an administrative portal, so the name should say so. The rename must be complete: the folder, the root runner project and service names, the port environment variable, scripts, tests and every document that points at the old path, so no stale link remains.

## Context

Today `source/apps/web` is a Next.js app with a `/review` workbench and inherited `/admin` pages (see its README). The root runner in `scripts/lib/projects.ts` lists it as the project and service `web` on port 3100 with `WEB_PORT`. Other references are in `scripts/tasks/dryv.ts`, `scripts/tasks/setup.ts`, `scripts/README.md`, `scripts/mz.ts`, `scripts/mz.test.ts` and several documents under `.docs/` (SYSTEM, STORY, repository map, MIGRATION, DATA_LIFECYCLE, DEVELOPER_PORTAL). Archived task files and historical snapshots keep their old paths. The new public website and developer portal are created by generation in a later task. `AGENTS.md` and the rules in `.docs/rules/` apply.

## Acceptance checklist

- [x] The folder is `source/apps/admin` with its dependencies and environment intact, and no `source/apps/web` content remains.
- [x] The root runner project and service are `admin` (port 3100, `ADMIN_PORT`), and the scripts and their tests use the new name.
- [x] Active documents and READMEs point at `source/apps/admin`; archives are untouched.
- [x] `bun run help` works and the runner tests pass.
- [x] `task validate` passes.
