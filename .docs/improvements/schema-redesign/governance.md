---
id: DOC-7CE43B819FA2
name: Institutions, offices, holders, public services and rule patterns
type: documentation
tags: [improvements, schema-redesign, governance, planning]
extra: {status: planning_only, implementation: not_approved}
---

# Institutions, offices, holders, public services and rule patterns

**Planning only. Not approved for code changes or Taskcode task creation.** The user will direct the order of final design review and later tasks. All physical table/column changes below are proposals, not authorized migrations.

## 1. Current domain, user intent and boundaries

Governance is central to MZIZI's goal of explaining how African administrations are structured. **Keep `governance` separate from `person` and `organization`.** The user leans toward moving relevant `civic` public services closer to governance, but the services/amenities model must still distinguish **who is responsible**, **what service is delivered**, **where it is offered** and **who holds an office**.

Address the previously noted country-wide geo unit defect: national ministries/IEBC-style institutions should have valid country-root scope, while actual headquarters and offices have separate place/occupancy links. Pattern-generated expected offices do not prove current holders or operating locations.

## 2. Current database table and column inventory

These **real migration-declared** table/column names are from `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database/migrations/1793607856459-initial.ts` and relevant subsequent CREATE-table migrations. They form the **baseline**, not a certified live/current column audit: later ALTER migrations, current TypeORM entities and deployed schema may add/remove/rename fields. Compare against `source/apps/api/src/modules/`, Dryv and PostgreSQL before finalizing any column decision. This document deliberately does not invent exact types/FKs not yet checked against live metadata.

