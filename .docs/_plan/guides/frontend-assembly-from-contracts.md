---
id: DOC-9C7B71F90D42
name: Frontend assembly from contracts plan
type: documentation
tags: [frontend, dryv, planning, patterns, ui]
extra: {status: planning_only, dryv_changes: not_approved}
---

# Frontend assembly from contracts

**PLANNING ONLY. No change to the Dryv repository is approved. Everything below marked "Dryv" is a proposal to be written and agreed first.** The Dryv facts come from its reference docs (`.tasks/docs/reference/ir/{views,parts,presentations,schemas,themes}.md`, decisions 0017 and 0018) and its generation context; they were read, not run, except where stated.

## Goal

Mzizi's web and mobile apps should be assembled from contracts instead of being written page by page. Dryv must never write implementation. It supplies vocabulary and patterns (intent and behaviour) that link to **hand-written implementation** (page shells, dialog and sheet shells, fields, cell renderers), and generates only the thin glue: routes, typed props taken from operation schemas, SDK calls and state wiring. The same operation id and schema that drive the backend drive the component and page that use them.

## Three layers and who owns them

| Layer | Question it answers | Owner | Lives in |
| --- | --- | --- | --- |
| Intent | What is the user doing? | Dryv contract | views, parts, context, destinations, theme |
| Behaviour | What state and transitions exist? | Dryv contract (vocabulary) | view state, collection controls, option sources, after-effects |
| Implementation | How does it look and run? | Hand-written library | shells and components in `source/ui/*` |

Glue sits between them, is generated, and is never edited by hand. Implementation is never generated.

## Inventory: what Dryv already has

| Need | Dryv today | Verdict |
| --- | --- | --- |
| Pages and parts from operations | Views with `present`, `collect`, `invoke` parts bound to operation ports; view roles `list`, `detail`, `form`, `dashboard`, `wizard`, `search` | Exists |
| Filter and edit forms that supply part of an input | `collect` can supply only some input paths and take the rest from view context; a collect that feeds the same operation a present part shows is already recognised by the official pack | Exists |
| Filter, sort and search capability per field | Field `query` with `filter`, `sort`, `search`; exposed to packs. Mzizi declares only a little of it (`_shared.ts`) | Exists, under-used |
| Search-and-select and lookup fields | Field-local `sources` with purpose `options`, `resolve`, `value`, bound to an operation output and input bindings from the field or another field | Exists; no Mzizi contract uses it; no official frontend pack reads it |
| Ids and parameters of a view | Named view `context` values, typed, usable by parts | Partly: no notion of where a value comes from |
| Addresses (`?key=value`, `#id`, path params, mobile deep links) | Removed on purpose; routing is a pack decision | Missing |
| Paging | Not in the IR. Mzizi's API uses a `PageWindow` input by convention | Missing as vocabulary |
| Dialog and sheet behaviour | `flow` of inline, overlay or destination; transitions between destinations with `replace` or `overlay` and an optional initiating operation | Partly: no after-effects |
| Variants and patterns | Declarations carry tags and explanations; tags reach packs | Mechanism exists; no agreed vocabulary |
| Slots and binding to a component library | Packs declare `needs` and `provides`; `bind` fills a slot from another pack in the same run | Exists |
| Theme | Typed tokens, eight roles, modes | Exists and used |

Conclusion: the intent layer is largely there and the binding mechanism exists. The work is a behaviour vocabulary (addressable state, collection controls, after-effects), using what is already declared (`query`, `sources`) properly, and a pack that links patterns to a hand-written library.

## Assembly flow

1. A view (role, parts, context, tags) is matched to a **pattern** by role, part kinds and tags.
2. The pattern names a hand-written component with a typed interface and slots (for a list page: filters, rows, row actions, pagination).
3. The glue fills the slots from the contract: the present part's output schema types the rows, the collect part's input paths become filter fields, invoke parts become row or page actions, each wired to the operation's SDK function.
4. Field and cell renderers are chosen by the semantic property type (for example a business code, a date, an id with a lookup source), through a manifest, never by pack code that knows Kenya or any publisher.
5. A field with an `options` source renders a search-and-select backed by that source's operation; an id field with a `resolve` source shows the resolved label.

## Behaviour vocabulary to define (Dryv proposals, to be agreed first)

