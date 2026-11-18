---
id: HANDOFF-HARDCODING-AND-CONTEXT-AUDIT-20261118
name: Hard-coding audit - what the UI hard-codes, why it proves the backend is not generic enough, and how to automate it away
type: handoff
tags: [frontend, backend, dryv, hardcoding, localisation, context, sdk, audit, handoff]
extra: {status: open_for_agreement, date: 2026-11-18, extends: HANDOFF-FRONTEND-CRITIC-20261118, code_changes: none}
---

# Hard-coding and context audit (2026-11-18)

Documentation only. No code, contract or pack was changed. This extends [HANDOFF-FRONTEND-CRITIC-20261118](HANDOFF-FRONTEND-CRITIC-20261118.md) and the existing proposal [neutral-platform-and-reference-driven-localisation](../_plan/guides/neutral-platform-and-reference-driven-localisation.md), which this audit shows was not carried into the insights API or the apps.

## 0. The principle recorded from the owner

1. **Every hard-coded thing in the UI is evidence that the backend and database are not yet powerful or generic enough.** The fix is a more generic backend with advanced contextualisation, never a UI constant.
2. **Context is a backend concept.** Country, concept vocabulary, administrative levels, currency, language, number and date conventions, and the region the user is in must come from the system, resolved from (in order of the user's authority): a manual selection, a saved preference, the device position, the network address, and finally a configured default.
3. **Every frontend-to-backend request goes directly through the generated SDK client.** One screen needs one authored operation. The UI never calls ten endpoints and stitches them, and never has a hand-written "server assembly" function.
4. Dryv contracts must be able to author "the thing the screen needs" directly (a screen-shaped read, with its context, its server-side behaviour and its states), and the packs generate the page, the SDK call and the types from it.

## 1. Findings: hard-coding in the web app (`source/apps/web`)

Counts come from a search of `app`, `components` and `lib` (generated `lib/api` and `lib/types` excluded unless stated).

| # | What is hard-coded | Where | What it proves the backend lacks |
| --- | --- | --- | --- |
| H1 | The word "Kenya", "KSh", "county", "constituency", "ward", "MP" and similar: 75 lines in the pages, plus 26 in the phrase table. `app/page.tsx` ("Kenya at a glance", "Where people live"), `statistics/page.tsx` ("Kenya in numbers", "Kenya's population over time"), `browse-view.tsx`, `leader-tree.tsx`, `fact-strip.tsx`, `site-header.tsx`, `site-footer.tsx`, `primitives.tsx` ("One of the 47 counties, each run by an elected governor.") | web | No "current country/context" object that carries its name, adjectives, currency, level names and civic vocabulary |
| H2 | The ladder of levels: `NEXT = { country: "counties", county: "constituencies and towns", constituency: "wards", ... }` | `components/site/browse-view.tsx:14` | Administrative levels per country, with plural labels and what is below each, are not served; they are dated reference data |
| H3 | Indicator codes used as story logic: `"sta.population.total"`, `"sta.population.density"`, `"sta.area.km2"`, `"civ.projects.per-100k"` | `app/page.tsx`, `app/statistics/page.tsx`, `app/statistics/[id]/page.tsx`, Flutter `home_screen.dart` | No notion of a "headline indicator" or "key facts of a place" resolved by the backend per country and level |
| H4 | A second hand-made indicator list `EXTRA` (title and unit written by hand) | `app/statistics/page.tsx:15` | The metric catalogue API does not return every indicator with title, unit and display hints |
| H5 | The default level `"county"` for maps and boards, `"constituency"` for rankings | `app/page.tsx`, `app/statistics/page.tsx` | "Which level should this country show by default" is not data |
| H6 | The whole navigation: `MAIN` and `MORE` arrays of routes, words and icons; a second `MORE` array on the home page with English titles | `components/site/site-header.tsx`, `app/page.tsx` | Navigation and features per country and role are not authored in Dryv or served; a country without elections or tenders data still shows the tabs |
| H7 | Interface strings: 147 keys in `lib/site/i18n.tsx` and a 205-entry Swahili table `lib/site/phrases.ts` keyed by the English sentence; only `en` and `sw` exist in a union type (`type Language = "en" | "sw"`) | `lib/site` | The API already has `ListLanguages`; interface strings are not content in the database or generated from contracts, so adding a language means editing code |
| H8 | Label maps for kinds and platforms: `PLATFORM_LABEL`, `ICON`, hemicycle `COLOUR`/`LABEL` ("Voted yes", "Abstained"), `STATUS_COLOUR` for projects | `ui/media.tsx`, `global-search-box.tsx`, `ui/hemicycle.tsx`, `map/projects-map.tsx` | Reference values have labels per language but no display hints (icon, colour token, order) |
| H9 | Two map colours as raw hex (`#b4542f`, `#c68a2e`) | `components/site/map/place-map.tsx:56-57` | The theme contract is not reachable from the map layer |
| H10 | Chart palette array `PALETTE` | `components/site/ui/charts.tsx:83` | The theme has no categorical palette token set |
| H11 | Number and currency formatting written for Kenya: "KSh", compacting rules | `lib/site/format.ts`, `lib/site/phrases.ts` | Currency and number format conventions are not read from the reference values and the active locale |
| H12 | Language and theme preference, saved places and likes in `localStorage` (`i18n.tsx`, `theme-toggle.tsx`, `saved.tsx`) | `lib/site` | No user-context / preferences operation; a signed-in user cannot carry them across devices; the server cannot render in the user's language |
| H13 | `navigator.geolocation` is called in two components (`civic/page.tsx`, `locate-button.tsx`) and the position is stitched manually to a second request | web | No one operation of the form "resolve my context (position, IP, selection) and give the place"; no IP fallback anywhere in the stack |
| H14 | Free text in pages: gap messages, empty states, headings, chips ("Responsible", "Your place", "Leadership here", "No smaller places are recorded...") | all pages | Copy is not authored with keys and per-language values |

## 2. Findings: UI assembling several endpoints (breaks principle 3)

- **Home page (`app/page.tsx`)**: eight independent `useAsync` reads in one page (statistics of the chosen place, root place, population series, density map, elections, open tenders, project board, facts). The page waits on the first to build the second (`series` depends on `root.state`). This is a hand-made orchestration of at least eight operations in the browser.
- `app/statistics/page.tsx` (5 reads), `app/civic/page.tsx` (3), and per-component reads in `browse-view`, `leader-tree`, `fact-strip`, `election-timeline`.
- `Compare` on the home page calls `statisticsOf(id)` and then searches `topics.flatMap(t => t.indicators).find(i => i.code === ...)` in the response: the page re-implements "pick the headline numbers" because the response is open JSON.
- `web/lib/site/insights.ts` (779 lines) exists to type the 83 `dryv.dynamic()` fields of `dryv/contracts/apps/api/insights.ts`. Anything `dynamic` is an unfinished contract; the typing then lives in the UI.

Consequence: each screen is a client-side orchestration problem. What is needed is **screen-shaped operations** (one read, one document, server-composed) and **intents** (see section 5).

## 3. Findings: hard-coding inside the backend itself

The "real" fix cannot stop at the UI, because the same constants live in the hand-written insights reads.

- `source/backend/api/src/modules/insights/features/insights/reads/` is 1,316 lines of hand-written SQL composition (`leaderboards.ts`, `statistics.ts`, `elections.ts`, `civic.ts`, `leader.ts`, `tree.ts`, `browse.ts`, `search.ts`, `activity.ts`, `facts.ts`, `nearby.ts`, `shared.ts`). The decision DEC-FRONTEND-ASSEMBLY #6 allows hand-written "query logic Dryv cannot express"; here it grew into the main product reads.
- `leaderboards.ts` holds a catalogue of 17 metrics in code: codes, titles, units (`"KSh"`, `"per km²"`, `"%"`), descriptions in English ("Ballots cast ... in the 2022 general election (county governor or constituency member contest)"), SQL snippets with seed code prefixes (`sta.ind.`, `ref.val.fin.expenditure.class.salaries`). It should be rows (indicator and metric definitions with per-language labels, units and display hints) read through one generic engine.
- `elections.ts`: office kinds mapped to levels (`kind === "member-of-parliament" ? "constituency" : "county"`), the gap message "County and constituency results are available; ward results are not published", fields named `votes2022`, `fundAllocationKes`, `amountKes`.
- `statistics.ts:100`: "check the Kenya National Bureau of Statistics county abstracts yourself".
- `shared.ts`: `pol.par.ke.party.uda`-style code rewriting, fixed buffer sizes by kind (`county: 0.012, constituency: 0.004, ward: 0.0015`), the indicator code prefixing rule (`sta.ind.`).
- `leader.ts:43`: a regex on the office title (`/constituency|member of parliament/i`) decides behaviour.
- Responses carry English sentences (gaps, descriptions) built in code, so the SDK clients cannot localise them.
- The schema is more generic than the reads: `Country` (reference) is linked from governance, official, civic, accountability and auth scope rows; currencies are reference values (`currencyId`); amounts are minor units. The reads ignore all of this and assume one country, KES and fixed levels.
- No operation takes a country or a context. `languageCode` is an optional input on some reads; no read takes country, level set, currency or locale.
- Server-side detection does not exist: a search of the API source finds no use of `x-forwarded-for`, IP geolocation, `Accept-Language` or a user preference store.

## 4. Findings: Flutter, admin, dev, mobile

- **Flutter `app`**: about 93 lines naming Kenya, KSh, county or constituency, indicator codes written as literals in `home_screen.dart` (`'sta.population.density'`, `'civ.projects.per-100k'`, `'sta.population.total'`, `'sta.area.km2'`), 45 hard-coded colours or font sizes, 219 lines of hand-keyed strings (`presentation/i18n/strings.dart`), `UserStore` and `SavedStore` singletons holding language, theme and saved items locally. The same orchestration problem as the web home page.
- **`mobile`**: its own `http` client, its own colours (`theme/app_colors.dart`), no shared theme.
- **`admin`**: a hand-written API wrapper with a default `http://127.0.0.1:8700`, its own UI kit, `json/` folder; route handlers for OIDC. All of its behaviour is outside Dryv.
- **`dev`**: hard-coded forward allow-list and default engine URL in `app/api/engine/[...path]/route.ts`; an unauthored `/health` type (`EngineHealth` written by hand in `lib/portal/engine.ts`).

## 5. What the contracts need to be able to author (Dryv capability gaps)

The owner's requirement: UI needs one direct thing. These are the Dryv/pack capabilities that do not exist today (or exist only as proposals in `dryv-frontend-proposals.md`) and must be proven or built **in Dryv**, not worked around:

1. **Screen-shaped operations ("view reads")**: an operation whose output is the composed document a screen needs, authored as a composition of other reads or of query definitions, with typed sections (no `dynamic`). Dryv generates the NestJS handler composition (or the repository plan), the SDK method and the types. The UI calls one method.
2. **Authored queries instead of hand-written SQL**: metric/indicator definitions, rankings, comparisons and trees authored as data or contract queries, executed by a generic engine, not coded per metric.
3. **A context concept** (see section 6) as a first-class authored type that every read can declare it needs (country, level set, currency, language, locale, region, time), resolved by one generated middleware or interceptor, passed to the SDK by a generated header or option, and resolved server-side when the page renders.
4. **Intents and behaviours on the app contract**: named user intents ("find my place", "compare", "save a place", "switch language", "follow the leader tree") with the operation they call, the state they change, their loading, empty, error and gap states, and their route. Features group views, intents and navigation; apps have many files.
5. **Navigation and feature availability as authored data** (per country and role), emitted to the router, header and tab bar.
6. **Copy**: keys declared in the contract (or discovered from views), values stored per language (database or Dryv-managed files), delivered through the SDK, not through a string table in the app.
7. **State and preferences**: authored preference types (language, theme, region, saved items), with a storage target (device, account), and generated providers (Riverpod) and server cookies/session reads (Next.js).
8. **Display hints on reference data**: icon, colour token, order, short label and formatting for reference values, indicators and kinds, so the UI never keeps label maps.
9. **Server rendering semantics**: a view declares `render: server` by default and which parts are client-interactive; packs generate server pages that read through the SDK. Client leaf components only for maps, charts and forms.

## 6. Context model to design (backend and database)

Goal: heavy, generic contextualisation to country, concept and region, resolved from the user's place, manual selection or network address.

- **Context object** (authored once, returned by one operation and consumed by all reads): `countryRefId`, `regionFeatureId` (the unit the user is "in"), `languageCode`, `locale` conventions, `currencyId`, time zone, administrative level labels, vocabulary set, headline indicators, enabled features, source of the resolution (`selection`, `preference`, `device_position`, `ip`, `default`) and a confidence/gaps flag.
- **Resolution order**: manual selection > saved account preference > device position (point-in-polygon on the geographic features that already exist) > IP geolocation > configured default country. The response always says which step decided it so the UI can offer "Not here? Change".
- **IP detection**: needs a decision on source (a local IP database file or a service) and a privacy rule (store nothing, or a coarse region only). See questions.
- **Concept vocabulary per country**: level names, office names, election kinds, party and fund concepts as reference values with country scope and per-language labels (the schema already has `Country` and `Value`); a "concept map" between countries (for example "county" and "district" at the same depth) so comparison across countries works.
- **Dated administrative structure**: levels and parentage are dated relationships already (see DEC-GEOGRAPHY-FEATURES). The reads must use them instead of the words "county", "constituency", "ward".
- **Indicator and metric definitions** as data: code, title and description per language, unit and currency, direction (higher is better), applicable levels per country, source, display hint.
- **User context storage**: a preferences table (or account-less cookie contract) with a server read so server-rendered pages start in the right language, country and region.
- **Gaps stay explicit**: when the system has no data for a country or level, the document carries a structured gap (code and parameters), not an English sentence.

## 7. Where automation can remove the hard-coding

| Opportunity | Mechanism | Removes |
| --- | --- | --- |
| Generate interface copy catalogue from the contracts and store values per language | Dryv collects keys from views and intents; a pack generates the key file and the SDK reads values from the API | H7, H14, Flutter `strings.dart` |
| Generate navigation, routers and tab bars from feature and destination contracts | App pack emits router and header from `destination`/`intent` | H6, home `MORE` array |
| Generate server pages from `render: server` view contracts | `app-next` pack with a server SDK call per view | All `"use client"` pages and `useAsync` |
| Generate Riverpod providers and repositories from the same contract | `app-flutter` pack | Singleton stores, FutureBuilder code |
| Generate typed sections instead of `dynamic` | Dryv typed unions for the 83 open fields | `web/lib/site/insights.ts`, the Flutter `asMaps` helpers |
| Generate display hints into a typed enum of kinds and tokens | Reference value contract with `icon`, `colorToken`, `order` | H8, H9, H10 |
| Generate the theme for map and chart libraries (palette, map style) | `theme-css` and `theme-dart` packs add chart palette and map style outputs | H9, H10 |
| One context resolver generated into the API and the SDK | Dryv `context` declaration, interceptor and SDK option | H1, H2, H5, H11, H13 |
| Generate indicator and metric endpoints from rows | Generic read over definitions, no per-metric code | `leaderboards.ts`, `EXTRA`, H3, H4 |
| Lint the repository for forbidden patterns | A root check that fails on `fetch(` outside the SDK, `"use client"` in `page.tsx`, `NEXT_PUBLIC_API_URL`, route handlers under `app/api`, literals matching country names or indicator codes in apps, raw hex colours outside generated theme | Prevents regression |

## 8. Direction on server rendering and SDK (owner answer recorded)

The earlier question (server actions or server-side SDK) is superseded by the owner's rule: **every request goes through the generated SDK client, authored in contracts, with no UI-side assembly.** The design consequence to confirm:

- the generated SDK has a server-side form (used by server components and server actions) and a browser form (used only by client leaf components that need live data), both generated from the same contract;
- context (country, language, region) travels as an authored option, resolved on the server from cookies, headers and the network address, so server pages and mobile clients share one rule;
- the pack never emits a browser `fetch` against a public API URL for first paint.

## 9. Questions the owner needs to decide

1. **Country scope.** Is the target Kenya-first with a generic engine, or truly multi-country from the start (several countries loaded at once)? This decides whether context has a country dimension on every row or a default.
2. **IP detection.** Which source (local database file, hosting header such as a CDN country header, external service) and what privacy rule (nothing stored, coarse region only)? Mobile and web both?
3. **Resolution order.** Is "selection > preference > device position > IP > default" correct, and should "device position" ever override an explicit saved choice?
4. **Where do interface strings and copy live**: in the database (editable, per language), or in Dryv contract files compiled into the API? Who translates and approves?
5. **Metrics and rankings**: agree that indicator, metric and leaderboard definitions become data rows with a generic engine, and that the 17 hand-written metrics are migrated, not extended.
6. **Screen-shaped operations.** May the API contract hold composed read operations per screen (one call, typed document), or should composition be a generated layer over finer operations? Which one does the owner prefer to author?
7. **Dryv itself.** Which of the capabilities in section 5 may be built in the Dryv engine now (it is the owner's own project), and which should be proposed first as `_plan` documents?
8. **Browser-side reads.** Is any browser-direct SDK use acceptable (maps, polling, forms), and how is the API origin exposed without a public `NEXT_PUBLIC_API_URL`?
9. **Preferences for anonymous visitors.** Cookie-only, device storage, or optional account? What happens on first visit?
10. **`admin`, `mobile`, `dev`, `www`.** Regenerate from contracts, retire, or keep outside Dryv? (Also asked in the earlier critic.)
11. **Does the web app contract file layout** (several files per feature, per app) have a preferred structure, for example `apps/web/features/<feature>/{views,intents,navigation}.ts`?
12. **Existing Dryv proposal documents** (`dryv-frontend-proposals.md`, `frontend-assembly-from-contracts.md`, `neutral-platform-and-reference-driven-localisation.md`): are they still valid inputs, or are they to be reset?

## 9a. Owner answers recorded

- **Q1 answered (2026-11-18): multi-country now.** Several countries are served at once, so country is a dimension of every context-dependent read and of the data, not a default. Consequences to plan:
  - The context object always carries a country, and a visitor can be in country A while looking at country B (a selection beats detection).
  - No read may assume one country, currency, level ladder, election cycle or source agency; the reads in section 3 (metric catalogue, elections, statistics, parties, tree) must take country context and read concept vocabulary, levels, currencies and indicator definitions from data.
  - Cross-country comparison needs a concept map between countries (for example the same depth under different level names) and currency-aware money (minor units plus currency, with conversion only where a source and date are recorded).
  - Seed, search, rankings and maps must be scoped by country with an explicit "all countries" mode; global search results say which country each hit belongs to.
  - Country discovery for first-time visitors (IP, position) must handle countries the system has no data for, with a structured gap rather than a fallback to Kenya.
  - Questions 2 to 12 remain open. New questions this raises: which countries load first and in what order, and are country-specific sources and legal rules (privacy, collection) tracked per country as the policy docs require?

- **Q2 answered (2026-11-18): IP detection uses a CDN country header.** Consequences to plan:
  - Country comes from a header the CDN or proxy sets (for example a two-letter country code, and region where offered), read by the API, never by the browser and never by a third-party lookup. No IP database file and no stored IP address.
  - The header must be trusted only from the configured edge: the API accepts it when the request comes through the CDN and ignores it otherwise, so a client cannot forge its country. Local development and tests need an authored override, not a hard-coded country.
  - A header gives country (sometimes region), not a place: the finer region still comes from device position or manual selection. The context object records the source as `cdn_header`, between `device_position` and `default`.
  - The mobile app reaches the API through the same edge, so it gets the same header; direct-to-origin calls have no header and fall to the default with a gap flag.
  - Open: which CDN or proxy (it fixes the header names and region granularity), and the privacy rule for logging the derived country (suggest: log the country code only, never the address).

- **Q2b answered (2026-11-18): the edge is Cloudflare.** Consequences to plan:
  - Country arrives in `CF-IPCountry` (ISO 3166-1 alpha-2; the values `XX` for unknown and `T1` for Tor mean "no country" and must become a gap, not a country). Finer location (region, city, latitude and longitude, timezone) is only sent when the "Add visitor location headers" managed transform is enabled on the zone; plan for it as optional and treat region granularity as unconfirmed until it is switched on.
  - Trust: the origin must accept the header only from Cloudflare (restrict origin traffic to Cloudflare, by its published IP ranges or authenticated origin pulls or a tunnel), otherwise any client can forge `CF-IPCountry`. The trust rule is configuration, authored and testable, not code in each read.
  - Proxy chain: dev and test have no Cloudflare, so the authored override from Q2 stands in for it; the override must be impossible to enable in production.
  - Caching: pages and reads that vary by country must vary on the context (country, language), and Cloudflare caching rules must not serve one country's cached page to another; the server-rendered pages need a context-aware cache key.
  - The country code is mapped to the `Country` reference row by ISO code; countries with no row yield a structured gap.
  - Logging: log the derived country code only, never the visitor address (suggested; owner to confirm).

## 10. What to do next (agreed first, then planned, then built)

1. Owner answers sections 9 and the open questions in the [critic](HANDOFF-FRONTEND-CRITIC-20261118.md).
2. A planning document maps every web page, Flutter screen and backend read to: contract, pack, generated or hand-written, using the tables in both handoffs.
3. A Dryv capability plan per section 5 item, ordered by what removes the most hard-coding (context and screen-shaped reads first).
4. Only then: a Task group with detailed tasks, and the new `AGENTS.md` rules (SDK only, server pages, no UI constants, no hand-written fetch or route handlers, gaps go to Dryv first).

Nothing in this list has been started.
