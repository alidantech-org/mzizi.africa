---
{id: RULE-WEB-NAVIGATION,name: Web navigation and URL state,type: rule,tags: [web,navigation,accessibility,agent-guidance]}
---

# Web navigation, scroll and URL state

These rules bind every contributor and every AI agent working on `source/apps/web`. The implementation lives in `src/lib/route.ts`, `src/lib/scroll.ts`, `src/lib/use-ctx.tsx` and `src/components/scroll-keeper.tsx`.

## The URL is the state

- The path identifies a place (`/ke/nairobi/westlands`). The query chooses what to show about it: `view`, `view.*`, `filters.*`, `sort.*`, `page.*`, `display.*` and `lang`.
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

- `/` and `/me` belong to no country or place. They never call `setCountry` or change the theme or context; they only read the last place (`mzizi-place`) to offer "Continue where you left off", and the theme follows the last active country so nothing flickers.
- Sidebar links are never removed. When a place does not support a link it is shown greyed out and disabled, with a plain explanation of why (`whyUnavailable` in `src/lib/route.ts`).
- A `#section` carried across a place or tab switch is validated once the page settles. If the destination has no such section the hash is removed, so the address never names something that is not there.

## Preferences in cookies, painted by the server

- Preferences live in one cookie per topic, not localStorage: `mzizi-theme` (mode, palette, base palette, picked flag colour with its country), `mzizi-a11y` (contrast, text size, option letters), `mzizi-side` (sidebar mode and width), `mzizi-groups` (closed sidebar groups), `mzizi-place` (last place), plus the existing `mzizi-lang`, `mzizi-home` and `mzizi-hide-count`. Codecs are in `src/lib/pref-cookies.ts`; the values are short positional strings, so they stay a few tens of bytes (general compression would make them longer).
- The server (`src/components/shell.tsx`, `src/lib/server-prefs.ts`) reads them and renders sidebar width and mode, sidebar links, closed groups, the active link, the flag palette `<style>` and the last place in the first HTML. A tiny script in `<head>` sets colour mode, palette, contrast, text size and display options on `<html>` from the same cookies before first paint. Only the system colour scheme needs the browser, so it is the one value resolved there.
- Never add a new preference to localStorage if it changes what the page looks like. Add a cookie and a codec, read it in `readPrefs()`, and seed it through `PrefsInit`. `migrateLegacy()` copies old localStorage values into cookies once.
- The sidebar minimise button lives in the sidebar header (expanded to minimised). In the minimised rail the mark becomes the expand button on hover. The app bar shows the open button only when the sidebar is completely hidden (or below the large breakpoint).

## Onboarding and colour choice

- Setup opens by itself on the first visit and asks the device for its location straight away, after reading the country from the connection headers (`/api/locate`). Denied or blocked location falls back to the connection, then to the map and lists. A late location result never overwrites something the reader already picked.
- The setup has a small OpenStreetMap map (`src/components/osm-map.tsx`). Clicking it, or using "Use my location", drops a pin and shows the detected county, constituency and ward. Tiles load only while the map is on screen. Constituency and ward are approximate until real boundaries are loaded.
- Theme: besides the three palettes and the country flag colours, the reader can pick their own colour. It is stored as the fifth field of `mzizi-theme` and painted by the server like the flag palette.
