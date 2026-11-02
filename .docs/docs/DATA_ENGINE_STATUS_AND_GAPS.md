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
- Source assessments and dossier stages: sites under a trusted suffix (`.go.ke`) are approved by `auto-assess`; the Kenya dossier was moved to pilot by the agent account on 2 November 2026. Other suffixes need an entry in `fixtures/policy/trusted-domains.json` or an explicit approval.
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
- **Governance structure seed.** `fixtures/seed/ke-governance-structure.json`: 100 institutions (arms of government, ministries, constitutional commissions, independent offices, courts, state corporations and regulators) plus a government and an assembly for each of the 47 counties generated from the geography units. It is labelled custom-prepared from manual research with a confidence per row; the ministry list must be checked against the current Executive Order.
- **Procurement from tenders.go.ke** (`import-procurement`, stages A to D) for financial years 2025/26 and 2026/27: procuring entities (units and organisations typed from their names, linked to their county), suppliers keyed by portal id, tenders and contracts. Published contact data of public procuring entities is kept as identifiers that the public API hides; supplier contact points stay only in the preserved raw packages. Older years (2018/19 to 2024/25) are downloaded and not imported yet.
- **Matching** (`dedup`, `profile`, `DEC-ENTITY-MATCHING`): the 423 people in `mzizi` produced one flagged pair and no automatic merges.
- **Databases.** `mzizi` real, `mzizi_dev` disposable preparation, `mzizi_test` the single scratch database.
- **Open:** import the older procurement years; replay the portraits and verify the count; link more entities (suppliers' addresses are free text); the 90 deferred boundaries; wards still unverified; IEBC constituency offices, Senate and county assembly members, county workers, Acts, Hansard and gazettes.

## 2 November 2026 (morning): site registry for every place and body, and the statistics plan

- **Site records.** `mzizi` now holds 481 sites: 47 county governments and 47 county assemblies (from the county geography units and the domain patterns), 290 constituency fund committees (NG-CDF pattern), 89 national bodies from `fixtures/seed/ke-expected-sites.json` (custom-prepared from manual research; ministries, courts, constitutional commissions, independent offices, state corporations and regulators, each linked to its institution through `website.subjects`), and the 9 sites already profiled. All new sites are `expected`; their hostnames are unverified candidates and none was contacted. Task: probe and confirm (data engine group).
- **Statistics review.** The statistical schema holds one-dimensional series only (no multi-dimensional breakdowns, measure types, denominators, margins, count-versus-projection flag or derived-from links); the electoral schema holds candidates and per-candidate votes but not registered voters, turnout, rejected ballots, referendum options or list seats; geography has no area although boundary geometry is in PostGIS. A new task group, "Statistics, electoral results and derived data" (nine tasks), plans the schema work, the source catalogue (KNBS, DHS, KIHBS, Communications Authority, CRA, IEBC, HDX, WorldPop), the census and breakdown loaders (including ethnic community, religion and ICT access, as group counts only), the electoral loader, derived indicators (density, turnout, vote share, per capita) and cross-source quality checks.

## 3 November 2026: Dryv generation, deferred boundaries

- **Dryv generation ran.** It had not been tried this session; the engine API starts normally (`.docs/guidance/running-dryv.md` has the steps and traps). Generation created 187 and changed 52 files: read endpoints for the domain, place, contact (entities only) and statistics modules. The typecheck stopped on one project-owned file, `statistics-read.service.impl.ts`, which lacked ten methods; they were added. `bun run check`, `generated:check`, `access:export` and the API unit suite (15,864 passing, 61 skipped) are clean. Committed as `e1354db`.
- **The 90 deferred boundaries** are 80 wards and 10 constituencies whose simplified shape spills 2 to 80 percent outside the parent. Measured against the promoted parents: 55 lie at least 75 percent inside, 21 between 50 and 75 percent, 14 below 50 percent. The cause for at least 11 is that the importer chose the parent by the shape's representative point, which in these overlapping simplified shapes can fall in a neighbour (Chemelil-Chemase has 88 percent of its area in Tinderet but was parented to Aldai). The importer now picks the parent holding most of the shape and reports when that differs from the point's parent (test added). **Not yet applied to `mzizi`**: correcting a promoted unit's parent changes its business code, so it needs a replacement unit through the staging path, and the other 79 need either a better geometry (HDX has only levels 1 and 2) or a recorded containment waiver. Both stay open under the geography verification task.
