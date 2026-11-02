---
{id: DOC-GEOGRAPHY-NEUTRAL-MODEL,name: geography-model,type: documentation,tags: [geography,dryv,contracts]}
---

# Geography: neutral model and contract mapping

Contracts live in `dryv/contracts/geography.py` and reuse `dryv/contracts/shared.py`. They replace the geographic legacy models listed in `.docs/docs/audits/LEGACY_MODEL_INVENTORY.md` section 2.

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
