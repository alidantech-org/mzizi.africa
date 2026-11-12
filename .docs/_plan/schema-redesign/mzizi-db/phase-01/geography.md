---
id: DOC-MZIZI-SCHEMA-GEOGRAPHY-20261111
name: geography schema — phase-01
type: schema-review
tags: [database, schema-redesign, main, approved, user-review]
extra: {status: approved, approval: approved, approval_record: DEC-MZIZI-REFERENCE-GEOGRAPHY-20261112, implementation: authored_not_generation_ready, database: mzizi, recorded_on: 2026-11-12}
---

# Geography — Phase 01

> **APPROVED — 12 November 2026.** The approved Geography design is implemented as nine authored Dryv table contracts in [`geography.ts`](../../../../../dryv/contracts/schemas/mzizi/geography.ts). This records contract authorship only: there is no generated SQL, migration, live database change, or deployment. The schema is excluded from generation until PostGIS and spatial-index semantics are represented faithfully.

[Phase 01 index](README.md) · [Schema catalogue](../../README.md)

## Approved responsibility

Geography owns canonical geographic identities, territorial and physical-place specializations, names, external identifiers, spatial representations, dated typed relationships, transformations and a catalog of spatial datasets. `geography.features` is the sole identity registry. Historical, cross-border and global features do not require a country association. Reference owns modern-country identity; Geography owns the corresponding territory. Measurement units remain `reference.units`.

Countrywide scope must resolve to the Geography unit representing that country when a domain record requires geographic scope. Such a unit is a Geography feature specialization linked to `reference.countries`; an absent unit is not a representation of countrywide scope. Country association is optional for other units, including historical and cross-border units. Spatial containment does not establish legal authority.

## Approved tables and authored fields

| Table | Authored fields | Identity, relations and indexes |
|---|---|---|
| `geography.features` | `id`, `code`, `feature_kind`, `created_at` | PK `id`; unique `code`; lookup index on `feature_kind`. Sole canonical identity for every geographic entity. |
| `geography.units` | `feature_id`, `unit_kind_id`, `country_id?`, `valid_from?`, `valid_until?` | PK `feature_id`, one-to-one FK to `features`; required FK to `reference.values`; optional FK to `reference.countries`; indexes on kind and country. |
| `geography.places` | `feature_id`, `place_kind_id`, `is_inhabited?` | PK `feature_id`, one-to-one FK to `features`; required FK to `reference.values`; index on kind. |
| `geography.names` | `id`, `feature_id`, `name`, `language_tag?`, `name_kind_id`, `valid_from?`, `valid_until?`, `source_ref_id?` | PK `id`; many-to-one FKs to `features` and `reference.values`; indexes on feature, kind and language. |
| `geography.identifiers` | `id`, `feature_id`, `scheme`, `namespace?`, `external_id`, `source_ref_id?` | PK `id`; FK to `features`; unique `(scheme, namespace, external_id)`; feature lookup index. |
| `geography.geometries` | `id`, `feature_id`, `geometry_kind`, `geometry`, `srid`, `valid_from?`, `valid_until?`, `observed_at?`, `source_ref_id?`, `file_version_ref_id?` | PK `id`; FK to `features`; indexes on feature and validity. Geometry versions preserve prior representations. |
| `geography.relationships` | `id`, `subject_feature_id`, `object_feature_id`, `relationship_kind_id`, `system_code`, `valid_from?`, `valid_until?`, `source_ref_id?` | PK `id`; two role-specific FKs to `features`, FK to `reference.values`; indexes for each feature/kind direction and validity. Rows represent typed directed edges across overlapping systems. |
| `geography.changes` | `id`, `transformation_id`, `predecessor_feature_id?`, `successor_feature_id?`, `change_kind_id`, `effective_on?`, `source_ref_id?`, `explanation?` | PK `id`; optional predecessor/successor and required kind FKs; indexes on transformation, both feature roles and kind. Multiple rows per transformation preserve split/merge edges. |
| `geography.datasets` | `id`, `code`, `title`, `dataset_kind`, `format`, `crs?`, `resolution?`, `resolution_unit_id?`, `coverage_feature_id?`, `source_ref_id?`, `file_version_ref_id?`, `quality_notes?` | PK `id`; unique `code`; optional FK to `reference.units` for resolution units and `features` for coverage; indexes on kind and coverage. |

Question marks indicate optional and nullable fields in the Dryv contract. All UUID and scalar validation reuses profiles from `dryv/contracts/schemas/_shared.ts`; schema-local enums are limited to closed technical classifications (`FeatureKind`, `GeometryKind`, `DatasetKind`). Declared relations use restrictive delete/update behavior to preserve accepted records. Field names and exact storage definitions are the executable contract; the table above is a summary.

## Storage, evidence and domain boundaries

PostGIS is the intended store for curated vector geometries, boundary representations, spatial relationships, versioned spatial queries and indexes. Large raster/array/original assets—including GeoTIFF/COG, NetCDF, Zarr, GeoParquet and point clouds—remain in the existing Filesystem/SeaweedFS S3 system. Geography stores metadata and typed references, not duplicate file identities or raw asset bytes. Statistical observations belong to Statistical; Geography may catalog their relevant spatial datasets and coverage.

Reference is the only schema that may mediate Legal relationships for domain records. There is currently no executable Reference Legal-basis interface in `reference.ts`; therefore no Geography legal-basis table or unverified Legal FK is authored. Source and Filesystem contracts are also shells, so `source_ref_id` and `file_version_ref_id` are currently typed UUID references without enforced cross-schema relations. These remain explicit integration gaps.

## Dryv limitations and generation status

The `geometries.geometry` value is represented with `dryv.unknown()` only to preserve the approved field's presence in this authored design. It does not specify a PostgreSQL/PostGIS geometry type, SRID subtype, dimensionality or validity rule. The current Dryv authoring and database-pack path has no verified PostGIS geometry mapping, GiST/SP-GiST index method, exclusion constraint for temporal overlap, partial uniqueness needed to guarantee one countrywide unit, or null-safe uniqueness for external identifiers whose namespace is absent. No spatial index is claimed by this contract. The model is **not generation-ready** until these capabilities and countrywide-unit integrity are represented and verified; do not generate or apply migrations from it.

Dryv expressions now describe ordered validity windows, non-self geographic relationships and positive dataset resolution. Verify that the selected database pack preserves these invariants as database enforcement before generation. The current model does not enforce that a Reference value belongs to the intended classification scheme, guarantee a transformation has at least one predecessor or successor, or prevent temporal overlap between competing representations. TypeScript typecheck alone is not database enforcement. Advanced raster/COG/NetCDF/Zarr bytes stay in S3.

## Superseded material

This approval replaces the earlier candidate Geography inventory, including `geography.countries`, `geography.boundaries` and `geography.legal_bases`. Countries are canonical identities in Reference; geographic identity and spatial representation are held by `features` and `geometries`. Historical proposal text and migration inventories previously embedded below this heading have been removed because they described a different, unapproved target model. Existing migrations and generated artifacts remain historical implementation evidence, not this approved design.
