---
{id: RULE-WEB-NAVIGATION,name: Web navigation and URL state,type: rule,tags: [web,navigation,accessibility,agent-guidance]}
---

# Web navigation, scroll and URL state

These rules bind every contributor and every AI agent working on `source/apps/web`. The implementation lives in `src/app/demo/_lib/navigation/route.ts`, `src/app/demo/_lib/navigation/scroll.ts`, `src/app/demo/_lib/navigation/use-ctx.tsx` and `src/app/demo/_components/navigation/scroll-keeper.tsx`.

## The URL is the state

- The path identifies a place (`/demo/ke/nairobi/westlands`). The query chooses what to show about it: `view`, `view.*`, `filters.*`, `sort.*`, `page.*`, `display.*` and `lang`.
- The **hash** (`#population-growth`) records where the reader is on the page. It is part of the shareable address.
- Back and Forward must restore every one of these.

## Scroll must never be lost by navigating within a subject

IMPORTANT. Changing the place, a filter, a sort order, a tab or the language **must not scroll the reader back to the top**, even when the reader is at the bottom of a long screen (a chart, a map, a table).

- Every programmatic navigation inside the explorer uses `router.push` or `router.replace` with `{ scroll: false }` and calls `keepScroll()` first. Use `useNav()` (`goPlace`, `set`, `href`) instead of calling the router directly.
- Plain `<Link>` navigation to the same subject (same `view`) is intercepted by `ScrollKeeper`: it keeps the scroll position and the hash. Do not add a custom click handler to work around it.
- While the next place loads the page may get shorter. `ScrollKeeper` holds the position until the content settles, and gives control back the moment the reader scrolls, touches or presses a key.
- A **different subject** (a sidebar link) starts at the top, or at the `#section` in its link.

## Sections carry ids

- Every section a reader can scroll to has a stable `id` and `data-section`. `Panel` generates it from its title; give a section a different `id` only when two titles would collide.
- `ScrollKeeper` updates the hash as the reader scrolls (`history.replaceState`, never a new history entry) and clears it at the top of the page.
- A link with a hash opens at that section, waiting for streamed content to arrive.
- Place, filter, sort and tab switches keep the current hash. Links to another subject do not.

## Checks before merging a web change

- Open a long view, scroll to the bottom, switch place from the map and from the location switcher: the position holds.
- Copy the address while reading a lower section, open it in a new tab: it opens at that section.
- Back returns to the previous place and position.

## Welcome page, disabled links and hashes

- `/demo` and `/demo/me` belong to no country or place. They never call `setCountry` or change the theme or context; they only read the last place (`mzizi-demo-place`) to offer "Continue where you left off", and the theme follows the last active country so nothing flickers.
- Sidebar links are never removed. When a place does not support a link it is shown greyed out and disabled, with a plain explanation of why (`whyUnavailable` in `src/app/demo/_lib/navigation/route.ts`).
- A `#section` carried across a place or tab switch is validated once the page settles. If the destination has no such section the hash is removed, so the address never names something that is not there.

## Preferences in cookies, painted by the server

- Preferences live in one cookie per topic, not localStorage: `mzizi-demo-theme` (mode, palette, base palette, picked flag colour with its country), `mzizi-demo-a11y` (contrast, text size, option letters), `mzizi-demo-side` (sidebar mode and width), `mzizi-demo-groups` (closed sidebar groups), `mzizi-demo-place` (last place), plus the existing `mzizi-demo-lang`, `mzizi-demo-home` and `mzizi-demo-hide-count`. Codecs are in `src/app/demo/_lib/preferences/pref-cookies.ts`; the values are short positional strings, so they stay a few tens of bytes (general compression would make them longer).
- The server (`src/app/demo/_components/layout/shell.tsx`, `src/app/demo/_lib/server/server-prefs.ts`) reads them and renders sidebar width and mode, sidebar links, closed groups, the active link, the flag palette `<style>` and the last place in the first HTML. A tiny script in `<head>` sets colour mode, palette, contrast, text size and display options on `<html>` from the same cookies before first paint. Only the system colour scheme needs the browser, so it is the one value resolved there.
- Never add a new preference to localStorage if it changes what the page looks like. Add a cookie and a codec, read it in `readPrefs()`, and seed it through `PrefsInit`. `migrateLegacy()` copies old localStorage values into cookies once.
- The sidebar minimise button lives in the sidebar header (expanded to minimised). In the minimised rail the mark becomes the expand button on hover. The app bar shows the open button only when the sidebar is completely hidden (or below the large breakpoint).

