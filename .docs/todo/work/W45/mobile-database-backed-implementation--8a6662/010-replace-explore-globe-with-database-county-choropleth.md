---
{id: TSK-DD15B8EA0285,name: Replace Explore globe with database county choropleth,type: task,status: completed,priority: medium,created_at: 2026-11-02T21:58:28.325Z,updated_at: 2026-11-02T21:59:35.624Z,tags: [mobile,geography,map],order: 10240,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:58:30.260Z},{from: in-progress,to: completed,at: 2026-11-02T21:59:35.624Z}]}}
---

## Goal

Replace the Explore screen's 3D globe with the flat Kenya county map shown in the product reference. Render county shapes from the canonical geography boundary API and keep county selection connected to existing place and governance details.

## Context

The existing Explore screen embeds a cinematic 3D globe. The product reference instead shows an upright 2D administrative map with distinct colored county polygons and clear borders. GeographyApiClient.initialBoundaries returns a validated GeoJSON FeatureCollection from the Mzizi NestJS API and rejects boundaries without verification and provenance. The app must not bundle illustrative geography or invent county names. The map should communicate that colors only distinguish areas; they do not encode statistics. A tapped county must resolve by canonical geography ID and open its existing Explore details. Preserve loading, error/retry and empty states if the API is offline or has no verified polygons.

## Acceptance checklist

- [x] Add a native Flutter 2D map renderer for verified Polygon and MultiPolygon features from GeographyApiClient.initialBoundaries.
- [x] Replace the 3D globe only on the Explore screen with a flat, fitted, multicolor county map and visible county borders.
- [x] Tapping a rendered county resolves the canonical entity and loads its existing geography/governance scene details.
- [x] Show API loading, retryable failure and no-data states without substituting fabricated or bundled geography.
- [x] Keep provenance available through existing boundary evidence UI and ensure color is explained as visual distinction only.
- [x] Format modified Dart files and run Task workspace validation; do not add dependencies or generated geography assets.
