---
{id: DOC-DATA-ENGINE-STATUS,name: DATA_ENGINE_STATUS_AND_GAPS,type: documentation,tags: [data-engine,status,gaps,planning]}
---

# Data engine: status, gaps and limitations (2026-11-02)

What exists, how it is verified, and what is not done or not safe to assume. Written for the next automated run. Plans: `DATA_INTAKE_PLAN.md`, `WEBSITE_DESIGN.md`, `SITE_STRUCTURE_SPEC.md`, `LEGALITY_SAFETY_AND_COMPLIANCE.md`; tasks: group "Data engine research and build".

## What works (all on `develop`)

| Area | State | Verified by |
| --- | --- | --- |
| Layout | `source/backend/engine/{data,database}`, contracts in `source/backend/contracts` | references updated, API tests |
| Contracts | five layer contracts in Dryv, JSON Schema export with staleness check, generated Pydantic models | `bun run check`, example validation |
| Website schema | sites, dated domains, publisher links, structures and versions, families, patterns, members, subjects, traits, relations, fingerprints, assessments, dossiers; read endpoints (not for assessments or dossiers) | Dryv check, generated check, API unit tests |
| Database engine | generated migrations with drift check, hand-written staging, engine, PostGIS shape and job migrations, seeds (reference, research, fixtures), integrity checks, grants, collection gate, validation, review application, controlled promotion | 81 bun tests against PostGIS |
| Data engine | job queue, local files interface, GeoJSON, World Bank, PDF and HTML legal extractors, structure validator, deterministic runner, polite fetcher, compliance controls, candidates, incidents, pattern expansion, probes (mock only), fingerprints, batch tooling, importers | 116 pytest cases |
| Vertical slice | Kenya counties from real geoBoundaries data to the boundary endpoint's use cases, with source and licence | `tests/test_slice_geoboundaries.py` plus an API integration spec |
| Wave 1 | South Africa, Nigeria, Tanzania, Kenya: country and first-level boundaries, national population series | `tests/test_poc_countries.py` |
| Structures | three pilot bundles from real saved markup (IEBC, Parliament, geoBoundaries API) | validator dry runs, a runner test |

Counts at the end of this run: API 14,149 unit tests, database engine 81, data engine 116.

## Findings worth knowing

1. **The pipeline is country neutral.** Only an ISO3 to jurisdiction mapping is in code; level names come from reference data.
2. **Tanzania's boundary sources disagree.** 11 of 30 regions are more than 2 percent outside the country polygon (different sources and years); they were held back as invalid, not accepted.
3. **Licences differ per dataset**: Kenya Public Domain (as stated by the dataset), South Africa CC BY 3.0 IGO, Nigeria CC BY 4.0, Tanzania ADM0 CC BY 4.0 and ADM1 ODbL 1.0 (share-alike). All are recorded verbatim as unconfirmed by a human.
4. **The legacy seeds are unfit as they stand** (`audits/LEGACY_SEED_FINDINGS.md`): geography has 156 repeated codes, 7 counties missing, 249 of 290 constituencies; nothing was imported.
5. **A selector bug the pilot caught**: matching an ancestor wrapper duplicates items; the authoring guide records the fix.
6. **Sites unreachable from the dev machine**: KNBS and the National Treasury (connection failed), Kenya Law and Nairobi County (redirects not followed).

## Not done, and why (gaps and limitations)

**Approvals (DEC-AUTO-APPROVAL: a person or an AI agent may do these, recorded against the account)**
- Source assessments and dossier stages: sites under a trusted suffix (`.go.ke`) are approved by `auto-assess`; the Kenya dossier was moved to pilot by the agent account on 2 November 2026. Other suffixes need an entry in `seed/system/policy/trusted-domains.json` or an explicit approval.
- Licences are still recorded as unconfirmed for imported documents; counsel review of the Kenya dossier, ODPC registration and the DPIA remain open questions in the dossier, now carried by rules and the audit trail rather than a gate.
- The production contact and bot page for `MZIZI_USER_AGENT` (development uses `.data/env.local`).

**Engineering gaps (tasks exist)**
- Tier B extractors: PDF (text, tables, scan detection) and HTML legal text exist (DEC-PDF-EXTRACTION); OCR is not performed, table column alignment is left to mappings, and the legacy pdf_extractor was never run.
- Real imports for legal, governance, elections, people, finance, debt, procurement, organisations, KNBS statistics, constituencies and wards.
- Review dashboard and candidate read endpoints; files service beyond a local directory; intelligence layer; scheduler and alerting; legacy removal.
- Second administrative level of boundaries for ZA, NG and TZ; census tables from statistical offices; ISO identifiers (no table holds external identifiers yet); county numbers and names as officially spelled (geoBoundaries says "Tharaka").
- Runner: no path pagination, no browser mode, no resource downloads (PDF links are records, not fetched), single threaded, one slot per domain pattern, subject sources limited to geography units and institutions.
- Structure format: minimal JSONPath subset, no loops over value lists, `shares_module` relations are written by hand only.
- Validation depth: geography rules are deep; other targets get generic rules until their waves land. Containment tolerance is in degrees (about 1 km).
- Promotion: one record per candidate (no atomic groups); changed records only for versioned tables; reviewers' decisions are inserted by SQL in tests.
- The Dryv-generated API route for the boundary endpoint itself was not called over HTTP; its use cases were.
- Personal-data scanner is heuristic and Kenya-centred (phone and ID patterns); trait keywords are English only.
- Dev database state: `bun src/cli.ts reset`, `seed research`, then the geoBoundaries and World Bank imports leave candidates waiting for a human reviewer; fixtures contain illustrative data.

## Next automated run: start here

1. Read this file and `task list`; run the three suites (commands in the package READMEs) to confirm the baseline.
2. Do anything not blocked by a human: constituency and ward source selection (026), review API and dashboard (033), files service (034), then the imports whose sources are reachable.
3. Never run live requests until `MZIZI_USER_AGENT` resolves and an approved assessment covers the request; use mocks and saved samples.
4. Keep gaps in this file current; close tasks only when their checklists are true.

## Update 2026-11-02 (session 3)

