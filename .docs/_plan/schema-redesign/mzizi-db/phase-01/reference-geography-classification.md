---
id: PLAN-MZIZI-REFERENCE-GEOGRAPHY-CLASSIFICATION-20261112
name: Reference and Geography classification architecture
type: plan
tags: [database, reference, geography, classifications, dryv]
extra: {status: proposed_for_review, approval: not_approved, recorded_on: 2026-11-12}
---

# Reference and Geography classification architecture

> **PROPOSED — detailed classification definitions and Reference extensions are not approved.** The nine Geography table names and responsibilities are approved, and the current Reference table inventory is the accepted foundation. This plan reconciles their detailed fields and describes a proposed Reference-owned geographic catalogue. No seed values are loaded by this document. See [Reference](reference.md), [Geography](geography.md), and the [authoring agreement](../../../../rules/schema-contract-authoring.md).

## Audit and decision matrix

| Area | Current authored state | Design decision / status |
|---|---|---|
| Reference inventory | `countries`, `schemes`, `values`, `units`, `topics`, `patterns`, `pattern_versions`, `pattern_bindings`, `pattern_dependencies` | Preserve names and responsibilities. `vocabulary` remains a compatibility export. |
| Classification catalogue | `schemes` and `values`; `values.supersedes_id` is a self-reference | Keep supersession for replacement history. It is not taxonomy. Feature class/type relations need separate directed relations. |
| Geography identity | `features` owns identity; `units` and `places` use `feature_id` as their PK/FK | Preserve this one-identity model. Do not create a Geography country table or another identity registry. |
| Feature classification | `features.feature_kind` is a closed TS enum; no specific feature type exists | Replace the proposed enum field with a Reference value for a primary feature type. Derive broad classes through the proposed value-relation graph. Multi-type identity remains an open requirement; do not add a Geography join table without approval. |
| Geometry classification | `geometries.geometry_kind` is a TS enum; the geometry payload is `dryv.unknown()` | A geometry role is Reference data; actual shape family belongs in the PostGIS geometry subtype/metadata, not an enum duplicating the stored geometry. Exact PostGIS representation is blocked. |
| Dataset classification | `datasets.dataset_kind` combines subject, physical representation and dataset purpose | Split proposed fields into subject and representation References. Keep file format as format metadata and file version as a Filesystem reference. Current one-subject/one-representation shape is a primary classification only; multi-label needs a separately approved association design. |
| Reference taxonomy | No value-to-value relation exists | `reference.value_relations` is the smallest proposed addition that supports multiple parents and cross-scheme semantic edges. It remains proposed and excluded from active composition. |
| Scheme integrity | Relations point to one `reference.values.id`; scheme membership is not encoded in the target | Not safe for generation. The current author DSL cannot declare composite FKs/checks, and the SQL pack emits neither. Record the necessary pack capability; do not claim runtime rejection. |
| Geography to Reference | Geography has value relations but hardcoded `FeatureKind`, `GeometryKind`, `DatasetKind`; some external IDs are plain strings | Convert semantic classifications to typed Reference value relations in the proposed contract. Expected scheme validation remains a blocker. |
| Country / territory | `reference.countries`; optional `geography.units.country_id` | Keep country identity separate from territory. Rivers and other cross-border features have no single country requirement. Countrywide scope resolves to the country's geographic unit where required. |
| Pattern to Geography | `pattern_bindings.unit_id` is a nullable UUID with no relation | Intended FK target is `geography.units.feature_id`. Its same-country invariant cannot be enforced until composite/trigger semantics and Geography composition are supported; do not claim it is live. |
| SQL/Postgres generation | Pack template is marked a skeleton and multi-authoring is not activated | No generated SQL is a valid verification target for these designs. The current template injects `id`, `created_at`, `updated_at`, `version`, skips related fields, and omits indexes/constraints. Do not generate or apply it. |

## Proposed Reference catalogue

The following are initial **catalogue candidates**, not hardcoded enums, approved seed data, or a claim that all codes already exist. Use `reference.schemes` and `reference.values` as rows. Codes follow `.docs/rules/code-columns.md`: lowercase dot-separated stable identity codes, globally unique in their table, with child prefixes. Labels and meanings may evolve independently of codes.

