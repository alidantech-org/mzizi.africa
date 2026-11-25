# Mzizi web

Two independent handwritten Next.js applications share this web project: a permanent prototype at `/demo`, and the fresh backend-connected application under `src/app/(app)`. Dryv owns backend schemas, request/response contracts and generated API bridge clients. Both UIs are handwritten. The web UI/theme activation is disabled in `dryv.yaml`; app and dev generation remain separate.

## Source layout

```text
src/components/                   shell UI (sidebar, appbar, popovers, settings), shared with the demo look
src/lib/server/                   server-only reads through the generated SDK (@mzizi/api-client)
  codes.ts                        web address <-> row codes (/ke/nairobi = geo.ftr.ke.nairobi; ref.cty.ke; ref.lng.sw)
  copy.ts, places.ts              interface copy and the shell's place catalogue
  views/                          screen loaders (place, ranking, map, government, money)
  parse/geojson.ts                the one parser for geometry in responses (DRYV_GAPS)
src/app/
  (app)/                          the real application: server components only, one SDK call per screen where possible
    _views/home.tsx               countries (frontend/home)
    _views/place-*.tsx            overview, statistics, government, money, sources for /<country>/<place…>?view=
    _views/place-map.tsx          divisions drawn as SVG on the server from prepared outlines
  demo/                           the permanent prototype (unchanged)
```

## The real application (rebuilt 25 November 2026)

