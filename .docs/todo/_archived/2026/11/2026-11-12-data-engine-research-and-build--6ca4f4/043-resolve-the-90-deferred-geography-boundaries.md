---
{id: TSK-8D70F7C0C53E,name: Resolve the 90 deferred geography boundaries,type: task,status: archived,priority: medium,created_at: 2026-11-02T22:25:03.733Z,updated_at: 2026-11-12T05:47:50.535Z,order: 44032,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T22:28:44.728Z},{from: in-progress,to: archived,at: 2026-11-12T05:47:50.535Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-8D70F7C0C53E/1793658524731-start,started_at: 2026-11-02T22:28:45.375Z,ended_at: 2026-11-12T05:47:50.536Z,end_error: "EROFS: read-only file system, open '/home/alidante/.local/share/taskcode/projects/f166568a11ef213d/.init.lock'"}]}},due_at: 2026-11-04,archived_at: 2026-11-12T05:47:56.094Z}
---

## Goal

Resolve the 90 geography boundaries that the containment check deferred in the real database, without relaxing the check silently.

## Context

The 90 candidates (80 wards, 10 constituencies) come from the simplified geoBoundaries shapes. Measured against the promoted parents, 55 lie at least 75 percent inside, 21 between 50 and 75 percent and 14 below 50 percent. At least 11 were parented to the wrong constituency because the importer used the representative point; it now uses the polygon holding most of the shape (test added, not yet replayed). Correcting a promoted unit's parent changes its business code, so it needs a replacement unit through staging, not an edit. HDX covers only counties and constituencies, so wards have no second source.

## Acceptance

- [x] List the units whose best parent differs from the assigned parent and stage replacement units and boundaries for them.
- [x] Decide for the remaining spill cases between a better geometry and a recorded containment waiver with the measured percentage.
- [x] Re-run validation and promotion; the invalid count for geography boundaries is zero or each remainder has a recorded reason (36 wards remain: need a better source geometry).

- [ ] Run the HDX cross-check again and update the status document.

## Comments

### 2026-11-02T22:28:41.004Z · PETER IRUNGU

Done in mzizi: 7 wards reparented, 54 boundaries clipped (inferred) and promoted, 1,754 current boundaries, all constituencies covered. Open: 36 wards need a better source geometry; HDX cross-check not re-run.

### 2026-11-03T07:16:21.251Z · PETER IRUNGU

Lane S: the 36 wards now have unverified boundaries (containment as a warning under MZIZI_CONTAINMENT_SOFT=1, DEC-COMPLETION-FIRST); gazetted geometry still needed. HDX cross-check not re-run.
