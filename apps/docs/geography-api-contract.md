# Mzizi geography API contract for the mobile map

The Flutter client does not own administrative geography. Its IDs, hierarchy,
boundary geometry, provenance, and governance records come from the Mzizi API.
Set the API origin at build time:

```sh
flutter run \
  --dart-define=MZIZI_API_BASE_URL=https://api.example.org \
  --dart-define=CESIUM_ION_TOKEN=YOUR_RESTRICTED_PUBLIC_TOKEN
```

The Ion token is optional for the imagery-only globe; without it, terrain uses
the ellipsoid fallback. Treat the token as public client configuration and
restrict it in the Cesium account.

The client expects these endpoints under `/v1/geography`:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/search?q={query}&country=KE&limit=12` | Search Kenyan administrative entities. |
| `GET` | `/boundaries?country=KE&level=county` | Verified county outlines for the Kenya-first map view. |
| `GET` | `/entities/{id}` | Resolve a canonical geography ID and its metadata. |
| `GET` | `/entities/{id}/boundary` | Return the verified geometry for that entity. |
| `GET` | `/entities/{id}/children/boundaries` | Return the immediate child boundaries as GeoJSON. |
| `GET` | `/entities/{id}/map-context` | Return its parent outline and sibling boundaries for context. |
| `GET` | `/entities/{id}/governance` | Return live governance records linked by canonical geography ID. |

## Entity response

Search returns `{"results": [entity, ...]}`. Entity IDs must be stable backend
IDs, never names or coordinates. `level` and `parent_id` are country-specific;
the client does not assume that every country has counties, constituencies, or
wards.

```json
{
  "id": "mzizi-geography-id",
  "name": "Display name",
  "display_name": "Display name",
  "level": "backend-classification",
  "parent_id": "parent-geography-id",
  "parent_name": "Parent name",
  "ancestors": [],
  "boundary_verified": true,
  "boundary_source": "source organization and dataset",
  "boundary_license": "license identifier and attribution terms",
  "boundary_year": "2024"
}
```

The client currently accepts `level_name` as an alternative to `level`, and
`geography_id` as an alternative to `id` for migration compatibility.

## Geometry response

`/boundary` returns a GeoJSON `Feature` (or a one-feature `FeatureCollection`).
The API must set `boundary_verified` only after validating the geometry source
and its applicable license. It must also provide enough feature properties to
identify child polygons by canonical ID. Multipolygon geometry and holes must
be preserved in the GeoJSON; the renderer supports standard GeoJSON geometry
types through Cesium's GeoJSON loader. A verified `label_point` property in
`[longitude, latitude]` order lets the map place labels without guessing a
centroid. The focus Feature and parent outline must also carry a canonical
geography ID in `properties.geography_id`, `geo_id`, or `id`.

`/children/boundaries` returns a GeoJSON `FeatureCollection`. Every selectable
child feature must include `properties.geography_id` (or `geo_id` / `id`) equal
to its canonical entity ID. Do not include approximate or unverified features
in this collection. Empty `features` is a valid response.

`/boundaries?country=KE&level=county` returns a GeoJSON `FeatureCollection`
containing only verified Kenyan county geometries. Every feature must include a
stable canonical geography ID, `boundary_verified: true`, source and license
metadata, and a `label_point` when a county label is available. This endpoint
is required for direct county selection. The mobile client rejects the entire collection if a feature
is missing an ID or is not marked verified.

If a selected entity has no verified boundary, its `/boundary` endpoint is not
requested and the UI reports that geometry is unavailable. The API should
return `404` for a missing optional governance resource; the client shows an
empty-state message. Other errors remain visible as retryable loading errors.

`/map-context` may return a verified `parent_boundary` Feature and a
`sibling_boundaries` FeatureCollection. Sibling features must carry stable
canonical IDs and verified geometry. This lets the globe show neighboring
areas and the parent outline around the focused polygon without loading all
country geometry at startup.

## Governance response

The client renders `sections[]` returned for the selected canonical ID. Each
section may include `title` and `records[]`; each record may include `title`
and `summary`. The client does not embed elected officials, budgets, projects,
or other governance facts.

## Operational requirements

- Use HTTPS and the app's existing authentication scheme when the backend
  requires it. Add a token provider to `GeographyApiClient` when that contract
  is available; no credential is hardcoded in this app.
- Boundaries should be simplified for the current camera scale and paginated or
  vector-tiled for large child collections. Avoid returning all ward geometry
  for all countries.
- Include dataset source, license, retrieval date, reference year, validity
  dates, and verification status in the entity/feature metadata.
- Keep historical geometry versioned and queryable by canonical ID and valid
  time range. Avoid replacing an entity ID after a rename, split, or merge.
- The map imagery is NASA GIBS. If Cesium ion terrain is enabled, build with a
  restricted public token using
  `--dart-define=CESIUM_ION_TOKEN=...`. Do not embed backend secrets in the app.

## Validation plan

- Search and select a country, then navigate through its actual child hierarchy.
- Confirm county/constituency/ward labels come from the backend classification.
- Compare selected outline and camera framing with the API's exact geometry.
- Exercise multipolygons, islands, holes, small wards, and large countries.
- Verify click selection uses the canonical feature ID, including duplicate
  names.
- Verify breadcrumbs and back-to-parent use explicit parent IDs.
- Verify missing or unverified boundaries never get substituted or highlighted.
- Exercise empty search, missing governance, slow API responses, HTTP errors,
  offline state, and rapid selection changes.
- Confirm attribution and license metadata remain visible and no OSM service is
  requested.
- Measure memory, frame rate, and interaction latency on a representative
  Android device before production rollout.
