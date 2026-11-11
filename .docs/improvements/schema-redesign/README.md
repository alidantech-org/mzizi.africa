---
id: DOC-DB-SCHEMA-REVIEW-20261111
name: Two database schema review catalogue
type: documentation
tags: [improvements, planning, schemas, review, approval]
extra: {status: planning_only, approval_required: true, implementation_authorized: false}
---

# Schema redesign: user review catalogue

**Status: proposals for review.** Every schema, table, column, relationship and partition decision here awaits explicit user approval. Documentation completion does not authorize implementation.

## Architecture and inventory

The target has two logical PostgreSQL databases: **Main** for accepted cross-domain knowledge, verified sources/evidence, published file records and approved analytical products; **Operations** for auth, acquisition, jobs/runs, staging, analytical work and operational audit. S3 holds file bytes. Python capabilities own rebuildable native vector indexes. Rust is the only application database access boundary, with Dryv as the contract authority.

The checkout inventory is an artifact-level estimate, not a live database certification. Current SQL migrations and generated Dryv entities materially diverge. See [management and gap register](../knowledge-platform/rust-dryv-management.md) for measured inventory and coverage method. Earlier four-, five-, eight- and nine-database layouts are superseded by the two-database direction.

The focused rules are [ownership and publication](../knowledge-platform/two-database-rules.md), [Rust and Dryv](../knowledge-platform/rust-dryv-management.md), and [capacity, partitioning and storage](../knowledge-platform/capacity-partitioning-storage.md). This catalogue and its linked schema files are the authority for user review of proposed tables and columns.

## Main database review queue

| Schema | Proposed responsibility | Review file | Status |
|---|---|---|---|
| `reference` | Definitions, classifications, units, topics, identifiers and reusable patterns | [reference.md](reference.md) | Proposed; approval required |
| `geography` | Places, territories, boundaries, spatial representations and geographic relationships | [geography.md](geography.md) | Proposed; approval required |
| `legal` | Legal instruments, provisions, versions, applicability and authority | [legal.md](legal.md) | Proposed; approval required |
| `person` | Canonical individuals, names and external identities | [person.md](person.md) | Proposed; approval required |
| `organization` | Canonical institutions, businesses and other organizations | [organization.md](organization.md) | Proposed; approval required |
| `society` | Communities, social groups and structures distinct from formal organizations | [society.md](society.md) | Proposed; approval required |
| `governance` | Institutions, offices, mandates, appointments and tenures | [governance.md](governance.md) | Proposed; approval required |
| `political` | Parties, movements, memberships, affiliations and coalitions | [political.md](political.md) | Proposed; approval required |
| `electoral` | Elections, contests, candidates, electorates and results | [electoral.md](electoral.md) | Proposed; approval required |
| `civic` | Infrastructure, facilities, public services and development projects | [civic.md](civic.md) | Proposed; approval required |
| `finance` | Public budgets, revenue, expenditure, transfers and debt | [finance.md](finance.md) | Proposed; approval required |
| `procurement` | Tenders, bidders, awards, contracts and delivery obligations | [procurement.md](procurement.md) | Proposed; approval required |
| `economy` | Markets, products, prices, trade and economic activity | [economy.md](economy.md) | Proposed; approval required |
| `statistical` | Published statistical definitions, datasets, releases, observations and approved indicators | [statistical.md](statistical.md) | Proposed; approval required |
| `education` | Education systems, programmes, curricula, qualifications and accreditation | [education.md](education.md) | Proposed; approval required |
| `health` | Health conditions, surveillance, incidents, interventions and system relationships | [health.md](health.md) | Proposed; approval required |
| `linguistics` | Languages, families, dialects, scripts, features and distributions | [linguistics.md](linguistics.md) | Proposed; approval required |
| `activity` | Real-world events and occurrences, excluding domain-owned elections and transactions | [activity.md](activity.md) | Proposed; approval required |
| `history` | Historical periods, interpretations, accounts and curated chronologies | [history.md](history.md) | Proposed; approval required |
| `heritage` | Cultural objects, traditions, practices and collections | [heritage.md](heritage.md) | Proposed; approval required |
| `biology` | Taxonomy, organisms, traits, biodiversity and biological interactions | [biology.md](biology.md) | Proposed; approval required |
| `chemistry` | Substances, composition, properties and analytical measurements | [chemistry.md](chemistry.md) | Proposed; approval required |
| `agriculture` | Farms, fields, cultivation, livestock, practices and harvests | [agriculture.md](agriculture.md) | Proposed; approval required |
| `environment` | Climate, weather, hydrology, soil, quality and environmental observations | [environment.md](environment.md) | Proposed; approval required |
| `research` | Accepted study designs, protocols, samples and experimental relationships | [research.md](research.md) | Proposed; approval required |
| `filesystem` | Published logical files, immutable versions, hashes, S3 references and derivatives | [filesystem.md](filesystem.md) | Proposed; approval required |
| `source` | Accepted publishers, publications, captures, citations, attribution and provenance | [source.md](source.md) | Proposed; approval required |
| `participation` | Accepted public/official contributions and consultation records | [participation.md](participation.md) | Proposed; approval required |

