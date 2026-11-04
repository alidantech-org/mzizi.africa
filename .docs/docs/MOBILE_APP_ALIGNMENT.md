---
{id: DOC-11FCB0DFAED2,name: Mobile app alignment audit,type: documentation}
---

# Mobile app alignment audit

**Reviewed:** 2026-11-02  
**Scope:** documentation direction and the current Flutter client under `source/apps/mobile`.

## Summary

The mobile client has a sound first vertical slice for geography: it consumes the documented geography API, uses stable IDs and hierarchy from the backend, validates GeoJSON, requires verified boundary metadata, and does not substitute sample outlines when the API is unavailable. The rest of the app has not caught up with Mzizi's evidence-first product direction. In particular, History and Money are locally defined presentation content, while Saved stores only process-local state. Those screens cannot yet deliver the documented experience of following claims through sources, time, place and related entities.

Treat this as a product and contract alignment audit, not proof that every target service or domain is already populated. The architecture and migration docs describe target ownership; the 2026-11-02 migration status says the NestJS read API and data pipeline exist, but several source imports, evidence/file services and public domain data remain incomplete.

## What the docs have changed or clarified

The foundational product docs define Mzizi as a connected African knowledge system: research and preserve source material, extract and review it, publish versioned claims, and let users explore continuity and change across place, time, people, institutions and evidence. The public mode is visual and approachable, but it must expose sources and uncertainty; the research workbench owns ingestion and review.

Recent architecture and migration updates make responsibilities concrete. NestJS is the product API. Flutter, `www`, and the research dashboard consume stable contracts. Source discovery/extraction belongs to the data engine, file custody to the files service, AI suggestions to the intelligence layer, and schema/import lifecycle to the database engine. The 2026-11-02 migration accounting says the new NestJS API has geography, legal and other contracted read groups, while seed migration, real domain imports, PDF/table extraction and the files service remain unfinished. The mobile API guide is still specifically a geography contract; it is not a general mobile data API specification.

The data lifecycle makes retrieval time distinct from historical validity, requires preserved raw evidence and lineage, and says missing or unverified geometry stays unavailable. The domain catalog prioritizes geography and cross-domain context, but also establishes legal, people, governance, elections, finance, statistics, filesystem and source contracts. The app should consume published canonical data and source metadata; it should not contain a second source of facts.

## Current mobile app by screen

| Screen / area | Current implementation observed | Alignment |
|---|---|---|
| Home | Kenya-first entry point, location search and globe interactions use the geography client. | Directionally aligned; should become a route into connected stories and source-backed records, not a standalone globe. |
| Explore | Searches API-backed geography, resolves parent/ancestor relationships, requests map context and child boundaries, and has loading/error handling. `GeographyApiClient` validates canonical IDs, geometry and verified source/license data. | Strongest alignment. It is still current-verified geography only; historical boundary/time selection is explicitly outside the current contract. |
| History | Timeline events and explanatory text are a `static const` list in `history_screen.dart`. Each detail displays a human-readable source note, but it is not a linked source/capture/attribution record from the API. Filters and county context are UI-level selections. | Material gap. Facts can be mistaken for canonical claims, and users cannot inspect exact artifacts, validity, retrieval date, confidence/dispute or version. |
| Money | `money_screen.dart` builds static explanatory sections, portal references and interactions locally. Fiscal year choices and section search do not query canonical finance/procurement records. | Material gap. It resembles the finance domain but does not show sourced budgets, debt, tenders, amounts/currency, periods or record-level provenance. |
| Saved | `SavedLibrary` is a process-local `Map` with no disk persistence or API identity. The screen filters predefined categories and shows saved entry references. | Useful prototype, but saved items disappear after app restart and are not yet stable links to canonical records/artifacts. |
| Shared shell | Tabs are Home, Explore, Money, History and Saved; light theme is forced in `main.dart`; profile affordances are present in screens. | Navigation is understandable, but there is no clear heritage/culture/story/source journey or explicit data freshness/offline state shared across screens. |

## Prioritized improvements

### P0 — Make evidence status honest

1. Remove the appearance that local History and Money examples are live canonical data. Until source-backed API records are connected, label these views clearly as illustrative prototypes or replace them with empty states that explain which sourced records are available.
2. For every published claim or data point, provide a detail route/card with source title/publisher, artifact or citation link, retrieval time, historical validity/period, method where relevant, confidence/dispute state where supplied, and version/update context. Unknown metadata should remain unknown rather than be filled by client guesses.
3. Keep raw artifact custody, extraction and review out of mobile. Mobile should open a safe read view or source URL for published evidence, not recreate reviewer workflows.

