---
id: HANDOFF-GENERATED-FRONTENDS-20261117
name: Generated frontends, SDKs and the pattern library, handoff and watch-list
type: handoff
tags: [frontend, dryv, sdk, flutter, nextjs, handoff]
extra: {status: feature_closed, date: 2026-11-17, tasks: group GRP-6AE884C63F77}
---

# Generated frontends: where things stand and what to watch

The decision is [DEC-FRONTEND-ASSEMBLY-20261117](../decisions/DEC-FRONTEND-ASSEMBLY-20261117.md); the plan is [frontend-assembly-from-contracts](../_plan/guides/frontend-assembly-from-contracts.md); the Dryv gaps are in [dryv-frontend-proposals](../_plan/guides/dryv-frontend-proposals.md). All ten tasks of the Task group "Generated frontends from Dryv contracts" are completed.

## What exists

| Piece | Where | State |
| --- | --- | --- |
| Theme | `dryv/contracts/schemas/theme.ts`, packs `theme-css`, `theme-dart` | Generated into `theme.css` (web, dev) and `mzizi_theme.dart` (app); dark mode proposed by us, not from www |
| Frontend contracts | `dryv/contracts/apps/{app,web,admin,dev}` | `app`, `web`, `dev` generate; `admin` is declared but not generated (the old dashboard is hand-written) |
| SDKs | `source/sdk/{api-ts,api-dart}`, packs `sdk-ts`, `sdk-dart` | Generated from the API; formatted; no unused imports |
| Libraries | `source/ui/web` (`@mzizi/ui-web`), `source/ui/flutter` (`mzizi_ui`) | Page shell, filter bar, search-select, table or tile list, pagination, detail list |
| Patterns | `dryv/packs/app-next`, `dryv/packs/app-flutter` | List and detail templates by view role; paging from the query plan |
| Geography | browse, detail and a feature-kind choice | Web and Flutter run against the live API; geometry operations exist but nothing draws a map yet |
| Dev runner | `bun run dev api app` | Starts the API and the Flutter app on the web (3500); API CORS allow-list from the runner |

## How to regenerate (important)

```bash
# the Dryv engine must be the checkout with present-part context (Dryv commit dfb0dd79 or later) on port 8750
bun $DRYV_HOME/source/apps/cli/bin/dryv.ts generate --app api --app web --app dev --app app \
  --pack sdk-ts --pack sdk-dart --pack web-app --pack web-theme --pack dev-app --pack dev-theme \
  --pack app-app --pack app-theme --yes --no-input --conflicts keep
```

Select the provider (`--app api`) in the same run, and name the packs: a pack binds only to a pack enabled in the same run. **Do not run a full `--app api` generation without `--pack` limits** unless you restore `source/backend/api/src/app.module.ts` afterwards: generation rewrites it and drops the hand-added `EngineModule` and `SystemModule`. The Dryv TypeScript compiler runs from its built `dist`; after changing Dryv source run `bun run build` in `source/plugins/authoring/typescript/compiler` and restart the Dryv API.

## Remaining gaps and risks

1. **`flutter_api_bridge` web fixes are uncommitted** in `opensource/flutter_api_bridge` (in-memory cookie jar and no dio cookie interceptor on the web). The app depends on the git-ignored `source/apps/app/pubspec_overrides.yaml` pointing at that checkout (an absolute path on one machine). Release the bridge, bump the dependency, delete the override.
2. **Transitions carry no context bindings** (gap 3): the list passes every text value of the clicked row as address values and the detail view picks its context by name. Needs a Dryv proposal.
3. **The `dev` portal is a stub:** its list view calls the engine's `GET /capabilities` through the fallback fetch; the engine needs a service key and must never be called from a browser. The server-side layer is not built.
4. **Geometry and maps:** no stored drawings exist yet (`geography.geometries` is empty in `mzizix`); the operations were checked with a rolled-back insert and over HTTP. Dryv cannot plan a query over a geometry schema or express a bounds predicate, so those operations are hand-written use cases; the generated DTOs type geometry as `unknown`.
5. **The feature-kind scheme code is a named constant** in `browse-feature-kinds.usecase.ts` (Dryv cannot bind a constant query parameter); keep it equal to the tag on `featureTypeId`.
6. **Views are declared twice** (web and app contracts differ only by surface).
7. **Visuals:** dark mode and the `danger` colour are proposals; the Flutter app uses `material_ui` (Flutter 3.50 deprecates `material.dart`); a Flutter device run (Android or iOS) has not been done, only the web run.
8. **Tooling:** the template server answers a bare HTTP 500 for some template errors (bisect the template); avoid `namespace` objects in templates; `bun install` for `web`, `dev`, the SDK and `ui/web` runs at `source/` (Bun workspace).
9. **`source/apps/web` is the new public site and `source/apps/admin` the old dashboard;** `www` still has its own hand-written tokens and could import the generated `theme.css` later.

## What to watch when extending

Add an operation to the `api` contract first, regenerate the SDKs, then add it to the frontend contract's `.consumes(...)`. A field with an `options` source is rendered as a choice if the source operation's record fields are tagged `option:value` and `option:label`. New patterns are a new view role plus a template in both packs and a component in both libraries; keep implementation out of Dryv and intent out of components.
