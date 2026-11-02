---
{id: DOC-DATA-INTAKE-PLAN,name: DATA_INTAKE_PLAN,type: documentation,tags: [data-engine,intake,provenance,planning]}
---

# Data intake plan

How real data enters Mzizi. The database (19 schemas, 96 tables) and the NestJS API exist; only two test fixtures populate them. This plan describes the path from a public artifact to a canonical row, which datasets feed which schema, and the order of work. It extends `DATA_LIFECYCLE.md` and does not replace it.

**Scope.** Kenya is the full suite: every schema is planned and built in waves. South Africa, Nigeria and Tanzania are a proof of concept: jurisdiction, administrative boundaries (levels 1 and 2) and one population table each, using exactly the same pipeline. If the pipeline needs country-specific code, the design is wrong.

**Status of facts.** Dataset names below are candidates from general knowledge. Nothing here has had its licence, format or current availability verified; each intake task begins with that check and records it in the `source.documents` licence field. A dataset with an unclear or non-commercial licence does not enter canonical data.

## 1. Principles

1. Bulk download or API first; scraping only when no file or API exists, and never past access controls, CAPTCHAs or robots policy.
2. One pipeline for every country. Mapping produces records (jurisdictions, classifications, units), never schema changes.
3. Raw evidence is preserved before anything else happens; every later step is derivable from it.
4. Extraction, intelligence and promotion are separate stages with separate owners. Only the database engine writes canonical rows and verification state.
5. Re-running never overwrites: a rerun creates a new extraction result; a correction creates a new record version and supersedes the old one.
6. Provenance is written with the record, in the same promotion transaction.

7. **Legal and source approval is a separate gate** (`LEGALITY_SAFETY_AND_COMPLIANCE.md`). Public visibility is not permission. No scheduled or bulk collection runs for a source whose legal/source assessment is missing, expired or outside scope, and no country moves from research to production collection without a jurisdiction dossier and its launch checklist. Technical success (a valid structure, a healthy site, a clean extraction) is never evidence of legality or accuracy.
8. **Personal data is excluded by default.** The default scope is institutional, legal, geographic and aggregate statistical information. Identity numbers, biometrics, health, children, home addresses, protected attributes and criminal records need specialist review and explicit approval; person-level lists and cross-source person profiles need a documented purpose and lawful basis. Unexpected personal data quarantines candidates instead of promoting them.
9. **Licence and rights travel with the source.** `source.documents` records the rights holder, licence name/version/URL, attribution and reuse conditions; a missing or ambiguous licence blocks publication of the content (not necessarily internal assessment).
10. **External processors are assessed first.** No personal, confidential or restricted source content goes to an external AI or cloud provider until its role, location, retention and transfer basis are assessed; minimise or redact before sending.

## 2. Source tiers

| Tier | What | Examples | Handling |
| --- | --- | --- | --- |
| A | Machine-readable open datasets and APIs | boundary GeoJSON/shapefile, CSV/XLSX statistics, results sheets, open-data portal APIs | parse directly; automatic validation, light review |
| B | Documents | PDFs and HTML: statutes, gazettes, budget books, tender notices | text/table extraction, pinpoint locators, mandatory review of interpretation |
| C | Discovered sites | institution websites found by AI-assisted research (the attached research note) | later wave; produces source proposals, not data |

Tier A drives the first waves because it proves the whole path with the fewest unknowns.

## 3. Candidate datasets per schema group

Licences are **to verify**, not claims.

