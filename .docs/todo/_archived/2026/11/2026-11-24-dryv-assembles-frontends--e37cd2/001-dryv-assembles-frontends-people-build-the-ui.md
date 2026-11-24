---
{id: TSK-C2BE702A9A28,name: Dryv assembles frontends; people build the UI,type: task,status: completed,priority: medium,created_at: 2026-11-17T21:24:40.052Z,updated_at: 2026-11-17T22:51:26.422Z,order: 1024,extra: {status_history: [{from: planned,to: completed,at: 2026-11-17T22:51:26.422Z}]},archived_at: 2026-11-24T19:23:29.447Z}
---

# Dryv assembles frontends; people build the UI

## Goal

The generated frontends (web, dev, Flutter app) currently get whole pages from Dryv at routes like `/dev/capability-list`, with no root page and no navigation. The goal is to change what Dryv owns: Dryv should manage the automatable parts of a frontend (folder structure, route constants and path builders, navigation data, per-view column, field and filter metadata, SDK clients, and reference pages and components that can be borrowed), while the layouts, the real route pages and the way components are assembled stay hand-written and are never overwritten.

## Context

Root cause of the 404 on `/`: the app-next pack only writes `app/<group>/<view>/page.tsx` and nothing for `/`. The owner wants URLs that start at the root with consistent navigation, the same for the Flutter app, and generated code that editors may borrow (components, simple features, path details) without Dryv owning the page. The packs are the project copies in `dryv/packs/app-next` and `dryv/packs/app-flutter`, wired in `dryv.yaml`; the Dryv checkout under `~/Projects/personal/alidantech-org/codepot/dryv` may be changed where the engine itself needs it. See `dryv/README.md`.

## Acceptance checklist

- [x] app-next generates managed route, navigation and view metadata modules under `lib/dryv/`, and reference page components that are not routed by themselves.
- [x] app-next scaffolds once a root `app/page.tsx`, a layout with a navigation shell and root-level route pages that borrow the reference components; regenerating never overwrites them.
- [x] web and dev serve their pages from root-level URLs with working navigation and no stray query string.
- [x] app-flutter follows the same split: managed route constants, view metadata and reference screens, with hand-owned router, shell and screens scaffolded once.
- [x] `dryv/README.md`, pack READMEs and `source/apps/*` docs describe the split; `task validate` passes.

## Progress

Done 18 November 2026 on `develop`:

- `app-next` and `app-flutter` packs now manage routes, navigation data, metadata and reference pages and scaffold the shell, home and route pages once. web (:3300), dev (:3400) and the Flutter app (:8090, phone-sized browser tab) were each opened and used against real data.
- New `locality` API group (position lookup, search, languages, sources, evidence) with hand-written SQL use cases; no table changed. See `.docs/design/data/LOCALITY_READS.md`.
- The JSON fixtures mode was built and then removed at the owner's direction; the proof now rests on a seeded database (`mzizi_ui`) filled by `bun run dev:data` from `.dev/` (real geoBoundaries outlines, invented officials and procurement).
- Gaps found in Dryv and the manifest loader are in `.docs/design/data/DRYV_GAPS.md` rows 51-59; the packs checkout fix for `examples.ts` was committed there and the pin moved.
- Checks run: API 164 test files pass, engine API tests pass (92), manifest tests pass (154 plus one new), ruff and mypy on the touched Python, `tsc` on web, dev and API, `flutter analyze`.

Not done: the admin app is still not generated; real office-holder, party and procurement data are not loaded; media for places is empty; `bun run check` was not run as a whole.