## Onboarding and colour choice

- Setup opens by itself on the first visit and asks the device for its location straight away, after reading the country from the connection headers (`/demo/api/locate`). Denied or blocked location falls back to the connection, then to the map and lists. A late location result never overwrites something the reader already picked.
- The setup has a small OpenStreetMap map (`src/app/demo/_components/visualization/osm-map.tsx`). Clicking it, or using "Use my location", drops a pin and shows the detected county, constituency and ward. Tiles load only while the map is on screen. Constituency and ward are approximate until real boundaries are loaded.
- Theme: besides the three palettes and the country flag colours, the reader can pick their own colour. It is stored as the fifth field of `mzizi-demo-theme` and painted by the server like the flag palette.

## Permanent demo and real application boundary

The existing prototype remains permanently available under `/demo` until the owner explicitly decides to remove it. Its routes, `_components`, `_lib`, `_view`, `_data`, stylesheet and root document layout live together in `src/app/demo/`. The real application starts independently in `src/app/(app)/layout.tsx`, with `/`, `/[country]` and `/[country]/[...place]`. The first real slice uses the generated explorer API for welcome-dialog setup, explicit-country resolution and recorded geography/evidence coverage. Other subjects remain migration work. Never import prototype datasets, availability rules, financial examples or applicability inference into the real application.

Internal demo links and navigation stay under `/demo`; `#demo/*` resolves only to private demo files. Demo cookies use `mzizi-demo-*` names and `/demo` paths; local storage/events are separately named too. Its manifest, service worker, connection-header endpoint and downloaded assets are scoped to demo URLs. The demo worker must not intercept real-page navigation or clear unrelated caches. The root `/sw.js` only retires the previous root-scoped prototype worker. The demo worker route supplies its own scope header; the former country/view redirects are removed.

Crossing between the two root layouts performs a full document navigation, keeping the demo's fonts, theme scripts and CSS out of the real document. Migration means intentionally reimplementing a supported screen against generated backend clients and typed data, while preserving the working demo for comparison. A screen's existence in the demo is not proof that its data or rules are ready for production.


## Real backend setup and explorer

The real UI is handwritten. Dryv generates the backend boundary and shared API bridge client, not web screens or themes. Real server components call the generated feature-grouped explorer helpers. The package root exports only route definitions and types; server request helpers use explicit action imports.

The welcome dialog belongs to `/`, using `view=setup`, `view.tab=place|preferences`, `filters.country`, `filters.query`, and a selected `view.entity=place&view.id`. Confirming a place validates its country-bound identity through the API before storing independent device cookies and navigating to its canonical address. No account is needed. Browser coordinates are posted only after a device-location request; confirmation remains mandatory and late results are discarded after navigation. Public URLs do not contain coordinates.

The place address is authoritative over cookies. Registered routing roots and current canonical slug parentage define paths and breadcrumbs; they do not imply governmental authority or service coverage. Missing roots, ambiguous identities and unsupported views must remain explicit. The initial overview shows recorded children and citations, with coverage limitations. No prototype measures are substituted.


## Demo-only files and verification

Prototype preparation scripts and their local inputs live in `source/apps/web/src/app/demo/_scripts/`; fake/generated data stays in ignored `_data/`. Downloaded flags and source documents live in ignored `_assets/`, with demo-owned routes preserving their public URLs. The historical web UI is quarantined in ignored `_archives/` under the demo and excluded from compilation. Only shared branding and the root service-worker retirement guard remain in `public/`.

The owner requires browser verification for the web app at this stage. Do not add automated web tests until explicitly requested. The stale web `test/` folder and active prototype test files are removed; existing backend/SDK tests are unaffected.
