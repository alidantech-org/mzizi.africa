# Mzizi web

Two independent handwritten Next.js applications share this web project: a permanent prototype at `/demo`, and the fresh backend-connected application under `src/app/(app)`. Dryv owns backend schemas, request/response contracts and generated API bridge clients. Both UIs are handwritten. The web UI/theme activation is disabled in `dryv.yaml`; app and dev generation remain separate.

## Source layout

```text
src/app/
  (app)/
    layout.tsx                    independent real document layout
    page.tsx                      real entry skeleton (/)
    _components/explorer-start.tsx
    [country]/page.tsx             country root skeleton
    [country]/[...place]/page.tsx   deeper real explorer skeleton
  demo/
    layout.tsx                    demo document, fonts and theme setup
    page.tsx                      demo welcome (/demo)
    demo.css                      demo-only styles
    manifest.webmanifest/route.ts
    [country]/[[...place]]/page.tsx
    help/page.tsx
    me/page.tsx
    me/saved/page.tsx
    api/locate/route.ts
    _components/                  brand, ui, layout, navigation, preferences,
                                  accessibility, visualization, media
    _lib/                         grouped helpers and authored install manifest
    _view/                        subject screens and private components
    _data/                        ignored local content and prepared/demo data
public/
  icons/                          shared brand identity assets
  demo/                           demo worker, offline page and ignored content
  sw.js                           retirement of the old root-scoped worker
```

`#/*` resolves to `src/*`; `#demo/*` resolves to `src/app/demo/*`. Demo views use explicit imports rather than broad server/client barrel exports. No real route imports the demo. `(app)` is an organisational route group and does not appear in URLs; `demo` is an actual URL prefix. There is no shared top-level root layout: switching between the two document roots reloads the document and keeps demo styles and setup isolated.

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

## First real backend slice

The independent `(app)` root now uses the generated `@mzizi/api-client` server helpers for explorer setup, country-scoped place search, registered hierarchy children, context confirmation and place overview. Set `SERVER_URL` to the running product API origin. Root-runner environment values take precedence over Next local environment files; for the local API use `SERVER_URL=http://127.0.0.1:8700 bun run dev web`. Product reads happen in server components; the browser receives rendered content and navigates with forms and links. It never imports the demo to fill a missing real value.

`/` opens the welcome dialog for a device without completed setup. Its state uses `view=setup`, `view.tab=place|preferences`, `filters.country`, `filters.query`, and `view.entity=place&view.id=…`. Place confirmation revalidates through the API, stores independent `mzizi-*` cookies, and redirects to the API's canonical country-prefixed path. Explicit device location is the one browser capability: coordinates are posted through a server action for resolution and the suggested place still needs confirmation. Coordinates are not included in public URLs.

`/[country]` and deeper place URLs resolve from the address, regardless of the saved place. This initial overview shows recorded child-place and citation counts, not prototype statistics. Unavailable data and unknown paths remain explicit. Optional `lang` overrides cookie preference; place links preserve an explicit language without adding it to cookie-only journeys. Interface translations may fall back to English and are labelled accordingly. Other subject screens remain migration work; a demo screen is not a connected production screen.

## Demo isolation and local preparation

All prototype code, ignored data, preparation scripts/inputs, downloaded documents/flags and the historical UI archive live under `src/app/demo/`. `_scripts/` contains the moved builders and their ignored `inputs/` and `geo-input/` folders. Paths are resolved from the scripts themselves, so a repository-root invocation writes only to the intended demo or shared icon directory. The local source-specific data builder remains ignored. `_data/` remains ignored except ambient declarations; `_archives/` is ignored and excluded from TypeScript compilation.

Downloaded files live in ignored `_assets/flags/` and `_assets/sources/`. Demo-owned route handlers preserve `/demo/flags/<file>` and `/demo/sources/<file>`; the worker/offline page are served from tracked `_assets/sw.js` and `_assets/offline.html`. Routes reject path traversal, return proper media types and 404 when a local download is missing. Next output tracing includes these files for demo deployments. There is no `public/demo/` or web-root `scripts/` folder.

`public/icons/` contains shared app identity assets. The small root `/sw.js` retirement guard remains public to unregister the previous root-scoped prototype worker before it can intercept real pages; it serves no demo content.

There are no active automated web tests at this stage, by owner direction. The stale `test/` compile assertions and prototype test files have been removed. Verify visible behaviour in the browser; type-checking remains a code-quality check. Do not introduce web tests until the owner asks for them.
