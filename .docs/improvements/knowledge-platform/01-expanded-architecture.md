---
id: DOC-MZIZI-KNOWLEDGE-ARCHITECTURE-20261111
name: Mzizi Africa knowledge platform architecture
type: architecture-proposal
tags: [knowledge-platform, domains, schemas, architecture, research]
extra:
  status: working_proposal
  approval: not_approved
  implementation: not_authorized
  recorded_on: 2026-11-11
---

# Mzizi Africa — Knowledge Platform Architecture

> STATUS: COMPREHENSIVE ARCHITECTURAL PROPOSAL. This document is a design reference, not approved SQL, migrations or implementation instructions.

## 1. Vision

Mzizi Africa is intended to become a reusable, evidence-first African knowledge infrastructure.

It must support the collection, organization, preservation, interpretation and discovery of information about:

- Geography and the physical world.
- Climate and environmental conditions.
- Plants, animals and living systems.
- Human populations, societies and cultures.
- Education and health.
- Languages and linguistic development.
- Agriculture and food production.
- Infrastructure and public services.
- Government, law, politics and elections.
- Markets, trade and economic activity.
- Historical development and heritage.
- Statistics, scientific observations and research.
- Original documentary and scientific evidence.

Mzizi should be capable of powering several products and research applications. Its value should not depend on one frontend or one subject area.

The platform must allow researchers to move between a geographic place, its environment, population, institutions, economic activity, historical development and supporting evidence.

## 2. Architectural positioning

Mzizi has five primary exploration areas:

1. Civic and Society.
2. Geography and Nature.
3. History and Heritage.
4. Statistics and Demographics.
5. Economics and Production.

These are product and research groupings, not database schemas.

The technical architecture uses specialized domains, shared foundations and cross-domain contracts.

Geography, Reference, Source and Statistical are especially important shared capabilities, but none should become an unrestricted owner of every subject.

## 3. Schema ownership principles

Every real-world entity must have one canonical owner.

Examples:

- A river belongs to Geography.
- A species belongs to Biology.
- A pathogen belongs to Biology.
- A disease identity belongs to Health.
- A farm belongs to Agriculture.
- A school organization belongs to Organization.
- Its campus belongs to Geography.
- Its facility function belongs to Civic.
- Its curriculum belongs to Education.
- A language belongs to Linguistics.
- A historical interpretation belongs to History.
- A published artifact belongs to Heritage where it has heritage identity.
- A statistical indicator belongs to Statistical.
- A product or market belongs to Economy.
- A public office belongs to Governance.

Other domains connect to the canonical entity through explicit relationships.

A road must not be independently recreated in Geography, Civic, History and Statistical.

Civic owns its infrastructure function. Geography provides its spatial identity and representation. History explains its development. Statistical provides measurements about it.

## 4. Proposed schema catalogue

The following is the full candidate domain architecture. It does not establish a fixed final schema count.

### 4.1 Shared foundations and platform capabilities

| Candidate schema | Purpose | Important connections |
|---|---|---|
| `reference` | Shared concepts, countries/jurisdictions, classification schemes, values, topics, applicability and reusable patterns. | Connects to all domains through controlled definitions. Directly connects with Legal and Geography. |
| `legal` | Constitutions, laws, regulations, provisions, amendments, legal procedures and applicability. | Reference, Governance, Political, Electoral, Civic, Finance, Procurement and other legally governed domains. |
| `geography` | Geographic areas, physical places, natural features, boundaries, spatial representations and geographic relationships. | Civic, Environment, Biology, Agriculture, Economy, Statistical, History, Linguistics and all spatially scoped domains. |
| `source` | Publishers, publications, source documents, captures, attribution, verification and research provenance. | Every domain that contains evidence-backed information. |
| `filesystem` | Logical files, immutable versions, folders, tags and external object-storage references. | Source, History, Heritage, Environment, Geography and all document/media consumers. |
| `engine` | Processing pipelines, jobs, extraction, staging, candidate evaluation, generation and data promotion. | All domain ingestion and derived-data workflows. |
| `auth` | Accounts, authentication, roles, permissions and scoped access. | Platform and domain access control. |
| `audit` | Immutable decisions, reviews, corrections, actors and accountability. | Source, Engine, Participation and canonical domain changes. |
| `participation` | Citizen and official submissions, consultation, feedback and public participation. | Governance, Legal, Civic, Activity, Geography and Audit. |
| `activity` | Real events, public actions, schedules, announcements and occurrences. | History, Governance, Electoral, Civic, Economy and other event-producing domains. |

### 4.2 People, institutions and civic structures

