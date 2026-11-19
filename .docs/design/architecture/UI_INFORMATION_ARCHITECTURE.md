---
id: DOC-UI-INFORMATION-ARCHITECTURE-20261118
name: UI_INFORMATION_ARCHITECTURE
type: documentation
tags: [ui, information-architecture, routes, navigation, web, flutter, proposal]
extra: {status: proposal_for_owner_agreement, date: 2026-11-18, code_changes: none}
---

# UI information architecture: pages, addresses, hierarchy and placement

**Status: proposal for the owner to agree page by page. Nothing here is implemented.** It defines how the public web app (`source/apps/web`) and the mobile app (the Flutter `source/apps/app`) are organised so that the later migration is a move of known screens to known addresses, not a redesign. The goal is an intuitive product: a visitor lands in their country and place, sees what matters first, and can always answer "where am I, what is this, what is next". Authoring and generation rules are in [CONTRACT_AUTHORING_FOR_FRONTENDS](CONTRACT_AUTHORING_FOR_FRONTENDS.md); the context rules are in [CONTEXT_AND_LOCALISATION](../data/CONTEXT_AND_LOCALISATION.md); the read-only versus posting split is in [USER_INTERACTIONS_AND_TRUST](USER_INTERACTIONS_AND_TRUST.md).

The administrative interface is the `dev` portal. The earlier `admin` and old `mobile` apps are deferred and removed (2026-11-18); see [BLAST_RADIUS_AND_MIGRATION](../operations/BLAST_RADIUS_AND_MIGRATION.md).

## 1. What the audit found about the current structure

- **Two address vocabularies.** The web uses `/statistics`, `/elections`, `/leaders`, `/parties`, `/projects`, `/civic`; the Flutter app uses `/stats`, `/election/:id`, `/leader/:id`, `/party/:code`, `/project/:code`, `/place-elections/:id`. The same screen has two addresses, so links, sharing and deep links cannot be shared across clients.
- **Dead generated demo routes** remain in the web app: `/feature-browse`, `/feature-detail`, `/place-search`, `/place-profile`, `/evidence-view`, `/source-browse` come from the first Dryv slice and sit beside the real pages (`/browse`, `/search`, `/profile`).
- **No country in any address.** Every route assumes Kenya; a shared link carries no country or language.
- **Flat navigation.** Ten sections in the web header (five main, five under "More") with no grouping by what the visitor wants to do; the home page repeats the same eight entries again.
- **Place identity is an opaque id** (`/browse/[id]`) in the URL, not a stable readable code.
- Counts: 35 web routes (two are redirect-like demo pages), 13 `dev` routes, about 38 Flutter routes.

## 2. Principles

1. **One address scheme for every client.** The mobile deep link is the web address; a route is authored once in the contract and generated for both.
2. **Country first, then topic, then thing.** Every public address starts with the country (or `all` for cross-country views) so links are unambiguous in a multi-country product.
3. **Stable readable codes in addresses**, never database ids: places, offices, parties, projects, indicators, institutions use their `code` (dotted lowercase, see [codes](../../rules/codes.md)).
4. **Address equals state.** Place, level, indicator, election, tab and compare targets are in the path or query, so the server can render the page and a link reproduces it.
5. **A visitor is never lost.** Every page shows its country, place, and path (breadcrumb); gaps say what is missing instead of hiding sections.
6. **Server-rendered by default** (first paint comes from the server through the SDK); only maps, charts and forms are client leaves.
7. **Same intent, same template.** Lists, detail pages, compares and evidence views follow a small set of page templates generated from the contract role.

## 3. Address scheme (proposal)