**Main proposal count: 28 schemas.** Each is separately reviewable and may be merged, renamed or rejected by the user.

## Operations database review queue

| Schema | Proposed responsibility | Review file | Status |
|---|---|---|---|
| `auth` | Accounts, authentication, roles, permissions and service identities | [auth.md](auth.md) | Proposed; approval required |
| `acquisition` | Discovery, crawl state, observed links, fingerprints and access attempts | [acquisition.md](acquisition.md) | Proposed; approval required |
| `engine` | Pipeline releases, jobs, runs, attempts, checkpoints and delivery coordination | [engine.md](engine.md) | Proposed; approval required |
| `staging` | Candidate revisions, mappings, validation findings and review workflow | [staging.md](staging.md) | Proposed; approval required |
| `analytics` | Analytical requests, working projections, experiments and unpublished outputs | [analytics.md](analytics.md) | Proposed; approval required |
| `audit` | Operational/security actions and workflow decision history | [audit.md](audit.md) | Proposed; approval required |
| `management` | Minimal migration, contract and publication/delivery bookkeeping in both databases | [management.md](management.md) | Proposed; approval required |

**Operations proposal count: 6 operational schemas plus the cross-database management proposal.**

## Consolidations and ownership boundaries

| Prior responsibility | Proposed owner | Tables/concepts to reconcile |
|---|---|---|
| Climate and hydrological measurements | Main `environment` | Climate observations, weather, river measurements, soil and water-quality observations |
| Physical features and spatial structures | Main `geography` | Places, territory/boundary versions, geometries and spatial dataset descriptors |
| Experiments | Main `research` | Study, protocol, sample and experimental relationship records; execution runs stay in Operations `engine` |
| Evidence and publication provenance | Main `source` | Publisher, publication, capture, evidence, citation, verification and attribution records |
| Accepted websites | Main `source` | Website/source identity; discovery and crawl frontier remain Operations `acquisition` |
| Debt | Main `finance` | Debt instruments, balances, servicing and public borrowing |
| Real-world calendar events | Main `activity` | Occurrences; elections and procurement/financial transactions stay in owning domain |
| Identity and access administration | Operations `auth` | Accounts, roles, grants and service identities |
| Contact information | Typed owner tables in Main `person`, `organization` or `geography` | Avoid unrestricted polymorphic foreign keys |
| Temporary files and uploads | Operations `engine` | Reservations, incomplete uploads and cleanup; accepted immutable versions in Main `filesystem` |
| Analytics execution | Operations `analytics` | Requests, working projections and experiment state; accepted results in appropriate Main domain |
| Scraping/NLP vector indexes | Python capability-owned native store | Rebuildable index metadata; suggestions remain staging candidates |

## Review workflow and approval dashboard

Each schema file records proposed tables/columns, current SQL and Dryv inventory where found, FK targets, example queries, admission/publication behavior, growth assumptions, partition decision, S3 offload, risks and an explicit approval block. Its status stays **proposed** until the user records a decision.

Review order: shared definitions and publication rules; geography/source/filesystem; auth and operational contracts; identities and connected civic/governance domains; scientific/social domains; analytics outputs and management. For each table, review every column, key, FK, evidence path, retention rule, growth scenario and partition recommendation. A material edit reopens approval and dependent relationships.

## Implementation readiness gate

Implementation remains **blocked pending explicit user approval** of each retained schema and all its tables/columns, resolved ownership and foreign keys, capacity/partitioning decisions, and reconciliation of untouched `.docs/docs` and `.docs/rules` guidance. A later plan uses fresh Main and Operations databases generated from approved Dryv contracts, followed by selective import of validated records. Existing databases and S3 artifacts remain protected until a separately authorized cutover.
