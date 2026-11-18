---
id: DOC-DRYV-FRONTEND-GENERATION-PLAN-20261119
name: DRYV_FRONTEND_GENERATION_PLAN
type: documentation
tags: [dryv, frontend, components, navigation, sdk, generation, plan, proposal]
extra: {status: proposal_for_owner_agreement, date: 2026-11-19, code_changes: none}
---

# How Dryv will build the apps: contracts, components, navigation and the changes to Dryv itself

**Status: proposal.** It answers the owner's request (2026-11-19) to explain the contract and Dryv changes, the changes the web, app and dev apps will go through, and the owner's issue that code which Dryv should manage was written by hand. Nothing below is implemented. It extends [CONTRACT_AUTHORING_FOR_FRONTENDS](CONTRACT_AUTHORING_FOR_FRONTENDS.md), [UI_INFORMATION_ARCHITECTURE](UI_INFORMATION_ARCHITECTURE.md) and [DRYV_CAPABILITY_PLAN](DRYV_CAPABILITY_PLAN.md).

## 1. The owner's issue, stated precisely

Work that Dryv should have produced was written by hand, in four ways that repeat in every app:

1. **Behaviour in code, not in contracts:** page logic, navigation, data loading and state (`useAsync`, `useSearchParams`, singletons such as `UserStore`) were hand-written in `web/app/**`, `web/lib/site/**` and `app/lib/presentation/**`; the contracts hold six views each.
2. **Requests outside the SDK:** browser `fetch` in a generated transport, a hand-written `api()` wrapper and route handlers in the removed admin app, a hand-made engine proxy route in `dev`, and hand-written parsing of `dynamic` sections.
3. **Hard-coded knowledge in the UI:** Kenya, KSh, level names, indicator codes, navigation lists, label and colour maps, interface strings.
4. **Edits inside generated files:** hand-added code in managed files (`routers/_utils.dart`) that regeneration then destroyed.

The fix is not "be more careful"; it is giving Dryv the vocabulary to say these things, so that a person authors a declaration and regeneration produces the code, every time, identically.

## 2. What Dryv has today (verified in the Dryv repository)

- **Authoring (TypeScript and Python):** `application`, `feature`, `view`, `part`, `surface`, `destination`, `transition`, `theme`, operations with `http` facets, schemas with unions, and the pack mechanism.
- **Packs choose templates by what a view is:** `app-next` selects list pages, detail pages and generic pages by `role`, imports a hand-written component from the UI library and writes only the glue that fills its typed props. `app-flutter` does the same for Dart.
- **Ownership:** each generated file is `managed` (regenerated, never hand-edited) or scaffold-once (written once, then project-owned).
- **Evidence:** every generation records each file's pack, digest and trace in Dryv's state directory.

What it cannot yet say is listed in section 3.

## 3. Changes in the Dryv repository

| Layer | Change | Why |
| --- | --- | --- |
| **Author (TS and Py)** | `component(...)`: a named visual component with typed props, variants and the surface it is for; `part.present(...).as(component)` and `slot()` bind data to components | today a part cannot say "render this with a table" except through a string hint |
| | `shell(...)`: sidebar groups and items, app bar slots (logo, search, breadcrumbs, place switcher, actions), drawer behaviour, no footer | navigation and layout are authored, not hand-coded |
| | `address(...)`: the address grammar with typed segments, place-scope prefix, reserved words, canonical form and redirects | one source for web routes, app deep links, breadcrumbs, push targets and sitemaps |
| | `context(...)` declarations (country, language, place, source) and `scope` (place) a view requires | context-dependent reads and links without UI constants |
| | `navigation`: transitions with context bindings, scope preservation, back behaviour, guards, redirects | behaviour as data |
| | `intent(...)`, `state(...)`, `copy(...)`, `states(...)` (loading, empty, gap, error), `render: server | client` | intents, preferences, copy keys and page states are contract concepts |
| **IR (canonical runtime IR)** | New record kinds for the above (component, shell, address, context, intent, state, copy key, page state) in `v1alpha1`, evolved in place | the IR is the only semantic authority |
| **Validation** | Rules: every part binds to a component whose props its data satisfies; every destination has an address; every address segment is typed; every view declares its states; no `dynamic` in a bound output; routes do not shadow reserved words | wrong contracts fail at authoring time, not in production |
| **Generation context** | Projections the templates need: the component catalog, the address table, the navigation graph, the copy catalogue | templates never invent structure |
| **Packs (`app-next`, `app-flutter`, SDK packs)** | New templates: server-component pages that call the server SDK, layout with sidebar and app bar, breadcrumbs from the address and hierarchy, place switcher, Riverpod providers and repositories, GoRouter generation from the address table, copy delivery, preference providers | removes the hand-written pages, routers and providers |
| **SDK packs** | A server form and a browser form of each client, sending the context as a typed option; an `engine` SDK for `dev` that is server-only | the only way a frontend reaches a backend |
| **CLI and actions** | Run the unused-import and formatting actions on `apply` too; a manifest export; `--check` for every app; a protected-slot mechanism and a "report, never silently keep" conflict mode | the problems met during the 2026-11-19 regeneration |
| **Template servers** | Request size limit raised (done in Jinja); check the other three servers | large contracts must render |

