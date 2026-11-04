---
id: DOC-MOBILE-SCHEMA-INVENTORY-PHASE1
name: Mobile schema inventory phase one
type: documentation
tags: [mobile, database, schema-inventory, frontend, research]
---

# MZIZI Mobile — Schema Inventory, Phase 1

**Status:** Preliminary source-backed inventory (2026-11-04). This is not a field-by-field audit, a completed Taskcode task, or a claim that all documented tables are currently migrated. No production data has been inspected.

## Purpose

Establish a traceable starting point for mobile API contracts, screens, data visualizations, data availability checks, and synthetic fixtures. Domain truth remains in the current Dryv contracts and database engine, not this inventory or the mobile application.

## Source hierarchy

1. `dryv/contracts/`: authoritative semantic contract definitions and generated API surfaces.
2. `source/backend/engine/database/`: migration state, integrity rules, imports, and seeds.
3. `source/backend/api/`: implemented NestJS read behavior and response DTOs.
4. `.docs/docs/DATABASE_DESIGN.md`, `PEOPLE_DESIGN.md`, `SOURCING_DESIGN.md`, `geography-model.md`, `DOMAINS.md`: design rationale and documented catalogue.
5. `source/backend/api-legacy/`: historical reference only, never an unqualified current contract.

## Documented schema catalogue

| PostgreSQL schema | Documented tables | Mobile presentation candidates |
| --- | --- | --- |
| reference | jurisdictions, classifications | Country selectors, classifications and labels |
| geography | units, relationships, boundaries, names, changes | Place explorer, hierarchical navigation, changing maps |
| legal | instruments, provisions, amendments, changes, links | Statutes and provision histories |
| person | individuals, names, profiles, contacts, handles | Public figure profiles, names, biographies |
| identity | accounts, grants | Private; exclude from public fixtures |
| governance | institutions, relationships, offices, rules, procedures, stages, holders | Institution structures, office terms and holders |
| electoral | elections, seats, candidates, results, manifestos, commitments | Election profiles, candidate results, turnout context |
| political | parties, memberships, units, ideologies, positions, alignments, holders | Party and affiliation profiles |
| calendar | events, links | Event timelines |
| organization | entities, identifiers, ownerships | Entity registry and ownership links |
| finance | years, units, budgets, transfers, revenues, expenditures, entries | Budgets, spending and fiscal comparisons |
| debt | loans, disbursements, repayments | Debt history and repayments |
| procurement | tenders, bids, contracts, milestones, variations | Procurement process and contracts |
| statistical | periods, categories, indicators, fields, datasets, observations | Indicator detail, chart series and comparison tables |
| civic | services, amenities, posts, deliveries | Public-service directories |
| filesystem | stores, formats, folders, objects, files, versions, variants, attachments, uploads, events | Approved media and attachments; never file bytes in domain rows |
| source | publishers, documents, captures, methods, attributions, verifications | Evidence, citations, trust and verification status |
| website | sites, domains, site_publishers, structures, structure_versions, structure_files, checks, families, domain_patterns, members, subjects, traits, relations, fingerprints, assessments, dossiers | Research/source context; mostly internal |
| place | places, occupancies, occupancy_links, expectations | Actual locations, occupancy history, planned presence |
| contact | points | Public contact channels only |
| audit | comments, evidence, decisions | Authorized review/discussion surfaces |

**Catalogue reconciliation required:** `DATABASE_DESIGN.md` also describes statistical tables `dimensions`, `dimension_members`, `observation_dimensions`, `vintages`, `observation_derivations`, absent from its earlier summary table. `DOMAINS.md` documents `organization.locations` as retired and replaced with `place` occupancies and `contact` points. The current migration/contract state has not yet been independently enumerated for every table. `staging`, `engine` and derived `geography.boundary_shapes` are engine-owned rather than public Dryv entities.

## Confirmed relationship examples