| Candidate scheme code | Purpose | Initial candidate value concepts |
|---|---|---|
| `geography.feature_class` | Broad feature families | `area`, `place`, `natural`, `infrastructure` |
| `geography.feature_type` | Specific geographic identity type | `country_territory`, `county`, `district`, `region`, `province`, `sub_county`, `constituency`, `ward`, `census_area`, `city`, `town`, `village`, `settlement`, `locality`, `landmark`, `river`, `stream`, `lake`, `reservoir`, `ocean`, `sea`, `wetland`, `mountain`, `mountain_range`, `valley`, `forest`, `island`, `waterfall`, `road`, `road_segment`, `railway`, `railway_segment`, `bridge`, `tunnel`, `airport`, `seaport`, `building`, `dam`, `water_facility`, `electricity_infrastructure`, `telecommunications_infrastructure` |
| `geography.relationship_type` | Directed semantic relation between features | `administrative_parent_of`, `electoral_parent_of`, `statistical_parent_of`, `segment_of`, `connects_to`, `flows_into`, `drains_to`, `member_of_network`, `within_ecoregion` |
| `geography.relationship_system` | Named, overlapping relationship systems | Country/system records such as a country's administrative, electoral, statistical, hydrological or infrastructure network system; not a Geography table. |
| `geography.geometry_role` | Why a spatial representation is recorded | `boundary`, `centerline`, `footprint`, `location`, `entrance`, `label_point`, `coverage` |
| `geography.change_type` | Meaning of a geographic transformation | `creation`, `dissolution`, `split`, `merger`, `succession`, `renaming`, `boundary_adjustment` |
| `geography.name_type` | Kind of a geographic name | `official`, `local`, `former`, `historical`, `alternative`, `translated` |
| `geography.identifier_scheme` | External registry namespace | `openstreetmap`, `wikidata`, national geographic registry identifiers and other reviewed providers. |
| `geography.dataset_subject` | What a dataset is about | `topography`, `hydrology`, `climate`, `soils`, `geology`, `biogeography`, `land_cover`, `infrastructure`, `settlements`, `historical_geography` |
| `geography.dataset_representation` | Spatial data structure represented by an asset | `vector`, `raster`, `point_cloud`, `grid`, `surface` |

Illustrative fully qualified value codes are `geography.feature_class.area` and `geography.feature_type.area.county`; they are examples only. File formats such as GeoJSON, GeoPackage, GeoParquet, FlatGeobuf, GeoTIFF/COG, NetCDF, Zarr, vector tiles and PMTiles are formats/storage metadata, not dataset subjects. Point/line/polygon are geometry storage types, not feature classes, feature types or geometry roles. A spatial intersection is derived by PostGIS and is not a stored geographic relationship.

### Type-to-class relations

A specific type may be associated with more than one broad class. Candidate edges include `county -> area`, `ward -> area`, `river -> natural`, `lake -> natural`, `settlement -> place`, `road -> infrastructure`, `bridge -> infrastructure`, and `airport -> place` plus `airport -> infrastructure`. This is a directed many-to-many relation graph, not a single `parent_value_id` on `values`. A feature stores one primary feature type in the initial proposal; that type's broad classes are derived from Reference edges rather than duplicated on `geography.features`.

If evidence requires a single canonical feature identity to carry multiple independent feature types (rather than one type with several broad classes or related feature identities), a separate `geography.feature_classifications` association is a possible future extension. It is **not authorized or included** in this plan's contracts. Establish query and data examples before seeking approval.

### Relationship-system semantics

`relationship_type` describes what a directed feature-to-feature edge means. `relationship_system` says which independent hierarchy/network the edge participates in. A ward may have both administrative and electoral parent edges without cloning its `features` identity. Country-specific system values must carry country applicability; a global type scheme alone must not imply that every country has counties, wards or constituencies. The data edge is in `geography.relationships`; do not add a `geography_systems` table.

## Is `reference.value_relations` necessary?

Yes, for the approved requirements in this handoff, subject to review. `values.supersedes_id` means one value replaces another and cannot also mean broader/narrower taxonomy without mixing lifecycle and semantics. A `parent_value_id` extension would permit at most one parent and would conflate hierarchy with other typed relations. Feature types such as airport may map to multiple broad classes, and classification relations may cross schemes. The proposed table is therefore:

