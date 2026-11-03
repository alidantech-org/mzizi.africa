---
{id: DOC-GEOGRAPHY-NEUTRAL-MODEL,name: geography-model,type: documentation,tags: [geography,dryv,contracts]}
---

# Geography: neutral model and contract mapping

Contracts live in `dryv/contracts/foundation/geography/index.ts` and reuse `foundation/shared` and `foundation/reference`. They replace the geographic legacy models listed in `.docs/docs/audits/LEGACY_MODEL_INVENTORY.md` section 2.

## Model

| Contract | Legacy source | What changed |
|---|---|---|
| `GeoUnit` | `geo_units` | One business code, a `kind` (territorial, electoral, statistical, fiscal, historical_polity), a jurisdiction, a level record, versioning. |
| Level (a `ClassificationRecord`, scheme `geography/level`) | `geo_levels` | Level names and order are rows scoped by jurisdiction and period. No country's hierarchy is in the schema. |
| `GeoRelationship` | `geo_relationships` | Typed, dated, with a source. |
| `GeoBoundaryVersion` | `geo_boundary_versions` | Kept as the provenance template; adds method, confidence, artifact reference and a verification state. |
| `GeoUnitNameVersion` | `geo_unit_name_versions` | Adds language and method. |
| `GeoUnitChange` | `geo_unit_change_relationships` | Adds method; fold into a generic lineage contract later. |

Geometry is GeoJSON text in the contract. PostGIS columns are derived by the database management engine (`.docs/decisions/typeorm-postgis-jsonb.md`).

## Worked example: a historical polity

A pre-colonial kingdom is a `GeoUnit` with `kind = historical_polity`, a jurisdiction record for that polity (its own `Jurisdiction`, with `validFrom`/`validTo` and uncertain-date precision on the claim), and one or more `GeoBoundaryVersion` rows with method `inferred` or `curated`, a source reference and a verification state `disputed` where sources disagree. A modern state that later covers the area is a separate unit linked by `GeoUnitChange` (`continued_as`) or `GeoRelationship` (`overlaps`), so the polity is never forced into today's borders.

## Mapping to the mobile contract (`geography-api-contract.md`)

| Mobile endpoint | Contract operation |
|---|---|
| `/v1/geography/search` | `SearchGeography` |
| `/entities/{id}` | `GetGeographyEntity` |
| `/entities/{id}/boundary` | `GetGeographyBoundary` |
| `/entities/{id}/children/boundaries` | `GetChildBoundaries` |

Gaps still open:

- `/boundaries?country=&level=`, `/entities/{id}/map-context` and `/entities/{id}/governance` have no operations yet (governance waits for the governance task).
- The mobile client expects snake_case fields (`parent_id`, `boundary_verified`, `display_name`); contracts use camelCase. The NestJS layer must map names or the pack naming must change.
- `ancestors`, `historical_names` and `historical_relationships` are not fields of `GeographyEntity` yet; they derive from `GeoUnit` parents, name versions and changes.
- Search accepts `country` as a jurisdiction code; the mobile client sends `KE`, so lowercase normalisation is a service concern.
- `GeoJson` is a `json`-format string; typed GeoJSON validation is a service concern.

## Legacy Python comparison (shape only)

Compared with `source/backend/api-legacy/app/routes/geographic/models/mobile_api.py` by reading, not by a live run:

- Same: entity metadata, verified boundary provenance (source, reference, licence, year, retrieved-at, version), valid time, GeoJSON Feature and FeatureCollection with `geography_id` in properties.
- Different: field names are camelCase here; boundary and child boundaries are wrapped as `{ geojson, boundaryVerified }` with the GeoJSON as text instead of returning the GeoJSON object directly; ids are UUIDs, not ULIDs; `country` filters by jurisdiction code.
- Not yet built: `/boundaries?country&level`, `/entities/{id}/map-context`, `/entities/{id}/governance`, hierarchy, ancestors, historical names and relationships on the entity.

## Jurisdiction-wide scope (DEC-JURISDICTION-WIDE-SCOPE)

A jurisdiction has one root geography unit (the country unit, `ke`). A record that belongs to a whole jurisdiction points at it: `governance.institutions.scope_geo_unit_id`, `governance.offices.scope_geo_unit_id`, `finance.units.geo_unit_id` and `statistical.datasets.geo_unit_id`. A null is a gap, never "national". The root unit is a jurisdiction scope, not a physical location (physical placement is in `place`).

- `rootUnitId(db, jurisdictionId)` in `engine/database/src/seeds.ts` returns the root unit and throws when a jurisdiction has none or several; every loader resolves `national` through it.
- `backfillScope` (`bun src/cli.ts backfill-scope`, `src/scope.ts`) scopes what evidence allows: seats by a stated name rule (equal after normalisation, or one edit away and unique; a second seat named by person and slug is the county's woman representative when the constituency seat of that slug exists on its own or the slug names no constituency; two records may never claim one unit), finance units that are national bodies (party finance, funds, the national procuring-entity block) to the root and county governments or NG-CDF committees by name, datasets to the root. Everything else is returned, not guessed.
- Integrity (`checkIntegrity`) reports each current record of a jurisdiction with a single root unit that has no scope; the data engine `coverage` command prints the same scope-gap table (`reinforcement.scope_gaps`).
- Real database on 3 November 2026 (lane H3): 10 of 20 unscoped offices, 219 finance units and 4 datasets scoped. Remaining gaps: seats whose constituency name is not in the geography data (Dagoretti North and South, Garissa Township, Chuka Igambang'ombe, Mbeere North and South, Mwingi Central, Homa Bay Town, the Tharaka-Nithi seats), 9 NG-CDF committees with the same names, and 14 school and college procuring entities that need a place, not a national scope.

Office patterns on the real database (3 November 2026, lane H3): 2,768 posts and 862 expected regional units generated, 399 existing seats adopted with their holders (402 of 417 MP and senator holders now sit on a post with a definition and a geography scope; 15 are on seats still without scope, 2 constituencies have two candidate offices and were left for review), totals 47 counties and 290 constituencies match and 1,452 wards differ from the law's 1,450 (reported, not corrected). See `DEC-OFFICE-PATTERNS`.
