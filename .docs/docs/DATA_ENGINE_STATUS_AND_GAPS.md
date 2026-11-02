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

**Needs a human (an agent must not do these)**
- Name the six accountable roles and create reviewer grants (`KENYA_JURISDICTION_DOSSIER.md`).
- Confirm every recorded licence; approve or reject source assessments (none exist; the gate refuses all sites).
- Counsel review of the Kenya dossier; verify the law lists against official texts; decide on ODPC registration and DPIA.
- Assess the external AI provider and other processors before any personal or restricted content is sent.
- Provide a monitored contact address and bot page; set `MZIZI_USER_AGENT`. Until then the engine refuses live requests, so **no live probe, crawl or drift check has ever run against a real site**.
- Record real review decisions through the API (tests use a test reviewer account).

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