```text
/                                   country detection, then redirect to /{country}
/{country}                          country home (ISO 3166-1 alpha-2, lowercase, e.g. /ke)
/{country}/places                   places browser (level ladder from data)
/{country}/places/{placeCode}       a place: overview, tabs below
/{country}/places/{placeCode}/{tab} tabs: leaders, money, elections, numbers, evidence
/{country}/people                   leaders and office holders, tree entry
/{country}/people/{personCode}      a person's record
/{country}/offices/{officeCode}     an office and its holders over time
/{country}/parties, /{country}/parties/{partyCode}
/{country}/institutions, /{country}/institutions/{code}
/{country}/law                      constitution and legal texts; /{country}/law/{slug}
/{country}/elections, /{country}/elections/{electionCode}
/{country}/parliament, /{country}/parliament/motions/{motionCode}
/{country}/money                    funds, budgets, spending by place
/{country}/projects, /{country}/projects/{projectCode}
/{country}/tenders, /{country}/tenders/{tenderCode}
/{country}/numbers                  statistics explorer; /{country}/numbers/{indicatorCode}
/{country}/rankings, /{country}/rankings/{metricCode}
/{country}/compare?a=&b=            compare two places or entities
/{country}/sources, /{country}/sources/{sourceCode}      sources and evidence
/{country}/evidence/{citationCode}  one citation with its files
/{country}/search?q=                search within a country; /all/search?q= across countries
/me                                 preferences: language, theme, country, saved items
/about, /help                       static pages
```

The language is a preference (cookie or the app setting) resolved on the server, with `?lang=` for sharing; alternates are exposed for search engines. Whether language belongs in the path instead is an open question below.

## 4. Hierarchy and navigation

**Primary navigation (five groups, same on web and app):**

| Group | Holds | Why this grouping |
| --- | --- | --- |
| Places | place browser, place overview and its tabs, map | where am I; everything else is reached from a place |
| People | leaders, leader tree, offices, parties | who holds power |
| Government | institutions, law, parliament, elections | how power is organised and exercised |
| Money | funds, projects, tenders, rankings of spending | where the money goes |
| Numbers | statistics, rankings, compare | how places compare |

Sources and evidence are not a top-level group: every claim links to its evidence, and the full list lives under the footer and the search page. Search is a persistent control, not a page. The place switcher (country and place) is always visible in the header; it shows the source of the current choice ("detected", "selected", "device position") with a "change" action.

**Mobile app:** bottom bar with five tabs, Home, Places, Explore (People, Government, Money, Numbers hub), Saved, Me. Entity pages carry the posting actions described in [USER_INTERACTIONS_AND_TRUST](USER_INTERACTIONS_AND_TRUST.md). The web has no posting.

**Entry journey.** First visit: the country comes from the Cloudflare country header (see context document), the language from the browser, the place is empty. The home shows the country headline numbers and a prominent "Find your place" (type a name, use the device position, or pick from the ladder). Once a place is chosen it is remembered as a preference and the home becomes "your place against the country". A visitor from a country with no data sees a structured gap and a country chooser.

## 5. Page templates

Generated from the contract `role`; hand-written parts are components inside slots.

| Template | Role | Used by | Slots |
| --- | --- | --- | --- |
| Overview | detail | country home, place overview | headline numbers, "your place vs country", sections, gaps |
| Browse | list | places, people, projects, tenders, institutions | filters, results, paging, map or table toggle |
| Profile | detail | person, party, office, institution, project, tender | header, key facts, timeline, related, evidence, community (app) |
| Explorer | list+detail | numbers, rankings | indicator picker, level picker, map, series, table |
| Compare | detail | compare | two subjects, metric set, differences, evidence |
| Document | detail | law, content | table of contents, text, notes, citations |
| Evidence | detail | citation, source | citation, source, files, provenance |

Every template defines loading, empty, gap and error states in the contract; none is hand-coded per page.

## 6. Mapping every current screen to its proposed address