| Candidate schema | Purpose | Important connections |
|---|---|---|
| `person` | Canonical identities of real individuals, names and sourced profiles. | Organization, Governance, Political, Electoral, History, Heritage and Education. |
| `organization` | Canonical companies, government bodies, NGOs, universities and other organizational identities. | Governance, Civic, Education, Health, Economy, Procurement and Finance. |
| `governance` | Government institutions, offices, mandates, holders, authority and administrative relationships. | Person, Organization, Geography, Reference and Legal. |
| `political` | Parties, memberships, affiliations, ideology, party structures and party leadership. | Person, Organization, Geography, Electoral, Legal and History. |
| `electoral` | Elections, contests, candidates, seats, electorates, referendum questions and official results. | Person, Political, Geography, Legal, Statistical and History. |
| `civic` | Built infrastructure, networks, facilities, public services and development projects. | Geography, Organization, Governance, Environment, Finance, Procurement and Statistical. |
| `finance` | Budgets, public funds, revenue, expenditure, transfers, debt and financial accounting. | Governance, Organization, Economy, Procurement, Legal and Statistical. |
| `procurement` | Procurement processes, awards, bidders, purchasing parties, contracts and delivery locations. | Organization, Governance, Finance, Civic, Legal and Geography. |

### 4.3 Natural and scientific knowledge

| Candidate schema | Purpose | Important connections |
|---|---|---|
| `environment` | Weather, climate, environmental conditions, monitoring stations, sensor readings and environmental models. | Geography, Biology, Agriculture, Health, Statistical and Civic. |
| `biology` | Organisms, taxonomy, plants, animals, microorganisms, biodiversity, traits and biological interactions. | Environment, Geography, Agriculture, Health, History and Statistical. |
| `agriculture` | Farms, fields, cultivation, livestock management, agricultural practices and harvests. | Biology, Environment, Geography, Economy, Statistical and Civic. |
| `health` | Human, animal and plant health conditions, disease incidents, surveillance and interventions. | Biology, Environment, Agriculture, Geography and Statistical. |
| `education` | Education systems, programmes, curricula, subjects, qualifications and accreditation. | Organization, Person, Civic, Legal, Reference and Statistical. |
| `linguistics` | Language identities, dialects, language families, scripts, linguistic features and distributions. | Geography, History, Person, Heritage, Statistical and Reference. |

### 4.4 Historical, cultural, statistical and economic knowledge

| Candidate schema | Purpose | Important connections |
|---|---|---|
| `history` | Historical periods, period definitions, interpretations, chronologies, historical accounts and explanations. | Geography, Heritage, Person, Organization, Governance, Legal, Economy and Statistical. |
| `heritage` | Artifacts, monuments, manuscripts, collections, cultural practices and provenance. | History, Geography, Person, Organization, Source and Filesystem. |
| `statistical` | Datasets, releases, indicators, dimensions, periods, observations, methods and derived measures. | Every domain that publishes or consumes measurable information. |
| `economy` | Products, services, markets, prices, trade, economic operations and production. | Agriculture, Geography, Civic, Organization, Finance, Procurement, History and Statistical. |

## 5. Migration is initially a cross-domain capability

Do not automatically introduce `migration` as another schema.

Migration has several meanings:

- Human population migration.
- Historical migration.
- Refugee and displacement movements.
- Pastoral mobility.
- Seasonal labor migration.
- Animal migration.
- Language-community movement.

Their canonical ownership differs.

| Information | Initial owner |
|---|---|
| Population movement measurements | Statistical |
| Historical migration narratives | History |
| Dated migration events | Activity |
| Migration routes and corridors | Geography |
| Individual identities, where appropriate | Person |
| Animal migration observations | Biology |
| Language movement and distribution | Linguistics |

A dedicated Migration schema should be considered when Mzizi needs detailed migration episodes, movement corridors, displacement case management or specialized movement networks.

## 6. Additional schema consolidation decisions

The following older schema responsibilities must be reconciled rather than blindly recreated:

| Existing concept | Proposed direction |
|---|---|
| `place` | Integrate physical-place responsibilities into Geography, retaining separate physical-place identity. |
| `contact` | Keep as a possible shared capability; inspect all consumers before deciding. |
| `website` | Evaluate consolidation into Source without losing website intelligence. |
| `staging` | Evaluate whether to retain separately or consolidate operational responsibilities into Engine. |
| `debt` | Absorb into Finance. |
| `calendar` | Rename/replace with Activity. |
| `identity` and `access` | Consolidate under Auth. |

No fixed number of schemas is approved.

## 7. The five cross-domain foundations

### 7.1 Reference

Reference provides shared meanings.

It owns reusable classifications, concepts, topics, schemes, values and versioned structural patterns.

It should not own actual roads, diseases, people, offices, animals, markets or statistical measurements.

Every domain may reference Reference for controlled classification where applicable.

Reference topics provide subject discovery across domains.

For example, the topic `agriculture` may expose records from Biology, Agriculture, Environment, Economy and Statistical.

A topic is not a substitute for these records.

### 7.2 Geography

Geography provides spatial identity and context.

It should support:

- Administrative units.
- Statistical territories.
- Electoral territories.
- Historical territories.
- Watersheds.
- Ecological regions.
- Cultural regions.
- Physical sites.
- Natural features.
- Spatial representations.
- Historical boundary changes.
- Spatial datasets and derived map products.

Geography connects directly to relevant domain schemas.

**Geography must not depend directly on Legal.** Legal relationships are established through Reference and the appropriate legal/domain contracts.

### 7.3 Source

