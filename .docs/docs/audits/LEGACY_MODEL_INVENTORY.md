---
{id: DOC-LEGACY-MODEL-INVENTORY,name: LEGACY_MODEL_INVENTORY,type: documentation,tags: [api,migration,audit]}
---

# Legacy model inventory and disposition

Produced by task `TSK-4B83AC17019D`. Source: `source/backend/api-legacy/app/routes/*/models`, `_archives`, seeds under `*/_seed`, and `alembic/versions`. Findings come from reading code and seeds; no queries or migrations were run, so items marked "verify" are unconfirmed. Dispositions are **proposals** framed by `COUNTRY_NEUTRAL_GOVERNANCE_MODEL_RESEARCH.md`; none authorises schema or API change.

Disposition vocabulary: **reuse**, **extend**, **split**, **country-config** (becomes jurisdiction-scoped records), **replace**, **investigate**.

## 1. Cross-cutting findings

- Only `geographic` and `legal` have controllers; `mobile_geography_router` serves `/v1/geography`. Every other domain is models plus CSV seeds plus alembic. `api_router.py` registers root, files, geographic and legal; statistics registration is unconfirmed and the scraper router is commented out.
- Primary keys mix ULID `String(26)`, `uuid4` defaults on `String(26)` columns, `String(36)` (people), and Integer (scraper).
- Foreign keys are doubled as `x_id` plus `x_code`; several `*_id` columns have no FK at all (`holders.person_id`, `finance_entities.institution_id`, `expenditure_workflow.entity_id/budget_id`, `ledger_entry_id` in debt).
- Provenance is strong only on `geo_boundary_versions`; valid time exists on many tables, record time only on `constitution_sections`.
- Kenya lives in data: the `ke/` code prefix, `ke/*` enum-like values, KES defaults, Kenyan institutions. Few columns are Kenyan (`tax_pin`, `registration_number`, term and retirement fields).
- Booleans stored as strings: `Seats.is_active`, `CandidateManifesto.is_published/is_featured`, `StatisticsTables.is_verified`. Timestamps typed `String`: `EventTypes.created_at`, `people.Profile.created_at/updated_at`.
- Probable defects to verify: `ke/national` (institutions seed) vs `national` (geo_levels seed); `Holders.selection_method` back_populates with no counterpart; `section_code` unique globally and per constitution; duplicate `ward` row in `geo_levels.csv`; `seats.csv` spelling `dagoreti` vs `dagoretti`; `func.utcnow()` in scraper models; services FKs to `legal.legal_authority_sources` and `governance.offices` that do not exist.

## 2. Geographic (6 tables + presentation contract)

| Model | Notes | Disposition |
|---|---|---|
| `GeoLevels` | Kenyan level seed (national to sub-location); duplicate ward, shared order 3 | country-config + extend: levels become jurisdiction-scoped records |
| `GeoUnits` | two unique codes (`geo_unit_code`, `geo_code`); no geometry; endpoints exist | extend: add jurisdiction type, drop duplicate code |
| `GeoRelationships` | contains/overlaps/shared/adjacent_to/part_of with valid time; ~43 seed rows | extend: typed, evidence-backed relationships |
| `GeoBoundaryVersions` | JSON geometry, source, licence, retrieved_at, valid time, is_current | reuse: template for provenance; consider PostGIS later |
| `GeoUnitNameVersions` | dated names with source | reuse |
| `GeoUnitChangeRelationships` | renamed/split/merged/continued; ID-only FKs | reuse; fold into generic lineage |
| `mobile_api.py` | Pydantic contract, not a table; governance section is a placeholder | reuse as presentation contract (`geography-api-contract.md`) |

Consumers: `geographic_controller`, mobile geography service, repositories, alembic 002 and 016. No `geo_units.csv` seed exists.

## 3. Legal (2 tables)

| Model | Notes | Disposition |
|---|---|---|
| `Constitutions` | `document_hash` holds "1963"/"2010", not a hash; no jurisdiction column | extend: one instrument type in a general legal-instrument model, real content hash |
| `ConstitutionSections` | valid time + record time + version chain; article numbers in codes | reuse + extend: pinpoint citation, per-constitution uniqueness |

