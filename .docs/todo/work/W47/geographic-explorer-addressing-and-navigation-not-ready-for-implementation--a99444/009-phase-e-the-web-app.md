---
{id: TSK-0CE2BE62D0CC,name: "Phase E: the web app",type: task,status: in-progress,priority: medium,created_at: 2026-11-18T22:29:04.846Z,updated_at: 2026-11-19T13:04:34.977Z,order: 9216,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T13:04:34.977Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0CE2BE62D0CC/1795093474980-start,started_at: 2026-11-19T13:04:36.675Z}]}}}
---

# Phase E: the web app

## Current owner-approved integration slice

The November 20 direction supersedes earlier web generation and planning-only prose below. Keep this same delivery programme: no second backlog. The web UI, theme, pages and navigation are handwritten. Dryv owns backend contracts, generated validation/controllers/service signatures, and the shared typed Next API Bridge client. Typed project-owned backend readers are allowed. App/dev generation and engine operations are outside this slice.

Implement anonymous setup in the welcome-page dialog, using registered country roots and canonical place slugs, country-scoped search and child-place reads, coordinate candidates requiring confirmation, independent device preferences, and a real place overview with honest recorded coverage. Preserve the permanent `/demo`; no prototype import or fallback dataset enters the real application. Do not add root seed inputs or reset a database. The remaining subject migrations in the broader programme remain open.

### Integration slice acceptance

- [x] Generate one shared route registry, grouped typed request helpers, compatibility re-exports and a client-safe routes/types barrel.
- [x] Generate and implement explicit-country bootstrap, context, search, children, coordinate and overview endpoints with validated named responses.
- [x] Connect the handwritten welcome dialog and canonical country/place pages through server-rendered generated-client reads.
- [x] Verify API scoping, identity errors, pagination, language/cookies, SSR and the complete setup flow; preserve `/demo` and record quality limitations.


## Goal

Rebuild the web app from contracts with every agreed feature, the new design and behaviours, full contextualisation and no hard-coding, verified in a browser against the seeded database. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and is now governed by the consolidated group readiness gate; no runtime work, commit or push is authorized yet.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Acceptance checklist

- [ ] Author every feature and view and regenerate the pages.
- [ ] Build the catalogue components and the hand-written shell in source/sdk/ui and delete lib/site, the client pages and the hard-coded strings, names, colours and navigation.
- [ ] Typecheck, lint patterns, production build and run against the API on mzizi_ux.
- [ ] Every page loaded and checked in the browser, with the five status layers recorded per feature.

## Consolidated ownership and readiness

This task becomes the single web migration and acceptance owner for the combined effort. It remains planned and authorized for implementation. Integrate country/place paths, grouped query state, optional language sharing, generated navigation, composed reads and duplicate-type removal per feature, rather than repairing the old route system before redesigning it. All work must consume approved Dryv capabilities and generated clients/types. The reported 40/45 HTTP routes and this chat's 43 page files are different measurements from different moments, not proof of a fixed route count or visual completion. Refresh the active inventory and baseline when implementation begins.

## Integrated acceptance checklist

- [ ] Migrate compare, election detail, finance and leadership product reads to server rendering; remove useAsync/effect-driven product reads and handwritten response duplicates in insights and governance adapters.
- [ ] Keep personal browser-only preferences/saved-item state and approved likes/view mutations distinct from product reads; preserve delivered interactions with regression evidence.
- [ ] Deliver each feature slice with its final country/place address, generated sidebar and copy, typed composed data, filters, details, evidence, maps/cards/search links and saved-link migration together.
- [ ] Rebuild the richer place overview and cover budgets, funds, politics, coverage, calendar, reports and utility pages; missing spending/debt/election inputs remain labelled gaps until approved data exists.
- [ ] Integrate nearest-facility and export screens when their generated API capabilities exist; do not link the browser directly to product API download endpoints as a workaround.
- [ ] Verify desktop/mobile rendering, keyboard/focus behaviour, direct and shared URLs, Back/Forward, search, pagination, language persistence, canonical metadata and source/evidence relevance.
- [ ] Run root quality checks, generation verification and browser network checks proving product reads occur on the server; report pre-existing failures and unverified deployment controls separately.
- [ ] Close every consolidated audit item with evidence or an explicit owner-accepted deferral, retaining external deployment and policy dependencies as unresolved until actually settled.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.

## Comments

### 2026-11-19T13:19:14.130Z · PETER IRUNGU

Implemented the contextual shell and generated catch-all, government structure presentation with position detail, grouped navigation, language-aware sharing, and SSR finance/comparison wiring. Initial likes, legal basis and explanatory content now load on the server; writes remain client-triggered. Browser proof at desktop1440/mobile390 verified ex officio selection, country prefix, ZA isolation, language cookie, canonical selected identity, and one active sidebar item. This is a partial foundation: search/place-switcher results, many contextual renderers, locally scoped applicability, diagrams and remaining client reads are unfinished. Do not accept the full web proof yet.

### 2026-11-19T21:30:02.228Z · PETER IRUNGU

Owner replaced the web UI and changed ownership: all UI/theme/pages are handwritten; Dryv remains responsible for backend schemas and generated bridge clients. Current request is a code-only Git checkpoint: retain local data on disk, ignore fake/prepared datasets, GeoJSON, flags and downloaded media; include reusable active source and app identity assets. Backend integration planning follows separately. Data-dependent pages are not a self-contained clean-checkout application until their local imports are replaced.

### 2026-11-19T21:40:44.320Z · PETER IRUNGU

Owner requested formatting the active handwritten web app with source/apps/web/.prettierrc. Apply Prettier to active src, reusable scripts, web configuration, README and offline/service-worker code, respecting the web gitignore so local data/media and archives are not formatted. Preserve existing owner edits to the explorer page and root dependency files.