| Current web route | Current Flutter route | Proposed address | Template |
| --- | --- | --- | --- |
| `/` | `/` | `/{country}` | Overview |
| `/browse`, `/browse/[id]` | `/browse`, `/browse/:id` | `/{country}/places`, `/{country}/places/{placeCode}` | Browse, Overview |
| `/profile` | `/profile` | `/me` (preferences) and place tabs | Profile |
| `/place-search`, `/place-profile`, `/feature-browse`, `/feature-detail` | `/places`, place profile, feature screens | removed (dead generated demos); replaced by places and search | none |
| `/search` | `/search` | `/{country}/search` | Browse |
| `/explore` | `/explore` | navigation hub (no page; the group menus) | none |
| `/statistics`, `/statistics/[id]` | `/stats`, `/stats/:id` | `/{country}/numbers`, `/{country}/places/{placeCode}/numbers` | Explorer |
| `/leaderboards` | `/rankings` | `/{country}/rankings` | Explorer |
| `/compare` | `/compare` | `/{country}/compare` | Compare |
| `/leaders`, `/leaders/[id]` | `/leaders`, `/leader/:id`, `/leaders-tree` | `/{country}/people`, `/{country}/people/{personCode}` | Browse, Profile |
| `/parties`, `/parties/[code]` | `/parties`, `/party/:code` | `/{country}/parties`, `/{country}/parties/{partyCode}` | Browse, Profile |
| `/elections`, `/elections/[id]`, `/elections/place/[id]` | `/elections`, `/election/:id`, `/place-elections/:id` | `/{country}/elections`, `/{country}/elections/{electionCode}`, `/{country}/places/{placeCode}/elections` | Browse, Profile |
| `/parliament`, `/motions/[code]` | `/parliament`, `/motion/:code` | `/{country}/parliament`, `/{country}/parliament/motions/{motionCode}` | Browse, Profile |
| `/institutions`, `/institutions/[code]` | `/institutions`, `/institutions/:code` | `/{country}/institutions`, `/{country}/institutions/{code}` | Browse, Profile |
| `/constitution`, `/content`, `/content/[slug]` | `/constitution`, `/content`, `/library` | `/{country}/law`, `/{country}/law/{slug}` | Document |
| `/civic`, `/civic/[id]` | `/civic`, `/civic/:id` | `/{country}/money`, `/{country}/places/{placeCode}/money` | Overview |
| `/projects/[code]` | `/project/:code` | `/{country}/projects/{projectCode}` | Profile |
| `/tenders` | `/tenders` | `/{country}/tenders`, `/{country}/tenders/{tenderCode}` | Browse, Profile |
| `/saved` | `/saved` | `/me/saved` | Browse |
| `/source-browse`, `/evidence-view` | sources and evidence pages | `/{country}/sources`, `/{country}/evidence/{citationCode}` | Browse, Evidence |
| none | `/splash`, `/welcome` | app only: splash, onboarding (country, language, place, consent) | none |
| `dev`: `/runs`, `/files`, `/csv`, `/database`, `/knowledge`, capability and job lists | none | unchanged paths under the developer portal (administrative interface until an admin app is funded) | Browse, Profile |

Addresses for the `dev` portal are not country-scoped; it is an operator tool. See [DEVELOPER_PORTAL](DEVELOPER_PORTAL.md).

## 7. What this requires from the contracts and backend (summary)

- Routes, destinations and navigation groups are authored per feature in Dryv; a pack emits the router, header and tab bar.
- Every address segment (`country`, `placeCode`, `personCode`, ...) is a typed view context value resolved on the server.
- Level names and what sits below a level (today `NEXT` in `browse-view.tsx`) come from country data.
- Composed reads give each template one call. See the contract authoring document.

## 8. Open questions for the owner

1. Is `/{country}/...` right, or should the country be implicit until the visitor leaves their own country? (Multi-country sharing argues for explicit.)
2. Language: in the path (`/ke/sw/...`), a query (`?lang=sw`), or preference only?
3. Are the five navigation groups right (Places, People, Government, Money, Numbers)? Should elections and parliament sit under People?
4. Does the home page lead with "your place against the country" or with country headline numbers when no place is chosen?
5. Should place tabs (`leaders`, `money`, `elections`, `numbers`, `evidence`) be separate addresses (as above) or sections of one long page?
6. Is the cross-country address `/all/...` wanted now, and for which pages (search, rankings, compare)?
7. Legacy addresses: keep permanent redirects from today's web routes, or ignore since the site is not public yet?
8. Mobile tabs: Home, Places, Explore, Saved, Me, or a different set (for example posting as its own tab)?
9. Should the `dev` portal be reorganised in the same pass (runs, files, review workbench), given it now carries the admin role?

