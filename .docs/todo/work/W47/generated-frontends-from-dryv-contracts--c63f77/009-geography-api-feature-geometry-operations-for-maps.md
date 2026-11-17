---
{id: TSK-36417960E399,name: "Geography API: feature geometry operations for maps",type: task,status: completed,priority: medium,created_at: 2026-11-17T09:05:14.468Z,updated_at: 2026-11-17T11:53:00.286Z,order: 9216,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T09:05:19.793Z},{from: in-progress,to: completed,at: 2026-11-17T11:53:00.286Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-36417960E399/1794906319795-start,started_at: 2026-11-17T09:05:20.296Z,end_ref: refs/tracking/TSK-36417960E399/1794916380289-end,ended_at: 2026-11-17T11:53:00.287Z,summary: {files: 193,insertions: 5340,deletions: 294}}]}}}
---

# Geography API: feature geometry operations for maps

## Goal

Give the product API operations that return the stored drawings of geographic features, so a generated map view has real data to present. Today `BrowseFeatures` and `GetFeature` return names only, even though `geography.Geometries` stores geometry, centroid, envelope, area, role, basis, confidence, zoom range and validity. This task adds the first geometry operation using existing Dryv vocabulary and records, with evidence, what Dryv's read queries cannot yet express (a bounds filter), so the next decision is made on facts.

## Context

The plan is `.docs/_plan/guides/frontend-assembly-from-contracts.md` (Maps section). Dryv read queries support equality, ordering comparisons, prefix and null checks, but no spatial predicate, so a bounds filter is not expressible as a query today. Mzizi's rules apply: evidence is never substituted (a feature without geometry returns an empty list, not a guess), and the geometry's basis, role, confidence, zoom range and validity travel with it. Contracts are under `dryv/contracts/apps/api`; generated API code is under `source/backend/api` and must not be hand-edited.

## Acceptance checklist

- [x] Two operations exist: `ListFeatureGeometries` (`GET /v1/geography/features/{featureId}/geometries`) lists the current drawings of one feature with role, basis, revision, confidence, zoom range, validity, geometry, centroid and area; `BrowseGeometries` (`GET /v1/geography/geometries`) returns current drawings whose envelope meets a bounds at a zoom, optionally of one feature type and simplified.
- [x] The contract compiles, passes the contract import and audit checks, and the generated API typechecks.
- [x] The way the geometry value is serialised over HTTP is inspected in the generated code and recorded.
- [x] The Dryv gaps (queries over geometry fields, spatial predicate, typed geometry in DTOs) are recorded, and the owner chose a hand-written use case built on the generated repository, entities and DTOs.
- [x] `task validate` passes.

## Progress

Chosen route (owner): hand-written use cases built on generated code. Both operations are declared in `dryv/contracts/apps/api/geography.ts` without a query (plain response schemas, a `GeometryWindow` input extending the page window, longitude, latitude and tolerance properties). Generation with `--app api` scaffolds the use cases, DTOs, interfaces, specs and SDK methods. The project-owned use cases (`list-feature-geometries.usecase.ts`, `browse-geometries.usecase.ts`) and a shared `geometry-reads.ts` build their query on the generated `GeometriesRepository.query()`, `GeometriesEntity`, `FeaturesEntity` and `FeatureGeometryDto`, adding PostGIS only for what the contract cannot yet say: envelope overlap (`&&` with `ST_MakeEnvelope`), the zoom range (null means every zoom), the optional feature type join, and `ST_SimplifyPreserveTopology`. Geometry leaves as GeoJSON (`ST_AsGeoJSON`), timestamps as ISO instants, current drawings only (`valid_until IS NULL`), pages capped at 200.

Checked: `dryv-ts compile`, the contract import check and API `tsc` pass; the new spec builds the SQL against the generated entity metadata and asserts the predicates; the whole geography test folder passes. **Not run against a database**: neither `mzizi` nor `mzizi_dev` has a `geography.geometries` table yet, so the statements were checked as SQL text only.

## Dryv gaps found (for later proposals, none changed)

- A read query over a schema with a geometry field fails planning (`persistence.unsupported`).
- Read queries have no spatial predicate (only equality, ordering comparisons, prefix, null).
- The generated DTOs and interfaces type `geometry` and `centroid` as `unknown`; a GeoJSON type would let clients and the SDK type them.

## Verified against `mzizix`

The database in `.env` (`mzizix`, PostGIS 3.6, 2,100 features, no stored drawings yet) has `geography.geometries`. The generated statement was run there inside a transaction that was rolled back (nothing persisted; the row count was 0 afterwards): one polygon inserted with a valid role and basis value (a trigger enforces the reference schemes `ref.sch.geo.geometry.role` and `.basis`) returned its GeoJSON, simplified GeoJSON and centroid for a bounds over Kenya at zoom 6, and was excluded by a bounds elsewhere and by zoom 10. The table also has `deleted_at`, which the generated repositories always filter on, so both use cases now add `deleted_at IS NULL` (the spec asserts it). The earlier "not run against a database" note no longer applies to the SQL; the use cases themselves were not called through HTTP.