## 4. Governance, offices, people (no endpoints; seeds + alembic 004 to 006)

| Model | Notes | Disposition |
|---|---|---|
| `ArmsOfGovernment` | judicial arm missing from seed | reuse as optional classification |
| `Institutions` | free-string `institution_type` (`ke/commission` etc.), no FK to arm, no time, no legal basis | extend + country-config |
| `InstitutionRelationships` | only structural `has_*` types | extend: authority, appointment, funding, oversight, with dates and evidence |
| `Offices` | `max_terms`, `term_duration_years`, `retirement_age` columns (Kenyan values) | split: dated, jurisdiction-scoped rules table with legal basis |
| `Holders` | no FK on `person_id`; free-string status/departure; broken `selection_method` relationship | extend: person FK, appointment link, evidence, valid vs record time |
| `SelectionMethods` | five `ke/*` rows citing Articles | country-config |
| `SelectionRules` | single-step; approval step only in description | split: rule header + ordered stages |
| `People` | `String(36)` PK; honorifics; `is_pwd`; no `tax_pin` here | extend: per-claim evidence for birth/death, configurable fields |
| `people.Profile` | contact data and biography mixed; string timestamps | investigate: PII and evidence status |

## 5. Elections, political, events

| Model | Disposition |
|---|---|
| `Elections` (fixed type/status enums) | extend: election-type registry per country, legal basis, administering body |
| `Seats` (hard FK to a constitution; string `is_active`) | extend: link to legal instrument and provision, electoral jurisdiction |
| `Candidates` | reuse; add nomination status |
| `Results` | extend: source, verification state, result level, declaring authority |
| `CandidateManifesto`, `ManifestoContent` | reuse; align verification and data_sources with shared claim/evidence contract |
| `Parties` | extend: registry identifier with issuing authority, dated status |
| `PartyIdeology` (unique `ideology_code` per row) | investigate: shared vocabulary plus dated link |
| `PartyMembership`, `PartyPositions`, `PartyPositionHolders` | reuse; party-scoped `position_code`; add evidence |
| `PartyStructure` | country-config for `level`; structure reusable |
| `Events` | split: neutral calendar event; election/legislative semantics move to domain records; evidence link replaces `source_url`/`is_verified` |
| `EventTypes` | country-config; move UI fields out |

## 6. Entities, finance, debt, procurement

| Model | Disposition |
|---|---|
| `LegalEntities` (`tax_pin`, BRS number, Kenyan entity-type enum) | split: neutral identity plus jurisdiction-scoped identifier records with issuing authority; type enum to country-config |
| `FinanceEntities` (bare `institution_id`) | extend: real FK; finance hierarchy separate from institution and geography |
| `FinanceEntityLevels` | country-config; investigate program/sub-program mapped to constituency/ward |
| `Locations`, `entities.Profile` | reuse; verify coordinate type |
| `Ownership` (Integer percentage) | extend: Numeric, entity-to-entity ownership, evidence |
| `FiscalYears` (has `country_code`) | reuse |
| `Budgets` (no currency) | extend: currency, legal authority, appropriation vs revision |
| `Transfers`, `RevenueLog` | extend: currency, vocabulary for transfer type, status history |
| `RevenueCategories`, `WorkflowStages` | country-config (per country and period) |
| `ExpenditureWorkflow` | extend: missing FKs, typed approver, link to commitment/payment/procurement |
| `LedgerEntries` (polymorphic reference, no currency) | investigate |
| `Loans`, `LoanDisbursements`, `LoanRepayments` | extend: typed lender, legal authority, real ledger FK, fee/penalty handling |
| `Tenders`, `Bids`, `Contracts` (`KES` default) | extend: remove KES default, thresholds and methods to country-config, budget and legal links, milestones and variations |

## 7. Statistics and services

