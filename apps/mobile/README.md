# Mzizi Mobile

The Explore map uses the versioned geography API contract in
[`apps/docs/geography-api-contract.md`](../docs/geography-api-contract.md).
The Flutter app does not contain authoritative boundaries or governance data.

Run against a Mzizi API origin:

```sh
flutter run \
  --dart-define=MZIZI_API_BASE_URL=https://api.example.org \
  --dart-define=CESIUM_ION_TOKEN=YOUR_RESTRICTED_PUBLIC_TOKEN
```

The Ion token is optional. Country scope, initial boundary level and camera
center default to Kenya/county/Nairobi and can be set with
`MZIZI_DEFAULT_COUNTRY`, `MZIZI_DEFAULT_BOUNDARY_LEVEL`, and
`MZIZI_MAP_INITIAL_LONGITUDE`, `MZIZI_MAP_INITIAL_LATITUDE`, and
`MZIZI_MAP_INITIAL_HEIGHT` defines.

The API exposes only geometry recorded as current and verified in the
geography boundary version table. An empty boundary response is expected until
verified, licensed source data has been loaded. The client will not draw a
substitute boundary.
