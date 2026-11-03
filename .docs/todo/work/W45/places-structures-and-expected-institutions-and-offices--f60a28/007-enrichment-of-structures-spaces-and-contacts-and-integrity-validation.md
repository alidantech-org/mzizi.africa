---
{id: TSK-4864E3B1AD5E,name: "Enrichment of structures, spaces and contacts, and integrity validation",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T21:34:07.826Z,updated_at: 2026-11-03T06:38:56.398Z,order: 7168,depends_on: [TSK-EBA9E2370C55],due_at: 2026-11-05,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-03T06:38:56.398Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-4864E3B1AD5E/1793687936402-start,started_at: 2026-11-03T06:38:57.345Z}]}}}
---

# Enrichment of structures, spaces and contacts, and integrity validation

## Goal
Enrich identified places with buildings, spaces, building types and contacts at the right scope, and guard the whole design with automatic integrity checks.

## Context
Once a place is identified, research adds structures, floors, wings and rooms only when a source names them, and contacts at the narrowest scope that has a genuine public contact (organisation, branch, facility, site, structure, department, room), without copying organisation contacts to every room. Contact lookup falls back to the broader scope. Public contact information must not expose personal or restricted contact data; visibility follows the privacy architecture and the person design. Integrity jobs run in the database engine: every occupancy and expectation target exists, no place exists without at least one attribution, no expectation resolves to a nonexistent occupancy, contact fallback never crosses subjects, and generated rows still match their pattern versions.

## Acceptance checklist
- [ ] Add enrichment jobs for structures, spaces and building types from sources.
- [x] Add scoped contact import with visibility and fallback tests.
- [x] Implement the integrity rules in the database engine and add failing-case tests.
- [x] Add a coverage report: places, occupancies and contacts known versus expected.
- [x] Update the documentation and write the next handoff.