## 9. Owner direction, round 2 (2026-11-18, recorded, not yet agreed; supersedes sections 3 and 4 where they differ)

1. **Country by domain later.** Country-specific subdomains (for example `ke.mzizi.africa`) are planned once a domain is bought; until then the country is explicit in the address. On a country domain the host decides the country and the path has no country prefix.
2. **Context cookies and a server-held context.** Cookies (and the same context carried by the mobile app) track country, place, language, theme and other server UI context, to tune what the user sees. Basic features work automatically; usage analytics are explicit opt-in. The same device identity serves likes, activity and analytics.
3. **Mobile push notifications** for new content, mobile only, one notification signal in the contract, benchmarked on the RideRescue approach.
4. **User identity.** A server-issued device identity; linking email or phone to sync devices is a later option and is not collected now.
5. **Place-prefixed static links.** The same static sections work at country level and under any place, for example `/elections` and `/nairobi-county/elections`, instead of root links with a country.
6. **Codes or slugs only in addresses, never ids.** Explicit `slug` columns preferred, as clean as possible (`/nairobi-county/`, no country suffix).
7. **Static sections with dynamic slugs under them**, for example `/elections/2027-general`.
8. **Year context** in addresses: year in the slug where a thing is year-bound, `?year=` where it is a filter.
9. **Navigation labels** chosen for readability and usability, and SEO.
10. Language stays a preference plus `?lang=` (answered).

The explanation, examples, advice and caveats for these points were given in the conversation and are the basis for the next revision of sections 3 and 4.

## 10. Owner answers, round 3 (2026-11-18)

- **Accepted:** flat clean place slugs at the root (`/nairobi-county`), a reserved-word list, and a kind or parent suffix only when two places collide.
- **Accepted:** the router supports both host-country and path-country from day one.
- **Accepted:** year in the path where it is part of identity (`/elections/2027-general`, `/money/budget/2025-26`), `?year=` for filters.
- **Accepted:** web views counted with a daily-rotating salted hash and no cookie; the device identity is used for likes.
- **Direction:** `/` is the visitor's home context (their home place) with no navigation needed; links grow place-prefixed automatically as they go deeper, so every shared link is explicit. Saved places can carry labels such as Home and Work.
- **Direction, to evaluate:** one slug-management table (subject-based, with titles, classification, language and history) instead of slug columns on every table; partitioned by context as it grows.
- **Open:** navigation labels, to be mapped to the tables each one reads (explained in the conversation); push topics first: places, leaders, projects, elections, tenders, institutions, suppliers, and any `official` entity or individual; announcements and news later, built from a subject.

## 11. Owner answers, round 4 (2026-11-18)

- **Slug registry lives in the existing `source` schema** (no new `routing` schema), one subject-based table without titles; titles come from the name tables. Existing `filesystem.contents` slugs move into the registry. (Naming of the table and the semantic fit of `source` to be confirmed.)
- **Saved place labels** are free text with ordered suggestions: Home first, then Work, then further suggestions, prefilled and editable, skipping those already used.
- **Navigation:** Elections stay a label of their own; **Politics is a separate label** for parties and other political matters (parties, coalitions, manifestos, alignments), so elections and politics are not mixed.
- **Elections addresses:** direct links per kind and year, not `2027-general`: `/elections/general/{year}`, `/elections/by-election/{slug}` (for example `2026-08`), with `?year=` as the filter on list pages. By-elections have no fixed dates, so each year lists its own; backend, API, database and schema must support this and the matching UI. Design proposed in the conversation; to be written into the next revision of this document.

## 12. Owner answers, round 5 (2026-11-18)

