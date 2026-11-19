# MUST-FIX: web app against the agreed documents

Audit written 2026-11-19 against `UI_INFORMATION_ARCHITECTURE.md`, `DEC-CONTRACT-FIRST-FRONTENDS-20261118.md` and `CONTEXT_AND_LOCALISATION.md`. Status after the work of the same day. ✅ resolved and checked in the running app, ◐ partly resolved, ⏳ not done. Nothing here is marked resolved without a check.

## 1. Addresses and hierarchy

- ✅ **Agreed addresses exist.** `/politics/parties`, `/government/{institutions,law,parliament}`, `/procurement/tenders`, `/data/{statistics,rankings,compare,sources}`, `/finance`, `/places`, `/me`, `/me/saved`, `/elections/<kind>/<year>`, `/leaders/<slug>`. Old addresses redirect permanently (`next.config.ts`). 40 routes were requested and all answer 200.
- ✅ **No ids in addresses.** Places, leaders and elections use slugs or kind and year. The API now returns each place's clean `path` and each person's `leaderSlug` on any response that names them (`place-paths.interceptor.ts`). `/data/evidence/<citation>` still carries a citation id because citations have no slug yet.
- ✅ **Place-scoped sections.** `/<place>/{places,leaders,elections,finance,data/statistics,data/compare,infrastructure,calendar}` render under the place (the catch-all page), not as redirects.
- ✅ **Scaffold pages removed** (`feature-browse`, `feature-detail`, `place-search`, `place-profile`, `evidence-view`, `source-browse`), their contract views, destinations and generated files. The contract no longer declares any view.
- ✅ **Sitemap, robots, canonical and language alternates**; `?lang=` applies and redirects.
- ◐ **Sections.** Built (2026-11-19, server pages over typed reads): `/finance/budgets`, `/finance/funds`, `/politics/coalitions`, `/politics/manifestos` (these two say "nothing recorded yet" because the data is empty), `/data/coverage`, `/events/<code>`, `/calendar/<yyyy-mm>`, `/<place>/report`, `/me/privacy` (draft for legal review), `/me/notifications` (says notifications are a mobile feature), `/help`. **Still missing:** Finance spending and debt (no `finance.debts` or appropriations rows), by-election, referendum, runoff and primary pages (no such elections are loaded; the route accepts any kind that exists), infrastructure "nearest" (needs a distance-ordered facilities read), `/data/exports` (needs a downloadable-file facility in Dryv; the web may not link to the API directly).
- ⏳ **Sidebar is a hand-written list** in `components/shell/app-frame.tsx`, not authored in contracts.
- ◐ **Place overview** at `/<place>` is a tile page. The richer profile (representatives, procurement, media) was removed with the scaffold place-profile and is not rebuilt.

## 2. Contract-first and server rendering

- ✅ **No browser `fetch`, no route handlers.** The frontend gate passes.
- ✅ **80 `dynamic()` sections are typed** from real responses as named section schemas; the governance hand parser (`parse/documents.ts`, 382 lines) and its test are deleted. 11 fields stay `unknown` because Dryv cannot express them: GeoJSON geometry, one keyed map (`counts`), and a few fields that were empty in every sample (`fund`, `money`, `portrait`).
- ◐ **Hand-written duplicates remain:** `lib/site/insights.ts` (about 650 lines) and `lib/site/governance/contracts.ts` still declare shapes the SDK now generates. Replacing them with the generated types is mechanical and not done.
- ◐ **Server rendering.** Client views fell from 24 to 6: `data/compare`, `elections/<kind>/<year>`, `finance`, `leaders` (tree), and `me` and `me/saved`, which hold the visitor's own choices in the browser by nature. The statistics explorer, rankings, sources, place statistics and the place sections are server pages with small client leaves. The remaining views read through generated server actions from the browser; none uses `fetch`.
- ⏳ **No composed reads.** One authored read per screen is not built.
- ⏳ **Dryv frontend capabilities** (component catalog, address grammar, navigation as data, page states, gallery) are not started. This is the root cause of the hand-written pages.

## 3. No hard-coding

- ✅ **Country, currency and colour literals: zero** (the gate reports 0, 0, 0). Map colours come from the theme.
- ✅ **Indicator and metric codes** are gone from the web code (the gate fails if one returns). Indicators carry a role (`population`, `density`, `area`: scheme `sta.indicator.role`, approved by the owner 2026-11-19) and the screens ask for a role; the default and highlighted rankings are the first of the domain the API lists. The API reads derive them from the role too (`hasRole` in `reads/shared.ts`; roles: population, area, registered-voters, facility-capacity; the derived density is `derived.density`). The metric catalogue itself (17 definitions with their SQL, some with year literals) is still code, not rows.
- ⏳ **Level lists** (`county`, `constituency`, `ward`) in rankings and finance; the Explore topics and the sidebar groups are lists in code.
- ⏳ **About 40 English strings** in view files bypass the copy system.

## 4. Layout

- ✅ Sidebar and app bar layout, no footer, legal links in the sidebar foot.
- ✅ **Place switcher.** A slim chip at the top of the sidebar (flag, place or country name, Change) opens the place search; changing place keeps the current section for every place-scoped section.

## 5. Context

- ✅ **Cloudflare header rule checked** against the running API (2026-11-19): with `TRUST_EDGE_COUNTRY` unset, a `cf-ipcountry` header (TZ, XX or none) changes nothing and the source is `default`; with it set to `true` a known country is used and an unknown one is ignored with a gap message; the development override is switched off when `NODE_ENV=production`. Every country-dependent page is dynamic (`force-dynamic`), so no shared cache crosses countries or languages.
- ⏳ **Deployment, not code:** the origin must accept traffic only from Cloudflare (authenticated origin pulls, a tunnel or an allow-list), otherwise anyone can forge the header; `TRUST_EDGE_COUNTRY=true` must be set only behind that.

## 6. Interactions

- ✅ **Likes and views on the web.** `GetEngagement`, `Like`, `Unlike` and `RecordView` are authored in `dryv/contracts/apps/api/interactions.ts` and generated; the web keeps a random device id in an httpOnly cookie and the API stores only salted hashes (devices, actors, one view per visitor per day by a daily-rotating hash). Likes are shown with a count on projects, leaders, parties and places; views are counted and not shown (owner decision). The API refuses any table outside a short whitelist, and the web has no other write.
- ⏳ **Still to decide for interactions:** retention periods, the consent wording per country, and the account-linking option, all in `USER_INTERACTIONS_AND_TRUST.md` (open questions).

## Ground rules from the audit

- The Hierarchy and slug design stays as written in `UI_INFORMATION_ARCHITECTURE.md` sections 13 to 15.
- The remaining work is recorded here and in `.docs/handoffs/HANDOFF-DELIVERY-STATUS-20261119.md`; it is not reported as done anywhere.
