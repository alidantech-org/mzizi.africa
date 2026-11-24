---
{id: TSK-70E25E4F7C06,name: "Project app packs: absolute imports, shared SDK, runnable Next.js",type: task,status: completed,priority: medium,created_at: 2026-11-17T08:28:33.869Z,updated_at: 2026-11-17T11:52:59.344Z,order: 7168,extra: {status_history: [{from: planned,to: completed,at: 2026-11-17T11:52:59.344Z}]},archived_at: 2026-11-24T19:23:30.487Z}
---

# Project app packs: absolute imports, shared SDK, runnable Next.js

## Goal

Replace the official Next.js and Flutter app packs with project copies that follow the repository's import rule, call the shared SDKs in `source/sdk` instead of generating clients of their own, format and clean their output, and ship the scaffold files needed to run. The Flutter app should analyze cleanly and the Next.js apps should typecheck and build, so the first generated slice can be started with the root runner.

## Context

The copies are `dryv/packs/app-next` and `dryv/packs/app-flutter` (from `unit/frontend/nextjs-app` and `unit/frontend/flutter-app`). They are wired in `dryv.yaml` for `web`, `dev` and `app`, bound to `sdk-ts` and `sdk-dart`. Dryv only allows a bind to a pack that is enabled in the same run, so generation selects the `api` application together with the frontend: `generate --app api --app web --app dev --app app --pack ...`. Static code files in the packs are named `.j2` so IDEs do not analyze them as code. Rules: `.docs/rules/typed-code.md` section 5, and the project rule that imports start at `#/`.

## Acceptance checklist

- [x] Both packs use absolute imports and write no `../` imports, and the Flutter app passes `flutter analyze` against the shared Dart SDK.
- [x] The Next.js apps install, typecheck and `next build` successfully against `@mzizi/api-client`.
- [x] Generated app code is formatted and has no unused imports.
- [x] The apps are added to the root runner with ports and documented, and `task validate` passes.

## Progress

Done: both packs copied and wired; Flutter app generated against `mzizi_api` and `flutter analyze` reports no issues; the Next.js pack writes `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, layout and `globals.css` (importing the generated `theme.css`) and no longer installs packages or formats on its own; `.tsx` now goes through the Biome unused-import and Prettier actions. `tsc` passes for `web`.

Resolved: the SDK's own files use the alias `#sdk/` (its package.json `imports`) and the apps use `#/` through tsconfig `paths`, so both resolve in one build. Specifiers carry explicit extensions because package.json `imports` targets are exact. Turbopack could not read the SDK installed by `file:` (Bun symlinks each file), so `source/package.json` is a Bun workspace of `sdk/api-ts`, `apps/web` and `apps/dev` and the apps depend on `workspace:*`.

Checked: `tsc` passes for the SDK, `web` and `dev`; `next build` succeeds for `web` and `dev`; `next start` serves `/web/feature-list` with HTTP 200 (the API was not running, so the list itself was not exercised); `flutter analyze` is clean; no `../` imports in generated TypeScript or Dart. The runner now lists `web` (3300), `dev` (3400) and `app`.
