---
{id: TSK-C664D03AC84E,name: Author the four frontend application contracts,type: task,status: completed,priority: medium,created_at: 2026-11-17T07:30:20.896Z,updated_at: 2026-11-17T11:52:56.325Z,order: 2048,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T07:30:53.942Z},{from: in-progress,to: completed,at: 2026-11-17T11:52:56.325Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C664D03AC84E/1794900653945-start,started_at: 2026-11-17T07:30:54.408Z,end_ref: refs/tracking/TSK-C664D03AC84E/1794916376327-end,ended_at: 2026-11-17T11:52:56.326Z,summary: {files: 1045,insertions: 28443,deletions: 2925}}]}},archived_at: 2026-11-24T19:23:30.487Z}
---

# Author the four frontend application contracts

## Goal

Give each Mzizi frontend its own Dryv application contract so the official frontend packs can generate from it later. The four applications are `app` (public mobile, Flutter), `web` (public website, Next.js), `admin` (administrative portal, Next.js) and `dev` (developer portal, Next.js). Each selects the shared `brand.Mzizi` theme, declares a surface, consumes real operations from the product API or the engine, and exposes one first destination. The first slice is deliberately small so the generated output can be inspected before more is added.

## Context

The theme lives in `dryv/contracts/schemas/theme.ts` (task TSK-3977B5D078D4). Dryv application contracts follow decisions 0017 and 0018 in the Dryv repository: views with `present` parts, Application destinations and a Theme. Public app, public website and admin consume the product API (`dryv/contracts/apps/api`); only the developer portal consumes the engine (`dryv/contracts/apps/engine`), through a server-side layer so the service key never reaches a browser (see `.docs/decisions/DEC-DEVELOPER-PORTAL.md`). Existing contract folders are `apps/{pgsql,api,engine}` with one flat file per group. Generation destinations for these apps are not configured here.

## Acceptance checklist

- [x] `dryv/contracts/apps/{app,web,admin,dev}/index.ts` exist and each selects `themes.Mzizi` and one surface.
- [x] app, web and admin consume API geography operations and show a feature list destination; dev consumes engine capabilities and shows a capabilities destination.
- [x] Each contract compiles with `dryv-ts compile` without errors.
- [x] The Dryv README lists the four applications and which service each consumes.
- [x] `task validate` passes.

## Progress

The four contracts compile. They reference operations through registered groups and do not use `.consumes(...)`: Dryv rejects a consumed application unless both applications are in one `dryv.project(...)`, so the cross-application link is deferred until the frontends are wired into `dryv.yaml`. The Dryv doctor was not run.
