---
{id: TSK-A08E18BDB85F,name: "Phase 2: geography browse, detail and search-select from contracts",type: task,status: in-progress,priority: medium,created_at: 2026-11-17T09:37:30.843Z,updated_at: 2026-11-17T09:40:14.693Z,order: 10240,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T09:40:14.693Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-A08E18BDB85F/1794908414703-start,started_at: 2026-11-17T09:40:15.563Z}]}}}
---

# Phase 2: geography browse, detail and search-select from contracts

## Goal

Prove that a real Mzizi screen can be assembled from contracts and hand-written components using only the Dryv vocabulary that exists today, and record exactly where it falls short. The prototype covers geography browse (a list with filters and paging), geography detail, and a search-and-select field, first for the Next.js web app and then for the Flutter app. Dryv never writes implementation: the contract carries intent and behaviour, a hand-written library under `source/ui` carries implementation, an assembly manifest binds the two, and generation writes only the glue.

## Context

The plan is `.docs/_plan/guides/frontend-assembly-from-contracts.md`; decisions recorded there say the shells live under `source/ui/web` and `source/ui/flutter`, visuals come from the generated theme, intent and behaviour stay in contracts, and the manifest is YAML only for binding components. The shared SDKs, project app packs, the geometry operations and the generated first slice already exist. Dryv field-local `sources` (purpose `options`, `resolve`) and field `query` capabilities are available in the IR but unused by Mzizi contracts. Dryv read queries cannot bind a constant parameter (only an operation input or a policy value), so an options operation for a fixed classification scheme is a hand-written use case on generated code, the same route chosen for geometry. Every Dryv gap found becomes a written proposal; nothing in the Dryv repository changes without approval.

## Acceptance checklist

- [x] The geography contracts declare an options operation for feature kinds and attach it as an `options` source to the feature-type filter fields.
- [x] The web contract declares geography browse and detail views with roles, parts, context values, destinations and a transition (the search-select is the feature-type filter, which waits on a Dryv proposal).
- [x] `source/ui/web` exists as a package with the page and section shells, filter bar, search-select, data table, pagination and detail list, themed by the generated theme.
- [x] Pattern binding lives in the project pack only: selections by view role pick a pattern template that imports the hand-written components (no separate manifest, by owner decision).
- [x] A project pack assembles the views into routes and typed glue; the web app builds and the geography browse and detail pages render from the live API.
- [x] The Flutter side exists: the app contract's geography views, `source/ui/flutter` components and the Flutter pattern templates, verified with `flutter analyze`.
- [ ] The Flutter app is run on a device, emulator or Linux (needs `libsecret-devel`) against the live API and the browse and detail screens are checked.
- [x] Every Dryv gap found is recorded with a failing example, and `task validate` passes.

## Progress

Step 1 done: `BrowseFeatureKinds` (`GET /v1/geography/feature-kinds`) is declared in `dryv/contracts/apps/api/geography.ts` and attached as a field-local `options` source (`source.options(...)`) to the `featureTypeId` field of `FeatureWindow` and `GeometryWindow`. Its use case (project-owned) reads the members of the feature kind scheme through the generated `ValueRepository`. Both new use cases were run end to end against `mzizix` (read-only): 37 feature kinds returned, 0 geometries (the table is empty).

Findings so far (for the gap record):
- A Dryv query parameter can be bound only to an operation input or a policy value, never a constant, so "the members of one fixed scheme" cannot be a Dryv query. The scheme code is one named constant in the use case, tied by comment to the field's `scheme:` tag.
- An operation must be registered (`feature.operations({...})`) before a schema field can name it as a source, so such operations are declared above the schemas that use them and merged into the exported operation map.
- Regenerating the API rewrites `source/backend/api/src/app.module.ts`, which holds hand-added `EngineModule` and `SystemModule` imports; `--conflicts keep` does not protect it. It was restored from git after each run; it needs a stable home outside generated code.

Remaining: steps 2 to 6 (views in the web and app contracts, `source/ui` library, assembly manifest and schema, assembling pack, gap record).

## Progress: views and library

Step 2 (web): `dryv/contracts/apps/web/index.ts` now declares `FeatureBrowse` (role list: an inline `collect` filter over `featureTypeId` and `codePrefix`, a `present` table of features) and `FeatureDetail` (role detail, view context `featureId`), two destinations and an `openFeature` transition. Step 3 (library, web): `source/ui/web` (`@mzizi/ui-web`, workspace member, alias `#ui/`) with `PageShell`, `Section`, `FilterBar`, `SearchSelect`, `DataTable`, `Pagination` and `DetailList`, typed and themed by the generated role variables; typecheck and Prettier pass.

### Gaps found by generating the stock pack from these views (for the gap record)

1. **Context cannot feed a present part.** A detail view needs `featureId` to reach `GetFeature`. A `collect` with only context bindings is rejected ("input collection selector must be omitted when empty"), so the only way to bind context to an operation input is an `invoke` part, which means a button. The contract tags it `run:on-open`. The stock pack ignores the context and calls `getFeature()` with no input, so the generated detail page is broken.
2. **Part order is lost.** Parts are a map and the IR sorts them by name, so the page shows `features` before `filters`. Layout order cannot be authored.
3. **The stock pack ignores `sources`.** The feature-type filter renders as a text box instead of a choice backed by `BrowseFeatureKinds`.
4. **The stock pack ignores `collection` and tags.** The present part asks for a `table`; the pack prints a generic result block.
5. **No paging vocabulary.** The page window stays the operation's default; there is no way to say that the filter and the page controls belong together.

## Open design question

How generation reads the assembly manifest. A Dryv pack renders from the IR plus its own resources and inputs; it cannot read an arbitrary project file. See the session for the options.

