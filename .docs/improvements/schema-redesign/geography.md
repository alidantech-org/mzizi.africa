---
id: DOC-D57A9C234E81
name: Geography, places and geographic scope
type: documentation
tags: [improvements, schema-redesign, geography, planning]
extra: {status: planning_only, implementation: not_approved}
---

# Geography, places and geographic scope

**Planning only. Not approved for code changes or Taskcode task creation.** The user will direct the order of final design review and later tasks. All physical table/column changes below are proposals, not authorized migrations.

## 1. Current domain, user intent and boundaries

The user leans toward placing **geography and physical places together** while insisting they remain conceptually distinguishable. The current `geography` tables model administrative/territorial units, boundaries, names and history; `place` models physical locations, occupancy and expected presence. `contact` needs a separate evaluation of ownership rather than an automatic merge.

**Critical user concern:** country-wide Kenya ministries or IEBC must have an applicable **country-root geo unit**, not null merely because their scope is nationwide. But a registered supplier's unknown service area must not be invented as Kenya-wide, and its HQ in Nairobi must not be confused with geographic scope.

Design worldwide and historically: multiple administrative, electoral, statistical and customary systems can overlap; countries and boundaries have histories. Do not hardcode one Kenyan tree as universal.

## 2. Current database table and column inventory

These **real migration-declared** table/column names are from `source/backend/engine/database/migrations/1793607856459-initial.ts` and relevant subsequent CREATE-table migrations. They form the **baseline**, not a certified live/current column audit: later ALTER migrations, current TypeORM entities and deployed schema may add/remove/rename fields. Compare against `source/backend/api/src/modules/`, Dryv and PostgreSQL before finalizing any column decision. This document deliberately does not invent exact types/FKs not yet checked against live metadata.

