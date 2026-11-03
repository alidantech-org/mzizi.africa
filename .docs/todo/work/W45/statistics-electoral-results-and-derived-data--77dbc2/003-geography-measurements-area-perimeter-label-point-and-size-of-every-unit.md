---
{id: TSK-20EFD30E52E3,name: "Geography measurements: area, perimeter, label point and size of every unit",type: task,status: completed,priority: medium,created_at: 2026-11-02T19:25:51.570Z,updated_at: 2026-11-03T01:24:38.433Z,order: 3072,depends_on: [TSK-1F02AF48DAD0],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T22:33:14.749Z},{from: in-progress,to: completed,at: 2026-11-03T01:24:38.433Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-20EFD30E52E3/1793658794751-start,started_at: 2026-11-02T22:33:15.318Z,end_ref: refs/tracking/TSK-20EFD30E52E3/1793669078440-end,ended_at: 2026-11-03T01:24:38.433Z,summary: {files: 398,insertions: 19699,deletions: 992}}]}}}
---

# Geography measurements: area, perimeter, label point and size of every unit

## Goal

Answer the question whether geography units know their size: they do not store it yet, and the boundary geometry in PostGIS lets the system compute and store area in square kilometres for every county, constituency and ward.

## Context

`geography.units` has a code, name, kind, level and parent, and `geography.boundaries` and `geography.boundary_shapes` keep the geometry (a PostGIS geometry in SRID 4326 with an is_valid flag) and a label point. No column holds area or perimeter, so population density cannot be computed today. The right design stores area as a derived measurement with its method (geodesic area of the boundary shape, in square kilometres), the boundary and reference year it came from, and the source of the geometry, because the same unit has different areas under the simplified geoBoundaries shapes, the full-resolution shapes and the HDX COD-AB shapes, and a boundary that changes should produce a new area rather than overwrite the old one. The measurement should be stored in the statistical schema as an indicator (area, square kilometres) so that density is an ordinary derived indicator.

## Acceptance checklist

- [x] Decide whether area lives in the statistical schema as an indicator (preferred) or as columns on boundaries.
- [x] Compute geodesic area and perimeter from boundary shapes in PostGIS for all 1,790 promoted units and store them with method and source.
- [x] Compare areas between geoBoundaries and HDX shapes and report disagreements above 5 percent.
- [x] Load the official county areas from the KNBS publications where available and keep both values with their sources.
- [x] Add a recomputation command that runs when a boundary is replaced.
- [x] Add tests with a square of known area on the equator and at a high latitude.
