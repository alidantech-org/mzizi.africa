---
{id: TSK-EBA9E2370C55,name: Expected places from patterns and reinforcement of their details,type: task,status: planned,priority: medium,created_at: 2026-11-02T20:59:36.382Z,updated_at: 2026-11-02T20:59:36.382Z,order: 5120}
---

# Expected places from patterns and reinforcement of their details

## Goal
Create expected places for every pattern-based and seeded body even when the real location is unknown, then fill in addresses, coordinates, buildings and contacts later from research.

## Context
Examples: a county headquarters per county, a constituency office per constituency (the 290-office PDF is already downloaded), an NG-CDF office, MP office, ward office, regional offices of agencies. Each place starts `expected`, with its source being the pattern or seed. Reinforcement adds claims from crawled sites, PDFs, and from Wikidata and OpenStreetMap where licences allow, each stored with source and confidence, and canonical values chosen by source trust. Places can move: a move sets the old occupancy to `moved`, keeps it, and starts a new one. Building type, floors and rooms are recorded when sources mention them.

## Acceptance checklist
- [ ] Define place patterns and generate expected places and occupancies.
- [ ] Parse the constituency offices PDF into places with fuzzy geography matching.
- [ ] Add refill jobs that fill address, point and contact claims from sources.
- [ ] Record moves and closures without deleting history.
- [ ] Report coverage of known versus expected places.
