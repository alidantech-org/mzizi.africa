---
{id: TSK-471C902B718F,name: Complete the verified Kenya map hierarchy flow,type: task,status: completed,priority: high,created_at: 2026-11-01T00:36:49.584Z,updated_at: 2026-11-01T05:46:57.645Z,tags: [mobile,map,geography],depends_on: [TSK-9EEB47279B23],extra: {description: "Finish the home map flow using the geography API contract: verified county selection, immediate child boundaries for constituency navigation, canonical-ID selection, explicit parent navigation, and source/license attribution.",acceptance_criteria: [County collection is rejected if IDs or verified flags are missing.,Child selection uses stable canonical IDs and backend hierarchy labels.,Unverified or missing geometry is never substituted or highlighted.,"Map context, loading, empty, and retry states are usable."],status_history: [{from: planned,to: completed,at: 2026-11-01T05:46:57.645Z}]},due_at: 2026-11-03}
---

# Complete the verified Kenya map hierarchy flow

## Goal

Allow a user to select a verified Kenyan county and continue into its immediate child geography while preserving the canonical ID and exact API hierarchy at every step. County and child geometry is evidence-backed data, not visual decoration: the map must retain attribution, reject invalid geometry, and leave unsupported areas visibly unavailable. Selection must work from both the initial Kenya county layer and API-loaded child polygons, including duplicate display names, multipolygons, and holes.

## Context

The mobile contract is `apps/docs/geography-api-contract.md`. The initial layer comes from `/v1/geography/boundaries?country=KE&level=county`. Selecting a feature resolves the entity through `/entities/{id}`, then uses `/boundary`, `/children/boundaries`, and `/map-context` according to verified metadata. A boundary is selectable only with a stable geography ID, valid GeoJSON geometry, `boundary_verified: true`, and source/license provenance. The renderer sends the canonical feature ID to Flutter; names and coordinates are never IDs. Parent navigation uses explicit `parent_id` or backend ancestor IDs. Missing optional child or context data may be empty; other errors need visible retry behavior.

## Acceptance checklist

- [x] County collections are rejected as a whole when any feature lacks a canonical ID, valid geometry, verified status, or required attribution metadata.
- [x] Child selection and breadcrumbs resolve canonical entity IDs and explicit backend parent relationships.
- [x] Missing and unverified boundaries are never substituted or highlighted; missing verified geometry remains an explicit empty state.
- [x] Boundary source and license attribution appear alongside loading, empty, and retry states.
