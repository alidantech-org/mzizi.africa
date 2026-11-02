# Polifin API Governance Capability Audit

**Recorded:** 2026-10-28  
**Status:** Preliminary, source-tree-only audit; remediation not approved  
**Audited repository:** https://github.com/Alidantech/polifin-api  
**Recorded in:** Mzizi Africa

## Purpose and scope

This document records a read-only capability audit of the inherited political-governance backend. It captures model/API foundations, gaps against representative governance questions, risks to verify, and a proposed follow-up sequence before adopting legacy code or data into Mzizi's canonical platform.

The inspection covered repository structure, API router wiring, ORM models, seed files and Alembic migration files. The application was not run, deployed API endpoints were not tested, and no live database or deployed schema was inspected. Findings are therefore preliminary source observations, not runtime-confirmed defects.

## Executive finding

The legacy backend contains useful foundations across governance, legal structures, offices and office holders, finance, procurement, statistics, public services, events, geography and related domains. However, **none of the seven representative questions below was demonstrated to be fully answerable end-to-end from the inspected source tree**.

The main gap is not whether a table exists. Mzizi must connect claims to authoritative evidence, model relationships with the correct meaning, reconstruct state at a historical date, and distinguish known facts from missing or uncertain information.

## Representative questions

All seven questions are rated **Partially supported**: relevant foundations were visible, but complete, source-backed answer paths were not established.

| # | Question | Visible foundations | Main gaps / unproven capabilities |
|---|---|---|---|
| 1 | What types of government institutions exist in Kenya, and why does each exist? | Governance institution models and institution seed data. | Complete legal classification, authoritative mandate evidence and source-backed explanations of institutional purpose were not established. |
| 2 | What is the relationship between the President, Cabinet Secretary, Principal Secretary, a board and the KeNHA Director General? | Institutions, arms of government, institution relationships, offices, holders and constitutional/legal references. | A complete graph of typed authority, reporting, appointment and oversight relationships, with effective dates and legal evidence, was not demonstrated. |
| 3 | What is the difference between IEBC, KNBS and NTSA? | Institution records and governance-related models. | Verified legal status, founding/mandate sources, functional distinctions and leadership coverage were not established for all three as a source-backed answer. |
| 4 | How does county own-source revenue move through the County Revenue Fund and relate to the National Treasury? | Budget, revenue-log, transfer and ledger-entry models. | A fully linked and legally grounded flow covering fund boundaries, allocation, receipt, transfer, expenditure and reconciliation was not demonstrated. |
| 5 | Can a county project be traced from funding through procurement, payment and completion? | Tender, bid, contract and expenditure-workflow models. | A complete chain connecting budget/project, procurement, contract, invoice, payment, delivery/acceptance, completion and audit evidence was not established. |
| 6 | Who held an office when a past decision was made? | Office-holder records include date-related fields; event models exist. | A source-verified link between the decision, its date, the office and the holder effective on that date was not demonstrated. Current flags alone cannot prove historical state. |
| 7 | Did public spending improve services? | Statistics/indicators, geographic statistics, public services/service-delivery mapping and finance models. | Comparable outcome measures, aligned time/geography, spend-to-service linkage and a defensible evaluation method were not demonstrated. Correlation alone would not establish causation. |

## API exposure observed

In the inspected app/routes/api_router.py, root, files, geographic and legal routers were actively included. Governance, offices, people, finance, procurement, statistics, services and events routers were not visibly included there; scraper import/include code was commented out.

This finding applies to that router file only. It does not prove there is no alternate entry point, route registration or deployment. Confirm the actual application entry point and deployed routes in a later verification phase.

## Cross-cutting risks and verification points

### Relationship and referential integrity

- Some fields in entities/models/finance_entities.py and finance/models/expenditure_workflow.py appeared to have optional or weakly enforced references.
- Some ORM join declarations appeared to list multiple candidate fields while only one appeared to be an actual foreign key. These are potential mapping issues to verify, not confirmed runtime defects.
- Migration/seed success does not prove records are fully connected. In particular, alembic/versions/009_create_seed_finance_data.py appears to resolve references by codes and tolerate missing IDs or nullable foreign keys in some paths.

### Temporal reconstruction

Office-holder start/end dates are a useful foundation, but historical questions require effective-dated relationships across offices, institutions, appointments, legal authority and decisions. A present-day current flag is not enough to reconstruct the past or explain later corrections.

### Evidence and provenance

Scraper/source-related models cover concepts such as sources, query results, files/pages, processing jobs, processed items and seed logs. Their existence does not establish claim-level provenance. Trustworthy answers need the exact source passage or record supporting each claim, retrieval/version details, conflict tracking, correction history and review.

