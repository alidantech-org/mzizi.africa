---
{id: TSK-2107BCCA74E8,name: "Shared capability contracts: place tree, occupancy, expectation and contact points",type: task,status: completed,priority: medium,created_at: 2026-11-02T20:59:35.586Z,updated_at: 2026-11-02T22:29:42.333Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:37:55.122Z},{from: in-progress,to: completed,at: 2026-11-02T22:29:42.333Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-2107BCCA74E8/1793655475125-start,started_at: 2026-11-02T21:37:55.712Z,end_ref: refs/tracking/TSK-2107BCCA74E8/1793658582335-end,ended_at: 2026-11-02T22:29:42.333Z,summary: {files: 283,insertions: 17609,deletions: 108}}]}}}
---

# Shared capability contracts: place tree, occupancy, expectation and contact points

## Goal
Add the four new, domain-neutral capabilities that the assessment (`.docs/docs/PLACES_AND_PRESENCE_ASSESSMENT.md`) identified as missing, through the Dryv contracts and database migrations, with no compatibility layer.

## Context
All nine assessment decisions were accepted on 3 November 2026. The place tree is a single self-referencing `place.places` table whose kind is site, structure, floor, wing, room, unit or service point, with name, building type, optional point, a located-in geography unit (containment, never jurisdiction), `available_from`, and its own status (planned, in_use, vacant, closed, demolished). Occupancy (`place.occupancies`) links a subject (kind and id, soft reference) to a place, structure or space with a role, status and validity; successors live in a link table so a move, split or merge can have many predecessors and successors. Expectation (`place.expectations`) holds subject, role, scope geography unit, facility type, minimum and maximum, basis (legal rule, plan, pattern) and status (expected, researching, identified, no_details_found, not_applicable, ceased) and points to the occupancy that resolves it. Contact points (`contact.points`) have scope kind and id, channel, value, visibility, validity and a fallback walk up the scope chain. None of these carries a `source` column: evidence is `source.attributions` and `source.verifications` on their target kinds. No cross-schema foreign keys.

## Acceptance checklist
- [x] Write the Dryv contracts and entities for places, occupancies, occupancy links, expectations and contact points; Dryv check and drift check pass.
- [x] Write the migration with indexes and enum types, and register the new target kinds for attributions and verifications.
- [x] Add integrity rules: every occupancy target exists, no place without a kind and status, no expectation containing an address.
- [x] Add engine tests that express all eight scenarios in the assessment (Governor with unknown building, IEBC offices, funded private school, county hospital, shared compound, many buildings, a move with history, a multi-tenant building).
- [x] Add read endpoints and contract documentation, and update `.docs/docs/DOMAINS.md`.
