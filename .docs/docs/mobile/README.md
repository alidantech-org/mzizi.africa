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
