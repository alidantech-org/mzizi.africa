---
{id: TSK-8D70F7C0C53E,name: Resolve the 90 deferred geography boundaries,type: task,status: planned,priority: medium,created_at: 2026-11-02T22:25:03.733Z,updated_at: 2026-11-02T22:25:03.733Z,order: 44032}
---

## Goal

Resolve the 90 geography boundaries that the containment check deferred in the real database, without relaxing the check silently.

## Context

The 90 candidates (80 wards, 10 constituencies) come from the simplified geoBoundaries shapes. Measured against the promoted parents, 55 lie at least 75 percent inside, 21 between 50 and 75 percent and 14 below 50 percent. At least 11 were parented to the wrong constituency because the importer used the representative point; it now uses the polygon holding most of the shape (test added, not yet replayed). Correcting a promoted unit's parent changes its business code, so it needs a replacement unit through staging, not an edit. HDX covers only counties and constituencies, so wards have no second source.

## Acceptance

- [ ] List the units whose best parent differs from the assigned parent and stage replacement units and boundaries for them.
- [ ] Decide for the remaining spill cases between a better geometry and a recorded containment waiver with the measured percentage.
- [ ] Re-run validation and promotion; the invalid count for geography boundaries is zero or each remainder has a recorded reason.
- [ ] Run the HDX cross-check again and update the status document.