Built: the `access` catalogue (roles, permissions, `account_permissions`) and permission-based API checks; a read-only reviewer database role; the reviewer-only `pipeline` API (candidates with detail, runs, jobs, sites, documents, captures, structure versions, checks, assessments, dossiers, draft an assessment (reviewer), apply decisions, promote, approve or reject assessment (admin)); human-only assessment decisions in the database engine; Tesseract OCR with English and Swahili behind the `ocr` profile; table realignment and the budget-table import (fiscal year, units, budgets) reaching `finance.budgets`; and the review workbench at `/review` in `source/apps/web` on Bun (queue, candidate detail, decisions, promote, runs, jobs, sites, documents, captures, structure versions, checks, assessments with a draft form, dossiers, and a read-only canonical data browser over the API's list routes), with unit tests, a smoke script (`bun scripts/smoke.ts`) and the API checking JWKS single sign-on tokens.

Still open: no live request has ever run and none is permitted (no approved assessment, dossier at research); a named human must approve an assessment in the workbench and move the Kenya dossier to pilot before that changes, and an agent must not. `MZIZI_USER_AGENT` is set only in the git-ignored `.data/env.local`; the production contact and bot page are added at deployment. The budget table mapping is proven on a generated PDF because no real Parliament PDF is stored in the repo and fetching one is a live request; the end-to-end review of that import in tests used SQL-inserted decisions, while the decide, apply and promote path through the API was checked by hand on the dev database. The data browser has pagination but no filters yet. The inherited `/admin` pages build and return 200 on Bun but need `SERVER_URL` and the file and scraper service, which are not running here. Five orphaned inherited login and dashboard components that imported modules that no longer exist were removed so the app type checks. Dev sign-in is not real authentication: the API verifier already accepts an identity provider's tokens (`AUTH_JWKS_URL`, tested with a local JWKS server), but the web app has no OIDC login flow yet because no provider is chosen.

## 2 November 2026 (evening): live extraction and a real import

- Live: after `auto-assess` and `advance-dossier`, the gated `fetch` command retrieved the Parliament of Kenya budget pages and the National Treasury "Budget Summary FY 2026/27" PDF (36 MB, a scan). Four requests to `www.parliament.go.ke`, identified by `MZIZI_USER_AGENT`, 0.2/s, robots.txt respected, the assessment id recorded in each provenance file.
- Real import: `import-budget-summary` read Table 3 (page 22) with Tesseract under several renderings, accepted only values whose sums add up (arms = national government; national + consolidated fund services + county = total), and staged the fiscal year, five units and five budgets. The agent account validated, approved and promoted them: `finance.budgets` now holds KSh 2,817,388.2m Executive, 48,690.7m Parliament, 30,441.8m Judiciary, 1,501,327.1m Consolidated Fund Services and 420,000.0m County Governments for FY 2026/27. The 2025/26 column was not staged because OCR misread a digit there; the totals caught it.
- Single sign-on: `source/dev/keycloak` (realm fixture) plus an OIDC code-with-PKCE login in the workbench; the API verifies Keycloak tokens by JWKS. Production points `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `AUTH_ISSUER` and `AUTH_JWKS_URL` at the real provider.

## 2 November 2026 (night): people, legal text, NG-CDF and IEBC from live sources

All fetched through the gate (assessments by the agent account under DEC-AUTO-APPROVAL: `.go.ke` suffix, plus exact hosts for `www.iebc.or.ke` and Kenya Law), 0.2 requests per second, robots.txt respected, provenance file beside every raw artifact in `.data/raw`. Everything below was validated, approved and promoted by the agent account with a recorded rationale.

| Data | Source | In the canonical tables |
| --- | --- | --- |
| National Assembly and Senate members, 13th Parliament | www.parliament.go.ke member lists (43 pages) | 350 MPs and 67 senators as individuals, seats (offices), holders, 25 parties, memberships; two institutions |
| Official portraits | the same site, per member | 410 raw images kept as documents and captures, each attributed to its person |
| IEBC commissioners | www.iebc.or.ke | 7 individuals, offices and holders |
| Constitution of Kenya, 2010 | www.klrc.go.ke article pages (Kenya Law answered with a bot challenge, so it was not used) | the instrument, 18 chapters, 274 articles, schedules and preamble, verbatim |
| NG-CDF allocations and disbursements | crm.ngcdf.go.ke API behind the fund's own pages | 290 constituency committee units plus the board; 4,058 allocations (FY 2013/14 to 2026/27) as budgets; 22,643 dated disbursements as transfers (KSh 417.9 billion) |

Scope kept to public-office facts: names, seats, party, chamber; no phone numbers, emails, addresses or histories. Names are cleaned of honorifics, and family and given names are only recorded when the list gives an order. Known limits: two members with the same cleaned name would share one person code; 26 NG-CDF constituencies are missing from the fund's list page, so their units carry no county; the IEBC constituency-offices PDF, the Senate and county assembly pages, Hansard, Acts, county workers and gazettes are not imported yet; licences are recorded as unassessed; Kenya Law remains blocked by its challenge.

Commands: `fetch`, `fetch-photos`, `import-members --stage A|B|C`, `import-ngcdf --stage A|B`, `import-constitution --stage A|B`, `import-iebc --stage B|C`, then `validate`, `review-run`, `apply-review`, `promote` in the database engine.

## 2 November 2026 (late night): three databases, Kenyan admin geography, tenders.go.ke probed

**Databases (product owner's decision).** `mzizi` is the real database: migrated, reference data (classifications, jurisdictions) and the agent account only, never fixtures, never reset (the engine refuses `reset` on any name not ending in `_dev` or `_test`). `mzizi_dev` is the disposable preparation database (it still holds fixtures and the earlier members, Constitution and NG-CDF loads). `mzizi_test` is the single scratch database every test suite creates and drops; suites that use it run one file at a time. Real-database env: `.data/real.env` (git-ignored); `ENVFILE=.data/real.env /tmp/stage2.sh ...` pattern in the status commands. The earlier loads in `mzizi_dev` have not yet been replayed into `mzizi`.

**Administrative geography in `mzizi`.** `import-geo-admin` reads the geoBoundaries ADM0-3 files kept in the Polifin repository (commit 290ffbf, `public/admin`), finds each unit's parent by geometry, builds codes `ke/<county>/<constituency>/<ward>` and deduplicates (repeated shape id dropped; same parent, same name and area within 2 % is one unit; other repeats are suffixed and reported). Promoted by the agent account: 1 country, 47 counties, 290 constituencies, 1,452 wards (two wards, Mwiki and Tarakwa, appear twice with different shapes and are coded `-2`; three coastal wards fall in no constituency polygon and use the nearest). 1,700 boundaries promoted; 90 were deferred by the containment check (the simplified shape lies partly outside its parent, 2 to 19 percent) and wait for a better geometry. The HDX COD-AB cross-check has not been run yet; boundaries are recorded as unverified until it is.

**tenders.go.ke.** Registered as `ke/tenders` and assessed under the `.go.ke` rule. Machine routes found in the site's own scripts: OCDS 1.1 bulk files per financial year at `/storage/OCDS/<year>.json` (FY 2026/27 alone has 7,047 releases with buyers, tenders, awards and contracts), and paged JSON at `/api/pe/all-pe` (procuring entities with type, county and city), `/api/supplier-with-contracts`, `/api/get/all/published-contracts` and `/api/active-tenders`. The supplier and entity endpoints also carry phone numbers, emails and KRA PINs; those are not to be staged. Raw files so far are in `.data/raw/tenders*`. Not yet modelled: procuring entities and suppliers as organisations linked to geography, tenders, awards, contracts, and the deduplication and profiling scoring.


## 2 November 2026 (early morning): the real database, procurement, matching, seed structure

- **Replay into `mzizi`.** Geography first (so later data carries correct references), then Parliament members (seats carry a `Geography:` code for their county or constituency), IEBC commissioners, the Constitution (instrument, 18 chapters, 274 provisions) and NG-CDF (290 constituency units, 279 linked to their constituency geography unit, 4,058 allocations, 22,643 dated disbursements). A fixture bug (the legislature classification shared a key with another row) was found and fixed on the way. Portraits are being re-fetched through the gate for the real database.
- **HDX cross-check.** The HDX COD-AB boundaries were fetched through the gate (the redirect to S3 needed that host in the site's scope; a 403 on `robots.txt` is treated as "no rules published", per RFC 9309). 319 of 327 promoted county and constituency boundaries agree (overlap 0.9 or more, same parent) and are `verified`. Differences kept visible: Kericho and Bomet county shapes differ between the sources (overlap 0.83 and 0.85) and HDX places Buret under Kericho where geometry from the first source puts it in Bomet; Tharaka-Nithi is spelled differently; 14 HDX constituencies have no counterpart because 10 constituency boundaries were deferred by the containment check. Wards have no second source and stay `unverified`.
- **Governance structure seed.** `seed/ke/governance/ke-governance-structure.json`: 100 institutions (arms of government, ministries, constitutional commissions, independent offices, courts, state corporations and regulators) plus a government and an assembly for each of the 47 counties generated from the geography units. It is labelled custom-prepared from manual research with a confidence per row; the ministry list must be checked against the current Executive Order.
- **Procurement from tenders.go.ke** (`import-procurement`, stages A to D) for financial years 2025/26 and 2026/27: procuring entities (units and organisations typed from their names, linked to their county), suppliers keyed by portal id, tenders and contracts. Published contact data of public procuring entities is kept as identifiers that the public API hides; supplier contact points stay only in the preserved raw packages. Older years (2018/19 to 2024/25) are downloaded and not imported yet.
- **Matching** (`dedup`, `profile`, `DEC-ENTITY-MATCHING`): the 423 people in `mzizi` produced one flagged pair and no automatic merges.
- **Databases.** `mzizi` real, `mzizi_dev` disposable preparation, `mzizi_test` the single scratch database.
- **Open:** import the older procurement years; replay the portraits and verify the count; link more entities (suppliers' addresses are free text); the 90 deferred boundaries; wards still unverified; IEBC constituency offices, Senate and county assembly members, county workers, Acts, Hansard and gazettes.

## 2 November 2026 (morning): site registry for every place and body, and the statistics plan

- **Site records.** `mzizi` now holds 481 sites: 47 county governments and 47 county assemblies (from the county geography units and the domain patterns), 290 constituency fund committees (NG-CDF pattern), 89 national bodies from `seed/ke/registry/ke-expected-sites.json` (custom-prepared from manual research; ministries, courts, constitutional commissions, independent offices, state corporations and regulators, each linked to its institution through `website.subjects`), and the 9 sites already profiled. All new sites are `expected`; their hostnames are unverified candidates and none was contacted. Task: probe and confirm (data engine group).
- **Statistics review.** The statistical schema holds one-dimensional series only (no multi-dimensional breakdowns, measure types, denominators, margins, count-versus-projection flag or derived-from links); the electoral schema holds candidates and per-candidate votes but not registered voters, turnout, rejected ballots, referendum options or list seats; geography has no area although boundary geometry is in PostGIS. A new task group, "Statistics, electoral results and derived data" (nine tasks), plans the schema work, the source catalogue (KNBS, DHS, KIHBS, Communications Authority, CRA, IEBC, HDX, WorldPop), the census and breakdown loaders (including ethnic community, religion and ICT access, as group counts only), the electoral loader, derived indicators (density, turnout, vote share, per capita) and cross-source quality checks.

## 3 November 2026: Dryv generation, deferred boundaries

- **Dryv generation ran.** It had not been tried this session; the engine API starts normally (`.docs/guidance/running-dryv.md` has the steps and traps). Generation created 187 and changed 52 files: read endpoints for the domain, place, contact (entities only) and statistics modules. The typecheck stopped on one project-owned file, `statistics-read.service.impl.ts`, which lacked ten methods; they were added. `bun run check`, `generated:check`, `access:export` and the API unit suite (15,864 passing, 61 skipped) are clean. Committed as `e1354db`.
- **The 90 deferred boundaries, resolved in `mzizi` with `geo-fix-containment`.** They were 80 wards and 10 constituencies whose simplified shape spilled outside the parent. The importer used to choose the parent by representative point; it now takes the polygon holding most of the shape (test added). The command (data engine, `geo_fix.py`) then: (1) **reparented 7 wards** where at least 60 percent of the shape lay in a sibling and at most 40 percent in the assigned parent (Chemelil-Chemase to Tinderet, Kwa to Suna East, Kitutu Central to Kitutu Chache South, Athwana to Tigania West, Githobokoni to Gatundu North, Dertu to Dadaab, Mochongoi to Baringo South; each unit's code follows its parent and its version was incremented); (2) **re-staged 54 boundaries clipped to their parent** (at least 75 percent of the source shape lay inside; method `inferred`, the original candidates are `superseded`), reviewed by the agent account and promoted. All 290 constituencies now have a boundary; 1,754 boundaries are current. **36 wards still have no boundary**: more than a quarter of their shape lies outside the parent and clipping would discard too much (mostly coastal and island wards and ones in dispute between sources). They stay `invalid` with the containment message; they need a better geometry (Kenya's gazetted ward boundaries or IEBC files), not a waiver. The HDX cross-check was not re-run.

## 3 November 2026: Lane C, political parties, ORPP and IEBC

- **ORPP as an institution and a site.** `ke/registrar-of-political-parties` (Office of the Registrar of Political Parties, Political Parties Act 2011, Cap. 7D) is in the governance structure seed with no parent (an independent statutory office; confidence medium, to be checked against the Act) and no location columns (an expected placement of the Registrar's offices belongs to the places lane). Site `ke/orpp` (host `orpp.or.ke`) is linked to it through `website.subjects`. `orpp.or.ke` is `.or.ke`, so `seed/system/policy/trusted-domains.json` gained an exact-host rule (subdomains such as `ippms.orpp.or.ke` are deliberately not covered); the agent account approved the assessment under DEC-AUTO-APPROVAL and the gate fetched the home page, the register pages and the PDFs below at 0.2 requests per second. The domain row is `reachable` (HTTP 200). The publication catalogue (type, URL pattern, format, frequency, pipeline) is `database/seed/ke/catalogues/ke-orpp-catalogue.json`. No licence statement was found on the site; reuse terms are recorded as unassessed. Raw files: `.data/raw/orpp/`.

## 3 November 2026: statistics, electoral register and derived indicators (lane D2)

All loaded into `mzizi` through stage, validate, review by the agent account (rationale recorded) and promote, with attributions to preserved source files. A dump was taken before each load (`/tmp/d2/*.dump`, not kept in the repository).

- **Geography measurements.** `measure` computes geodesic area, perimeter (PostGIS on `geometry::geography`) and a label point for every current boundary: 1,754 units, 3,508 observations (`geography.area_km2`, `geography.perimeter_km`, estimate kind derived, vintage `geometry/2020`, release label names the boundary version). Label points were also written to `geography.boundaries.label_point`. A replaced boundary gives a new value that supersedes the old one when `measure` is run again. Comparison with HDX COD-AB shapes (332 counties and constituencies matched): 7 differ by more than 5 percent (Kericho, Bomet, Baringo South, Bura, Belgut, Kilome, Central Imenti); the first two and Belgut are units whose shape was clipped or reparented, so the difference is expected.
- **Publisher catalogue.** `seed/ke/catalogues/ke-statistical-catalogue.json` (custom-prepared from manual research) seeded by `seed statistical-catalogue`: 9 publishers, 4 new expected sites, 12 candidate domains, 19 publication records with licence `unassessed`. Exact-host rules added for `knbs.or.ke`, `www.knbs.or.ke` and `iebc.or.ke`; the agent account approved `ke/knbs`, `ke/ca`, `ke/cbk`, `int/hdx`. **KNBS serves an incomplete certificate chain** (the Let's Encrypt intermediates are missing). Verification was not disabled: the two public intermediates (YE2 and Root YE, signed by ISRG Root X2, which the system already trusts) were added to a bundle in `.data/knbs-ca-bundle.pem` and passed through `SSL_CERT_FILE` for KNBS fetches only.
- **2019 census, Volume I.** National, 47 counties and the sub-county tables, after 734 arithmetic checks (sex adds to total, counties to 47,564,296, sub-counties to counties, land areas to the national area) with no failure. 1,827 observations: population total and by sex (sex dimension), population in households, households, average household size and the land area as published (`geography.official_land_area_km2`, kept apart from the computed area). **Constituencies and wards:** KNBS Volumes I and II publish sub-counties and sub-locations, not constituencies or wards, so ward population is a recorded gap. 182 of 345 sub-county rows (including forests and parks) were linked to a constituency because the names are identical within the county; they carry medium confidence and a release label saying so. 163 stay unlinked (list in the run diagnostics). The quality rules show this link is not safe for all units.
- **Breakdowns (Volume IV).** Religion by county (13 categories, group counts, `religion` dimension) and ICT by county (mobile phone ownership, internet use, computer use, each with the sex dimension), 1,248 observations, 206 checks passed. **Ethnicity and nationality (Table 2.31) is not loaded**: it is published nationally only and its numbered groups plus the "Kenyan so stated" row add to 47,055,780 against 47,067,376 Kenyans (11,596 apart). Age by sex (Volume III, downloaded), education, disability and the survey-based economic indicators (KIHBS, KDHS, CRA marginalisation index) are not loaded. Ethnic and religious tables are group counts only and must be published only as such.
- **Electoral schema.** Electorate (registered voters, votes cast, valid, rejected, spoilt, register version, result status, evidence form), referendum questions, options and results, party-list and nominated seat allocations. Migration `1794800000000`, Dryv contracts regenerated, engine tests (`test/electoral.test.ts`).
- **IEBC register of voters.** 2022 (47 counties, 282 of 290 constituencies, 1,337 of 1,450 wards), 2017 (47, 282, 1,333; diaspora and prisons registers are not geography units and stay unlinked) and 2013 (47 counties, 272 constituencies, from the "4th March 2013 General Election Data" book). Totals reconcile to the published 22,102,532 (2022), 19,611,423 (2017) and 14,388,781 (2013); constituencies or wards that fail to add are held back. The remaining rows did not match a unit by name and are listed in the staging reports. **Not loaded:** candidates and results for 2013, 2017 and 2022, turnout, rejected ballots and referendum results. The 2013 book holds results by county, constituency and ward; the 2017 data report and the 2022 forms exist, but loading candidates must pass the person matching system and was not done in this lane. The register for 2013 at ward level is not published in the book.
- **Derived indicators.** Registry in `derived.py` (density, voters per population, NG-CDF per person and per km2, turnout and vote share registered but waiting for electoral inputs). Loaded: density 230 units, NG-CDF per person 180, per km2 279 (financial year 2019/20), voters per population 228. Each value links to its inputs in `observation_derivations`; `derive stale` lists values whose inputs were superseded.
- **Quality.** `quality run` stored 291 findings (rules: official versus computed area, density bound, voters above a plausible share of population, county versus sum of name-matched constituencies, register parent versus children). The agent account disputed 16 (the density of Mathare and 15 constituencies whose registered voters exceed 75 percent of the name-matched population), which adds a `disputed` verification to the figure. The rest are open for review. Cross-source population (KNBS against HDX COD-PS and WorldPop) is not run: the HDX files answered 202 or timed out through the gate and WorldPop was not fetched.

## 3 November 2026: reinforcement, claims, markers and Wikimedia (lane F2)

Refill handler `wikidata` is registered (ids, markers, descriptions, abbreviations); found values become proposed claims, are reviewed by the agent account (audit decision with rationale) and promoted in place by `promote-claims`; a different existing value is never overwritten. ORPP, KNBS, IEBC and Kenya Law refill handlers are not written: no collected data exists to refill from, so their gaps stay open and no attempt is logged. Wikimedia hosts are a registered, assessed site (DEC-WIKIMEDIA-API-ACCESS). Files are stored only with a recorded free licence; skipped ones are listed in `.data/reports/wikimedia-media.json`. Wards and constituencies are not given flag searches (level expectation none). Review workbench publishing of coverage is not done.

Coverage on `mzizi` after this run:

| Table | Field | Rows worth chasing | Present | Known absent | Unknown | Claims proposed | Disputed | Coverage |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| geography.units | parent_id | 1790 | 1789 | 0 | 1 | 0 | 0 | 99.9% |
| geography.units | valid_from | 1790 | 0 | 0 | 1790 | 0 | 0 | 0.0% |
| geography.units | wikidata_id | 338 | 120 | 0 | 218 | 3 | 0 | 35.5% |
| geography.units | flag_marker | 48 | 15 | 0 | 33 | 0 | 0 | 31.2% |
| geography.units | emblem_marker | 48 | 25 | 0 | 23 | 0 | 0 | 52.1% |
| political.parties | registry_identifier | 144 | 142 | 0 | 2 | 0 | 0 | 98.6% |
| political.parties | abbreviation | 144 | 143 | 0 | 1 | 0 | 0 | 99.3% |
| political.parties | registry_authority_id | 144 | 142 | 0 | 2 | 0 | 0 | 98.6% |
| political.parties | symbol_url | 144 | 0 | 0 | 144 | 0 | 0 | 0.0% |
| political.parties | valid_from | 144 | 141 | 0 | 3 | 0 | 0 | 97.9% |
| political.parties | wikidata_id | 144 | 12 | 0 | 132 | 3 | 0 | 8.3% |
| political.parties | logo_marker | 144 | 0 | 0 | 144 | 0 | 0 | 0.0% |
| governance.institutions | scope_geo_unit_id | 195 | 195 | 0 | 0 | 0 | 0 | 100.0% |
| governance.institutions | legal_basis_id | 195 | 0 | 0 | 195 | 0 | 0 | 0.0% |
| governance.institutions | description | 195 | 193 | 0 | 2 | 0 | 0 | 99.0% |
| governance.institutions | valid_from | 195 | 0 | 0 | 195 | 0 | 0 | 0.0% |
| governance.institutions | wikidata_id | 195 | 45 | 0 | 150 | 1 | 0 | 23.1% |
| governance.institutions | logo_marker | 195 | 2 | 0 | 193 | 0 | 0 | 1.0% |
| governance.offices | description | 421 | 421 | 0 | 0 | 0 | 0 | 100.0% |
| governance.offices | valid_from | 421 | 0 | 0 | 421 | 0 | 0 | 0.0% |
| governance.holders | valid_from | 424 | 417 | 0 | 7 | 0 | 0 | 98.3% |
| governance.holders | selection_procedure_id | 424 | 0 | 0 | 424 | 0 | 0 | 0.0% |
| person.individuals | wikidata_id | 423 | 39 | 0 | 384 | 0 | 0 | 9.2% |
| person.individuals | portrait_marker | 423 | 2 | 0 | 421 | 0 | 0 | 0.5% |

### 3 November 2026, second pass (lane D2)

- **Cross-sources.** HDX data files (COD-PS population) answer HTTP 202 with an AWS WAF bot challenge (`x-amzn-waf-action: challenge`): not bypassed, so the KNBS-versus-HDX check is blocked (the CKAN `package_show` metadata is saved). The DHS Program API is disallowed for our agent by its robots.txt (not fetched). The CRA site (`crakenya.org`) has an expired TLS certificate (not fetched). WorldPop is a GeoTIFF raster; zonal sums were not computed. The World Bank series SP.POP.TOTL for Kenya was fetched and loaded; the quality rule `population.knbs-vs-worldbank` records that the KNBS census count (47,564,296) is 7.1 percent below the World Bank's 2019 figure (51,202,827), a different compilation (UN projection), left open for a reviewer.
- **Constituency population.** `census-links` scores each KNBS sub-county against the constituencies of its county (0.6 name similarity plus 0.4 agreement between the KNBS land area and the area computed from the boundary shape; one-to-one, margin 0.1). 26 links are written as claims (`census_2019_population_total` on the constituency, attributed to Volume I, medium at 0.75 or more and low at 0.6 to 0.75), not as canonical observations; 137 sub-counties stay unlinked. The 182 earlier canonical observations linked by exact name were re-checked with the area evidence: 30 units have an area agreement under 0.6 (Kinango, Kilifi North, Malindi, Ijara and others), so the sub-county is evidently not the constituency; their 208 observations carry a `disputed` verification (finding `population.link-weak-area`, decision by the agent account). Ward population remains unavailable from KNBS volumes.
- **Ethnicity (Table 2.31) explained and loaded.** The 11,596 gap was my own reading error: the table numbers Kenyan communities 1 to 45 and then restarts at 1 for non-Kenyan nationalities, so the first eight communities were overwritten. With the numbering fixed the Kenyan communities plus "Kenyan so stated" add exactly to 47,067,376 and Kenyans plus non-Kenyans plus not stated to 47,564,296. 48 national group counts are loaded (dimension `ethnicity`). The eight non-Kenyan nationalities add to 457,290 against a published 463,562 and are left out. County-level ethnicity is not published in this volume.
- **Volume III.** Age by five-year group and sex for all 47 counties (2,068 observations, 94 checks passed: groups add to male and female totals and equal the Volume I counts).
- **Poverty.** Kenya Poverty Report 2021 Table 4.4: headcount rate, gap, severity and number of poor for the nation and 47 counties (192 observations, estimate kind survey, 49 checks passed). KIHBS and KDHS tables, the CRA marginalisation index, education and disability tables are not loaded (see sources above).
- **Electoral.** 2013 turnout (votes cast over registered) for 45 counties as new versions of the register rows; the book lists the figures for Kericho and Bomet under swapped labels (they add to the sub-total only as a pair), so both are held back, not re-assigned. Derived `derived.turnout` for 45 counties matches the book's percentages. The 2017 and 2022 results portal `forms.iebc.or.ke` (added as a domain of the IEBC site, assessed by the agent account) serves scanned Forms A, B and C as images per polling station: no machine-readable results route. **Candidates and results for 2013, 2017 and 2022 are not loaded**: they require creating person records for thousands of candidates through the matching system and the 2013 book's results tables were not parsed in this pass.

### 3 November 2026 (lane G): procurement, all years

- **Counts (real database).** Tenders: 263482 rows, 262257 current, the rest closed earlier releases kept as versions. Contracts: 79346. Procuring entities and their units, identifiers and locations are all promoted for 2018/19 to 2026/27 (the older OCDS years were imported with `import-procurement` per year, stages A to D, then validate, review, apply-review, promote).
- **Tender versions.** A tender seen again in another year's file with a different payload is a new version of the same canonical tender. Promotion keeps one current row per code: the release with the latest `published_on` is current; a release published earlier is stored as a closed historical version (`valid_from` its publication date, `valid_to` the current release's publication date). A newer release closes the previous one at its own publication date. Every version keeps its own source attribution and verification; an identical release only adds attribution. Contracts reference the tender version that was current when they were promoted. Migration `1795400000000` adds `tenders.version_number`, unique `(code, version_number)`.
- **Codes are keys.** Tender and contract codes widen from 200 to 300 characters (Dryv `LongCode`); none is truncated.
- **Validation.** A null value for a required field (a tender without a title) is now an error, so it can no longer be approved and crash a promote run.
- **Contact data.** The importer removes email and phone text from procuring-entity addresses and tender titles. Digit runs inside source-assigned OCDS codes that only look like phone numbers were cleared on review (audit note on each candidate).
- **Still open.** 4 supplier names with a telephone number written into the name stay quarantined (and 4 contracts that depend on them); 1 tender has no title in the source; the user decision on whether to edit such names is pending. Contract-to-tender links point at the version current at promotion time, not always at the newest.

## Priority publishers (Lane E, 3 November 2026, TSK-2A15C7E9908D)

Catalogue: `seed/ke/catalogues/ke-priority-publishers-catalogue.json` (custom-prepared from manual research), section families `ke/publisher/*` in `ke-site-sections.json`, Parliament linked to its institution in `ke-expected-sites.json`. All hosts are `.go.ke`; no exact-host rule was needed. Crawl outcomes on `mzizi` (bounded, gated, 0.2 req/s): Parliament 122 new documents (stopped at the 150-request budget; files over 25 MB skipped), Auditor-General 35 (apex host fails TLS, `www` is now primary), Controller of Budget about 116 (WordPress Download Manager: crawler reads `?wpdmdl=` links and `onclick` handlers, `--max-depth 3`), NLC 0 files (package pages expose no file link without JavaScript), Gazette blocked (`kenyagazette.go.ke` does not resolve in DNS; Kenya Law is never contacted).
Legal import: extractor `legal-pdf`, importer `import-legal-documents` (stage A instruments, B provisions, `--flag-figures`). Promoted: 5 instruments (NG-CDF Act with 62 sections, Controller of Budget Act with 27, two Bills with 11 and 3, one Gazette notice without issue data) and 103 provisions. Budget, audit-report and financial-statement documents (84) carry an open `figures_review` gap (9 with extracted amounts); no figure is promoted. Instrument scope is the Kenya jurisdiction (no finer geography column exists). Known limits: the classifier labels many order papers as bills (the extractor refuses them); Hansard has no parser; Acts are `in_force` as published, repeals not applied.


## Place research (lane H4, 3 November 2026, TSK-EBA9E2370C55 and TSK-4864E3B1AD5E)

Rules and reasons are in `DEC-PLACE-RESEARCH` (`.docs/decisions/place-research.md`); the handoff is `.docs/handoffs/place-research-handoff.md`. A generated expectation is never evidence of a building.

**IEBC constituency offices PDF** (`.data/raw/89f94eabaa4c-...pdf`, 22 pages): 293 rows read: 276 matched a constituency unit of their county by rapidfuzz (similarity at least 90, lead of at least 6), 6 are county-level offices linked to their county, 11 stay unlinked and are reported in `.data/reports/constituency-offices.json` (Garissa Township, Chuka/Igambang'ombe, Mbeere South, Mbeere North, Mwingi Central, Tindiret, Bureti, Sisiria, Homa Bay Town, Dagoretti North, Dagoretti South: the geography table spells these differently). 293 candidate places were created (site, address text and landmark, no point), each attributed to the preserved PDF capture with the page and row as locator. 280 were verified by the agent account (similarity 95 or more, or county office) and each got an occupancy of the IEBC institution scoped to that constituency or county; two matches between 90 and 95 are `under_review`. 280 expectations moved from `expected` to `identified`; 16 constituency and 41 county IEBC office expectations remain `expected`. NG-CDF offices (290) and MP seats (337) have no source naming a location and stay `expected`.

**Landmark places** (seed `ke-landmark-places.json`, custom-prepared from manual research): 109 places and 110 occupancies for 16 national bodies' headquarters and 47 county governments and 47 county assemblies; all `unverified`, text addresses only, no expectation resolved.

**Refills**: handlers `site_documents`, `wikidata_place` and `osm_nominatim` are registered through `register_refill`. Wikidata (through the gate at 0.2 requests a second) was run on a first batch of landmark gaps: 2 points found as proposed claims (State House, KEMRI headquarters), 8 not found, the rest of the 109 gaps returned to `open` (the run was stopped, not exhausted). **OpenStreetMap Nominatim is refused by its robots.txt**, so no OSM point exists; with a single Wikidata claim (trust 0.51) nothing is applied or resolved. `place-apply` applies only corroborated or trusted claims.

**Duplicates**: 2,112 places scored, 700 pairs flagged in `engine.match_candidates` (kind `place`): 116 with a similar address or point, 584 name-only items capped at 0.7. Nothing merged.

**Integrity** (`checkIntegrity`): new rules for places and occupancies without an attribution, expectations resolved by an unattributed or ended occupancy, pattern-generated rows that do not match their pattern's newest version, a person's contact that is not restricted, and a public contact without an attribution. The real database violates none of them. `resolveContact` no longer lends one occupant's contact to another.

**Not done**: contact claims through the refill framework and a live contact import (no preserved document publishes a switchboard); a source-reading enrichment job for structures and spaces (the tested function `add_space` needs a source that names them).

Coverage report (`place-coverage --markdown`, real database `mzizi`):

| Measure | Count |
|---|---:|
| Places (current) | 2112 |
| Places with a point | 0 |
| Places with address text | 2112 |
| Places linked to a geography unit | 2067 |
| Structures, floors, wings, rooms (non-site places) | 0 |
| Places with a building type | 0 |
| Occupancies | 2137 (active 2137, moved 0, closed 0) |
| Duplicate-place flags awaiting review | 700 |

| Expectations by status | Count |
|---|---:|
| expected | 1393 |
| identified | 280 |

| Family | Status | Count |
|---|---|---:|
| county governments and assemblies | expected | 94 |
| IEBC constituency offices | expected | 16 |
| IEBC constituency offices | identified | 274 |
| IEBC county offices | expected | 41 |
| IEBC county offices | identified | 6 |
| NG-CDF constituency offices | expected | 290 |
| other institutions | expected | 615 |
| seats and posts | expected | 337 |

| Contact scope | Visibility | Count |
|---|---|---:|
| organization.entities | restricted | 3402 |
| political.parties | restricted | 249 |

| Place claim | Review | Count |
|---|---|---:|
| latitude | proposed | 2 |


### Priority publishers, second pass (Lane E, 3 November 2026)

- **Crawls resumed** (250 requests per host, size cap 60 MB for Parliament): Parliament 349 documents (order papers, Hansard, budget books, standing orders), Controller of Budget 190 (a further run found no new files, the reachable sections are exhausted), NLC 113 (the file link sits in a `data-downloadurl` attribute; the crawler now reads it), Lands 26 (`lands.go.ke` has dead links, 72 answered 404), Auditor-General 34. The wp-json route does not expose NLC packages; its sitemap lists package pages only.
- **Gazette**: no other official domain was found by web search; `kenyagazette.go.ke` still does not resolve. The online archive on Kenya Law is challenge-gated and never contacted. The Parliament library repository (`libraryir.parliament.go.ke`, site `ke/parliament-library`, DSpace REST API, harvested with `harvest-dspace`) holds Gazette issues: 43 registered, 33 notices promoted (OCR text; notices without a readable issue volume are not keyed). Issues over 60 MB (100 to 380 MB compilations) were skipped.
- **Classifier 1.2.0**: order papers and Hansard are recognised from their heading and no longer labelled as Bills. Parser `sitting-pdf` and importer `import-sittings` load sittings as `calendar.events` (root geography unit, status planned for order papers and completed for Hansard): 233 staged, 231 promoted, 2 deferred. Speakers, motions, Bills and division counts are read (division totals are checked against the 349 or 67 members); only counts and the presiding officer enter the event description, the speaker list stays in the extraction result. No votes or speakers tables exist yet.
- **Legal**: 52 instruments (14 Acts, 2 regulations, 2 Bills, 33 Gazette notices, the Constitution) and 1,302 provisions. Land, Public Finance Management, Physical and Land Use Planning, Urban Areas and Cities and other Acts have complete section sets checked against their arrangement.
- **Figures**: 84 documents carry a `figures_review` gap. A table survey (`pdf` tables profile and the budget-table row reader, 84 documents) found allocation-like rows in 4 documents; their own checks reported mismatches (recurrent plus development differs from total) and receipts tables rather than allocations, and no fiscal year can be read from their titles, so none was staged. Under DEC-COMPLETION-FIRST they stay flagged until a fiscal year is supplied; the 47 oversize or non-PDF files were not read.
- Two database-engine tests fail (`entities and migrations have not drifted`, places `no source columns`); they come from uncommitted places and finance changes of other lanes, not from this lane.

## Lane S: completion sweep under DEC-COMPLETION-FIRST (3 November 2026)

Everything earlier lanes held back for soft problems was re-approved by the agent account and promoted unverified, with the warning in the rationale. Backup before the sweep: `.data/backups/mzizi-pre-lanes-202611031200.dump`.

| Staging status in `mzizi` | Before | After |
|---|---:|---:|
| invalid | 47 | 2 |
| quarantined | 8 | 0 |
| approved but not promoted | 263 | 217 (all already canonical; 48 key-duplicates closed as `superseded`) |
| promoted | 538,352 | 538,403 |

- **Suppliers with phone digits in the name (4).** The name text after the P.O. box or phone marker was stripped (SMARTSEERS CONTRACTORS AND SUPPLIERS LIMITED, G5 HAULER LIMITED, AMANA INSURANCE BROKERS LIMITED, THE NIMPLE); a new candidate supersedes the quarantined one, which keeps the original name. The digits are kept as `restricted` phone contact points labelled unverified (one of them may be a mangled P.O. box). The 4 supplier entities, their 4 tender-portal identifiers and the 4 contracts are promoted.
- **Boundaries.** Containment became a warning when `MZIZI_CONTAINMENT_SOFT=1` (default stays an error; the test is unchanged). 35 boundaries were promoted unverified with the measured percentage in the issue (3.8 to 50.5 percent outside the parent); 5 candidates still pointed at pre-reparenting ward codes and were restaged against the new codes. All 1,452 wards now have a current boundary (1,790 boundaries); they need a gazetted source geometry and the HDX cross-check was not re-run.
- **Census false positives.** 4 census candidates (2 observations, 2 dimension links) were quarantined because a count looked like a phone number; they are cleared on review and promoted. The one contract whose OCDS code looked like a phone was promoted.
- **Constituency offices.** Of the 11 unlinked rows, 5 were linked by best fuzzy match (Tindiret to Tinderet 87.5, Sisiria to Sirisia 71.4, Homa Bay Town to Homa Bay 77.8, Dagoretti North and South both to Dagoretti 78.3); the two 90 to 95 matches (Mukurwe-Ini 94.7, Emurua Dikkir 92.3) were promoted. All are `unverified` with the score in the rationale; 4 have an occupancy and a resolved expectation, the two Dagoretti rows share one unit so only the place is linked. Six rows stay unlinked (Garissa Township, Chuka/Igambang'ombe, Mbeere South, Mbeere North, Mwingi Central, Bureti): the geography spells them so differently that the best score is 30 to 74 with no lead.
- **Unscoped offices (10).** 5 scoped by fuzzy match, unverified (Homa Bay Town, Dagoretti North, Dagoretti South, and the Tharaka Nithi Senator and Member of the National Assembly to county `ke/tharaka`). 5 stay unscoped: no match above 70 with a lead.
- **Ward count.** The 2022 register's 1,450 wards against 1,452 units is recorded as an `audit.comments` data note on the country unit; both are kept (Mwiki and Tarakwa are drawn twice by the source).
- **Not promoted, hard checks.** One tender (`ocds-5whusi-KPI/9A.2/DT/015/ADM/21-22`) has no title in the source (required field) and one contract depends on it.
- **D2 leftovers.** The 26 proposed constituency population claims (medium and low score, one sub-county per constituency) were accepted and written as canonical `census.population` observations with confidence `medium` or `low`, release label naming the sub-county and score, verification `unverified`; the claims are marked promoted. 137 sub-counties stay unlinked. Ward population remains absent (KNBS does not publish it).
- **F2 leftovers.** `gapclose.py` closes gaps the loads already filled (69 closed as found), marks independents and the Azimio coalition as `known_absent` for registry fields (6), and adds an `orpp` refill handler that reads the staged ORPP candidates (no request). Result on parties: registry identifier, authority and start date are found for every registered party; one start date and one abbreviation remain `not_found`. KNBS and IEBC handlers were not written: their data is loaded as observations and results, not nullable columns, so no gap exists for them. The coverage table above stands; the review workbench has no coverage or gap view and adding one needs an API contract and page, so that item stays open.
- **C leftovers.** A bounded ORPP crawl (62 requests, 34 pages, all HTTP 200 or 301, no refusal) found no party constitution or officials list: the site publishes notices, forms and reports only, and all 89 linked files were already registered. Party websites on .ke and .com hosts were not touched: no host list exists yet, each needs an exact-host rule and assessment first (a Wikidata website pass would produce the list).

## 3 November 2026: domain probe completed (lane A3, TSK-41CD5EF36909)

**NG-CDF real layout.** The directory page `https://ngcdf.go.ke/constituency/` (crawled 2 Nov, sha256 `d8eaaa45...`) links 290 per-constituency subdomains with unquoted hrefs and a different spelling convention from our unit names (`kitutuchache-south`, `nakurutown-east`, `homabay-town`, `mukurwe-ini`, `oljoro-orok`, `soin`, `bureti`, `maragua`, `emuria-dikirr`, and our older names Siakago, Gachoka, Nithi, Dujis, Mwingi East mapping by elimination to `mbeere-north`, `mbeere-south`, `chuka`, `garissa-township`, `mwingi-central`). The list and 17 overrides are in `seed/ke/policy/domain-spellings.json`; `expand-patterns` now puts the directory spelling first and `apply-directory` (offline, idempotent) added 17 `page_link` candidates plus 2 Dagoretti hosts (Dagoretti North and South cannot be mapped to our Dagoretti and Kilimani units without guessing, so both are aliases of the Dagoretti site; Kilimani has no host) and marked 134 unlisted pattern spellings `unreachable` (kept, not deleted). Of the 302 earlier NG-CDF failures, 168 were real listed hosts with slow origins: they were retried with a 30 s timeout (and 45 s on four), and many recovered. `probe-domains --retry-timeouts` is resumable and counts a timeout as retryable, not as a missing host.

**Non-.go.ke hosts.** Exact-host rules with a per-host rationale (DEC-AUTO-APPROVAL, agent account) were added for 20 Kenyan public bodies (CMA, CRA, CUE, HELB, KALRO, KCAA, KEBS, KenGen, KeNHA, KFS, KICD, KNCHR, KNEC, KNH, KPA, Kenya Power, Kenya Railways, NGEC, NSSF) and `forms.iebc.or.ke`. Not Kenyan public bodies, kept as candidates with a reason: gazettes.africa, World Bank, DHS Program, WorldPop (8 hosts). Many non-.go.ke failures are TLS chain or expired-certificate errors; verification is never disabled.

**Refused (kept, no retry):** ira.go.ke and meru.go.ke and www.ca.go.ke (captcha), rba.go.ke (403), kalro.org (robots.txt disallows the home page).

**Counts after (domains 686):** reachable 304, redirects 32, moved 4, unreachable 325, refused 5, candidate 16. By zone: go.ke reachable 291, redirects 25, moved 2, unreachable 315, refused 4, candidate 5; or.ke 4/2/0/3; co.ke 2/1/0/3; ac.ke 1/0/0/1; org 6/2/0/3 (+1 refused, 5 candidate). By origin: pattern 514, seed_research 131, page_link 20, manual 13, redirect 6. Sites: discovered 317, expected 164, profiled 8. NG-CDF: 194 hosts reachable covering 192 of 290 constituency sites; the rest still time out (real hosts, retried once; try again later).

**Profiling.** A reachable home page is now fingerprinted from the probe response (no extra request; 312 fingerprint rows). A separate profile crawl for discovered sites was not run (it needs a structure per site and would exceed the 400-request cap): queued.

## Lane P3: national office holders (3 November 2026)

Wikipedia list pages are read through the MediaWiki API (`en.wikipedia.org` joined the `wikimedia` site, 0.2 requests per second) and a curated seed (`ke-office-holders-curated.json`, unverified) is imported with `office-holders.sh A|B|C` (importer `imports/office_holders.py`). Loaded: members of the 11th and 12th Parliaments, senators 2013/2017/2022 including nominated seats, current Cabinet and previous cabinets (partial), Attorney-General, Chief Justices, Deputy Presidents, Speakers, party leaders of both Houses, inspector-general, DPP, Auditor-General, Controller of Budget and several commission heads, and about 290 13th Parliament holders attached to the seeded seats by place name with a score. Real database after the second pass: 3,691 people, 3,913 holders (2,916 current), 2,759 party memberships (counts include other lanes). The placeholder person `ke/person/vacant` was ended, not deleted. Remaining gaps: Principal Secretaries beyond three, commission members, Court of Appeal and High Court judges, state corporation chiefs and Gazette appointment notices (need notice extraction); Dagoretti North/South and Mwingi Central sit on aliased seats at score 0.85 and need review; 300 duplicate pairs are flagged.

### Lane P3, third pass (3 November 2026)

Gazette appointment extractor `gazette-appointments` (OCR text, tolerant regexes, rapidfuzz institution match from 85) ran over every Gazette issue in the registry after a bounded harvest of 37 more issues from the Parliament library (83 files): only one issue gave readable names (6 tribunal members, promoted unverified); other appointment notices were rejected for corrupt OCR names, so the real source for Principal Secretaries, board chairs and CEOs remains Gazette scans with better OCR or the agencies' own pages. API: `GET /v1/governance/office-holders/search` (filters q, office, institution, party, county, officeId, institutionId, personId, current; rows carry person, office, institution, place and party names). The guessed seat links for Dagoretti North/South and Mwingi Central are `under_review` with the guess in the rationale. Importer note: the first runs wrote preserved sources to a stray `source/backend/engine/data/.data/objects`; they were copied into `.data/objects` and the script now passes an absolute `--store`.

## Lane P2: county assembly members (3 November 2026)

Real database after the lane: 8,163 people (was 423 before the lane) and 3,015 current holders; 2,350 of the people are MCAs or assembly clerks. 1,433 of 1,452 ward MCA posts have a current holder, 910 nominated holders sit on the shared marginalised-group and gender top-up posts, 5 speakers and 6 clerks are loaded. Source: IEBC Gazette Notices 9956 (elected), 10712 and the 21 September addendum 11259 (nominated), fetched through the gate; 30 assembly sites harvested (Marsabit stopped on a captcha; 17 domains do not resolve). Second pass on unplaced wards: 6 linked, 5 of them recorded `under_review`, 28 missing from the geography tree (for example Kericho's Bureti wards), 22 are duplicates of an existing ward holder, listed in `.data/reports/mca-unplaced-resolution.json`. `dedup person`: 140 MCA-involving pairs flagged, 1 auto-merged. Not found: by-election winners of the 7 postponed wards, clerks for 41 counties, party for site-only members. See DEC-COUNTY-ASSEMBLY-MEMBERS.

### Lane P3, fourth pass (3 November 2026)

`fetch-leadership` fetched the leadership pages of 55 reachable institution sites (159 pages, gate 0.2 req/s, six pages per host at most; redirects followed only inside the approved host list) and the `leadership-page` extractor read name and title pairs; 138 holders were loaded unverified, linked by title suffix and fuzzy state-department name to the seeded Principal Secretary, Cabinet Secretary, chairperson, commissioner and chief-executive offices. Gazette appointment pages are re-OCRed with Tesseract at 300 dpi (only pages that hint at an appointment), which turned noisy names into clean ones (Rosemary Wacera Kuria, Timothy K. Toroney); two notices name institutions not in the database (Kenyatta International Convention Centre, National Cancer Institute) and stay unlinked. Gaps: 68 title lines had no readable name; Principal Secretary lists on sites that render in JavaScript were not seen; court benches (Court of Appeal, High Court) have no leadership page of this shape.
