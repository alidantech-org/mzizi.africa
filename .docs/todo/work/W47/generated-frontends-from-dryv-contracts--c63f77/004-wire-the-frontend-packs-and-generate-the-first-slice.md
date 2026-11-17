---
{id: TSK-0F4FCD2867A6,name: Wire the frontend packs and generate the first slice,type: task,status: in-progress,priority: medium,created_at: 2026-11-17T07:35:19.123Z,updated_at: 2026-11-17T07:35:23.514Z,order: 4096,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T07:35:23.514Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0F4FCD2867A6/1794900923515-start,started_at: 2026-11-17T07:35:23.755Z}]}}}
---

# Wire the frontend packs and generate the first slice

## Goal

Activate the official Dryv frontend packs against the four frontend contracts and generate the first slice so the output can be inspected before anything wider is attempted. The public website goes to `source/apps/web`, the developer portal to `source/apps/dev` and the mobile app to `source/apps/app`; the administrative portal is not generated into because it is not ready for work. The task ends with an honest list of what was generated, what works, and what Dryv or its packs still lack, rather than with a claim that the apps run.

## Context

The contracts are in `dryv/contracts/apps/{app,web,admin,dev}` and select the shared `brand.Mzizi` theme. Dryv's official packs repository, pinned in `dryv.yaml`, has `unit/frontend/nextjs-app`, `unit/frontend/flutter-app`, `unit/clients/next-api-bridge` and `unit/clients/flutter-api-bridge`. The Next.js pack binds the bridge's server actions; the Flutter pack binds the Dart bridge package. Both packs are version 0.1.0 with listed limits (nested schemas and arrays are not editable, views must belong to a feature). Their READMEs do not say they render theme tokens, so token output may need a Dryv or pack change recorded as a follow-up. Existing `source/apps/mobile` and the `www` landing page must not be touched. `dryv.yaml` holds one `applications:` entry per contract, each with its packs and destinations.

## Acceptance checklist

- [x] `dryv.yaml` has authoring sources, IR destinations, pack entries and `applications` for `app`, `web` and `dev` (not `admin`).
- [x] Generation runs and writes into `source/apps/web`, `source/apps/dev` and `source/apps/app` without touching `mobile`, `www` or `admin`.
- [x] The generated files are inspected and what is generated, what is missing and what the packs lack (including theme output) is recorded in this task.
- [x] `task validate` passes.

## Progress

Generated `source/apps/web` (118 files), `source/apps/dev` (38) and `source/apps/app` (124, including the Dart bridge at `sdk/api`) with `dryv generate --app web --app dev --app app`. `mobile`, `www` and `admin` were not touched. What was needed: each frontend is a `dryv.project(...)` with its provider, a `.consumes(...)`, and `operations: consumed` on its packs; groups of persisted schemas pull their store in through the provider.

## Findings

- **Theme is not rendered.** Neither official pack reads `brand.Mzizi`: the Flutter `main.dart` hard-codes `ThemeData(colorSchemeSeed: Colors.indigo)` and the Next.js output has no CSS or Tailwind tokens. This is the first Dryv/pack gap and is the next work.
- **Next.js apps are not runnable.** The pack writes `app/`, `components/`, `lib/` and the bridge `_gen/`, but no `package.json`, `tsconfig.json` or `next.config`. The pack's dependency install failed (`pnpm add` refused because the project is configured for bun); the `choose: { js.package_manager: bun }` setting used by the API destinations is not set on the new destinations.
- **Flutter app does not analyze cleanly.** `flutter pub get` works, but `flutter analyze` reports three errors in the generated bridge (`sdk/api/lib/src/client.dart` and `features/geography_feature.dart`: `GeographyFeature` and `GeographyEndpoints` undefined) plus an unused import and a style hint in the app.
- Routes are `/<group>/<view>` (`/web/feature-list`); the list renders through a generic `DryvResult`, not a designed list.
- The `web` output includes every geography model because the operation's output types pull them in.
- The generated page imports with `.ts` extensions, which needs `allowImportingTsExtensions` in the Next.js config.
