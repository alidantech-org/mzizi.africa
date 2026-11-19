---
id: HANDOFF-DELIVERY-STATUS-20261119
name: Delivery status after phase A and the first part of phase C
type: handoff
tags: [delivery, status, api, database, handoff]
extra: {status: in_progress, date: 2026-11-19, plan: backend-web-dev-delivery-plan}
---

# Delivery status (2026-11-19)

Plan: [backend-web-dev-delivery-plan](../_plan/guides/backend-web-dev-delivery-plan.md). Task group "Backend, API, web and dev delivery"; the Flutter task is blocked on the web task.

## Done and verified

| Phase | Item | State | Evidence |
| --- | --- | --- | --- |
| A | Database restarted from migrations at day one, database `mzizi_ux`, 148 tables | done | `db status` shows 2 releases; `dryv:database:verify` passes |
| A | `filesystem.contents.slug` removed; addresses are `source.slugs` rows | done | 5,922 slug rows loaded |
| A | Seed: 66 new schemes with about 500 values (proposed), Kenya geography levels, countries context columns | done, awaiting owner review | `mzizi-manifest data seed` 0 problems |
| A | Dev data for every new table that visitors do not create | done | 372,507 rows loaded: 28 events, 47 occurrences, 3,711 facilities, 1,353 polling stations and polls, 9,916 station and other results, 4 bills with stages, 188 reports, coverage rows |
| C | Hand-written reads moved off the removed schemas (`activities`, `facts`, `contents.slug`) | done | API typechecks; `/v1/motions`, `/v1/leaders/tree`, `/v1/elections`, `/v1/institutions` return data from `mzizi_ux` |
| move | `source/ui` to `source/sdk/ui` | done | web typecheck clean |

## Known breakage (expected, owned by later phases)

- `GET /v1/facts` is gone (the generated controller no longer has it); fun facts are content of the `fun-fact` category and need a composed read in the API contract (phase B). The web `fact-strip` and the Flutter facts screens call the removed operation.
- Content is addressed by subject or by the new clean slugs, not by the old `institution/iebc` style; the web content pages must change with the address map (phase E).
- The hand-written reads still return `dynamic` shaped JSON; replacing it with typed sections is phase B.

## Not started (in order)

Phase B (typed sections, composed reads, metric engine, context and slug operations, interactions), the rest of phase C (full regeneration with actions, manifest, every operation exercised), phase D (Dryv frontend capabilities in the TypeScript author), phase E (web app), phase F (dev app), phase G (Flutter, after the web app is verified).

## Honest notes

- Phases B to F are weeks of work for a person; this run reached the end of phase A and the first part of phase C and stopped at a green gate rather than starting phase B half way.
- Browser verification of web pages and device runs have not happened because no new pages exist yet.
- Community rows (actors, devices, posts) are not seeded: visitors create them at runtime.

## Update: first slice of the new API and web shell (2026-11-19, later)

Done and verified in the browser against `mzizi_ux`:

| Item | State | Evidence |
| --- | --- | --- |
| Typed `experience` operations (context, calendar with countdown, facilities with capacity, facility detail with hosted polling stations, fun facts) authored in `dryv/contracts/apps/api/experience.ts`, regenerated, implemented in `modules/experience/**/reads` | done | API typechecks; `/v1/context?path=nairobi/westlands` resolves the place through `source.slugs`; `/v1/calendar` returns the 2027 countdown with its rule and milestones |
| Country resolution order (selection, CDN header when `TRUST_EDGE_COUNTRY=true`, development override, default served country) | done | implemented in `reads/context.ts`; the web server forwards `cf-ipcountry` |
| Abbreviations: `Name (ABBR)` for organisation names in lists and titles (shared `entityName`) | done in the API reads | institutions, parties and facility operators show `(IEBC)`, `(ODM)`, `(CRA)` |
| Web shell: sidebar of grouped sections, app bar with breadcrumbs, search and tools, place switcher, no footer (hand-written in `source/sdk/ui/web/src/shell`) | done | browser checks of home, calendar, place, infrastructure, facility and the earlier institutions page |
| New server pages through the generated SDK only: home (countdown, fun-fact carousel, upcoming events, then the earlier analytics), calendar, infrastructure, facility, and the place resolver `app/[...path]` with `/place/infrastructure` and `/place/calendar` | done | no browser `fetch` in the new pages |
| Hard-coded country removed from the home page (hero and headings take the country from context) | partly | other earlier pages still name Kenya |

Still to do for the web app, in order: type the remaining `dynamic` sections and replace the hand-written client reads and pages (`lib/site/*`, the client pages) with generated server pages; lead media (flags first), topic Explore, per-place finance, procurement and projects sections, politics, government, data and Me sections on the new address map; copy keys from the database instead of the in-code string tables; delete the old header, footer and mobile nav files; lint gates; verify every page. The dev app and Flutter app are untouched; the Flutter task stays blocked until the web app is verified.

## Update: shell redesign, server pages, copy from the database, Flutter alignment (2026-11-19, last)

Done and checked (HTTP 200 on every route; the pages named below also looked at in the browser):

- **Shell:** full-height sidebar on the left (logo, place card with flag, six main links, "More" for the rest, preferences and licences at the foot); the app bar and page sit on the right; no footer. Drawer on small screens. The old header, footer and mobile-nav files are deleted.
- **Theme:** the light theme is pure white (`oat`/`cream` are white in `dryv/contracts/schemas/theme.ts`, regenerated for web, dev and app); panels use thin borders instead of tinted glass; the mesh background is dark-theme only.
- **Reads:** `lib/site/insights.ts`, `lib/site/api.ts` and `lib/site/governance/reads.ts` call generated server actions; no hand code in the web app calls the API from the browser, and the `/v1` rewrite is removed. Seven pages (`/parties`, `/parties/[code]`, `/elections`, `/elections/place/[id]`, `/leaders/[id]`, `/projects/[code]`, `/parliament`) and `/explore` are server components that read on the server; every other route file is a server `page.tsx` that renders an interactive `view.tsx` leaf.
- **Copy:** `GetCopy` (contract, API read `reads/copy.ts`, SDKs) delivers `reference.copy` rows per language; the web layout loads them and `T`/`tr` use them; the in-code Swahili tables are gone. Keys: `web.word.*`, `web.phrase.<slug>`, `app.word.*`, `app.phrase.<slug>`; the dev rows come from `scripts/dev/dev_seed/data/copy.json` (development text). Stale rows from the first load stay as `web.retired.*`.
- **Context:** country name and currency come from the API context (`CountryProvider`, `Money`, `AppCountry`); flags come from the ISO code.
- **Gates:** `bun run frontend` fails on a browser `fetch`, a route handler or `"use client"` in a route file, and reports country, currency and colour literals (3, 1 and 3 left).
- **Dev app:** reads the engine through the generated `@mzizi/engine-client`; typechecks; all pages 200.
- **Flutter app:** analyzes clean, 26 tests pass, builds for web, and its home screen fetches copy, context and facts from the API (checked in the browser with Flutter web; the headless renderer is too slow to check every screen).

Not done (carried forward):

- The 82 `dynamic()` sections are still hand-parsed (`lib/site/governance/parse/documents.ts`, the insight shapes in `insights.ts`).
- About 20 pages remain interactive client views reading through server actions; they are not yet server-rendered end to end. Indicator codes and some section copy are still literals in `statistics` and `home-analytics`.
- Lead media beyond flags and initials, finance/procurement/projects/politics/Me redesign on the new address map, the Dryv component/navigation/address-grammar capabilities, and screen-by-screen visual checks of the Flutter app are not done.