| Model | Disposition |
|---|---|
| `Periods`, `IndicatorCategories`, `Indicators`, `IndicatorColumns`, `GeoStatistics`, `StatisticsTables` | extend: add provenance refs, valid/record time, drop denormalised codes |
| `StatisticsTables.is_verified` (string) | replace with status enum / claim state |
| `StatisticsTables` institution/office FKs | investigate against neutral relationship model |
| `Sectors`, `PublicServices`, `ServiceDeliveryMap` | extend; no migration exists, FKs dangle |
| `LeadershipRoleEnum`, `BoardTypeEnum` (OCS, Principal, board names) | country-config |
| `Amenities`, `AmenityBoards`, `AmenityLeaders` | split: facility identity vs boards/leadership as office/holder links |

## 8. Files and scraper

| Model | Disposition |
|---|---|
| `files.File`, `FileType`, `Directory` | reuse in the files service; add source-URL provenance; fix PK types |
| Scraper `queries`, `query_runs`, `query_results`, `sources`, `discovered_paths`, `pages` | split to data-engine |
| `processing_jobs`, `processed_items`, `processing_feedback`, `data_seed_logs` | split to data-engine staging/candidates |
| Scraper `files` (name clash with `files.files`) | replace with a file artifact reference into the files service |

## 9. Archived domains (`_archives`)

Superseded by live domains: constitution/legal, elections, events, finance, procurement, geographic, governance (now governance + offices), people, parties (now political), statistics, services (identical to live). Stale copies of controllers/services in the archives: replace (remove after confirming).
No live equivalent, so **investigate** before any reuse: justice (`court_stations`, `judicial_rulings`, `judicial_overrules`, `legal_cases`), land (`land_authorities`, `rights_restrictions`, `spatial_units`, `tenure_types`), constitution amendments, legal instruments and dependencies, `person_aliases/citizenship/identifiers/status`, and `geo_boundaries`/`geo_versions` (probably superseded by migration 016).

## 10. Kenya-specific content and neutral replacement

| Kenyan item | Neutral replacement |
|---|---|
| `ke/` prefix in codes and enum-like values | jurisdiction-scoped business code; jurisdiction as a record |
| Level names national/county/constituency/ward | jurisdiction-scoped level records with period |
| `ke/*` institution types, IEBC and other institutions | records plus country-config type vocabulary |
| Article citations in descriptions | legal-provision links with pinpoint citation |
| `max_terms`, `term_duration_years`, `retirement_age` | dated office-rule records with legal basis |
| Selection methods and multi-step rules | vocabulary plus ordered stage records |
| `tax_pin`, BRS `registration_number` | jurisdiction-scoped identifier records with issuing authority |
| Entity types (private limited, etc.) | country-config |
| Election types, party levels | country-config registries |
| Fiscal workflow stages, revenue categories, transfer types (equitable-share) | per-country, per-period configuration |
| `KES` defaults | explicit currency column, no default |
| Leadership roles and board types (OCS, Principal) | country-config |
| Gender "constitutional compliance" framing, honorifics, `is_pwd` | configurable fields |

## 11. Non-model concerns and target owner

| Concern | Location | Owner |
|---|---|---|
| PDF extractor, OCR, table extraction | `app/services/pdf_extractor/` | data-engine |
| NLP classification and entity extraction | `nlp_analyzer`, `content_analyzer` | split: extraction in data-engine, classification in intelligence |
| Web search scraper, crawlers, converters | `app/services/web_search_scraper/`, `scripts/` | data-engine |
| S3 client, uploader scripts, files routes | `app/config/s3_service.py`, `routes/files` | files |
| Alembic 001 to 016 (schema mixed with seeds) | `alembic/versions` | db-engine; split schema from seeds; add the missing services migration |
| CSV seeds | `routes/*/_seed` | db-engine (reference seeds); research seeds (elections, people, debt) need curation review |
| `database_cli.py` | `scripts/` | db-engine |
| Geographic and legal controllers, config, exceptions | `routes/*`, `app/core` | NestJS API |

## 12. Open points to verify

Statistics route registration; dangling services FKs against live metadata; `func.utcnow()` and the `String(26)` PK with `uuid4` default at runtime; whether `holders.person_id` and `geo_units` seeds load correctly; whether migration 016 fully supersedes the archived geo boundary tables.