- **Slug table:** `slugs` in the `source` schema. **Politics** stays a label of its own. Election kinds general, by-election, referendum, runoff, repeat and primary confirmed as reference scheme values; the 2017 repeat presidential election is its own `repeat` event. Upcoming elections are a priority: planned dates, declared candidates, a countdown, content and the legal basis for why and how the date is known. A by-election month is one page.
- **Money is split, not mixed:** Finance (budgets and allocations), Procurement (tenders, contracts, suppliers) and Projects each get their own links. New sections requested: **Calendar and events**, and **Infrastructure** (facilities, offices, roads, polling stations on a map with search and analytics). Design in [EVENTS_INFRASTRUCTURE_AND_SPENDING_MODEL](../data/EVENTS_INFRASTRUCTURE_AND_SPENDING_MODEL.md). Navigation to be re-proposed with these (a header of grouped labels with two-level menus).
- Election key dates are events attached to the election, not a separate key-dates table.

## 13. Owner direction, round 6 (2026-11-18): application layout and hierarchical addresses

### 13.1 Layout (web app)

- **Sidebar plus app bar, no header-only design and no footer.** The app bar holds the logo, the search box, the actions (language, theme, place switcher, share) and the breadcrumbs. The sidebar holds the navigation groups with two-level menus and, at its top, the current place context. The `www` site keeps the landing page and the footer; the web app is an application.
- **The place switcher is path-based.** When the address names a place, the switcher shows it and changing the place rewrites the path and keeps the current section (`/nairobi-county/elections` to `/kisumu-county/elections`), falling back to the place home with a note when the target has no data for that section.
- **Breadcrumbs** come from the geographic hierarchy data and the section, not from the text of the address: Kenya, Nairobi County, Westlands Ward, Elections, General 2027, each linking to a real page.
- **Legal and consent links** (privacy, terms, data sources, report an error, licences) stay reachable on every page from the sidebar foot and the profile menu, because consent and privacy law expect them without a footer.
- **Mobile web** collapses the sidebar into a drawer; the **app** keeps bottom tabs and the same context chips.

### 13.2 Hierarchical place addresses

Owner idea: slugs with slashes, for example `/nairobi-county/westlands-ward` and `/nairobi-county/westlands-sub-county`. Assessment: **it works and is discoverable by search engines**, provided every prefix is a real page, breadcrumbs mark up the path, and the sitemap lists the canonical forms. Findings and recommendation (not yet agreed):