1. **Addressable view state.** A context value gets an origin: path parameter, query parameter, fragment, or private state. Packs map these to web addresses and mobile route arguments and deep links. The vocabulary must stay neutral (it is not a URL) because Dryv removed address semantics deliberately.
2. **Collection controls.** Name the paging, filter, sort and search controls of a list as parts of its behaviour, tied to the list operation's input paths and to the field `query` capabilities, with an explicit "this collect refreshes that present" link and a page-window semantic.
3. **After-effects.** A small closed set for what happens when an operation completes in an overlay or destination: close, refresh a part, navigate with context, confirm first.
4. **Pattern and tag conventions.** Agreed tag namespaces (density, layout variant, emphasis) and a pattern vocabulary. This may need no IR change if tags suffice.

## Decisions recorded (owner, 2026-11-17)

- The hand-written library lives under `source/`: `source/ui/web` and `source/ui/flutter`, imported as packages like the SDKs. Visuals come from the **Dryv-generated theme**; nothing restates colours, type or radii.
- **Intent and behaviour belong in the contracts**, never in YAML. A YAML manifest is only for assembling with implementation: it binds a pattern to the hand-written component that implements it (component path, typed props, slots, accepted property types). It carries no intent.
- First real targets: geography browse, geography detail, and a search-and-select form.

## The assembly manifest and the library

- The library starts from the shells in the riderescue dashboard (shadcn and Tailwind) and mobile kit (page and dialog shells, form sections, filter sheets, tables, catalog and search pickers), restyled by the generated theme.
- A manifest beside each library binds **patterns to components**: which component implements which pattern, its typed props and slots, the property types it renders. It is validated against a schema under `source/schema/`. It holds no intent or behaviour (those are in the contract), and no publisher or country knowledge (`typed-code.md` section 3).
- Packs bind the library as a provider of pattern slots to the app pack with the existing `needs` / `provides` / `bind` mechanism.

## Maps

Dryv can describe what a map means; the library decides how it is drawn.

- **Data meaning already exists.** Dryv has a `geometry` property kind (shape, SRID) and spatial calculations (envelope, centroid, area); Mzizi's `geography.Geometries` uses them. Dryv's own backlog (`explorations/spatial.md`) says to compose from existing vocabulary first and not to canonise map-widget concepts.
- **Map intent (contract).** A `present` part presents a collection spatially: it names the geometry path, the identity path, the label path and optionally a path to style by (for example the geometry basis classification). This is a narrow extension of the part's collection intent, proposed only if tags on the present part cannot carry it.
- **Map behaviour (contract).** The visible area is a view context value that feeds a bounds filter on the list operation; the selected feature is a context value that opens the detail view (overlay or destination) and can be addressable (`#id`); an as-of date is a context value because Mzizi geometries have valid time and a basis. All use the behaviour vocabulary above, not map terms.
- **Implementation (library).** The map library, tile source and style, clustering, level-of-detail, camera animation, gestures and an accessible list fallback are decided by the shell and its configuration. Vendor tokens never enter the mobile bundle (`.docs/rules/security.md`).
- **Mzizi evidence rules.** A feature without geometry is shown as missing, never substituted; basis, role and validity are shown with the geometry.
- **What must exist first on the API side (Mzizi, no Dryv change):** an operation that returns geometry for a feature and for a bounds with a simplification tolerance, with a bounds filter on its input. Today `BrowseFeatures` returns names only.

## Phases

1. **Inventory and plan (this document).** Done: read-only. Remaining: confirm the behaviours by running a small experiment before proposing anything to Dryv.
2. **Mzizi-only prototype.** Library packages under `source/ui/*` and the assembly manifest; a project pack that assembles list, detail, search-select and overlay-form views for geography and reference operations. Uses existing Dryv vocabulary only, including `query` and `sources` declared in Mzizi contracts.
3. **Gap record.** What the prototype could not express, with the failing example for each.
4. **Dryv proposals.** Each gap becomes a written proposal following Dryv's own rules (focused concern, facets rather than transport detail, names such as `view.parts`, no mixed concerns). Nothing in the Dryv repository changes without owner approval.

## Open questions

- How much of the address vocabulary Dryv should own versus leaving routes to packs.
- Whether map intent is carried by tags on the present part or needs a narrow vocabulary extension (decided by the prototype's gap record).
- Which map library and tile source each shell uses (an implementation choice, configured outside the contract).
