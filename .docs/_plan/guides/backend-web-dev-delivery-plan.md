---
id: DOC-BACKEND-WEB-DEV-DELIVERY-PLAN-20261119
name: Backend, web and dev delivery plan
type: documentation
tags: [plan, delivery, dryv, api, web, dev, autonomous]
extra: {status: approved_for_execution, date: 2026-11-19, flutter: deferred_until_web_verified}
---

# Autonomous delivery plan: backend and API, then web, then dev; Flutter last

Owner instruction (2026-11-19): work autonomously, editing Dryv and the contracts in this repository, generating, and editing whatever else is needed so that everything recorded in the handoffs works; finish and verify the backend and API first, then the web app with the new features, design and behaviours and no hard-coding; the dev app only changes to use generated SDK clients and loses client fetches and bad hard-coding; **the Flutter app is ignored until the web app is complete and verified**, and a Task is scheduled for it.

## Decisions recorded with this plan

- Component props are **authored in the contracts** (the component catalog), not read from component source.
- **Shells are hand-written** (sidebar, app bar, layout) in `source/sdk/ui` and imported by the generated templates; the generator does not write the shell, it binds data and slots to it.
- **TypeScript authoring is enough.** The new Dryv declarations are implemented in the TypeScript author and compiler only; the Python author does not get them and this is stated in the Dryv documentation.
- A **generated component gallery** (design review of every catalogue component with its typed props) is part of the plan.
- The dev data gains events, facilities, polling stations, obligations, coverage, community rows and slugs.
- `filesystem.contents.slug` is removed; content addresses live in the slug registry.
- The hand-written API reads that query removed schemas are migrated.

## Rules of work

1. Everything is authored in contracts and generated; hand code is limited to components and shells in `source/sdk/ui`, queries Dryv cannot yet express (each recorded as a Dryv gap), and project-owned scaffolds.
2. Every phase ends with its gates green and a commit on `develop`; the work is pushed at the end of each phase.
3. A gate failure is fixed before moving on; a gap in Dryv is fixed in the Dryv repository (separate commits that never include the owner's uncommitted Dryv files).
4. Seed data additions follow `seed/` rules (validators pass; invented data is tagged `dev` and never promoted to `seed/`).
5. Status layers per feature are recorded in the handoff: contract, generated, wired, validated, content available.
6. No browser `fetch`, no route handlers, no hard-coded country, indicator, colour or copy in any app.

## Phases

### Phase A: database finishing and data
- Remove `contents.slug`; generate slug rows for places, people, parties, elections, laws, content, projects, tenders, institutions, facilities and events (deterministic generator: clean name, kind or parent suffix only on collision, county-rooted paths, history rows).
- Seed indicators and metric definitions (the 17 hand-coded metrics become rows), copy keys with English and Swahili values, geography levels for Kenya (electoral and administrative ladders), display hints on values (icon, colour token, position), country context rows.
- Dev data: events (public holidays by rule, national days, general election milestones from the election date with a timetable schedule), seasons, calendars; facilities (offices of governors, county and constituency fund offices, schools, hospitals, police stations, courts, roads) with classes, capacity observations and operators; polling stations as features and facilities with polls and station-level electorates and results for the elections already seeded; reporting obligations and reports; coverage rows; community rows (actors, preferences, saved places, reactions, views, a few moderated posts, subscriptions).
- Gates: seed validators, `mzizi-engine seed` loads, row counts reported, `dryv:database:verify`.

### Phase B: API contract, queries and response shapes
- Replace all `dynamic()` sections with typed schemas and discriminated unions.
- Author the composed reads each screen needs (one call per screen) from the address map: context, home, place overview and its tabs, leaders and offices, politics (parties, coalitions, manifestos), elections (hub, kinds, year, contests, polling stations, results by level), government (institutions, law, parliament, sittings, bills, Hansard), finance, procurement (tenders, contracts, suppliers, buyers), projects, infrastructure (map, search, facility, nearest), calendar and events (including `.ics`), data (statistics, rankings from metric rows, compare, report card, coverage, sources, evidence, exports), search, copy delivery, preferences, saved places, reactions and views (web), subscriptions, posts and moderation (mobile client kind), notification delivery.
- Queries as data: the generic metric engine reads `statistics.metrics`; hand SQL remains only where Dryv cannot express it (spatial, tree walks), is typed, and is listed as a Dryv gap.
- Context middleware: host or path country, preference, device position, the Cloudflare country header (trusted only from the edge, development override), language; slug resolver with history redirects; client-kind rule (writes only from the mobile client).
- Gates: contract typecheck, doctor, compile, `database:check`, no `dynamic` left, API typecheck, API tests against `mzizi_ux`.

### Phase C: regenerate and finish the API
- Regenerate API, engine models and SDKs; run the post-generation actions on apply; fix every managed-file conflict at the source (contract or pack), not by hand edits.
- Migrate or replace the hand-written reads for the removed schemas; delete stale generated files of removed operations.
- Gates: API typecheck and tests, smoke run of every operation against `mzizi_ux`, manifest export, `dryv:verify` for every app.

### Phase D: Dryv frontend capabilities (TypeScript author)
- Component catalog with typed props; parts bound to components; hand-written shells imported by templates; address grammar and place scope; navigation (transitions with bindings, back, guards, redirects); context, intents, preference state, copy keys, page states, render mode; validation rules; projections for templates; gallery pack.
- `app-next` templates: server pages calling the server SDK, layout using the hand-written shell, breadcrumbs, place switcher, link builder, sitemap, canonical tags and hreflang; client leaves only for maps, charts, forms.
- Gates: Dryv tests for each new declaration, contracts compile, generated sample app builds.

### Phase E: web app
- Author every feature and view in the web contracts (home, places, leaders, politics, elections, government, finance, procurement, projects, infrastructure, calendar, data, me); regenerate; build the components the catalogue needs in `source/sdk/ui/web` and the shell; replace `lib/site/*`, the client pages and the hard-coded strings, names, colours and navigation; abbreviations, lead media, topic Explore, fun-fact carousel, coverage explainers, countdown, calendar, likes and views.
- Gates: typecheck, lint patterns (no `fetch`, no `"use client"` in pages, no literals for country or indicator), production build, run against the API on `mzizi_ux`, every page loaded and checked in the browser (server rendering verified, responsive, theme, accessibility checks), the five status layers recorded per feature.

### Phase F: dev app
- Switch to the generated server-only engine SDK; remove client fetches, the proxy route and hard-coded values; no other UI change.
- Gates: typecheck, build, the portal pages load against the engine.

### Phase G: Flutter app (scheduled, after phase E is verified)
- A Task already exists, blocked on the verified web app: regenerate the Flutter app from the same views, providers and repositories, remove hand-written duplicates, and verify on a device or emulator.

## Honest scope note

This is months of work for a person. The plan is executed in order; each turn of autonomous work ends at a gate with a commit, a push and a short report of what is done, what is verified, and what remains. Where something cannot be completed or verified in one run (the browser verification of every web page, device runs, large data sources that are not on this machine), the handoff says so.