Source provides evidence and provenance.

It should answer:

- Who published the information?
- What original artifact supports it?
- Which version was used?
- When was it published?
- When did Mzizi acquire it?
- Which extraction or research method was applied?
- Was it reviewed?
- Is the claim disputed or superseded?

Source does not own the physical file bytes.

Filesystem owns those.

### 7.4 Statistical

Statistical provides a shared measurement and analytical framework.

It does not own every numeric value.

A sensor reading belongs to Environment. A market price belongs to Economy. A harvest belongs to Agriculture. An official election result belongs to Electoral.

Statistical owns comparable published measurements, statistical releases, indicators, observations and derived analytical series.

### 7.5 History

History supplies chronology and evidence-backed explanation.

It references actual entities and events in their owning domains.

It must not duplicate a second person, institution, geographic boundary, election or financial transaction simply to make historical research convenient.

## 8. Cross-domain relationship contracts

| From | To | Relationship |
|---|---|---|
| All applicable domains | Reference | Classification, scheme membership, topics and controlled meaning. |
| Reference | Legal | Legal classifications, applicability and legal-definition relationships. |
| Geography | Reference | Geographic classifications and semantic definitions. |
| Governance | Legal | Establishment, authority, mandates and legal bases. |
| Political | Legal | Registration, party regulation and statutory rules. |
| Electoral | Legal | Election procedures, contest rules and electoral authority. |
| Civic | Geography | Spatial identity, geometry, networks and physical location. |
| Environment | Geography | Monitoring locations, coverage and environmental rasters. |
| Biology | Geography | Species occurrences and distributions. |
| Agriculture | Geography | Farms, fields and cultivated areas. |
| Health | Biology | Organisms, pathogens, vectors, hosts and health conditions. |
| Education | Organization | Educational providers and institutions. |
| Health | Organization | Healthcare providers and operators. |
| Linguistics | Geography | Dated language distributions and linguistic territories. |
| Statistical | All domains | Measured, reported and derived information. |
| History | All relevant domains | Historical context, chronology and interpretations. |
| Heritage | History | Artifacts, traditions and historical context. |
| Economy | Agriculture | Agricultural production and market products. |
| Finance | Procurement | Budgets, commitments, contracts and payments. |
| Procurement | Civic | Infrastructure projects and contracted delivery. |
| Source | All domains | Evidence and attribution. |
| Filesystem | Source and all file consumers | Immutable file versions and digital artifacts. |
| Engine | All ingested domains | Processing, candidate generation and promotion. |
| Audit | All governed domains | Accountable changes, review and decisions. |

These are conceptual contracts. Each implementation must specify cardinality, actual FK columns, nullable semantics, deletion behavior and whether the relationship is one-to-one, one-to-many or many-to-many.

Do not create generic polymorphic links as a shortcut.

## 9. No civic-data bias

The five exploration areas must remain independently useful.

A user should be able to begin with:

- A river basin.
- A language.
- A historical kingdom.
- An ecosystem.
- A crop.
- A disease.
- A school system.
- A market.
- A migration route.
- An election.
- A government institution.

No government office should be the mandatory parent of every African knowledge record.

Modern countries are important organizational contexts, but historical, ecological, cultural, linguistic and cross-border realities must be represented independently.

The Kenya civic pilot is a testing strategy, not a permanent architectural limitation.

## 10. Schema creation test

Before creating a new PostgreSQL schema, demonstrate:

1. The domain owns canonical entities with an independent lifecycle.
2. It requires meaningful integrity rules or relationships.
3. Its queries and operations are sufficiently specialized.
4. Its permissions, acquisition and data-management responsibilities justify separation.
5. Existing schemas cannot own the information cleanly.
6. Its connections to other domains are explicitly defined.

If these conditions are not met, prefer a Reference classification, a capability within an existing domain, or a cross-domain research view.

## 11. Existing versus proposed implementation

The 11 November repository documentation records six schemas in the active ordered SQL tree: `auth`, `engine`, `filesystem`, `geography`, `legal` and `reference`, across 13 migrations.

The 18 original domain designs and seven expansion briefs are planning documents, not proof of 25 implemented schemas.

The new Education, Health and Linguistics designs are additional proposals.

No final physical schema count is approved.

## 12. Approval boundary

All schema and table inventories in this architecture remain proposals until individually reviewed.

This document does not authorize:

- SQL changes.
- Migrations.
- Seed generation.
- API implementation.
- Frontend implementation.
- Production data changes.
- S3 configuration changes.
- Infrastructure or deployment work.

The purpose is to establish the complete knowledge architecture before the final relational specification and implementation planning.

## 2026-11-11 — Two database direction

Main stores accepted cross-domain knowledge, verified sources/evidence and published file metadata; Operations stores auth, acquisition, runs, staging, analytical work and operational audit. S3 stores file bytes. Python-native scraping/NLP vectors are disposable. Rust owns relational access and Dryv owns contracts. Earlier database groupings are superseded. See [two database rules](two-database-rules.md) and [schema review catalogue](../schema-redesign/README.md). All schema/table proposals remain unapproved.