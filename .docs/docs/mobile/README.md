---
id: DOC-MOBILE-DATA-UI-INDEX
name: Mobile data and UI architecture index
type: documentation
tags: [mobile, design,contracts]
---

# Mobile data-driven UI — implementation index

This is a **design and contract/fixture handoff**, not an assertion that all API endpoints or Flutter screens have been implemented. It derives mobile presentation requirements from the current Dryv contracts and database design on `develop`.

| Workstream | Output | Verification state |
| --- | --- | --- |
| Schema inventory | [Phase 1 inventory](schema-inventory-phase1.md) and [manifest](../../../fixtures/mobile/schema-inventory-manifest.json) | Source-backed catalogue; full migration audit still open |
| JSON contracts | [Presentation contracts](json-data-contracts.md) and JSON Schemas in `fixtures/mobile/contracts/` | Proposed mobile projections, **not** existing NestJS DTOs |
| UI components | [Mapping](ui-component-mapping.md) | Implementable design specification |
| Screen definitions | [Screen specifications](screen-specifications.md) | Routes, states, flows, responsiveness |
| Data availability | [Matrix](data-availability-matrix.md) | Contract-level capability distinct from verified data coverage |
| Mock data | [Fixture guide](mock-data-library.md) and `fixtures/mobile/data/` | Synthetic, non-authoritative, contract-validated examples |

## Authority and boundaries

- Source-of-truth semantic contracts: `dryv/contracts/`; migration and canonical integrity: `source/backend/engine/database/`; API behavior: `source/backend/api/`.
- The Flutter client is a consumer. Neither fixture structures nor component view models redefine canonical PostgreSQL entities.
- The mobile map has a pre-existing contract at `.docs/docs/geography-api-contract.md`; reconcile any proposed projection with that contract, not by introducing duplicate live routes.
- The legacy FastAPI models are migration research material only.
- No private identity data or restricted person contacts appear in public fixtures.
- Dates, geography, sources, money units, estimate types and historical versions must remain explicit.

## Integration sequence

1. Compare the fields documented here with generated NestJS DTOs and the database engine's actual migrations; record discrepancies.
2. Implement API-facing adapters that compose domain records into the proposed **presentation** contracts, rather than modifying canonical models to fit screens.
3. Add typed Dart DTOs and fixture loaders, respecting loading/empty/error/partial/unsupported states.
4. Implement the geography and person vertical slices, then elections, statistics, governance and finance.
5. Replace the fixture adapter with API transport only after endpoints and privacy checks are verified.
6. Run JSON and application tests when code implementation begins; Taskcode status remains managed by the local `task` CLI.

## Current limitations

The repository integration can commit files but cannot run the MZIZI checkout's Task CLI or connect to the running dashboard. Task records in `.docs/todo/` have deliberately not been forged via GitHub writes. These artifacts should be linked to the corresponding Taskcode records through `task` in the development checkout.

## Implemented Flutter offline preview (2026-11-04)

The mobile client now bundles `assets/sample_data/*.json`, registered in `source/apps/mobile/pubspec.yaml`, with a validated `SampleDataStore` asset loader and `SampleDataScreen`. The screen displays geographic relationships, public-person-style records, election candidate vote bars, statistical period charts including missing observations, and fiscal breakdowns. A visible synthetic series panel is present on Home, and navigation to the sample explorer is available from Home, Explore and Public Money. The synthetic values are deliberately segregated from the live API screens and prominently marked fictional.

Implementation files:
- `source/apps/mobile/lib/data/sample_data_store.dart`
- `source/apps/mobile/lib/screens/sample_data_screen.dart`
- `source/apps/mobile/lib/widgets/sample_overview_panel.dart`
- `source/apps/mobile/assets/sample_data/`
- `source/apps/mobile/test/sample_data_screen_test.dart`

**Not implemented:** generic live API adapters for every presentation type, real record population, operational Map/finance/elections backend aggregations and production data verification. When the NestJS API is unavailable, Home's **live** events and finance sections still show their own error/empty states; the sample dashboard is distinct and never presented as live data. This prevents misinformation.

The repository connection cannot execute `flutter analyze`, `flutter test` or `task validate`. Run these explicitly from the appropriate MZIZI checkout before claiming verified build status. Changes were committed on `develop` and no Taskcode-managed todo files were forged.

## Explore map troubleshooting (2026-11-05)

The Explore preview uses `CountyChoroplethMap` (a verified-boundary **API** widget), not the synthetic geography fixture. Its request is `GET /v1/geography/boundaries?country=KE&level=county`. A successful response must be a GeoJSON FeatureCollection of usable polygons whose properties include canonical geography IDs and verified source, source reference and license. Empty or unverified responses deliberately render a no-data panel rather than invented geography.

The widget now uses a compact scrollable error/no-data panel so its 230px Explore container displays diagnostic details and a Retry action without vertical layout overflow. A client can be injected for widget tests; the production default remains the existing `GeographyApiClient.instance`. Tests cover HTTP failure and empty collection (`source/apps/mobile/test/county_choropleth_map_test.dart`).

Local diagnosis (on the machine running the NestJS API):

```sh
curl -i 'http://127.0.0.1:3000/v1/geography/boundaries?country=KE&level=county'
```

- HTTP connection failure: start the NestJS service and the database it depends on.
- HTTP 404/5xx: confirm route wiring and server logs; do not switch to the sample-data endpoint.
- HTTP 200 with `features: []`: verify boundary import, data review and available published verification records.
- HTTP 200 with features but widget rejects them: check GeoJSON geometry, canonical IDs, `boundary_verified`, `boundary_source`, `boundary_source_reference` and `boundary_license`.
- Android emulator: default API origin is `http://10.0.2.2:3000`. On a **physical Android phone** this is not your laptop. Launch with `--dart-define=MZIZI_API_BASE_URL=http://<reachable-LAN-host>:3000` (replace the placeholder, use a trusted development network and ensure the API listens on a reachable interface).
- Flutter Web: browser origin must be permitted by NestJS CORS, and HTTPS deployments cannot fetch insecure HTTP resources.
- No actual boundary shapes are included in the synthetic fixture; the preview never draws fictional counties.

These changes improve feedback but cannot create missing verified geometry or make an unreachable API available. Run `flutter test test/county_choropleth_map_test.dart` and `flutter analyze` locally. No builds/tests were executed through the GitHub-only connection.

## Additional schema-driven mobile data views (2026-11-05)

The Flutter sample explorer now includes Government, Political parties, Law, Procurement, and Public services alongside the original five preview domains. These new views map existing Dryv schemas to institution/office-holder timelines, party memberships and branches, legal provisions/amendments, tender bids/contracts/milestones, and service facilities/delivery status. The code is in `source/apps/mobile/lib/screens/sample_data_screen.dart` with associated `assets/sample_data/` fixtures.

Home displays five topic chips and Explore links directly to each preview. Every screen identifies the data as **fictional** and keeps it separate from the live NestJS API. This is a schema-informed interface implementation, **not** production dataset ingestion, authentication design, real-time aggregated API endpoints, or verified government data coverage. Run `flutter analyze`, `flutter test test/sample_domain_topics_test.dart` and device previews locally before merging to production.