## 4. How a component, a part and a feature are built and regenerated

Illustrative authoring (names are proposals, not implemented syntax):

```ts
// dryv/contracts/apps/web/features/elections/views.ts
const ElectionHub = view()
  .role("hub")
  .context(place.optional(), year.optional())
  .states({ empty: "elections.empty", gap: coverage("results") })
  .parts({
    countdown: part.present(read.NextElection).as(components.Countdown).slot("hero"),
    timeline:  part.present(read.ElectionTimeline).as(components.YearTimeline),
    results:   part.present(read.LatestResults).as(components.ResultTable),
  })
  .render("server")
  .address("/elections");
```

1. **Component** (`Countdown`) is declared once with typed props in the catalog and implemented by a person in `source/sdk/ui/web` and `source/sdk/ui/flutter`. It does not know any endpoint.
2. **Part** binds one composed read's typed section to the component's props; validation fails if a prop has no data.
3. **Feature** groups views, intents, copy keys and navigation for one product area (Elections, Infrastructure, Calendar).
4. **Regeneration:** change the read, the component's props or the view, run generation; the page, the SDK call, the types and the Flutter screen change together; a check fails if a managed file was hand-edited.

## 5. Navigation and behaviour as authored data

- **Place scope in the address.** The address grammar says `{place...}/{section}/...`; the generated link builder carries the current place; switching the place rewrites the path and keeps the section; `/` shows the home place for visitors who have one.
- **Breadcrumbs** come from the dated geography hierarchy plus the section, not from the text of the address.
- **Back behaviour, guards and redirects** are declared per transition (for example a place that moved counties redirects through the slug history).
- **One address table** produces the web routes, the app's GoRouter, deep links, the push-notification mapper, the sitemap and canonical tags.
- **Context behaviour:** the host or path chooses the country, then selection, preference, position, the CDN header, default; the shell shows the source and a "change" action.
- **Intents** (find my place, compare, save a place, like, follow, post) are named, call an operation, change declared state and lead to a destination.

## 6. What changes in each app

**Web (`source/apps/web`)**
- Pages become generated server components; the 25 `"use client"` pages and `useAsync` disappear; client leaves remain only for maps, charts and forms.
- `lib/site/*` wrappers (including the 779-line `insights.ts`) and the hand parsing in `lib/site/governance/**` are deleted once sections are typed.
- The layout becomes a generated sidebar and app bar with breadcrumbs and the place switcher; no footer (the `www` site keeps it).
- No `fetch`, no `NEXT_PUBLIC_API_URL` for first paint; the server SDK reads on the server.
- All words come from copy keys; all colours from the theme; all icons and chips from reference display hints.

**App (Flutter, `source/apps/app`)**
- Routers, providers, repositories and screens come from the same views; state is Riverpod throughout (the `UserStore` and `SavedStore` singletons are replaced by generated preference providers backed by the server).
- Strings come from copy; no hex colours or font sizes outside the generated theme.
- Hand-written widgets (map, tree canvas, charts, globe) live in `sdk/ui/flutter` with typed props.

**Dev (`source/apps/dev`)**
- The hand-made engine proxy route and hand `fetch` are replaced by the server-only engine SDK; the service key stays on the server.
- It also becomes the administrative interface (review workbench) generated from engine contracts and the data and interaction operations.

## 7. What the owner will see change in the UI

Sidebar with grouped navigation and a persistent place context; an app bar with logo, search, breadcrumbs, place switcher, language and theme; no page footer in the web app; clean addresses (`/nairobi/westlands/elections`); the home page showing the visitor's place; the same sections available at country level and under any place; calendar and countdown; infrastructure map and search; honest "no data" explanations with actions; flags, logos and symbols leading lists; names shown with their abbreviations; a topic-based Explore; fun-fact carousels; likes and views on the web, posting on the mobile app only.

## 8. Order of the Dryv work

1. Typed sections (replace `dynamic`) and the manifest and gates (first proving slice: place overview with context).
2. Component catalog and part binding; page states; copy keys.
3. Address grammar and navigation, with the shell and the place switcher.
4. Server SDK forms and the server-page and Riverpod templates.
5. Migrate web, then Flutter, then dev, deleting the hand-written equivalents as each view lands.

## 9. Open questions

1. Component props: authored in the contract (typed schema) or read from the component's own source? The first is more controlled; the second duplicates less.
2. May the shell be generated fully, or does a person write the shell component with typed slots?
3. Is the Dryv Python author required to match every new declaration, or is TypeScript authoring enough for Mzizi?
4. Preview tooling: a generated component gallery from the catalog for design review?
