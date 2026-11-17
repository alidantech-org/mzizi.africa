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
- [ ] The web and app contracts declare geography browse, detail and search-select views with roles, parts, context values and destinations.
- [ ] `source/ui/web` and `source/ui/flutter` exist as packages with the list page shell, detail shell, filter bar, search-select field and pagination, themed by the generated theme.
- [ ] A schema-validated assembly manifest binds each pattern to its component with typed props and slots.
- [ ] A project pack assembles the views into routes and typed glue; the web app builds and the geography browse page renders from the live API.
- [ ] Every Dryv gap found is recorded with a failing example, and `task validate` passes.

## Progress

Step 1 done: `BrowseFeatureKinds` (`GET /v1/geography/feature-kinds`) is declared in `dryv/contracts/apps/api/geography.ts` and attached as a field-local `options` source (`source.options(...)`) to the `featureTypeId` field of `FeatureWindow` and `GeometryWindow`. Its use case (project-owned) reads the members of the feature kind scheme through the generated `ValueRepository`. Both new use cases were run end to end against `mzizix` (read-only): 37 feature kinds returned, 0 geometries (the table is empty).

Findings so far (for the gap record):
- A Dryv query parameter can be bound only to an operation input or a policy value, never a constant, so "the members of one fixed scheme" cannot be a Dryv query. The scheme code is one named constant in the use case, tied by comment to the field's `scheme:` tag.
- An operation must be registered (`feature.operations({...})`) before a schema field can name it as a source, so such operations are declared above the schemas that use them and merged into the exported operation map.
- Regenerating the API rewrites `source/backend/api/src/app.module.ts`, which holds hand-added `EngineModule` and `SystemModule` imports; `--conflicts keep` does not protect it. It was restored from git after each run; it needs a stable home outside generated code.

Remaining: steps 2 to 6 (views in the web and app contracts, `source/ui` library, assembly manifest and schema, assembling pack, gap record).