| Relationship | Evidence | Mobile implication |
| --- | --- | --- |
| `geography.units.parentId -> geography.units.id` | `dryv/contracts/foundation/geography/index.ts` | Breadcrumbs, hierarchy, parent-detail links; levels are jurisdiction-specific |
| `geography.boundaries.unitId -> geography.units.id` | Geography contract | Map geometry on demand and boundary history |
| `geography.names.unitId -> geography.units.id` | Geography contract | Name/alias history and time context |
| `person.names.personId -> person.individuals.id` | `dryv/contracts/domains/person/index.ts` | Names and aliases |
| `person.profiles.personId -> person.individuals.id` | Person contract | Dated summaries/biographies |
| `person.contacts.personId -> person.individuals.id` | Person contract | Only publicly exposed contacts may reach the app |
| `governance.offices.institutionId -> governance.institutions.id` | `dryv/contracts/domains/governance/index.ts` | Institution-to-office drilldown |
| `governance.holders.officeId -> governance.offices.id` | Governance contract | Office-holder timeline |
| `governance.holders.personId -> person.individuals.id` | Governance contract | Cross-schema soft reference; resolve through API |
| `finance.units.institutionId -> governance.institutions.id` | `dryv/contracts/domains/finance/index.ts` | Budgetary unit to institution link |
| `source.attributions(target_kind, target_id)` | `.docs/docs/SOURCING_DESIGN.md` | Evidence projection fetched separately, not a domain-row source column |
| `filesystem.attachments` | `.docs/docs/DATABASE_DESIGN.md` | Images/media referenced by attachment role; use approved retrieval |

Cross-schema IDs are soft references, not foreign keys; the database engine owns referential integrity checks.

## First mobile presentation rules

- **Geography:** show jurisdiction, classification, current/historical names, hierarchy and dated boundaries. Load large GeoJSON separately from list cards.
- **People:** show public biographies, aliases, positions and public contacts only. Keep platform `identity`, restricted and private contact data out of public responses and mock data.
- **Governance:** institution → office → dated holder → person; never confuse jurisdiction scope with a physical office location.
- **Statistics:** describe indicator, period, dimension members, unit, vintage, estimate type and uncertainty before choosing visualizations. Do not merge census and projections without labeling them.
- **Finance:** require currency, fiscal period, budgetary scope and measure definitions to compare amounts.
- **Evidence:** compose citation and verification summaries from `source` through explicit API projections; do not add fictitious provenance fields to canonical tables.
- **Media:** the `filesystem` domain owns attachments and file metadata; mobile presentation obtains approved file access through API contracts.

## Completion checklist — Task 1

- [ ] Enumerate all Dryv entity definitions and generated tables against database migrations.
- [ ] Record each field, type, optionality, constraints, indexes and temporal/versioning semantics.
- [ ] Catalog within-schema foreign keys, cross-schema soft references and cardinalities.
- [ ] Reconcile retired `organization.locations` and additional statistical dimension tables.
- [ ] Map each publicly accessible API operation and DTO to mobile views, noting missing aggregations.
- [ ] Document source, verification, privacy and media access rules by public entity.
- [ ] Create or update the corresponding Taskcode record via the Task CLI and run `task validate` from the MZIZI checkout.

## Subsequent task outputs

1. JSON contracts: list, detail, time-series, categorical breakdown and GeoJSON projections, each linked to supported API operations.
2. UI mapping: fields to cards, tables, maps, timelines and appropriately qualified graphs.
3. Screen specifications: navigation, information hierarchy, loading, empty, disputed and error states.
4. Data availability matrix: implemented, aggregatable, seeded, unavailable or unverified, with evidence of status.
5. Synthetic mock fixtures: realistic but explicitly synthetic JSON, validated against presentation contracts and safe for public preview.

## Taskcode tracking

This is a documentation deliverable, not a manually forged Taskcode task. Task and group records in `.docs/todo/` must be created and managed only through `task` in the actual `develop` checkout. A repository-only GitHub connection cannot run local Taskcode commands or validate the local workspace. Do not mark the task complete based on this phase-one document.
