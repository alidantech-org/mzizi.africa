---
{id: TSK-B245174A4FD4,name: Show geography evidence and time context in Explore,type: task,status: completed,priority: high,created_at: 2026-11-02T21:15:41.550Z,updated_at: 2026-11-02T21:17:32.905Z,order: 2048,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:15:49.329Z},{from: in-progress,to: completed,at: 2026-11-02T21:17:32.905Z}]}}
---

# Show geography evidence and time context in Explore

## Goal

Make the source and temporal metadata already returned for a selected geography boundary visible and understandable in the Flutter Explore screen. This is the first user-facing implementation slice of the database-backed mobile plan: it should let a user inspect why a boundary is marked verified and when the source dataset was retrieved or valid, while keeping the map focused and usable on small screens.

## Context

The current `GeographyApiClient` validates verified GeoJSON and parses `BoundaryMetadata`, including source title, source reference, license, reference year, retrieval timestamp, validity dates and dataset/boundary versions. `ExploreScreen` currently displays only a few of those values inline. Use the existing API-owned model; do not hard-code source details, infer validity, add a direct database connection, or add dependencies just to make a URL open. Keep labels accessible and make long URLs selectable/copyable.

## Acceptance checklist

- [x] Add a reusable evidence detail sheet/widget that renders boundary verification, source, reference, license, reference year, retrieved time, validity dates and versions when supplied.
- [x] Add an obvious action from the selected-place panel to open the evidence details, including when the boundary is unavailable or metadata is partial.
- [x] Clearly distinguish the geometry verification state from unknown/missing evidence fields; never fill missing metadata with guessed values.
- [x] Keep the panel responsive on narrow phones and allow long source references to be copied or selected.
- [x] Inspect the changed files and record any API metadata the client cannot currently receive.


## Progress (2026-11-03)

Implemented `BoundaryEvidenceSheet` and linked it from the selected-place panel in Explore. It displays API-provided verification, map geometry availability, source, source reference, citation, license, reference year, retrieval timestamp, validity dates and boundary/dataset versions. Missing values display as “Not recorded”; source references are selectable and can be copied. The geography model previously did not parse the documented `boundary_citation` field; the model now accepts both `boundary_citation` and `citation`, and the evidence sheet displays it. The existing geography contract already supplies the other fields used here.

The two changed Dart files were formatted with the bundled Dart SDK. Tests/analyzer were not run in this slice.