| Existing table | Columns declared at initial CREATE TABLE (baseline) |
|---|---|
| `civic.amenities` | `id`, `code`, `created_at`, `geo_unit_id`, `is_active`, `is_current`, `jurisdiction_id`, `name`, `sector_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `civic.deliveries` | `id`, `amenity_id`, `budget_id`, `created_at`, `is_current`, `responsible_office_id`, `service_id`, `status`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `civic.posts` | `id`, `amenity_id`, `created_at`, `is_current`, `office_id`, `role_kind_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `civic.services` | `id`, `code`, `created_at`, `description`, `is_current`, `jurisdiction_id`, `legal_basis_id`, `name`, `sector_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `governance.holders` | `id`, `created_at`, `departure_reason`, `is_current`, `legal_basis_id`, `office_id`, `person_id`, `selection_procedure_id`, `status`, `term_number`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `governance.institutions` | `id`, `branch_id`, `code`, `created_at`, `description`, `geo_unit_id`, `is_current`, `jurisdiction_id`, `legal_basis_id`, `name`, `type_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `governance.offices` | `id`, `code`, `created_at`, `description`, `institution_id`, `is_current`, `is_singleton`, `name`, `parent_office_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `governance.procedures` | `id`, `created_at`, `description`, `is_current`, `legal_basis_id`, `method_id`, `office_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `governance.relationships` | `id`, `child_institution_id`, `created_at`, `is_current`, `kind`, `legal_basis_id`, `parent_institution_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `governance.rules` | `id`, `created_at`, `is_current`, `kind`, `legal_basis_id`, `numeric_value`, `office_id`, `text_value`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `governance.stages` | `id`, `actor_institution_id`, `actor_office_id`, `created_at`, `description`, `is_current`, `kind`, `procedure_id`, `stage_order`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |



## 3. Potential target table responsibilities — **proposals only**

| Current/candidate | Specific purpose / issue |
|---|---|
| `institutions` | Public institution identity, legal establishment, jurisdiction/scope, relation to actual organization entity if relevant. |
| `relationships` | Dated institution-to-institution parent, oversight, subordinate, mandate, collaboration links; avoid uncontrolled polymorphism. |
| `offices` | Legally/structurally expected and observed posts, rank, scope, institution, office type, validity. |
| `rules` | Pattern/office definition and applicability, count, generating scope, legal provision and version. |
| `procedures` / `stages` | Selection, election, appointment, succession and other office filling procedures, jurisdiction/time aware. |
| `holders` | Individuals in offices, status, appointment dates, service intervals, authority/evidence. |
| `civic.services` / `deliveries` | Public service identity and actual delivery records, funding and reach. |
| `civic.amenities` / `posts` | Facilities/service posts; decide fit with `geography.places` and expected `occupancies` before any table move. |
| Proposed pattern registry linkage | Office/service expectations, counts, generation runs, deviations, reviewed overrides. |

## 4. Strong relationships, geography, law and query design

Real FKs: institutions → jurisdiction/root geography/legal basis where applicable; offices → institution, office rule, service region/seat; holders → person and office; governance.rules → legal authority/provision where relevant; physical `amenities`/facilities → place and scope; public service delivery → governing institution/finance units/geo and time. **No cross-schema soft-ID doctrine**. Use explicit typed junctions for multiple service territories or an office supported by several provisions. Avoid duplicating the same law FK on hundreds of generated offices if an approved pattern already supplies the reason, while retaining overrides/exception proofs.

## 5. Four-class acquisition, patterns and traceability

**Static seeded:** constitutional/legally established public institution definitions and basic controlled office types. **Pattern seeded:** county government offices, legislative seats, ministry structures and expected service locations generated by jurisdiction/period/geo unit. **Automated collected:** governors/deputies, ministers, commissioners, official holders, appointment/gazette notices, actual facilities and service delivery. **Derived:** coverage ratios, expected vs verified holders, cabinet composition and ministry responsibilities based on validated inputs.

For all retained/new tables, add concise PostgreSQL **schema/table/column comments**, plus a maintained Markdown/table registry describing each column's meaning, nullability decision, allowed acquisition classes and expected pattern/automated inputs. Record per-row origin via traceable lineage and real FKs where structurally possible. Do not treat a table's class eligibility as every row's origin.

## 6. Query scenarios the design must support

For a county/year list legally required offices, verified current holders, vacancies and their sources; show national ministries in county-relevant views without claiming HQ there; trace an office's legal origin; map parent institutions and local service facilities; distinguish expected/deployed services from delivered outputs; list missing county deputies without fabricating them.

## 7. Migration, preservation, integrity and compatibility

Audit 2026-11 existing governance generalisation and pattern scripts/fixtures (`ke-office-patterns.json`), `governance.institutions`, `offices` scope and `governance.rules` relations. Check current holders/office duplicates; do **not** trust historical guessed counts automatically. Move civic service tables only after full column, query and FK compatibility review. Resolve outdated jurisdiction-wide null geo links as a separate, evidence-checked backfill. Preserve office holder history across office pattern changes.

Global requirements: check live data, orphans, actual FK constraints, indexes and enum/lookup validity; reconcile every old→new table/column; preserve historical identities, evidence, versioning and record counts; update Dryv, API, ingestion and filesystem references with migrations only after explicit user approval. Never rewrite canonical facts to make a schema migration pass.

## 8. Decisions the user has not yet approved

1. Which civic public services belong in governance vs a service delivery subdomain?
2. Are `governance.rules` sufficient for pattern definitions, or do they need a separate versioned pattern table?
3. Which kinds of nationwide, subnational and institution-specific office should use direct vs multi-geo links?
4. What counts as "current" vs expected, acting, deputy, vacant or historically superseded?
5. How to model historical nonmodern institutions or different government forms worldwide?
6. Can one office have multiple holders simultaneously and under which appointment rules?

## 9. Related planning resources and decision status

See [master register](../mzizi-data-schema-storage-and-pipelines-redesign.md), [schema review index](README.md), [data classes/patterns](../data-categories-and-patterns.md), and [independent pipelines](../independent-data-pipelines.md). **Any preference noted here is a planning recommendation; the user decides the final schema/table/column specification and authorizes tasks one at a time.**

## Human review — editable user notes and design sign-off

**Review status:** `NOT REVIEWED` — AI-authored proposals in this document are not final approval.

**In my own words, what this schema should represent and exclude:**

> _My understanding and questions:_

**Tables/columns I want to keep, rename, move, merge, split, remove or add (and why):**

> _My proposed changes and alternative names:_

**Hard foreign keys, geographical and legal scope, pattern generation, classification and evidence I want changed or explained:**

> _My technical feedback, disagreements and alternatives:_

**Real data and queries I want to use to validate this design:**

> _My examples and expected results:_

**Unresolved decisions I want to discuss further:**

> _My remaining questions:_

**Final user decision:** `NOT DECIDED` / `NEEDS CHANGES` / `DESIGN VALIDATED BY USER` / `APPROVED FOR TASK PLANNING`.

**Approval reference and date:** _None. Only record explicit later user authorization. Even design validation does not authorize code, migration or Taskcode task creation._

## Mandatory per-table temporal, rigid-column and deletion review (2026-11-07)

**USER REQUIREMENT; planning only.** Examine every existing/proposed field and expressly record **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** for `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision`, `is_current`, `status`, `version`, `created_at`, `updated_at` and other copied/rigid flags. These fields are **opt-in by justified meaning**, not blanket schema conventions. Assess `deleted_at` only for recoverable soft deletion where appropriate. The full policy and migration/approval checklist is in [schema redesign README](README.md).

**Domain-specific guidance:** Key example: governance.offices should generally derive structural/legal applicability from the referenced pattern and law, rather than duplicating its validity period. An office may still independently open/close or be abolished, requiring a real history/exception. governance.holders DOES need appointment/tenure boundaries; exact modern dates rarely need precision columns. Institution and civic-service existence, operational status and source completeness are separate. Retirement is not deletion.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.
