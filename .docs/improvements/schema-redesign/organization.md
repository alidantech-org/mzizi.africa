---
id: DOC-BC719E5A03D2
name: Canonical organizations, legal identities and identifiers
type: documentation
tags: [improvements, schema-redesign, organization, planning]
extra: {status: planning_only, implementation: not_approved}
---

# Canonical organizations, legal identities and identifiers

**Planning only. Not approved for code changes or Taskcode task creation.** The user will direct the order of final design review and later tasks. All physical table/column changes below are proposals, not authorized migrations.

## 1. Current domain, user intent and boundaries

**Confirmed**: retain a distinct `organization` schema for legal entities, private companies, NGOs, public bodies' legal identities, suppliers and other organizations, while keeping their `governance` institution/office definitions separate. Organization identity should be stable across tender bids, contract awards, financial records, websites and legal changes. A single procurement supplier should not become a second new organization merely because its name is spelled differently at a portal.

**Important limitation:** old `organization.locations` was explicitly removed in an earlier migration; physical presence belongs in the place/occupancy model. Do not revive a duplicate organization-location table merely to attach one county.

## 2. Current database table and column inventory

These **real migration-declared** table/column names are from `source/backend/engine/database/migrations/1793607856459-initial.ts` and relevant subsequent CREATE-table migrations. They form the **baseline**, not a certified live/current column audit: later ALTER migrations, current TypeORM entities and deployed schema may add/remove/rename fields. Compare against `source/backend/api/src/modules/`, Dryv and PostgreSQL before finalizing any column decision. This document deliberately does not invent exact types/FKs not yet checked against live metadata.

| Existing table | Columns declared at initial CREATE TABLE (baseline) |
|---|---|
| `organization.entities` | `id`, `code`, `created_at`, `entity_type_id`, `is_current`, `jurisdiction_id`, `official_name`, `parent_entity_id`, `status`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `organization.identifiers` | `id`, `created_at`, `entity_id`, `is_current`, `issuing_authority_id`, `scheme_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `value`, `version` |
| `organization.ownerships` | `id`, `created_at`, `entity_id`, `is_current`, `owner_entity_id`, `owner_person_id`, `percentage`, `position`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |



## 3. Potential target table responsibilities — **proposals only**

| Current table | Purpose and redesign review |
|---|---|
| `entities` | Stable canonical legal identity, type/category, registered jurisdiction, parent affiliations and temporal status. |
| `identifiers` | Scheme/value/issuer/valid period; enable verified PPIP/e-GP identifiers, business registries, and historic identifier aliases. |
| `ownerships` | Dated share/control/relationship between organizations; real FKs to both parties. |
| `organization.locations` | **Retired**; replace ambiguous HQ/service/county roles with `geography.places`/occupancies and typed scope links. |
| Potential `names` | Only if historical aliases cannot be expressed cleanly via current entity fields/source claims. |
| Potential `roles` | Consider contextual role junction tables in domains (e.g., procurement), not a globally ambiguous "supplier type" on identity. |

## 4. Strong relationships, geography, law and query design

Use direct FKs from `procurement.bids`, `procurement.contracts`, `finance.units`, `source.publishers`, `website` publisher/owner associations and `governance.institutions.entity_id` if appropriate. A legal organization and a public institution may be tightly connected but are not interchangeable; validate the 1:1/1:N cases. Model registered jurisdiction, HQ physical occupancy, public-service jurisdiction, procurement roles and delivery location separately. Treat organizational relationships as dated, directional, typed FKs.

## 5. Four-class acquisition, patterns and traceability

**Static seeded:** canonical state/public bodies and verified organization registries. **Pattern seeded:** expected regional government bodies where law/structure creates them, but a private company must not be conjured from a pattern. **Automated collected:** supplier lists, statutory bodies, ownership/registration changes, official identifiers and contact points. **Derived:** linked entity rollups, procurement exposure, organizational network views. Each row's actual origin is evidence-linked and corrected with history.

For all retained/new tables, add concise PostgreSQL **schema/table/column comments**, plus a maintained Markdown/table registry describing each column's meaning, nullability decision, allowed acquisition classes and expected pattern/automated inputs. Record per-row origin via traceable lineage and real FKs where structurally possible. Do not treat a table's class eligibility as every row's origin.

## 6. Query scenarios the design must support

Find all tenders for one public body across name variants; link supplier bids to same verified entity across portals; find an organization physically in County A vs registered nationally vs delivering projects in County B; trace parent/subordinate organizations; audit an organization merge proposal and all affected FKs.

## 7. Migration, preservation, integrity and compatibility

Inventory organization identifiers and duplicate merges before enforcing uniqueness (scheme, issuing authority, value, valid interval). Carefully reconcile public institution vs organization entity mapping. Verify existing `entity_id` columns and later additions. Preserve IDs and aliases; do not absorb `person` or `governance` into organization.

Global requirements: check live data, orphans, actual FK constraints, indexes and enum/lookup validity; reconcile every old→new table/column; preserve historical identities, evidence, versioning and record counts; update Dryv, API, ingestion and filesystem references with migrations only after explicit user approval. Never rewrite canonical facts to make a schema migration pass.

## 8. Decisions the user has not yet approved

1. What identities represent government offices that are not separately incorporated?
2. Which supplier identifiers are authoritative and publicly reusable?
3. Who may correct an organization ID/name, and how are mergers/splits represented?
4. Are type classifications well-defined by jurisdiction, or mixed generic labels?
5. Which owner/parent/branch relationships are legal, financial or operational?

## 9. Related planning resources and decision status

See [master register](../mzizi-data-schema-storage-and-pipelines-redesign.md), [schema review index](README.md), [data classes/patterns](../data-categories-and-patterns.md), and [independent pipelines](../independent-data-pipelines.md). **Any preference noted here is a planning recommendation; the user decides the final schema/table/column specification and authorizes tasks one at a time.**