| Order | Schema group | Kenya candidates | ZA / NG / TZ (light) | Format | Route |
| --- | --- | --- | --- | --- | --- |
| 1 | `reference` | Kenyan levels, institution and election types, fiscal stages authored as classification records; ISO 3166 codes | one jurisdiction row each, ISO codes | JSON seed | reference seed in the database package |
| 1 | `source`, `filesystem` bootstrap | publishers for each source below; stores and formats (`fixtures/reference/media-formats.json`) | publishers per source | JSON seed | reference seed |
| 2 | `geography` | county, constituency and ward boundaries: HDX common operational datasets, geoBoundaries (CC-BY), OpenStreetMap derived (ODbL); IEBC boundary documents for provenance. Avoid GADM (non-commercial). Legacy `geo_units.csv` (about 550 rows) for names and codes | HDX COD-AB or geoBoundaries levels 1 and 2 per country | GeoJSON, shapefile | file import, extraction, candidates |
| 3 | `legal` | Constitution of Kenya 2010, selected Acts from Kenya Law, Kenya Gazette notices | national constitutions (public texts) | PDF, HTML | document extraction with pinpoint structure (article, clause) |
| 4 | `person`, `governance`, `political`, `electoral` | State institutions and office holders from official sites and Gazette; IEBC results and candidate lists; Registrar of Political Parties list | none in the proof of concept | HTML, PDF, XLSX | extraction plus entity resolution |
| 5 | `organization`, `finance`, `debt`, `procurement` | National Treasury budget documents, Controller of Budget county reports, Public Procurement Information Portal tenders and awards, Kenya Open Data | none | PDF, XLSX, CSV | table extraction; currency and fiscal-year mapping |
| 6 | `statistical`, `civic`, `calendar` | KNBS 2019 census tables and county statistical abstracts, health facility registry, gazetted public holidays | one national census/population table each (Stats SA, NBS, NBS) | CSV, XLSX, PDF tables | dataset parsing |
| runtime | `audit`, `identity` | none | none | none | written by the API and account system, never bulk loaded |

## 4. The path from artifact to canonical row

Stage names follow `DATA_LIFECYCLE.md`. "Writes" lists the rows the stage creates.

| # | Stage | Owner | Writes |
| --- | --- | --- | --- |
| 0 | Assess | human reviewer (agents draft only) | an `assessment` for the site: status, access basis, licence, data categories, approved scope; the engine fails closed without a current `approved` assessment covering the request |
| 1 | Register | data engine (calls files service for custody) | `source.publishers` (if new), `source.documents` (title, kind, publisher, published date, language, licence, citation, URL) |
| 2 | Preserve | files service | `filesystem.objects` (content hash, size, store, key), `filesystem.files` + `filesystem.versions` (in a `source-artifacts` folder), `filesystem.events` (created); then `source.captures` (retrieval time, URL, HTTP status, content hash, tool, file version id) |
| 3 | Extract | data engine | a new `ExtractionResult` (extractor, version, profile, diagnostics, segments/tables/features) stored as a derived file (`filesystem.variants`, kind extract) plus a row in the data engine job table; a `source.methods` row if the extractor is new |
| 4 | Normalise | data engine | primitive normalisation inside the same result: trim, Unicode NFC, number and date parsing with precision, currency codes; no inference |
| 5 | Intelligence (optional) | intelligence | `IntelligenceEvaluation` linked to the result: classification, entity matches, contradictions; `source.methods` of kind `ai_assisted` with tool and model |
| 6 | Candidates | data engine | staging rows: one candidate per intended canonical record (section 5), with natural-key hash and lineage to the extraction result and locator |
| 7 | Validate | database engine | validation issues on the candidate (section 6) |
| 8 | Review | dashboard through the API | `audit.decisions` (approve, reject, request changes) with rationale; the API never touches canonical data |
| 9 | Promote | database engine | one transaction: canonical row (or new version, previous validity closed), `source.attributions` (document, capture, method, locator, confidence) per record, `source.verifications` row with `is_current` (unverified, or verified on an approved decision), candidate marked promoted |
| 10 | Re-evaluate | database engine | new verifications or superseding versions; history is never edited |

### Staging model (implemented)

Implemented in `engine/database` (migrations `staging`, `staging-promotion`) with the rules in `src/staging/`: `validation.ts`, `review.ts`, `promotion.ts`.