| Existing table | Columns declared at initial CREATE TABLE (baseline) |
|---|---|
| `contact.points` | `id`, `channel`, `created_at`, `is_current`, `label`, `scope_id`, `scope_kind`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `value`, `version`, `visibility` |
| `geography.boundaries` | `id`, `created_at`, `geometry`, `is_current`, `label_point`, `reference_year`, `unit_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version`, `version_number` |
| `geography.changes` | `id`, `created_at`, `is_current`, `kind`, `source_unit_id`, `target_unit_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `geography.names` | `id`, `created_at`, `is_current`, `language`, `name`, `unit_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `geography.relationships` | `id`, `child_id`, `created_at`, `is_current`, `kind`, `parent_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `geography.units` | `id`, `code`, `created_at`, `is_active`, `is_current`, `jurisdiction_id`, `kind`, `level_id`, `name`, `parent_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `place.expectations` | `id`, `basis`, `created_at`, `facility_type_id`, `is_current`, `max_count`, `min_count`, `resolved_occupancy_id`, `role_id`, `scope_geo_unit_id`, `status`, `subject_id`, `subject_kind`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `place.occupancies` | `id`, `created_at`, `is_current`, `place_id`, `role_id`, `status`, `subject_id`, `subject_kind`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `place.occupancy_links` | `id`, `created_at`, `is_current`, `kind`, `predecessor_id`, `successor_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `place.places` | `id`, `address_text`, `available_from`, `building_type_id`, `created_at`, `is_current`, `kind`, `latitude`, `located_in_unit_id`, `longitude`, `name`, `parent_id`, `status`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |

**Additional migration-managed table:** `geography.boundary_shapes` (PostGIS materialization; its precise columns must be confirmed from the boundary-shapes migration).

## 3. Potential target table responsibilities — **proposals only**

| Candidate | Role / evaluation |
|---|---|
| `geography.units` | Canonical territorial/administrative/statistical/electoral units and country/root representations; preserve stable IDs. |
| `relationships` | Dated, typed parent-child and other relations; authoritative source for hierarchy. |
| `unit_paths` (proposed) | Optional ancestor/descendant lookup with real FKs, relationship system, depth and validity. Derive from relationships, not independent truth. |
| `boundaries` / `boundary_shapes` | Boundary versions vs heavy PostGIS materialization; evaluate whether expensive geometry needs separate physical storage. |
| `names` / `changes` | Names/aliases and territorial historical changes including splits and mergers. |
| `places` | Distinct real physical sites/buildings, coordinates, addresses, geo placement and precision. |
| `occupancies` / `occupancy_links` | Which organization/institution/office uses which physical place over which interval. |
| `expectations` | Pattern-proposed placement or presence, distinct from verified actual address. |
| `contact.points` | Not yet assigned: audit whether belongs to person, organization, place, site/publisher or shared contact domain. |

## 4. Strong relationships, geography, law and query design

Maintain separate **jurisdiction**, **legal territorial scope**, **physical location**, **operational presence**, **election/representation area**, **procurement delivery**, and **statistical observation location**. A single geo_unit_id everywhere is ambiguous. Prefer clear FK field names where a relationship is singular, and typed FK junction tables where a record has several scope roles. Each jurisdiction-wide scope maps to a valid root geo unit; time-aware exceptions must remain possible.

A country query should find descendant county/ward data; a ward query should find relevant national institutions where the scope includes the ward, **without automatically copying national statistical values to every descendant**. Recursive CTEs are the baseline; test a temporal closure table for high-volume querying. Real FK both directions (ancestor/descendant) if adopted. Handle multiple administrative systems and historical periods.

## 5. Four-class acquisition, patterns and traceability

**Static seeded:** countries/counties and official levels with evidence. **Pattern seeded:** expected offices or service presence per unit, and anticipated geography relationships where authoritative definitions permit. **Automated collected:** updated boundaries, actual sites, contact/location observations. **Derived:** spatial rollups, closure paths, aggregate counts, distance/containment and coverage—never ungrounded propagation of source facts. Preserve explicit class eligibility, lineage, pattern version and geographic validity.

For all retained/new tables, add concise PostgreSQL **schema/table/column comments**, plus a maintained Markdown/table registry describing each column's meaning, nullability decision, allowed acquisition classes and expected pattern/automated inputs. Record per-row origin via traceable lineage and real FKs where structurally possible. Do not treat a table's class eligibility as every row's origin.

## 6. Query scenarios the design must support

List all entities legally scoped to Kenya including county-specific ones without conflating HQ; retrieve all counties below Kenya; roll a constituency to historical parents; find services **physically present** in Nairobi vs services **nationwide in scope**; track ward boundary changes for an election year; see expected versus verified place occupancy; distinguish a county office legal presence from a real geocoded building.

## 7. Migration, preservation, integrity and compatibility

Reconcile existing `place.places`, `geography.units` and institution/finance/electoral/statistical scope columns before moving tables. Add country-root scope backfills based on evidence and confirmed jurisdiction, not simplistic nonnull assumptions. Establish actual FKs to `reference.jurisdictions`, `geography.units`, `organization.entities`, `governance.institutions` etc. Geospatial checks and historical-mapping consistency must be explicit. Assess old code `geo_link.py`, office-generation fixtures and related integrity checks.

Global requirements: check live data, orphans, actual FK constraints, indexes and enum/lookup validity; reconcile every old→new table/column; preserve historical identities, evidence, versioning and record counts; update Dryv, API, ingestion and filesystem references with migrations only after explicit user approval. Never rewrite canonical facts to make a schema migration pass.

## 8. Decisions the user has not yet approved

1. Merge `place` into `geography` now, or only after full column/usage audit?
2. Where does `contact` fit given multiple owner kinds?
3. Use direct scope FKs, typed scope junctions, or both by cardinality?
4. Can temporally valid closure paths support multiple hierarchies without false containment?
5. Which nullable geos mean truly global/nonspatial/unknown, and which must reference root?
6. Which place links are factual versus pattern-expected, and who verifies them?

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
