# Country-Neutral Governance Model — Comparative Research and Polifin Design Review

**Recorded:** 2026-10-28  
**Status:** Research and design proposal; implementation not approved  
**Scope:** Mzizi Africa governance domain and inherited `Alidantech/polifin-api` models  
**Related record:** [Polifin API Governance Capability Audit](POLIFIN_API_GOVERNANCE_CAPABILITY_AUDIT.md)

## 1. Vision and design principle

Mzizi must support Kenya's governance structure fully while representing other countries without changing the universal core for each new jurisdiction.

**Core principle: model universal governance concepts and relationships; represent each country's legal and institutional arrangements as evidence-backed, versioned configuration and records.** Kenya is a first-class country profile, not the template that defines every government.

The goal is not merely to rename Kenya-specific tables. The model must represent how public authority is constituted, allocated, exercised, constrained, funded, challenged and audited in different systems and historical periods.

This research is intended to guide domain design and the next schema audit. It does not authorize code changes, database migrations or production-data changes.

## 2. What the model must make possible

Mzizi should be able to answer, with evidence and temporal context:

- Which institution or office had authority over a subject, territory or decision at a particular date?
- What legal instrument and exact provision established that authority?
- Who held the relevant office at the time, by what selection/appointment process, and was the appointment contested or acting?
- Which body could appoint, confirm, remove, regulate, supervise, fund, review or audit another body—and under what conditions?
- How did public money move from revenue and budget authority through transfer, commitment, procurement, contract, payment and delivery?
- What audit, court, legislative or administrative finding followed, and what corrective action was taken?
- What changed when a constitution, statute, boundary, institution or rule changed?
- Which claims are verified, disputed, inferred, superseded or unsupported, and what evidence supports each?
- Did public expenditure relate to a measurable service outcome, using what methodology and with what limitations?

A table's existence is not proof that the system can answer these questions end-to-end.

## 3. Comparative governance stress tests

These examples are chosen to expose different modelling assumptions. They are not claims that all countries in a region share one system.

| Benchmark | Pattern to represent | Design pressure it places on the model |
|---|---|---|
| **Kenya** | Unitary state with constitutionally devolved national and county governments; bicameral Parliament; constitutional commissions and independent offices | Fully represent counties, national–county fiscal links, distinct executive/legislative roles, independent bodies, constitutional offices and dated Kenyan rules without hard-coding these as global types. |
| **Nigeria** | Federal republic with federal, state and local levels | Do not assume lower geographic levels are merely subordinate departments of the national executive. Record allocated powers and relationships between tiers. |
| **South Africa** | National, provincial and local spheres described as distinctive, interdependent and interrelated; constitutional recognition of traditional leadership | Support overlapping/interdependent responsibilities and traditional institutions without forcing every body into one branch or one administrative tree. |
| **Ghana** | Constitutional government alongside legally recognised chieftaincy and customary institutions | Represent customary authority and succession with their legal basis and actual jurisdiction; do not equate all authority with election or executive appointment. |
| **India** | Federal parliamentary republic with Union, State and Concurrent legislative subject lists | Model legal competence by subject, level, applicable law and time. A generic reporting line cannot express legislative allocation or conflicts of competence. |
| **Germany** | Federal system with constituent Länder and participation of Länder in federal legislation | Represent constituent units' own responsibilities and shared federal decision-making. |
| **United Kingdom** | Parliamentary state with asymmetric devolution and different arrangements across constituent nations and local government | Permit different powers and arrangements among territories in the same country; do not require all units at a level to have identical capabilities. |
| **United States and Brazil** | Federal systems with state/subnational powers and intergovernmental fiscal relationships | Test subnational legal authority, revenue and expenditure responsibilities, shared functions and federal transfers. Validate detailed country mappings from official sources before encoding them. |
| **Canada** | Federal, provincial, territorial and legally recognised Indigenous governance arrangements | Avoid assuming all governing authorities are part of one uniform administrative hierarchy. Model jurisdiction and legal recognition explicitly. |

### Comparative sources