| Field | Meaning |
|---|---|
| `id` | Stable row identity. |
| `source_value_id` | Value from which the directed assertion starts. |
| `target_value_id` | Related value. |
| `relation_kind` | Closed Reference relation meta-kind: broader-than, narrower-than or related-to; not a Geography feature enum. |
| `valid_from`, `valid_until` | Optional inclusive/exclusive dates for a relation that changes over time. |

The logical edge identity is `(source_value_id, target_value_id, relation_kind)` over non-overlapping effective periods. Use lookup indexes in both directions. FKs to both values are restrictive and self-edges are invalid. A unique index on the edge columns alone would wrongly reject legitimate time-separated assertions; a unique index including nullable dates would still not prevent overlapping intervals. The required persistence rule is a PostgreSQL exclusion constraint on the directed typed edge and its effective daterange (normalizing an unbounded interval consistently). Dryv and the current SQL pack do not support that constraint, so temporal uniqueness is a documented blocker, not an implemented guarantee. Exact inverse-direction normalization and cycle policy also need review. The type-to-class graph must remain queryable; never infer a strict tree.

This table is a **proposed Reference addition**, not an approved tenth Reference table. The proposal can be omitted only if a supported alternative provides multiple parents, cross-scheme directed relations, relation semantics and effective time without overloading `supersedes_id`.

## Scheme/value lifecycle and country scope

| Existing field | Disposition | Proposed handling |
|---|---|---|
| `schemes.id`, `code`, `title`, `owner_snapshot` | KEEP | Preserve stable identity, global code and steward snapshot. |
| `schemes.definition` | ADD candidate | Explain the scheme's meaning, boundary and intended consumers. |
| `schemes.scope_kind`, `country_id` | ADD candidate | Distinguish global vs country-scoped schemes; country ID references `reference.countries`. Check that scope and nullable country ID agree. |
| `schemes.effective_from`, `effective_until`, `retired_at` | ADD candidate | Separate applicability interval from record/retirement lifecycle only if actual queries require it. |
| `values.id`, `scheme_id`, `code`, `label` | KEEP | Stable globally unique code; one default label; scheme ownership remains explicit. |
| `values.supersedes_id` | KEEP, clarify | Means replaced/succeeded by a value only. Same-scheme supersession and cycles require integrity rules. |
| `values.definition`, `sort_order`, `retired_at` | ADD candidate | Meaning text, display ordering and retirement where clients/imports need them. `sort_order` is not identity. |
| localized/alternate value labels | DEFER | No separate table is proposed now. Geography `names` describes geographic entities, not the labels of Reference values. Add a dedicated label table only after multilingual requirements and uniqueness are specified. |
| scheme/value country applicability | ADD candidate | Country-specific administrative arrangements must have an explicit scope and dates, never a universal Kenya hierarchy. Decide whether scope belongs on a scheme or a value; avoid storing the same applicability in both. |

These are field dispositions for discussion, not accepted DDL. Historical Reference SQL proposals do not override the current Dryv contract. Keep `reference.units` for measurement units. Keep `reference.topics` for discovery themes; topics do not classify feature identities. Pattern identities, versions and dependencies stay in Reference; execution state stays in Engine.

## Natural vs constructed origin

Do not add `geography.feature_origin` now. The initial type/class graph can express common concepts: a lake type maps to `natural`; a reservoir may map to `natural` and/or `infrastructure`; a dam is a separate infrastructure feature related to the water body. A provenance-backed modification/change can state the known intervention. This does not encode a general origin attribute when two features share one type but differ by origin. If future scientific or infrastructure queries require this distinction independently of type, return concrete cases and propose a controlled origin scheme then.

## Country-specific structures

Use global feature classes for broad meaning. Use global feature types for concepts that travel between countries, then country-scoped schemes/values or named relationship systems for administrative terminology and hierarchy that differs by country or period. `reference.pattern_bindings.country_id` selects applicable definitions; `unit_id` narrows to a real Geography unit. A missing country is allowed for global patterns, history and cross-border phenomena. The architecture must not infer a country from geometry alone.

## Geography contract field alignment (proposed details)