- **References by natural key.** A candidate payload may hold `{"$ref": {"kind": "geography.units", "where": {"code": "ke/nairobi"}}}` (produced by the `ref` transform). Validation and promotion resolve it to the current record's id; an unresolved reference is an error, so parents are promoted before children.
- **Statuses.** `pending` (from extraction) then `invalid` or `in_review` (validation), `approved` or `rejected` (review decisions), `promoted`, `superseded`, or `quarantined` (unexpected personal data or a stopped source; quarantined candidates are never validated forward or promoted).
- **Review path.** A reviewer's decision is an `audit.decisions` row with target kind `staging.candidates` (the API accepts that one extra kind and can see only candidate ids). `apply-review` honours a decision only from an account with a current reviewer or admin grant.
- **Promotion rules.** Only approved candidates; the newest decision must be an approval by a reviewer; the candidate must have a capture whose document records a licence; if the capture belongs to a site its current assessment must be approved and not overdue; the payload must still validate; the natural key must match at most one current record. An identical record already present gets only a new attribution. A changed record becomes a new version (`isCurrent` false and `validTo` set on the old row, `versionNumber` + 1, a `superseded` verification on the old row), and only for versioned tables; for any other table a change is deferred, never overwritten. Everything for one candidate happens in one transaction, writes `source.attributions`, `source.verifications` (state from the approving decision, default `unverified`) and `staging.promotions` (the PromotionDecision), and never edits audit tables.

Original sketch:

Same PostgreSQL, a `staging` schema owned by the database engine and not served by the public API. Generic rather than per-domain tables:

```text
staging.runs         one import: dataset id, mapping version, artifact (capture id), extraction result ref, status
staging.candidates   run id, target_kind (schema.table), natural_key_hash, payload (JSON validated against the Dryv contract of the target),
                     lineage (extraction result, locator), status (pending, invalid, in_review, approved, rejected, promoted, superseded),
                     resolved_target_id (set on promotion), supersedes (candidate id)
staging.issues       candidate id, rule, severity, message
```

Typed-per-domain staging would double the schema surface and drift from the contracts; generic JSON validated by the same contract schema keeps one source of truth.

## 5. Candidate shape

A candidate carries: `target_kind`, a payload in contract terms (plain-id references stay as ids or as natural-key placeholders resolved at promotion), valid time with precision (never a bare year as an exact date), the extraction locator, the proposed method and a confidence. Candidates in one run are linked by run-local keys and resolved to real UUIDs at promotion in dependency order (reference, geography, then dependents).

## 6. Validation: where rules live

| Kind | Rules | Home |
| --- | --- | --- |
| Per-domain | contract schema, required fields, classification membership, domain invariants (a boundary needs a unit and a level) | generated from the Dryv contract; domain rule modules in the database engine |
| Cross-domain | geometry valid and non-empty, child contained by parent (with tolerance), level consistent with parent level, money has currency, dates have precision, every plain-id reference resolves, no valid-time overlap for the same natural key | database engine rule set, run at stage 7 and again at promotion; also scheduled integrity jobs over canonical data |
| Provenance | document, capture and licence present before promotion | database engine |

## 7. Entity resolution

| Entity | Deterministic key (first) | Fallback | Rule |
| --- | --- | --- | --- |
| Place | official code (IEBC, KNBS), plus parent and level | normalised name + alias table | unknown names become new units only after review |
| Institution | official name in jurisdiction, registry id | alias + type + parent | merges are proposals from intelligence, applied at review |
| Person | none reliable | name + office + term overlap + external id | never auto-merge; one human is one `person.individuals` row; privacy review before anything beyond public-office data |
| Legal entity | registry number | name + address | stored in `organization.identifiers` |

Aliases go in the domain's `names` table with a validity period. Fuzzy matches are suggestions attached to candidates and decided by a reviewer.

## 8. Idempotency and re-runs

- A capture is idempotent on (URL, content hash): identical bytes create no new object (the store dedupes), and a new `source.captures` row records the new retrieval.
- An extraction result is keyed by (capture, extractor, version, profile); a rerun with a newer extractor is a new result.
- A candidate is keyed by natural-key hash within a target. A re-import with the same payload hash is a no-op; a changed payload becomes a new candidate that supersedes the earlier one.
- Promoting a changed candidate creates a new record version, closes the previous version's validity, appends a `superseded` verification and keeps both attributions. Nothing is updated in place.