### Spending and service outcomes

Financial and service/statistics models provide useful ingredients, but an outcome claim needs aligned geography and time periods, clear indicator definitions, data-quality notes and an explicit analytical method. The system should distinguish descriptive association from causal evaluation and report missing data.

### Migration and deployed-state uncertainty

Alembic migration files numbered 001–015 were present in the inspected source tree. The audit did not establish which migrations have been applied in any deployed database, whether a live schema matches the models, or whether seed records satisfy intended integrity constraints.

### Seed data is not authoritative evidence by itself

The inspected governance seeds include records such as IEBC, county government, Commission on Revenue Allocation, County Assembly, Office of the Controller of Budget, National Land Commission and Council of Governors. These are useful fixtures/reference candidates, but descriptions in seed files are not independently verified legal evidence. Production claims need authoritative sources and effective dates.

## Key source paths in the audited repository

The paths below refer to the separate audited Alidantech/polifin-api repository, not necessarily the same paths in Mzizi's consolidated repository.

### Router and domain models

- app/routes/api_router.py
- app/routes/governance/models/institutions.py
- app/routes/governance/models/arms_of_government.py
- app/routes/governance/models/institution_relationships.py
- app/routes/legal/models/constitutions.py
- app/routes/legal/models/constitution_sections.py
- app/routes/offices/models/offices.py
- app/routes/offices/models/holders.py
- app/routes/entities/models/finance_entities.py
- app/routes/finance/models/budgets.py
- app/routes/finance/models/revenue_log.py
- app/routes/finance/models/transfers.py
- app/routes/finance/models/ledger_entries.py
- app/routes/finance/models/expenditure_workflow.py
- app/routes/procurement/models/tenders.py
- app/routes/procurement/models/bids.py
- app/routes/procurement/models/contracts.py
- app/routes/statistics/models/indicators.py
- app/routes/statistics/models/geo_statistics.py
- app/routes/services/models/public_services.py
- app/routes/services/models/service_delivery_map.py
- app/routes/events/models/events.py
- app/routes/scraper/models/1_core/source.py

### Seed files and migrations

- app/routes/governance/_seed/institutions.csv
- app/routes/governance/_seed/institution_relationships.csv
- app/routes/offices/_seed/offices.csv
- app/routes/offices/_seed/holders.csv
- alembic/versions/003_create_seed_legal_tables.py
- alembic/versions/004_create_seed_governance_tables.py
- alembic/versions/009_create_seed_finance_data.py
- alembic/versions/011_create_seed_procurement_tables.py
- alembic/versions/012_create_seed_statistics_tables.py

## Recommended follow-up sequence

No remediation or implementation is authorized by this audit record. The following is a proposed verification and planning sequence.

1. **Reconcile schema and migrations.** Inventory model relationships, actual foreign keys, nullable references, ORM joins, migration operations and seed assumptions. If a safe read-only database is available, compare live schema and migration state without applying changes.
2. **Audit API registration.** Trace the real application entry point and router inclusion; establish registered endpoints and compare with deployed behavior only in a safe test environment.
3. **Audit seed data and authoritative evidence.** Identify source and effective date for institution mandates, office holders, legal relationships, finance records and procurement references. Separate fixtures from verified production records.
4. **Create seven acceptance tests.** Specify required records, relationship paths, source citations, temporal rules, expected uncertainty behavior and failure conditions. Run only in an approved safe environment.
5. **Produce a remediation proposal.** Prioritize the smallest schema/contract changes that close demonstrated gaps. Keep legacy source material distinct from Mzizi's future canonical model and target service boundaries.

## Mzizi architectural implications

- Treat the legacy Python political-governance service as valuable source material to inventory and migrate deliberately, not as proof of the final API or canonical schema.
- Preserve raw sources and source versions; store extracted assertions as reviewable candidates until validated.
- Model relationships explicitly by type, direction, legal basis, valid-time interval and evidence.
- Keep valid time distinct from record/observation time so past states and later corrections can both be represented.
- Require source-level provenance and uncertainty/confidence for institutional, legal, office-holder, finance and procurement claims.
- Make finance-to-procurement-to-delivery links explicit before presenting a public-spending lifecycle as complete.
- Treat outcome evaluation as an analytical capability with declared methods and limitations, not an automatic conclusion from coexisting spend and service tables.

## Audit boundary

This record captures what was observed and what remains unproven from source inspection. It is not a runtime test report, security audit, legal opinion, production-data validation or assertion that potential schema issues are confirmed defects. Verify them before making implementation decisions.