- A **full chain** of every ancestor (county, constituency, ward, village) breaks whenever boundaries or parentage change, and Kenya has two parallel hierarchies (electoral: county, constituency, ward; administrative: county, sub-county, ward). The address would change often, and each change needs a redirect.
- Recommended: **rooted at the first administrative level**: the first segment is the first-level division (county, province, state, region, from the country's ladder), the second segment is the place: `/nairobi-county`, `/nairobi-county/westlands-constituency`, `/nairobi-county/westlands-sub-county`, `/nairobi-county/westlands-ward`, `/nairobi-county/kangemi-village`. Uniqueness is per first-level division, so most names need no disambiguation; the kind word is part of the administrative slugs. A re-parenting inside a county changes nothing; only a move between counties needs a redirect from the slug history.
- The breadcrumbs and place switcher use the real dated hierarchy (ward, constituency, county), so the clean address and the full context are both preserved.
- The router resolves segments in order, then matches a reserved section word (`elections`, `leaders`, `infrastructure`, ...) and the rest is the section path; place slugs cannot equal reserved words.
- The slug table gains a scope column (the first-level division the slug lives under) and its uniqueness is (country, scope, namespace, slug).
- Not recommended: also serving the same place at a shorter address as a second canonical form; shorter forms redirect to the canonical one.
- Open: always include the kind word for administrative units (`westlands-ward`), or only on collision.

## 14. Owner direction, round 7 (2026-11-18): deep clean place addresses (supersedes the county-rooted proposal in 13.2)

Owner preference: no kind words in place slugs (`/nairobi/westlands`, not `/nairobi-county/westlands-ward`); go as deep as the place hierarchy goes (`/nairobi/westlands/westgate`); add a suffix **only on collision** (a sub-county named like a constituency, a village inside a ward with the ward's name); avoid duplicate addresses caused by parallel hierarchies by letting one hierarchy be canonical; slugs may point to each other (translations, same area in another hierarchy).

Rules recorded for design:

1. **One canonical routing hierarchy per country**, set in data (in Kenya the electoral one: county, constituency, ward, then smaller places). Every place has exactly one canonical path built from its slug and its ancestors' slugs in that hierarchy.
2. **Parallel hierarchies** (the administrative one: county, sub-county, ward) do not get duplicate child addresses. A unit that exists only in a parallel hierarchy gets its own address with a marker (a plain suffix on collision, such as `/nairobi/westlands-sub-county`, or a systematic marker such as a tilde prefix; owner to choose) and its children resolve to the canonical addresses of those places.
3. **Suffix only on collision, and existing slugs never change when a collision appears.** The first slug stays plain; the newcomer takes the suffix (kind word first, then the parent's name if still colliding). Initial load assigns plain slugs to the larger unit first, then by code.
4. **Resolution is scoped:** each segment is looked up among the places under the previous segment (any depth below it in the canonical hierarchy is accepted and redirected to the canonical full path), then the first reserved section word starts the section path.
5. **History:** when a place is re-parented its old path stays as a closed row and redirects (301) to its new canonical path; boundary changes cost redirects, not broken links.
6. **Slug rows may reference each other:** a canonical pointer (an alias or a translated slug points to its canonical row) and a relation table with kinds same-as, translation-of, alias-of, supersedes, covers-same-area (a constituency and a sub-county covering the same area, with the period, derived from geometry), contains. Used for hreflang alternates, "see also", redirects and translated section words. One pointer level only; relations may not form cycles.
7. **Every prefix of a canonical path is a real page**, breadcrumbs come from the dated hierarchy, and the sitemap lists canonical paths only.
8. The slug table's uniqueness becomes (country, parent place, namespace, slug), valid in a period.

## 15. Application navigation and page map (proposal; to be agreed with the owner)

`{place}` is the canonical chain of place slugs (for example `nairobi/westlands`); every place-scoped section also works without it at country level.

### 15.1 Sidebar groups (two-level)

| Group | Items | Addresses |
| --- | --- | --- |
| Context (top of sidebar) | country, place switcher, language | `/`, the path |
| Home | my place or country | `/` |
| Places | browse places, map | `/places`, `{place}`, `/map` |
| Leaders | leaders, offices, leader tree | `/leaders`, `/leaders/{slug}`, `/leaders/offices`, `/leaders/offices/{slug}`, `/leaders/tree`, `{place}/leaders` |
| Politics | parties, coalitions, manifestos | `/politics/parties`, `/politics/parties/{slug}`, `/politics/coalitions`, `/politics/coalitions/{slug}`, `/politics/manifestos`, `/politics/manifestos/{slug}` |
| Elections | countdown and hub, general, by-election, referendum, runoff, repeat, primary, polling stations | `/elections`, `/elections/general`, `/elections/general/{year}`, `/elections/by-election`, `/elections/by-election/{yyyy-mm}`, `/elections/referendum/{slug}`, `/elections/runoff/{slug}`, `/elections/repeat/{slug}`, `/elections/primary/{slug}`, `/infrastructure/polling-stations/{slug}`, `{place}/elections` |
| Government | institutions, law, parliament | `/government/institutions`, `/government/institutions/{slug}`, `/government/law`, `/government/law/{slug}`, `/government/parliament`, `/government/parliament/sittings/{slug}`, `/government/parliament/motions/{slug}` |
| Finance | budgets, funds, spending, debt | `/finance`, `/finance/budgets`, `/finance/budgets/{fiscal-year}`, `/finance/funds`, `/finance/funds/{slug}`, `/finance/spending`, `/finance/debt`, `{place}/finance` |
| Procurement | tenders, contracts, suppliers, buyers | `/procurement`, `/procurement/tenders`, `/procurement/tenders/{slug}`, `/procurement/contracts/{slug}`, `/procurement/suppliers/{slug}`, `/procurement/buyers/{slug}`, `{place}/procurement` |
| Projects | projects, stalled, ground reports | `/projects`, `/projects/{slug}`, `/projects/stalled`, `{place}/projects` |
| Infrastructure | map and search, schools, hospitals, offices, police, courts, roads, polling stations, nearest to me | `/infrastructure`, `/infrastructure/{class}` (`schools`, `hospitals`, `offices`, `roads`...), `/infrastructure/facilities/{slug}`, `/infrastructure/nearest`, `{place}/infrastructure` |
| Calendar | calendar, events | `/calendar`, `/calendar/{yyyy-mm}`, `/events/{slug}`, `/events/{slug}/{year}`, `{place}/calendar` |
| Data | statistics, rankings, compare, place report card, coverage, sources, exports | `/data/statistics`, `/data/statistics/{indicator}`, `/data/rankings`, `/data/rankings/{metric}`, `/data/compare`, `{place}/report`, `/data/coverage`, `/data/sources`, `/data/sources/{slug}`, `/data/evidence/{citation}`, `/data/exports` |
| Me (foot) | saved places and labels, notifications (app), preferences, privacy, legal and help | `/me`, `/me/saved`, `/me/notifications`, `/me/privacy`, `/help` |

Filters use `?year=`, `?page=`, `?q=`; year-bound things carry the year in the path. Reserved section words: `places`, `map`, `leaders`, `politics`, `elections`, `government`, `finance`, `procurement`, `projects`, `infrastructure`, `calendar`, `events`, `data`, `me`, `help`, `report`, `search`, plus country codes on the apex.

### 15.2 Current screens to new addresses

| Current web route | Current Flutter route | New address |
| --- | --- | --- |
| `/` | `/` | `/` (home context) |
| `/browse`, `/browse/[id]` | `/browse`, `/browse/:id` | `/places`, `{place}` |
| `/profile` | `/profile` | `/me` |
| `/search` | `/search` | `/search` |
| `/explore` | `/explore` | sidebar groups (no page) |
| `/statistics`, `/statistics/[id]` | `/stats`, `/stats/:id` | `/data/statistics`, `{place}/data/statistics` |
| `/leaderboards` | `/rankings` | `/data/rankings` |
| `/compare` | `/compare` | `/data/compare` |
| `/leaders`, `/leaders/[id]` | `/leaders`, `/leader/:id`, `/leaders-tree` | `/leaders`, `/leaders/{slug}`, `/leaders/tree` |
| `/parties`, `/parties/[code]` | `/parties`, `/party/:code` | `/politics/parties`, `/politics/parties/{slug}` |
| `/elections`, `/elections/[id]`, `/elections/place/[id]` | `/elections`, `/election/:id`, `/place-elections/:id` | `/elections`, `/elections/{kind}/{year-or-slug}`, `{place}/elections` |
| `/parliament`, `/motions/[code]` | `/parliament`, `/motion/:code` | `/government/parliament`, `/government/parliament/motions/{slug}` |
| `/institutions`, `/institutions/[code]` | `/institutions`, `/institutions/:code` | `/government/institutions`, `/government/institutions/{slug}` |
| `/constitution`, `/content`, `/content/[slug]` | `/constitution`, `/content`, `/library` | `/government/law`, `/government/law/{slug}` |
| `/civic`, `/civic/[id]` | `/civic`, `/civic/:id` | `/finance`, `{place}/finance` |
| `/projects/[code]` | `/project/:code` | `/projects/{slug}` |
| `/tenders` | `/tenders` | `/procurement/tenders` |
| `/saved` | `/saved` | `/me/saved` |
| `/source-browse`, `/evidence-view` | sources pages | `/data/sources`, `/data/evidence/{citation}` |
| `/feature-browse`, `/feature-detail`, `/place-search`, `/place-profile` | `/places`, feature screens | removed |
| none | `/splash`, `/welcome` | app only: splash and onboarding (country, language, place, consent) |
| new | new | `/calendar`, `/infrastructure/*`, `/finance/*`, `/procurement/*` (besides tenders), `/data/coverage`, `/data/exports`, `{place}/report` |

Status: sections 14 and 15 are the agreed direction. The web app implements the sections that exist (2026-11-19; see `MUST-FIX.md` for what is built and what is not). Sections 3 and 6 above are superseded where they differ.
