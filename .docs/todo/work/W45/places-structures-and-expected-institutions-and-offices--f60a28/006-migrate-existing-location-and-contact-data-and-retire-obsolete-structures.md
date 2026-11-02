---
{id: TSK-28DC592B1E17,name: "Migrate existing location and contact data, and retire obsolete structures",type: task,status: planned,priority: medium,created_at: 2026-11-02T21:34:07.621Z,updated_at: 2026-11-02T21:34:17.449Z,order: 6144,depends_on: [TSK-AA0A323E646D]}
---

# Migrate existing location and contact data, and retire obsolete structures

## Goal
Move every existing location-like fact into the new model, verify nothing is lost, then drop the old tables and columns with no compatibility layer.

## Context
Inventory from the assessment: `organization.locations` has 1,704 rows (schools, colleges and DCC offices from procurement; geography is the county; address is free text; kind is null), plus their source attributions; organisation identifiers of the contact-email and contact-phone schemes (hidden from the public API); 94 institutions with a geography unit; API entity-location endpoints, DTOs and tests; and `engine/data/dedup.py`. Mapping: each location becomes a place of kind site with the address text, located in the county unit, plus an occupancy with a role from the entity type; attributions and verifications are re-pointed to the new target ids; contact identifiers become contact points at the entity scope with the same visibility. The same task removes the `source_note` and zone `source` columns added to the domain model on 2 November 2026, because they duplicate provenance, and keeps an `origin` enum only if it is classification. Hard rule: the user said bad design is not kept, but data must be verified before anything is dropped.

## Acceptance checklist
- [ ] Write the migration that moves locations, contact identifiers and attributions, with before and after counts.
- [ ] Verify through queries that every old location has a place, an occupancy and its attributions.
- [ ] Update the API, the data engine and the tests, then drop `organization.locations` and the obsolete contact identifiers.
- [ ] Remove the duplicate provenance columns from the domain model and regenerate contracts.
- [ ] Record the migration in `.docs/docs/MIGRATION.md`.