### P1 — Establish mobile-facing read contracts for the product journey

4. Extend the mobile contract inventory beyond geography. Define stable, versioned public read operations for place profiles, timelines/events, source/evidence details and relationships, then finance/procurement and heritage/culture as canonical contracts and data are ready. Identify whether existing NestJS domain query endpoints meet these needs before inventing mobile-specific payloads.
5. Connect History to time-aware API records and explicit place IDs. Add a time/era selector only when the API can return sourced historical validity and distinguish event time from source capture time. Clearly show approximate dates and conflicting accounts.
6. Connect Money to published finance/procurement observations with currency, jurisdiction/geography ID, fiscal period, units, source and update time. Replace static fiscal-year affordances with options returned by data or mark them unavailable.
7. Add cross-links among places, events, institutions, office holders, elections, budgets/projects and source artifacts so the app expresses the documented connected knowledge experience.
8. Make Saved durable (local database at minimum), version-tolerant and based on canonical record/artifact IDs. Preserve filters as views of actual saved item types; show a useful empty state and define backup/sync only if account support is introduced.

### P2 — Improve mobile usability and resilience

9. Add app-wide retry, timeout, offline and stale-cache states for all API-backed screens; show when cached data was last refreshed. Do not silently replace unavailable API results with bundled facts.
10. Revisit the five-tab information architecture once Stories, Sources and Heritage have useful API-backed content. Keep navigation labels tied to user tasks and ensure every geography selection can carry into related screens.
11. Respect the system theme (or add a real theme setting), audit screen-reader labels, text scaling, contrast, focus order, touch targets and reduced motion, and avoid relying on color alone for verified/disputed/approximate states.
12. Test map memory, frame rate, geometry size, camera interaction and selection on representative low- and mid-range Android devices as well as iOS and web. Keep geometry simplification/vector tiling and licensing decisions at the API/data boundary.

## Follow-up implementation plan

The screen-by-screen data mapping and phased delivery plan is in [MOBILE_DATA_DISPLAY_PLAN.md](MOBILE_DATA_DISPLAY_PLAN.md). It treats the canonical Mzizi database as the source of mobile content and routes access through NestJS read contracts.

## Recommended delivery order

1. Add an explicit prototype/data availability state to the current History and Money content; review and source any example claim that will remain visible.
2. Audit the existing NestJS public read routes and Dryv contracts against the proposed place, timeline, source and finance needs. Record contract gaps before wiring UI.
3. Implement source/evidence detail and place-linked timeline as the next public read vertical slice, preserving API IDs and temporal/provenance metadata end to end.
4. Implement finance/procurement views when published sourced records and corresponding query contracts are available.
5. Persist saved IDs and add global offline/accessibility polish; then revisit top-level navigation based on actual connected content.

## Constraints and unresolved prerequisites

- The mobile geography contract currently exposes current verified boundaries, not historical map queries. Historical map exploration needs an explicit API contract that selects a valid-time context and returns sourced, verified versions.
- Although the migration accounting reports broad NestJS read groups, that does not establish that public mobile-specific detail/query payloads, production authentication, or enough imported canonical records exist. Confirm each before client integration.
- Heritage/culture and several other domains are not yet contracted. Do not create client-owned models that pre-empt their domain contracts.
- The current Money and History content may have been intended as UX mock content. This audit recommends honest labeling and API replacement; it does not claim the screen authors intended to publish unsupported facts.

## Sources reviewed

- `.docs/docs/WHY.md`, `STORY.md`, `ARCHITECTURE.md`, `DATA_LIFECYCLE.md`, `DOMAINS.md`, `MIGRATION.md`
- `.docs/docs/geography-api-contract.md`, `implementation-roadmap.md`, `repository-map.md`
- `source/apps/mobile/README.md`
- `source/apps/mobile/lib/main.dart`, `screens/home_screen.dart`, `screens/explore_screen.dart`, `screens/history_screen.dart`, `screens/money_screen.dart`, `screens/saved_screen.dart`, `data/geography_api.dart`, `data/saved_library.dart`
- Documentation and mobile changes in recent repository history, with particular attention to the 2026-11-02 architecture, API, data-engine and migration updates.