- OECD, *Constitutions in OECD Countries: A Comparative Study* — [system of government](https://www.oecd.org/en/publications/constitutions-in-oecd-countries-a-comparative-study_ccb3ca1b-en/full-report/component-8.html) and [multi-level governance](https://www.oecd.org/en/publications/constitutions-in-oecd-countries-a-comparative-study_ccb3ca1b-en/full-report/component-9.html).
- United Nations Peacemaker — [Comparative Tables on Federalism](https://peacemaker.un.org/en/documents/comparative-tables-federalism).
- South African Government — [Structure and functions of the South African government](https://www.gov.za/ss/about-government/government-system/structure-and-functions-south-african-government).
- Supreme Court of India — [Constitution of India](https://www.sci.gov.in/constitution/).
- German Bundestag — [Competencies of the Federation and Länder](https://www.bundestag.de/en/parliament/function/legislation/competencies-245700).
- World Bank — [Public financial management programme context](https://www.worldbank.org/en/programs/reimagining-public-finance/overview).

These sources establish comparative design pressures; they do not replace country-by-country validation against current constitutions, statutes, regulations, judgments and official records.

## 4. Polifin source review: observed assumptions and risks

The following findings come from source-tree inspection of the separate `Alidantech/polifin-api` repository, including ORM models, seed CSVs and `app/routes/api_router.py`. This is not a runtime test, deployed-database inspection or legal opinion. Potential implementation defects must be confirmed before fixes are proposed.

### 4.1 Geography — a single hierarchy is insufficient

Relevant source paths:

- `app/routes/geographic/models/geo_units.py`
- `app/routes/geographic/models/geo_levels.py`
- `app/routes/geographic/models/geo_relationships.py`
- `app/routes/geographic/_seed/geo_levels.csv`

The seed models a Kenyan sequence involving national, county, constituency, sub-county, ward, location and sub-location. Constituencies, counties and administrative areas have different purposes and may not form one tree. The same area can participate in administrative, electoral, judicial, statistical and fiscal jurisdictions simultaneously.

The relationship model's effective dates are a useful foundation, but unit-level current/active flags alone cannot describe a renamed, split, merged, disputed or superseded unit and preserve its identity lineage.

**Design direction:** distinguish territorial units, jurisdictions, classifications and typed relationships. Allow multiple relationships, each with its own dates and evidence. Model boundary change and succession explicitly. Treat containment as one relationship, not the universal hierarchy.

### 4.2 Institutions — the three arms are useful, not exhaustive

Relevant source paths:

- `app/routes/governance/models/arms_of_government.py`
- `app/routes/governance/models/institutions.py`
- `app/routes/governance/models/institution_relationships.py`
- `app/routes/governance/_seed/institutions.csv`
- `app/routes/governance/_seed/arms_of_government.csv`
- `app/routes/governance/_seed/institution_relationships.csv`

The core `ArmsOfGovernment` seed defines executive, legislative and judicial arms. Kenyan seed records also include independent electoral, audit, budget oversight and anti-corruption bodies, among others. Such bodies cannot always be described accurately by forcing each into one of three branches.

The current institution relationship type set—`has_component`, `has_office`, `has_branch`, `has_department`, `has_agency`—mainly describes organisational composition. It does not by itself express appointment, confirmation, removal, regulation, audit, funding, delegation, shared competence or accountability.

**Design direction:** retain arms as an optional classification. Model institution type, mandate, jurisdiction, legal basis and relationships separately. Relationships should have a defined type and direction, effective dates, applicable jurisdiction, evidence and legal basis where relevant.

### 4.3 Geography codes and country-specific seed assumptions

Seed identifiers such as `ke/executive-arm`, `ke/national`, `ke/county-government` and `ke/appointment` are valid as Kenyan instance/configuration identifiers, not universal taxonomy values. The reviewed geographic seed uses level codes such as `national` and `county`, while institutional seeds use values such as `ke/national`; this should be checked against actual registries and constraints.

**Design direction:** separate globally defined concept/type identifiers from jurisdiction-specific record identifiers. Validate seed and registry references explicitly. Do not infer correctness from successful seed execution alone.

### 4.4 Offices and selection rules — rules are not timeless office attributes

Relevant source paths:

- `app/routes/offices/models/offices.py`
- `app/routes/offices/models/holders.py`
- `app/routes/offices/models/selection_rules.py`
- `app/routes/offices/models/selection_methods.py`
- `app/routes/offices/_seed/offices.csv`
- `app/routes/offices/_seed/selection_rules.csv`

Separating an office from its holder is a sound foundation and should be preserved. However, office seed/model fields such as `max_terms`, `term_duration_years` and `retirement_age` can encode rules as if they were timeless properties. These rules may depend on office, jurisdiction, legal instrument and period.

Selection rules connect offices to methods and appointing institutions/offices, but complex procedures can require multiple stages, nomination, consent/confirmation, eligibility, review, challenge and effective periods.

**Design direction:** represent selection procedures and office rules as dated, jurisdiction-specific rules with legal references. Record actual elections, appointments, confirmations, acting assignments, vacancies, disputes and removals as evidence-backed events/records. Do not assume every office is elected, has a fixed term or has a term limit.

### 4.5 Law — constitutional text is one part of the authority model

Relevant source paths:

- `app/routes/legal/models/constitutions.py`
- `app/routes/legal/models/constitution_sections.py`

Existing constitution models include useful versioning/effective-date concepts. The wider governance domain also needs statutes, regulations, delegated legislation, judgments, executive instruments, treaties, local by-laws, administrative decisions, customary-law sources and transitional instruments where applicable.

**Design direction:** use a general legal-instrument model with instrument type, issuing authority, jurisdiction, publication/promulgation details, effective period, amendment/repeal/suspension relationships and evidence. Keep constitution-specific sections as a specialised form. Link authority claims to exact provisions and the version applicable at the relevant date.

### 4.6 Finance and procurement — domains exist, but the end-to-end audit chain needs verification

Relevant source paths:

- `app/routes/entities/models/finance_entities.py`
- `app/routes/finance/models/budgets.py`
- `app/routes/finance/models/transfers.py`
- `app/routes/finance/models/expenditure_workflow.py`
- `app/routes/finance/models/ledger_entries.py`
- `app/routes/procurement/models/tenders.py`
- `app/routes/procurement/models/contracts.py`

The domain split is promising. Source-level risks include:

- `FinanceEntities.level_code` and `level_order` assume a particular finance hierarchy that should not be equated automatically with institutional or geographic hierarchy.
- `FinanceEntities.institution_id` is described as an institution reference but is not declared as a foreign key in that model.
- `ExpenditureWorkflow` comments that some entity/budget references are not enforced; the `approver_id` reference also needs type/integrity review.
- `LedgerEntries.reference_type` and `reference_id` form a polymorphic reference that does not itself enforce that the referenced transaction exists or has the expected type.
- Tender/contract references and the completeness of links to budget, commitment, payment, delivery and audit evidence require validation.
- Tender and contract defaults such as `KES` are appropriate for Kenyan records but should not be global assumptions.
- Fixed transfer classifications/statuses may not express the full range of fiscal instruments and approval rules in different jurisdictions.

These are verification points, not confirmed runtime failures.

**Design direction:** make financial flow records typed and linked: budget authority, appropriation, revenue, transfer, commitment, procurement, contract, invoice/payment, delivery/acceptance and audit, as applicable. Record source/recipient, legal authority, amount/currency, dates, conditions, status history and evidence. Country-specific stages and constraints should be configured, not hard-coded into the universal core.

### 4.7 Legal entities — Kenyan registry assumptions must be scoped

Relevant source path: `app/routes/entities/models/legal_entities.py`.

The model's own description says it defines entity types for Kenyan business registration. Its enumeration includes forms such as private/public limited companies, sole proprietorships, partnerships, NGOs, state corporations and trusts, and a `tax_pin` field with a KRA-specific comment.

**Design direction:** separate general legal identity from jurisdiction-specific registration records. Registration identifiers need an issuing authority and jurisdiction. KRA PIN should be one identifier type, not a universal field assumption. Do not assume every institution is a registered company or a legal person of the same kind.

### 4.8 Historical state, evidence and API exposure

The related [Polifin API Governance Capability Audit](POLIFIN_API_GOVERNANCE_CAPABILITY_AUDIT.md) found that seven representative questions were only partially demonstrated from the inspected source tree. It also recorded that the inspected `app/routes/api_router.py` includes root, files, geographic and legal routers, while governance, offices, people, finance, procurement, statistics, services and events were not visibly included in that file. This must be checked against the real application entry point; it is not proof that no alternate registration exists.

Across domains, current/active flags and creation/update timestamps do not replace historical validity, record history and evidence. A trustworthy answer needs exact supporting source evidence, temporal context, contradiction/dispute handling and a preserved correction history.

### 4.9 Service-delivery reference and schema integrity concerns

The source review observed a service-delivery relationship referring to `governance.offices.id`, while the office model declares its table under the `offices` schema. Treat this as a potential cross-schema reference mismatch to verify against ORM metadata and migrations—not a confirmed defect until checked.

## 5. Proposed neutral domain architecture

This is a conceptual design, not a final table list.

### Layer A — Universal core

- **Identity and actors:** person, organisation, legal entity, names/aliases and identifiers.
- **Territory and jurisdiction:** territorial unit, jurisdiction, classification, boundary/version, membership and succession.
- **Institutions:** institution, organisational unit, mandate, classification and jurisdiction.
- **Offices and appointments:** office, holder, appointment/selection, term, vacancy, acting role and succession.
- **Authority and law:** legal instrument, provision, power, duty, delegation, restriction and legal relationship.
- **Political representation:** election, candidacy, seat, result, party and representation.
- **Public finance:** budget, appropriation, revenue, transfer, commitment, payment, asset and fiscal classification.
- **Procurement and delivery:** tender, bid, award, contract, milestone, invoice, delivery/acceptance, service and outcome.
- **Oversight:** audit, investigation, complaint, finding, judgment, corrective action and follow-up.
- **Evidence and history:** source, artifact, claim/assertion, evidence link, review decision, version and audit history.

Not every concept necessarily needs its own table. The schema should follow validated relationship and lifecycle requirements, not a one-table-per-noun rule.

### Layer B — Country and period profiles

Represent, with explicit validity periods and sources:

- constitutional and governmental arrangements;
- territorial and administrative classifications;
- institution and office classifications;
- legal powers and responsibilities;
- appointment/election/confirmation rules;
- fiscal classifications and transfer rules;
- procurement processes and thresholds;
- recognised customary or other jurisdiction-specific arrangements.

### Layer C — Country records and extensions

Kenyan counties, ministries, commissions, constitutional offices and fiscal arrangements remain fully represented. Nigeria's states, India's Union/State competence, Germany's Länder and other documented arrangements become records and configuration using the same core. Add an extension only where a documented requirement cannot be expressed correctly in the shared concepts; do not introduce country-specific exceptions merely for convenience.

### Layer D — Audit and analysis

Enable historical reconstruction, legal-authority tracing, appointment traceability, financial/procurement tracing, oversight outcomes and service analysis. Analysis must state its method and limitations; association between spending and outcomes is not, by itself, proof of causation.

## 6. Auditability contract

Every important governance assertion or relationship must be able to resolve:

1. **Subject, predicate and object:** what is claimed.
2. **Jurisdiction and scope:** where and under which system the claim applies.
3. **Valid time:** when it was true/effective in the world.
4. **Record time:** when Mzizi recorded, learned or corrected it.
5. **Evidence:** exact source artifact/version and pinpoint passage, provision or record where possible.
6. **Authority basis:** legal instrument/provision establishing the power or duty, when the claim is about legal authority.
7. **Verification state:** e.g. unverified, corroborated, disputed, superseded or rejected.
8. **Review/correction history:** what changed, when, by whom/process and why.
9. **Lineage:** links to extracted assertions, source versions and any derived conclusions.

A report that an event happened is not the same as a legal rule authorising it. Store and evaluate event evidence separately from authority evidence.

## 7. Preliminary disposition of existing models

| Existing model/domain | Preliminary disposition | Rationale |
|---|---|---|
| `GeoUnits`, `GeoLevels`, `GeoRelationships` | Extend and separate concepts | Preserve territorial records; distinguish jurisdictions, classification, multiple relationships and historical lineage. |
| `Institutions`, `InstitutionRelationships` | Extend substantially | Add typed authority, appointment, funding, oversight and accountability relationships with dates and evidence. |
| `ArmsOfGovernment` | Retain as optional classification | Not a universal exhaustive hierarchy. |
| `Offices`, `Holders` | Preserve distinction; redesign rules | Office/holder separation is sound; tenure and selection rules need legal/temporal context. |
| `SelectionRules`, `SelectionMethods` | Extend or split after workflow analysis | Model multi-stage procedures, consent, eligibility, legal basis and rule history. |
| `Constitutions`, `ConstitutionSections` | Retain and integrate | Build on versioning; connect to broader legal-instrument model. |
| Finance models | Reconcile and strengthen | Improve referential integrity, fiscal authority and transaction lineage. |
| Tender/contract models | Retain and extend | Generalise currency and process rules; connect procurement to budget, payment, delivery and audit. |
| `LegalEntities` | Separate identity from registry profiles | Scope business forms and national identifiers to their jurisdictions. |
| People, elections, parties, services and oversight | Review against shared contracts | Standardise identity, temporal history, evidence and cross-domain links without flattening their domain semantics. |

## 8. Country-neutral acceptance matrix

Before implementation, create evidence-backed test fixtures and expected answers for:

- **Kenya:** national/county relationships, independent bodies, constitutional offices, fiscal transfers and historical appointments.
- **Nigeria:** federal/state/local authority and fiscal links.
- **South Africa:** interdependent spheres and traditional leadership.
- **Ghana:** constitutional and customary institutions.
- **India:** legislative subject allocation and competence.
- **Germany:** Länder participation and responsibilities.
- **United Kingdom:** asymmetric devolution.
- **United States/Brazil:** federal-subnational powers and fiscal relations.
- **Canada:** federal/provincial/territorial and Indigenous governance.

Each fixture should test whether the model can represent: appointment and confirmation chains; subject-specific legal authority; overlapping jurisdictions; non-hierarchical accountability; dated rule changes; financial traceability; disputed claims; and source-backed historical reconstruction. Country-specific details must be checked against current official legal sources before becoming canonical data.

## 9. Recommended work sequence

1. **Complete the source/schema inventory.** Include all models, migrations, seeds, enums, constraints, foreign keys, ORM joins, API registration and code-to-seed mappings.
2. **Specify the neutral domain model.** Agree core concepts, typed relationship vocabulary, temporal rules, legal-instrument scope and evidence/claim contracts before designing migrations.
3. **Build the comparative matrix.** Prioritise African governance diversity and use Asia, Europe and the Americas to challenge assumptions. Keep sources and open questions alongside each comparison.
4. **Map Kenya completely.** Demonstrate that the neutral core represents Kenya's actual institutions, offices, territorial arrangements, legal powers, fiscal and procurement rules without losing local detail.
5. **Classify every legacy model and field.** Mark as reusable, extend, split, country-specific configuration, replace or investigate. Record the evidence and migration implications for each decision.
6. **Define acceptance tests.** Derive expected records and answers from authoritative sources; test historical reconstruction, evidence traceability and uncertainty.
7. **Prepare a migration proposal.** Only after the model and tests are reviewed, propose schema changes, data backfills, compatibility strategy and implementation order.

## 10. Decisions and non-decisions

### Design direction recorded

- Kenya must be fully supported but must not define the universal governance schema.
- Model legal powers and relationships, not only organisational charts.
- Keep political, administrative, electoral, judicial, statistical and fiscal jurisdictions distinct while allowing explicit relationships among them.
- Separate an office from its holder and a legal entity from its registry-specific identifiers.
- Treat law and rules as jurisdiction-specific and time-bound.
- Preserve valid time separately from record time.
- Make important assertions evidence-backed, reviewable and correctable without erasing history.
- Connect finance, procurement, delivery and oversight into traceable chains.
- Use African cases as the primary design focus and global cases as stress tests.

### Not decided or authorised

- No final database table/ORM design has been approved.
- No model has been authorised for deletion or replacement.
- No migration, seed rewrite, API change or production-data mutation is authorised by this document.
- No suspected runtime defect is considered confirmed without metadata, migration or runtime validation.
- Country-specific mappings are not production-ready until checked against authoritative, dated sources.

## 11. Definition of success

The design succeeds when Kenya can be represented in full and a second country with a substantially different system can be added through country configuration and evidence-backed records—not a new branch of country-specific core schema—while the platform can reconstruct who held which authority, under which law, where, when, and with what financial and accountability consequences.