Every screen renders on the server through the generated SDK; the browser fetches no product data (the only client read is the device-location lookup after the browser's permission prompt). Screens and reads:

| Address | Screen | Reads |
|---|---|---|
| `/` | Countries | `frontend/home` |
| `/<country>[/<place…>]` | Place overview: breadcrumb, map, divisions, figures, leaders, projects, events, articles | `frontend/place` + `geography/child-outlines` (streamed) |
| `?view=statistics` | All figures; at country level a ranking of first-level places (`view.indicator`) | `frontend/place`, `frontend/ranking` (streamed) |
| `?view=leaders` | Offices and current holders | `frontend/place` |
| `?view=institutions[&view.id=]` | Institutions; one institution's offices | `governance/institutions`, `frontend/institution` |
| `?view=finance`, `suppliers` | Projects and tenders | `civic/projects`, `civic/tenders` |
| `?view=sources` | Sources | `source/sources` |
| `?view=law`, `parliament`, `elections`, `power` | Served by the API but not yet loaded in the rebuilt database: the page says so | none |

Run against the rebuilt API: `SERVER_URL=http://127.0.0.1:8711 bun --bun next build && SERVER_URL=… bun --bun next start -p 3311`. Measured in the browser (25 November 2026, production build, Redis-backed API): first byte 8 ms, DOM ready 143 ms; full HTML per page 94–159 ms server time; 0 API requests from the browser. Before, the same place page needed five API reads totalling 343 ms before rendering.

## Run and verify

Run from the repository root:

```sh
bun run dev web
bun run build --only web
bun run typecheck --only web
bun run start web
bun test source/apps/web/src/app/demo/_lib/navigation/route.test.ts
```

The normal address is http://localhost:3300. Open `/demo` for the prototype or `/demo/ke/nairobi?view=law` for a contextual subject. `/` and `/ke/...` are honest real-application skeletons: no backend product reads or substitute demo values are implemented there yet. Do not build into `.next` while a production server is serving that same output.

## Permanent prototype ownership

Keep the demo working alongside the real application until the owner explicitly authorises its removal. Backend integration is incremental: implement a real typed read and screen, compare it against the prototype, and leave the prototype intact. The demo deliberately contains country lists, availability rules, illustrative budgets/elections, example-place fallbacks, simplified geometry and local applicability logic. These are prototype limitations, not canonical backend rules. Some prepared geography, legal text and observations have recorded sources; neighbouring synthetic claims remain demonstrations.

## Navigation and preferences

The complete interaction rule is in [web-navigation.md](../../../.docs/rules/web-navigation.md). Within the demo, the place is in `/demo/<country>/<place...>`, query namespaces choose the subject/selections, and the hash records the reading section. Same-subject place/filter/tab/language changes preserve scroll and valid hashes; subject changes start at their appropriate section. Use demo `useNav()` helpers. The local Link wrapper prefixes internal paths, including those supplied by prototype data.

Demo cookies use `mzizi-demo-*` names and `Path=/demo`; local storage and UI events have their own demo namespace too. Existing real/root preference records are not deleted or reused. Server preference reads and the pre-paint theme script stay inside the demo root. Language comes from `?lang=`, then the demo language cookie, then English. Missing translations are explicitly described and English fallback is marked; evidence is never silently translated and presented as the original.

## Accessibility and components

Use semantic HTML, real table headers and `aria-sort`, labelled icon controls/charts/maps, meaningful alternative text and keyboard focus. The shared demo sheet/dialog shells trap focus, restore it and close on Escape. React Aria control wrappers in `_components/ui/controls.tsx` remain the demo's standard controls. Contrast, text size, spacing, underlined links and reduced motion override its theme and charts; colour is not the only signal. Browser speech and keyboard controls remain demo components.

## Assets and installable demo

The React logo is in `demo/_components/brand/logo.tsx`, using `currentColor`. Static SVG/favicon/Apple/install icons are in `public/icons/`; the document roots declare browser icons explicitly, and the demo manifest declares SVG/PNG/maskable install icons. Regenerate raster identity icons with `bun source/apps/web/src/app/demo/_scripts/build-icons.ts` from the repository root (ImageMagick required).

Demo country flags are locally served from `src/app/demo/_assets/flags/`, initially copied from the MIT-licensed flag-icons package. Source documents and media are under `src/app/demo/_assets/sources/`. They remain ignored local assets, not committed fixture content. Flag-derived theme colours stay in the demo's ignored data and presentation helpers.

The install manifest is `/demo/manifest.webmanifest`, with start and scope under `/demo`. The demo worker `/demo/sw.js` is served by a demo route with the exact `Service-Worker-Allowed: /demo` scope header. It ignores navigation outside the demo and only manages its own named caches. `/sw.js` contains no fetch handler: it retires the former root-scoped prototype worker. No real app worker or install manifest is set up yet.

## Local content and verification limits

The code checkpoint excludes `_data/` content (apart from ambient type declarations), GeoJSON/TopoJSON, preparation inputs, seed/fixture folders, flags, downloaded images and source documents. The source-specific `src/app/demo/_scripts/build-data.ts` stays local; its outputs now target the demo `_data` directory. Files were moved, not discarded. Logo and app identity assets remain eligible for Git.

The demo still imports those local files, so passing local checks does not establish a data-free clean-checkout build. Preserve demo labels; do not commit local datasets to fix missing imports. The real application must obtain product data through the generated server API client and typed contracts as its screens are implemented.

## Current real shell checkpoint

The owner requested an exact copy of the demo design before planning API adaptation. `src/components/` and `src/lib/` were copied with `cp -R` from the permanent demo, alongside its stylesheet and document layout. The sidebar, app bar, search/location/language popovers, saved/help controls, theme, sound and accessibility settings retain their prototype markup and behavior. Only import roots, root URL addressing, independent `mzizi-app-*` preference storage and document/PWA ownership were adapted. The real document does not register the demo worker or manifest.

Real routes render only the placeholder `src/app/(app)/_views/home.tsx` inside that copied shell. There are no duplicate `(app)/_components` or `(app)/_lib` folders. Other subjects have not been migrated: copied navigation can change the URL, but these routes still show the placeholder. Utility destinations such as `/me` and `/help` are not yet migrated either.

This is a design checkpoint, not an API integration claim. The copied shell still consumes prototype data explicitly from `app/demo/_data` and retains its existing hardcoded labels and country rules. Fake datasets were not copied into `src/lib` or `src/components`. Database-backed copy, complete Swahili coverage and generated API integration remain future work to plan with the owner. The rejected rewritten shell API and fixture code were reverted.

The original SDK resolution error came from an obsolete action import path. The old real welcome/overview consumers were removed in this checkpoint, so that failing import is no longer present. Future API consumers must use `@mzizi/api-client/actions/explorer` and the generated `explorer`-prefixed operation names, without a `.actions.ts` suffix.