## 9. Vertical slice (Wave 0): Kenya county boundaries (implemented)

Runbook (operator, with the database engine and data engine installed; the reviewer step is human):

```bash
# 1. download the simplified ADM0 and ADM1 GeoJSON and the API metadata for KEN from geoBoundaries (samples are in engine/data/tests/data/geoboundaries)
export DATABASE_URL=postgres://postgres@localhost:5432/mzizi_dev
cd source/backend/engine/database && bun src/cli.ts reset                     # migrations, reference seeds (incl. Kenya levels), fixtures
cd ../data && .venv/bin/mzizi-data import-geoboundaries tests/data/geoboundaries   # preserve, register, extract, stage (prints the four run ids)
cd ../database
bun src/cli.ts validate <unit-adm0-run>; # a reviewer records approvals through the API (audit decision on staging.candidates)
bun src/cli.ts apply-review; bun src/cli.ts promote <unit-adm0-run>
# repeat for boundary-adm0, unit-adm1, boundary-adm1 runs in that order (units before their boundaries, country before counties)
```

`engine/data/tests/test_slice_geoboundaries.py` runs the whole chain on the real files with a test reviewer account and ends by reading the result back through the API use cases (`api/src/neutral/boundary-slice.integration.spec.ts`): 48 units and 48 boundaries promoted, all verified, containment checked, re-import adds nothing, the endpoint returns source, licence, year and version.

Dataset facts used: geoBoundaries gbOpen, Kenya, simplified geometry, build 9469f09, 47 ADM1 units; its metadata states licence "Public Domain" with source RCMRD GeoPortal. The licence has not been confirmed by a human; the document record says so.

Original plan: Kenya county boundaries

Dataset: a county-level (47) administrative boundary file with a verified open licence. Path: register and preserve (1-2), GeoJSON extractor (3-4), candidates for `geography.units` and `geography.boundaries` (6), validation of geometry, parent containment (the Kenya country unit) and level (7), review decision through the audit write path (8), promotion with attribution and verification (9), then `GET /v1/geography/entities/{id}/boundary` returns the boundary with source and licence. Pass criteria: an integration test runs this chain against PostGIS on a small real file, then re-runs it and proves no duplicates.

## 10. Waves

| Wave | Content | Depends on |
| --- | --- | --- |
| 0 | engine layout, contracts, database package v1 (migrations, integrity checks), data package v1, staging and promotion, the slice above | decisions |
| 1 | South Africa, Nigeria, Tanzania: jurisdiction, boundaries levels 1-2, one population table; Kenya reference seed. Each country needs a jurisdiction dossier and an approved source assessment before collection; until then only licensed bulk downloads reviewed by a human are used | 0 |
| 2 | Kenya statistics (KNBS), legal (constitution and chosen Acts), institutions and offices | 1 |
| 3 | Kenya elections and parties; people with entity resolution and privacy review | 2 |
| 4 | Kenya budgets, debt, procurement, organisations | 2 |
| 5 | AI-assisted source discovery at scale, agent batches of site structures, drift monitoring (see `WEBSITE_DESIGN.md`) | 0 stable, website schema |

## 11. Legacy seeds (`api-legacy/app/routes/*/_seed`)

The seeds are small (the largest, `geo_units.csv`, is about 550 rows) and carry no source evidence. They are imported as reviewed candidates with a `curated` method and a "legacy seed" document, not bulk-copied. Dispositions follow `audits/LEGACY_MODEL_INVENTORY.md`, to be re-checked per seed in the legacy import task.

