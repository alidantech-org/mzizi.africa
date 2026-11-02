---
{id: TSK-2107BCCA74E8,name: "Place, structure, space and occupancy schema with migration",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:59:35.586Z,updated_at: 2026-11-02T20:59:35.586Z,order: 1024}
---

# Place, structure, space and occupancy schema with migration

## Goal
Add a physical model that is separate from organisations: places, structures inside places, spaces inside structures, dated occupancies, postal addresses and contacts. Move the data from `organization.locations`, then drop that table and any column that mixes logical and physical concerns. No compatibility is kept.

## Context
Decision DEC-PLACES-AND-OFFICE-PATTERNS. A place is never assumed to belong to exactly one body: many bodies may share a school, hospital or county headquarters, and one body may fill a whole structure. A space is a floor, wing, room or unit in a tree under a structure, with its own address text and contacts. An occupancy links an organisation, institution or office (kind and id, no cross-schema foreign key) to a place, structure or space with a role, a status (expected, active, moved, closed), validity dates and a successor link, so a move keeps the old record. Places also carry kind, building type, `available_from`, point or footprint, a geography unit, and a source; everything but identity and status is nullable. Contracts are written in Dryv; generation may need regeneration later, so the drift check must pass.

## Acceptance checklist
- [ ] Design columns, enums and indexes; write them in the Dryv contract and entities.
- [ ] Write a migration that creates the tables and moves every `organization.locations` row into a place and an occupancy.
- [ ] Drop `organization.locations` and any columns it made obsolete, and update code and tests that used them.
- [ ] Add postal address and contact tables, with contacts hidden from the public API by policy.
- [ ] Add read endpoints and tests for a shared building, a whole-structure occupancy and a move.