| Geography field | Proposed Reference target | Notes |
|---|---|---|
| `features.feature_type_id` | `geography.feature_type` values | Broad class derives through `value_relations`; do not store a duplicate class on the feature. |
| `units` specialization | Feature's type plus optional country | Remove a duplicate unit-kind classification if feature type fully identifies the unit kind. Country is optional for cross-border/historical units. |
| `places` specialization | Feature's type | Remove duplicate place-kind classification if the feature's type is sufficient. |
| `names.name_kind_id` | `geography.name_type` | Language tag remains on the name row; labels for Reference values are separate. |
| `identifiers.identifier_scheme_id` | `geography.identifier_scheme` | Preserve the external identifier as a separate value. |
| `geometries.geometry_role_id` | `geography.geometry_role` | The spatial geometry type itself must be a PostGIS type, not this value. |
| `relationships.relationship_kind_id`, system identifier | `geography.relationship_type`, `geography.relationship_system` | Both must be Reference values with country/time-aware applicability when relevant. |
| `changes.change_kind_id` | `geography.change_type` | `changes` rows remain predecessor/successor edges grouped by transformation. |
| `datasets.subject_id`, `representation_id` | `geography.dataset_subject`, `geography.dataset_representation` | Format remains separate; multi-subject datasets need a later association decision. |
| `datasets.resolution_unit_id` | `reference.units` | Measurement unit only. |
| `datasets.file_version_ref_id` | `filesystem.file_versions` | Source/Filesystem contracts are not yet authored; do not store bytes in Geography. |

The expected scheme for a value FK must be checked by the database. Until that is possible, these are proposed field relationships and must not be marked generation-ready.

## Scheme-aware integrity and Dryv/PostgreSQL capability audit

The current authoring relation accepts one target field. Storage accepts primary-key field lists and ordinary/unique indexes. It does not express a composite FK target, SQL `CHECK`, exclusion constraint, partial index predicate, generated column or trigger. The current Rust SQL pack is explicitly a skeleton: it emits an `id` PK and universal timestamps/version, skips fields with relations, maps many values to guessed scalar types, and emits no declared FK, unique/lookup index, check or spatial constraint. The Rust/database multi-authoring activation remains blocked.

Therefore the following required behavior is **not currently enforceable or verified** by the repository pipeline:

1. `features.feature_type_id` must reference a value in `geography.feature_type`, never a change type or identifier scheme.
2. Name, relationship, geometry-role, identifier, change and dataset classifications must each reference their intended scheme.
3. A value's supersession must remain within its scheme and must not form a cycle.
4. A unit-scoped pattern binding must point to an existing Geography unit, and any country scope must match that unit's country context.
5. Temporal overlap/exclusion rules, PostGIS geometry type/SRID rules and GiST indexes must retain their semantics.

An ordinary FK to `reference.values.id` only proves the value exists. A check in a form, operation or comment is not equivalent to a database constraint. Candidate technical options are (a) composite referenced keys `(scheme_id, id)` plus typed composite FKs and constants/checks at the consumer; (b) a database-side constraint/trigger generated from a typed scheme relation; or (c) a typed value-association contract whose scheme is itself structurally fixed. The current author API and SQL pack implement none of these end-to-end. Do not choose one until Dryv IR and emitted PostgreSQL support it and invalid cross-scheme inserts are demonstrated to fail.

## Verification plan and blockers

Required examples after the pack supports faithful persistence include Kenya and its territory; Nairobi County; a ward in administrative and electoral systems; a cross-border river; a road with segments; a feature with several names; a split/merger; an airport type associated to two broad classes; a country-scoped administrative pattern; and a dataset with original and derived Filesystem versions. Invalid tests must include a `geography.change_type` value in `features.feature_type_id`, a supersession to a different scheme, and a pattern unit paired with a conflicting country.

Current authoring typecheck and generic contract compilation can verify declarations only. The actual Rust SQL pack cannot produce a trustworthy schema, so generated SQL comparison, database-backed invalid insert tests and deterministic migration checks are blocked. Do not create manual SQL as a parallel contract or activate any proposed extension. The next implementation milestone must first make the SQL pack preserve columns, FKs, composite constraints, indexes and PostGIS semantics; then compile the explicitly selected approved schemas and run these tests.
