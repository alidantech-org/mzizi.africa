---
id: DOC-31F2B0951714
name: Dryv frontend proposals from the Mzizi phase 2 prototype
type: documentation
tags: [dryv, frontend, proposals, planning]
extra: {status: proposal, dryv_changes: not_approved, evidence: phase_2_prototype}
---

# Dryv frontend proposals from the Mzizi phase 2 prototype

**PROPOSALS ONLY. Nothing here changes the Dryv repository; each needs the owner's approval first.** They follow Dryv's own discovery method (reuse, compose, then a narrow extension of the natural owner) and its principles: intent stays neutral and in the IR, packs decide implementation, and concerns are not mixed. Evidence is the probes recorded in task TSK-A08E18BDB85F (`.docs/todo/work/W47/.../010-phase-2-...`), where the stock Next.js pack and a throwaway template read the generation context.

## 1. A present part can bind its operation's input from view context

**Observed.** A detail view has a context value `featureId` and must read `geography.GetFeature`, whose input is that id. Dryv lets `invoke` bind inputs from view context (`context` list) and lets `collect` bind some paths from context while collecting the rest, but a `collect` with only context is rejected ("input collection selector must be omitted when empty") and a `present` part has no input binding at all. The prototype therefore authored an `invoke` part tagged `run:on-open`, which means a button, to carry the binding. The stock pack ignores context and calls the operation with no input.

**Existing vocabulary tried.** `collect` with an empty selector and context (rejected); `invoke` plus `present` of the same operation (works, wrong meaning: invoke is an action).

**Proposal.** Give a `present` part the same `context` binding list an `invoke` part has: each entry targets an input port of the source operation and names a view context value. Validation reuses the existing rules for invoke: every required input of the operation must be supplied by context (a present part collects nothing), context belongs to the owning view, types match, no duplicates. No new concept, no route, address or widget term; packs decide how the value arrives (a route parameter, a query value, a screen argument).

**Why the natural owner.** The part already owns "which operation output I show"; supplying that operation's input is the same relationship one step earlier.

**Evidence of done.** The detail view's `load` invoke part and its tag disappear; a pack reads the present part's context binding and the generated detail page calls `getFeature` with the id.

## 2. A field source's operation is a dependency of the files that use the field

**Observed.** The feature-type filter field declares a source of purpose `options` pointing at `BrowseFeatureKinds`. The probe shows the source on the field (`sources` is in the collect part's port schema context) but the page's `file.dependencies` contains only `browseFeatures`: the source operation is not planned as a dependency, so the page has no import path or symbol for it. A link context carries the operation's id and name variants but not its group, so a path cannot be built from the link without a naming convention duplicated between packs.

**Existing vocabulary tried.** Reading the source from the field context (works); importing the source operation through the pack's `imports` and `transitive` reach (does not reach it, because dependency planning follows the file subject's references, not a field's sources).

**Proposal.** When planning dependencies, treat the operations named by the `sources` of the schema fields a file's subject reaches as references of that subject, in the same way an operation port's schema is. The existing `needs` slot (`operation.client`) then binds them like any other referenced operation. No IR change.

**Why the natural owner.** Field sources are already validated as references to operation ports; dependency planning is the one place that ignores them.

**Evidence of done.** The generated browse page imports the `BrowseFeatureKinds` action from the bound client and the feature-type filter renders as a choice.

## What needs no Dryv change

Selecting views by `role` and tags to pick a pattern template, reading part tags and the `collection` hint, reading paging (`read.page` of `operation.persistence.document`) from an operation template, and reading field sources. Part order for list and detail patterns is the pattern's concern; an authored order (in the view's presentation, because mobile and web may differ) is needed only for free-form views and is deferred.

## Gap record from the phase 2 prototype

Every gap met while assembling geography browse, detail and search-select for web and Flutter, with the example that shows it. Gaps 1 and 2 are the written proposals above; the rest are recorded here for the owner to rank. Nothing in the Dryv repository was changed.

| # | Gap | Failing example | Where it was worked around |
| --- | --- | --- | --- |
| 1 | A `present` part cannot bind its operation's input from view context. | `part.collect(inputFrom(GetFeature.in, [], { featureId: "featureId" }))` fails with "input collection selector must be omitted when empty". | An `invoke` part tagged `run:on-open` carries the binding. |
| 2 | A field source's operation is not a dependency of files that use the field. | The browse page's `file.dependencies` holds `browseFeatures` but not `BrowseFeatureKinds`, though `featureTypeId` declares it as an `options` source. | The filter renders as a text field. |
| 3 | A transition carries no context bindings. | `.transition("openFeature", "browse", "detail", { operation: GetFeature })` cannot say that the row's `featureId` becomes the detail view's `featureId`. | The list passes every text value of the row as address values; the detail view reads the ones it needs by name. |
| 4 | Part order is lost (the IR sorts parts by name). | `parts({ filters, features })` renders `features` before `filters` in the stock pack. | The pattern template places collect parts in its filter slot and present parts in its results slot. Free-form views would still need an authored order, best on the view's presentation. |
| 5 | A read query parameter cannot be bound to a constant. | "Members of the scheme `ref.sch.geo.feature.kind`" has no query form: parameters bind only to an operation input or a policy value. | `BrowseFeatureKinds` is a hand-written use case with one named scheme constant. |
| 6 | A read query over a schema with a geometry field cannot be planned. | A query selecting only ids from `geography.Geometries` fails with `persistence.unsupported: persistence execution does not support`. | The geometry operations are hand-written use cases on the generated repository. |
| 7 | Read queries have no spatial predicate. | A bounds filter (envelope overlaps a box) cannot be written; only equality, ordering comparisons, prefix and null exist. | PostGIS `&&` with `ST_MakeEnvelope` in the use case. |
| 8 | Generated DTOs and interfaces type geometry as `unknown`. | `FeatureGeometryDto.geometry: unknown`, so the SDKs cannot type GeoJSON. | None; the SDK models carry it untyped. |
| 9 | An operation must be registered before a schema field can name it as a source. | `source.options(op)` with an unregistered declaration fails type-checking ("__registeredRefBrand is missing"). | Declare such operations above the schemas that use them. |
| 10 | The template server answers a bare HTTP 500 for some template errors. | A template reading a part through a `namespace` object failed with "Template Server render failed with HTTP 500" and no message in the CLI or API log. | Found by bisecting the template; the pack avoids namespace objects. |
| 11 | A pack can bind only to a pack enabled in the same run. | `generate --app web` fails with "binds slot operation.client to sdk-ts, which isn't an enabled pack"; `--app api --app web` works. | The generate command selects the provider app and its packs too. |
| 12 | Generation rewrites hand-edited generated files. | `source/backend/api/src/app.module.ts` lost its hand-added `EngineModule` and `SystemModule`; `--conflicts keep` did not protect it. | Restored from git after each run. The project needs a stable home for those imports. |
| 13 | Official frontend packs hard-code relative imports and generate their own copies of client types. | 71 TypeScript and 19 Dart files used `../` imports. | Project copies of the packs in `dryv/packs`. |
| 14 | Views are declared once per app. | The web and app contracts declare the same two views in different groups; only the surface differs. | Duplicated; a shared view declaration is a possible later proposal. |

### What the prototype proved works with existing Dryv

Role selection of view patterns, part tags and the `collection` hint, field `sources` in the part's port context, paging from `operation.persistence`, view context values, application destinations and transitions, and the theme. The web slice ran end to end against the live API; the Flutter slice analyzes clean and its device run is pending.