## Probe results (no Dryv change; a throwaway template read the generation context, then it was removed)

- **Selection works as the pattern binding.** Views can be selected by `role` and `tags` in pack selections, so one pack template per pattern (`role: list`, `role: detail`) plus tag-selected variants is existing Dryv logic. No manifest file: the library's typed props are the interface and `tsc` checks the glue.
- **Part tags and the `collection` hint reach templates** (gap 4: pack-only).
- **Paging reaches templates.** A template of the operation subject sees `operation.persistence.document` whose `read.page` is `{limit, offset, max_limit: 200}`. The operation module the pack already generates per operation can export it, and the page imports it (gap 5: pack-only).
- **Field sources reach templates** through the collect part's port schema fields (`featureTypeId` shows one `options` source to `BrowseFeatureKinds`), but **the source operation is not a dependency of the page** (only `browseFeatures` is), so no SDK import or symbol is available for it. A link carries the id and name variants but not the group name, so a path cannot be built cleanly from it. Needs a Dryv change: treat a field source's operation as a reference when planning a file's dependencies.
- **Context to present** still needs a Dryv change (present parts cannot bind input from view context).
- **Part order** is a pattern concern for list and detail views (the pattern places collect parts in its filter slot and present parts in its results slot); an authored order is needed only for free-form views.

## Result: the web slice works end to end

`dryv/packs/app-next` now has two pattern templates selected by view role (`role: list`, `role: detail`; other roles keep the generic page) that import the hand-written `@mzizi/ui-web` components and fill their props from the contract: filter fields from the collect part's paths, table columns from the present part's element schema, paging from the operation module's new `<operation>Page` export (read from `operation.persistence`), and navigation from the application's transition. The dropped manifest is not needed: selection picks the pattern, the template is the binding, and `tsc` checks the glue against the components' props.

Verified: `tsc` passes for the library and the web app; `next build` produces `/web/feature-browse` and `/web/feature-detail`; with the API (started from `.env` on a spare port, database `mzizix`) and the web app running, the browse page listed real features styled by the generated theme, a click opened the detail page for Kenya with its three names, and `GET /v1/geography/feature-kinds`, `/geometries` and `/features/{id}/geometries` answer over HTTP (geometries empty: no stored drawings yet). Servers were stopped afterwards.

Found while verifying: the hand-written geometry use cases failed over HTTP with "No metadata for GeometriesEntity" because no generated module registers that entity; it is now registered in the project-owned `DatabaseModule` (`TypeOrmModule.forFeature([GeometriesEntity])`).

### Added to the gap record

6. **A transition carries no context bindings.** Opening a feature from the list should supply the detail view's `featureId` from the row's `featureId`. The transition names only an operation, so the generated list passes every text value of the row as address values and the detail page reads the ones it needs by name. Proposal candidate: transition bindings from source part values to target view context.
7. **Not yet done:** the feature-type filter is a plain text field (needs Dryv proposal 2), the detail view still uses the tagged `invoke` part (proposal 1), and the Flutter library, pack templates and the `dev` app are not yet built.

## Flutter side

The `app` contract declares the same `FeatureBrowse` and `FeatureDetail` views for the mobile surface. `source/ui/flutter` (`mzizi_ui`, a path dependency of the app) holds `MziziPageScaffold`, `MziziSection`, `MziziFilterBar`, `MziziRowList`, `MziziPaginationBar`, `MziziDetailList` and the shared types, coloured only by the app theme. `dryv/packs/app-flutter` gained list and detail screen templates selected by view role (other roles keep the scaffolded screen and its providers) and a `paging` template that exports each operation's page names from its query plan. On a phone the `collection: table` hint becomes a list of tiles: the pack chooses the representation per surface, the contract does not.

Verified: `flutter analyze` is clean for the app and for `mzizi_ui`; `flutter build web` compiled the app (dart2js). **Not run with data:** the app depends on `flutter_api_bridge`, which needs platform storage plugins. A widget test hangs on them; the web build starts but fails at start-up (the bridge uses `path_provider`, which has no web support), and the API has no CORS headers anyway; a Linux desktop run needs the system package `libsecret-devel`, which I did not install. A run needs an Android or iOS device or emulator, or that package. The temporary platform folders and test files made for these attempts were removed.

Same Dryv findings as the web slice apply (present parts cannot bind context; a field source's operation is not a dependency, so the feature-type filter is a text field; a transition carries no context bindings, so the row's text values travel as address values).

## Gap record

Written: `.docs/_plan/guides/dryv-frontend-proposals.md`, section "Gap record from the phase 2 prototype": 14 gaps, each with its failing example and workaround. Phase 2 is closed except the device run of the Flutter screens, which stays open above.

## Update: the feature-type filter is a real choice (Dryv proposal 2 withdrawn)

The planner already references field-source operations from schemas; the page only needed `transitive: true` on its `operation.client` import. The pack now renders a field with an `options` source as a choice whose options come from the source operation (value and label fields marked by the contract's `option:value` and `option:label` field tags). Verified in the browser against the live API: 37 feature kinds in the select; choosing County listed 20 counties (all of the County type). See the revised proposals document.

## Update: Dryv proposal 1 implemented

Dryv commit `dfb0dd79` lets a present part bind its operation's input from view context. The web and app contracts now declare `part.present(GetFeature.out).context({ featureId: "featureId" })` (the tagged invoke part is gone) and the web and Flutter detail templates read `view.part.present.context`. Verified: both contracts compile, the web app typechecks and builds, `flutter analyze` is clean, and `/web/feature-detail?featureId=...` shows Kenya and its names against the live API. Dryv checks: engine generation and semantic tests (518) plus the new tests, TypeScript author tests, Python typechecks and the import check pass.