### 2026-11-19T21:44:31.397Z · PETER IRUNGU

Owner requested component/lib organisation guidance and moving image assets out of src/app into public with correct manifest references. Move static favicon/SVG/Apple icons into public/icons; keep the theme-aware React logo as reusable component code. Update explicit Next metadata, manifest, icon builder, ignore exceptions and README. Broad source-folder reorganisation remains a proposal, preserving ongoing formatting and owner edits.

### 2026-11-19T21:46:02.746Z · PETER IRUNGU

Moved icon.svg, favicon.ico and apple-icon.png unchanged into public/icons. Layout metadata explicitly points to browser/Apple icons; manifest includes the SVG and existing PNG/maskable install assets. Updated build-icons output paths, Git ignore exceptions and README. Verified byte-identical moves, every manifest/metadata asset path exists, web typecheck, Prettier and whitespace checks. Existing localhost3300 is a previously built next start instance and still serves old generated metadata; no rebuild/restart or deployment was performed. Proposed responsibility-based components/lib grouping; did not perform broad folder moves.

### 2026-11-19T21:48:03.718Z · PETER IRUNGU

Owner authorised the proposed responsibility-based file grouping. Move shared components into brand/ui/layout/navigation/preferences/accessibility/visualization/media; group subject screens and private components under views/<subject>; group lib by navigation/preferences/charts/geography/formatting/server/accessibility. Move demo-backed applicability/comparison adapters beside their views without changing semantics. Rewrite imports including dynamic data paths, update live documentation, and verify local typecheck/format plus module resolution. Preserve ignored local data and existing edits.

### 2026-11-19T21:52:11.860Z · PETER IRUNGU

Completed responsibility-based regrouping:83 source files moved,69 files had module references rewritten; all304 local static imports/dynamic import directories resolve. Components/lib roots contain grouped folders; screens use views/<subject>/screen.tsx, with private components and shared explorer props/adapters scoped beside views. Updated README and navigation rule paths. Local web typecheck, Prettier, docs validation and whitespace checks pass. Isolated production build passes using existing local data; eight HTTP routes pass (welcome, KE, Westlands, leaders, chapter4 law, county finance, compare, ZA), and browser/Apple metadata plus every manifest icon resolves. Temporary verification server stopped; existing3300 production server untouched. No dataset/media acquisition or backend integration performed; no commit made.

### 2026-11-19T22:04:44.790Z · PETER IRUNGU

Owner authorised permanent side-by-side demo isolation: move all current UI/components/helpers/views/local data into src/app/demo with private _components/_lib/_view/_data folders, its own root layout/theme and /demo routes. Create a minimal independent (app) root layout and real country/place route skeleton without backend or demo dependencies. Remove legacy next.config redirects. Prefix demo navigation and content assets; isolate cookies/storage, manifest and service worker so demo cannot control real routes. Keep demo until owner explicitly removes it. Verify production build, direct routes and browser navigation; do not acquire or commit datasets.

### 2026-11-19T22:36:37.279Z · PETER IRUNGU

Owner approved backend/client integration plan: shared generated next-api-bridge client with one routes.ts and feature-grouped request helpers; handwritten UI and permanent demo; anonymous welcome-dialog setup with cookie preferences; typed custom backend handlers are allowed. Implement bootstrap/context/search/children/coordinate resolution and initial overview, preserve active consumers with generated compatibility exports, and stop web frontend generation. No root seed additions or database resets are authorised by this work.

### 2026-11-19T23:17:58.790Z · PETER IRUNGU

Implemented the first handwritten backend-connected slice: anonymous welcome dialog, country-scoped registered-place search/children/confirmation, canonical place overview, independent device cookies, optional language persistence and language-aware sharing. Browser setup redirects to /ke/nairobi/westlands and ward links preserve context. Product reads execute through generated server helpers. Six read-only live API acceptance tests and four SDK ownership/registry tests pass. Broader subject migrations remain open; no prototype data is used by real routes.

### 2026-11-20T07:16:27.254Z · PETER IRUNGU

Integration slice accepted locally: production web build passes; API/web/dev typechecks and SDK typecheck pass. Six live API tests previously passed against existing mzizi_ui without writes, and six SDK/navigation/boundary tests now pass. Browser proof covered anonymous setup, canonical Westlands redirect, wards, explicit Swahili links, cookie-only language journeys, sharing, mobile layout and isolated demo. SDK check regeneration was unchanged; backend enum retirement generated correctly. Full root suite remains non-green: existing manifest tests (8 failures), Python typing/lint and size issues; the early web type error was fixed and targeted checks pass. The runtime/log session was replaced during user steering, so the final full-suite and backend regeneration-check completion cannot be independently confirmed. Broader programme stays in progress; no commits or push.

### 2026-11-20T08:07:55.444Z · PETER IRUNGU

Owner explicitly requested committing all remaining active changes, including the existing web edits and planning documents. This is a working checkpoint, not a claim that frontend imports have been migrated to the newly committed resource SDK. Preserve ignored datasets, fixtures, flags, downloaded media, archives and build outputs; include reusable UI, identity assets, configuration, lockfiles and active documentation.

### 2026-11-20T08:08:40.347Z · PETER IRUNGU

All active remaining edits are being committed as explicitly requested, including permanent demo moves, real web routes, assets/ignore rules, formatting/dependencies, owner guidance and active planning notes. Documentation validation and staged whitespace checks pass. Web typecheck fails because real loaders/actions and compile assertions still import the previous SDK action paths/names; those imports need a later migration to the committed resource SDK. This commit is an active-work checkpoint, not a passing web release. Local datasets, flags, downloaded content, fixtures and build outputs remain ignored.
