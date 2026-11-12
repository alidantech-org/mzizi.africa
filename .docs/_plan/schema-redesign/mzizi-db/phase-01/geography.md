---
id: DOC-MZIZI-SCHEMA-GEOGRAPHY-20261111
name: geography schema — phase-01
type: schema-review
tags: [database, schema-redesign, main, approved-inventory, proposed-contract, user-review]
extra: {status: inventory_approved_details_under_review, approval: table_names_and_responsibilities, approval_record: DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112, implementation: proposed_contract_not_composed, database: mzizi, recorded_on: 2026-11-12}
---

# Geography — Phase 01

> **APPROVED INVENTORY — 12 November 2026; detailed field contracts remain proposals.** The nine approved table names and responsibilities are authored in [`geography.ts`](../../../../../dryv/contracts/schemas/mzizi/geography.ts). The fields compile in the Main review entrypoint with Reference, Filesystem, Source, Legal and Reference-Legal, but Geography is not activated in the database foundation application. The Rust SQL pack has not been verified to preserve its relations or spatial constraints. No migration, live database change or deployment occurred.

[Phase 01 index](README.md) · [Schema catalogue](../../README.md)

## Approved responsibility

Geography owns canonical geographic identities, territorial and physical-place specializations, names, external identifiers, spatial representations, dated typed relationships, transformations and a catalog of spatial datasets. `geography.features` is the sole identity registry. Historical, cross-border and global features do not require a country association. Reference owns modern-country identity; Geography owns the corresponding territory. Measurement units remain `reference.units`.

Countrywide scope must resolve to the Geography unit representing that country when a domain record requires geographic scope. Such a unit is a Geography feature specialization linked to `reference.countries`; an absent unit is not a representation of countrywide scope. Country association is optional for other units, including historical and cross-border units. Spatial containment does not establish legal authority.

## Approved table inventory and proposed authored fields

| Table | Authored fields | Identity, relations and indexes |
|---|---|---|
| `geography.features` | `id`, `code`, `feature_type_id`, `created_at` | PK `id`; unique `code`; type lookup index. `feature_type_id` is proposed as an FK to `reference.values` in scheme `geography.feature_type`; broad classes derive from Reference relations. |
| `geography.units` | `feature_id`, `country_id?`, `valid_from?`, `valid_until?` | PK `feature_id`, one-to-one specialization of `features`; optional FK to `reference.countries`; indexes on country and validity. The feature primary type describes its unit kind. |
| `geography.places` | `feature_id`, `is_inhabited?` | PK `feature_id`, one-to-one specialization of `features`; no secondary index is justified for the nullable low-selectivity flag. The feature primary type describes its place kind. |
| `geography.names` | `id`, `feature_id`, `name`, `language_tag?`, `name_kind_id`, `valid_from?`, `valid_until?`, `source_ref_id?` | PK `id`; many-to-one FKs to `features` and `reference.values`; indexes on feature, kind and language. |
| `geography.identifiers` | `id`, `feature_id`, `identifier_scheme_id`, `namespace?`, `external_id`, `source_ref_id?` | PK `id`; FKs to `features` and proposed Reference identifier scheme; unique identifier scope and feature lookup index. |
| `geography.geometries` | `id`, `feature_id`, `geometry_role_id`, `geometry`, `srid`, `valid_from?`, `valid_until?`, `observed_at?`, `source_ref_id?`, `file_version_ref_id?` | PK `id`; FKs to `features` and proposed Reference geometry role; indexes on feature and validity. Geometry versions preserve prior representations. |
| `geography.relationships` | `id`, `subject_feature_id`, `object_feature_id`, `relationship_kind_id`, `system_id`, `valid_from?`, `valid_until?`, `source_ref_id?` | PK `id`; two role-specific FKs to `features`, proposed Reference FKs for relationship type/system; indexes for feature/type and system directions and validity. |
| `geography.changes` | `id`, `transformation_id`, `predecessor_feature_id?`, `successor_feature_id?`, `change_kind_id`, `effective_on?`, `source_ref_id?`, `explanation?` | PK `id`; optional predecessor/successor and required kind FKs; indexes on transformation, both feature roles and kind. Multiple rows per transformation preserve split/merge edges. |
| `geography.datasets` | `id`, `code`, `title`, `subject_id`, `representation_id`, `format`, `crs?`, `resolution?`, `resolution_unit_id?`, `coverage_feature_id?`, `source_ref_id?`, `file_version_ref_id?`, `quality_notes?` | PK `id`; unique `code`; proposed Reference FKs for subject/representation; optional FK to `reference.units` for resolution and `features` for coverage; indexes on subject, representation and coverage. |

Question marks indicate optional and nullable fields. Scalar validation reuses `_shared.ts`. Geography classes, feature types, geometry roles, dataset subjects and representations are Reference values, not Geography enums. Proposed single-column relations currently target `reference.values` but cannot enforce expected scheme membership. Declared relations use restrictive delete/update behavior. These are authored field proposals, not approved physical constraints.

For the classification catalogue, value-relation proposal, country-specific scope and field dispositions, see the [Reference–Geography classification plan](reference-geography-classification.md). No new Geography table is proposed in this change.

## Storage, evidence and domain boundaries

PostGIS is the intended store for curated vector geometries, boundary representations, spatial relationships, versioned spatial queries and indexes. Large raster/array/original assets—including GeoTIFF/COG, NetCDF, Zarr, GeoParquet and point clouds—remain in the existing Filesystem/SeaweedFS S3 system. Geography stores metadata and typed references, not duplicate file identities or raw asset bytes. Statistical observations belong to Statistical; Geography may catalog their relevant spatial datasets and coverage.

Reference is the only schema that may mediate Legal relationships for domain records. The review-only `reference.geography_change_legal_bases` relation associates a Geography change with an exact legal basis assertion; it is outside the active database composition. Geography `source_ref_id` and `file_version_ref_id` remain typed UUIDs because those external Source and Filesystem owners are not represented as direct Geography-to-domain FKs in this authored contract. The separate review entrypoint resolves 94 typed relation fields across the composed Main graph; SQL-level enforcement remains unverified.

## Dryv limitations and generation status

The `geometries.geometry` value is represented with `dryv.unknown()` only to preserve the candidate field's presence in this authored design. It does not specify a PostgreSQL/PostGIS geometry type, SRID subtype, dimensionality or validity rule. The current Dryv authoring and database-pack path has no verified PostGIS geometry mapping, GiST/SP-GiST index method, exclusion constraint for temporal overlap, partial uniqueness needed to guarantee one countrywide unit, or null-safe uniqueness for external identifiers whose namespace is absent. No spatial index is claimed by this contract. The model is **not generation-ready** until these capabilities and countrywide-unit integrity are represented and verified; do not generate or apply migrations from it.

Dryv expressions now describe ordered validity windows, non-self geographic relationships and positive dataset resolution. Verify that the selected database pack preserves these invariants as database enforcement before generation. The current model does not enforce that a Reference value belongs to the intended classification scheme, guarantee a transformation has at least one predecessor or successor, or prevent temporal overlap between competing representations. TypeScript typecheck alone is not database enforcement. Advanced raster/COG/NetCDF/Zarr bytes stay in S3.

## Superseded material

The accepted Geography inventory replaces earlier country-catalogue, boundary and legal-basis table candidates. Countries are canonical identities in Reference; geographic identity and spatial representation belong to `features` and `geometries`. Detailed fields in the current contract remain proposals pending scheme-aware integrity, PostGIS support and review. Existing migrations and generated artifacts are historical implementation evidence, not this target model.
