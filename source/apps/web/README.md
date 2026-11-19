# Mzizi web

Handwritten Next.js App Router UI using TypeScript, Tailwind CSS and Bun. The welcome page is `/`; the explorer uses `/[country]/[[...place]]` with query-based subjects, alongside personal and help pages. Screens currently use local prepared/demo data; backend integration is pending.

Run from the repository root:

```sh
bun run dev web
bun run build --only web
bun run typecheck --only web
bun run start web
```

The default address is http://localhost:3300. Install workspace dependencies with `bun install --cwd source`. Tailwind is imported in `src/app/globals.css` and compiled by the Tailwind Turbopack loader.

The previous implementation is preserved in `_archives/` and excluded from TypeScript compilation. It is historical reference, not active application code. Dryv app generation may overwrite the starter; run it only when intentionally replacing this scaffold.

## Accessibility commitments

Every page and component follows these rules (also published on the Help page):

- Semantic HTML first: one heading outline, landmarks (`nav`, `main`, `aside`), real table headers, and `aria-sort` on sortable columns.
- Every icon-only control has an `aria-label`; every chart (`role="img"`) and map (`role="group"`) has a text label; images need alternative text.
- Sheets and dialogs use the shared shells in `src/components/shells.tsx`: focus trap, Escape to close, focus restored, `aria-modal` and a labelled title.
- Colour is never the only signal. Contrast modes (high contrast, high contrast light, yellow on black, black on yellow), text size, spacing, link underline and reduced motion are in the settings menu and override every palette, including charts and the map.
- Voice: speech input and output use the browser's Web Speech API; controls are in the settings menu and the search boxes.
- Keyboard: `/` opens search, `Ctrl+B` toggles the sidebar, and every popover is reachable and closable without a mouse.

## Language rule

When the language changes, every part of the page and its content must be in that language. Where something is not translated:

- A notice at the top of the page says that the language is selected, what is translated on that page, what is not, and why (no translation has been loaded for it). See `src/components/language-notice.tsx`.
- The untranslated text is shown in English, marked as English, and never silently mixed in.
- Evidence is never machine-translated and presented as the source. Where a translation exists in the seed (for example the Swahili Constitution, `translations.csv`, URAIA translation, unofficial, review pending), that translation is shown: in Kiswahili the Constitution reader and quick-view sheets show the Swahili text, provision by provision, with English fallback marked "English only".
- Local-language options in the switcher are listed as "Coming later" until content exists.
- The language comes from `?lang=`, then the `mzizi-lang` cookie, then English.

## Navigation, scroll and URL state

Full rule: `.docs/rules/web-navigation.md`. In short: the path is the place, the query is the subject and its selections, the `#section` is where you are reading. Switching place, filters, sort, tabs or language never scrolls back to the top and keeps the section in the address; sections have stable ids; use `useNav()` rather than the router directly.

## Brand and installable app

- **Mark and sitemark:** `src/components/logo.tsx`. The identity is the shape (an M whose middle stroke is a trunk forking into roots) and the way the name is lettered (soft Fraunces, seed-dotted i’s), never a colour. Everything is drawn in `currentColor`, so all palettes, light, dark and contrast modes work with no variants.
- **Favicon and icons:** `src/app/icon.svg` (adapts to light and dark tabs), `src/app/favicon.ico`, `src/app/apple-icon.png` and `public/icons/*`. Regenerate the raster icons with `bun scripts/build-icons.ts` (needs ImageMagick).
- **Install as an app:** `src/app/manifest.ts` (name, short name, icons including a maskable one, start page, shortcuts, theme colours), `public/sw.js` (offline shell: network first for pages, cached copy or `public/offline.html` when offline) and `src/components/pwa.tsx` (registers the worker in production and offers "Install Mzizi as an app" in the settings menu; on iOS it explains Share then Add to Home Screen). Installing needs HTTPS or localhost.

## Form controls

Every control comes from `src/components/controls.tsx` (React Aria underneath): `Select` (a searchable combo box for long lists), `Checkbox`, `Switch`, `Slider` and `TextField`. Do not use native `<select>`, checkbox, radio or range elements, or hand-rolled bordered inputs. The `TextField` wrapper draws the only focus outline.

## Flags

Country flags are the MIT-licensed [flag-icons](https://github.com/lipis/flag-icons) set (`flag-icons` dev dependency). Only the flags we use are copied into `public/flags/<code>.svg`, so nothing is fetched from another site. To add a country, copy its SVG from `node_modules/flag-icons/flags/4x3/` and add the country to `COUNTRIES` in `src/lib/route.ts` (with its ISO code and dial code).

## Flag palette

Choosing a flag colour in the theme switcher means "follow the flag of the country I am in". The palette is rebuilt for each country from its flag (`src/data/flag-colors.ts`, `src/lib/flag-palette.ts`), with the picked flag colour as the primary one. Every country starts at its dominant colour: the choice is cleared when the country changes. Choosing one of the three ordinary palettes switches following off.

## Code-only checkpoint and local data

The active UI is handwritten under `src/`; Dryv is intended to own backend contracts and generated API bridge clients, not these pages or their theme. The current Dryv application configuration and older guidance still need reconciliation before running frontend generation.

This checkpoint deliberately excludes `src/data/` content modules and generated datasets (except ambient type declarations), GeoJSON/TopoJSON, fixture/seed folders, local preparation inputs, flags, source documents and downloaded images. The source-specific `scripts/build-data.ts` preparation script stays local too. Files are ignored, not deleted. Logo code, the favicon and app/install identity icons are included, together with the icon-building utility.

Several views still import the ignored local data, and demonstration figures also remain embedded in prototype screens. They are not backend-connected or verified facts. Local typechecking uses those existing local files; it does not establish that the code-only checkpoint builds from a fresh checkout. Replacing these imports and illustrative values with generated-client responses is the next integration work. Do not solve missing imports by committing local datasets or silently substituting another place's data.