| Legacy seed | Target | Note |
| --- | --- | --- |
| geographic levels, units, relationships | `reference.classifications` (levels), `geography.units`, `geography.relationships` | levels become Kenyan classification records; prefer verified boundary dataset names and codes |
| legal constitutions, sections | `legal.instruments`, `legal.provisions` | re-extract from the official text for pinpoint locators; seeds only as a cross-check |
| governance institutions, relationships, arms of government | `governance.institutions`, `governance.relationships` | arms become classification records |
| offices, holders, selection methods and rules | `governance.offices`, `holders`, `procedures`, `rules` | holders reference `person.individuals`; names move out of governance |
| people, profiles | `person.individuals`, `names`, `profiles` | public-office data only; privacy review first |
| political parties and party tables | `political.*` | positions and holders keep validity periods |
| elections, seats, candidates, results, manifestos | `electoral.*` | results re-imported from IEBC; seeds are test data |
| entities (legal entities, ownership, locations, profiles, finance entities) | `organization.*` | finance entity levels become classifications |
| finance fiscal years, categories, stages, `data/*` | `finance.years`, classifications, `finance.*` | `data/*` are samples; drop after the real budget import |
| debt, procurement | `debt.*`, `procurement.*` | samples; replace with real notices |
| statistics indicators, periods, tables | `statistical.*` | keep indicator definitions; re-import values from KNBS |
| events | `calendar.*` | |
| files `file_types`, `directories` | `fixtures/reference/media-formats.json`, `filesystem.folders` | already moved |
| scraper models (sources, queries, runs, processing, seed log) | none | replaced by the data engine job and source registry |

Drop: anti-detection and TLS-verification-disabled code paths in the legacy scrapers, Kenya-specific schema fields, and any seed value with no source.

## 12. The attached research note (AI-assisted discovery)

Adopted: separate source, site-structure, extraction and dataset definitions; tiered promotion; drift states distinct from record lifecycle; an evidence-backed inventory with explicit counting rules.

Superseded by `DEC-WEBSITE-SCHEMA-STRUCTURE` (decided after the note):

- DevAuto's `site.structure.yml`, its integration contract and the human structure-approval gate are dropped. Mzizi owns a `website` schema (sites, many dated domains, publisher links, versioned structures stored as files in `filesystem`) and its own structure format; see `WEBSITE_DESIGN.md` and `SITE_STRUCTURE_SPEC.md`.
- Agents author structures in batches and publish them without approval; data extracted through them still goes through candidates, validation and review.
- The note's source, extraction and dataset files map to the bundle's manifest, modules and mappings. `dataset.yml` overlap with `statistical.datasets` is resolved by mappings targeting contract tables.
- Paths in the note (`.tasks/...`, `source/backend/data-engine`) are stale; its task references do not exist here.

## 13. Out of scope for now

| Item | Reason |
| --- | --- |
| OCR of historical archives and scanned gazettes | quality and licensing unknown; text PDFs first |
| Sensitive person data (ids, health, family) | excluded by default; needs specialist review and approval (`LEGALITY_SAFETY_AND_COMPLIANCE.md` section 6, `PEOPLE_DESIGN.md`) |
| Automated promotion without review | no track record; every dataset starts at tier 2 or 3 |
| Continuous monitoring and drift | needs stable intake first (Wave 5) |
| Polifin integration | separate canonical database |
| Pre-colonial and historical polities | prove the time model on modern boundaries first |
| Countries beyond ZA, NG, TZ | proof of concept only |

## 14. Issues found in the handoff and schemas

- The handoff says 69 tables in places and 91 elsewhere; the 18-schema catalogue is the current truth, confirm by inspecting the live database.
- No `staging` schema exists; it must be created by the database engine outside the generated Dryv entities.
- `ClassificationRecord.scheme` is free text with no registry, so level, type and stage vocabularies cannot be validated yet.
- Cross-schema links are plain ids with no foreign keys, so integrity jobs are required, not optional.
- Geometry is GeoJSON text; PostGIS columns must be derived before containment checks can use spatial indexes.
- There is no job table and no contract for `FileArtifactRef`, `ExtractionResult`, `CandidateRecord` or `PromotionDecision`.
