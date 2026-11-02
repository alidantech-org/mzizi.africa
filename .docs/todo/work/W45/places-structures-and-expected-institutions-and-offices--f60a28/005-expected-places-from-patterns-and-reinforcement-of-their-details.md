---
{id: TSK-EBA9E2370C55,name: Research and reinforcement of expectations into identified places,type: task,status: planned,priority: medium,created_at: 2026-11-02T20:59:36.382Z,updated_at: 2026-11-02T21:34:17.954Z,order: 5120,depends_on: [TSK-28DC592B1E17]}
---

# Research and reinforcement of expectations into identified places

## Goal
Turn expectations into identified places and confirmed occupancies using documents, while keeping every claim, its evidence and any conflict.

## Context
The research states are represented with existing parts: expected by rule or plan is the expectation basis; identified by an official source, reported by a secondary source, corroborated and contradicted are attribution relations plus the verification state; not researched, researched without details and confirmed closed are expectation statuses. Sources include the constituency offices PDF already downloaded (290 offices), crawled site sections, Wikidata and OpenStreetMap where the licence is recorded, and manually researched seeds. Conflicting claims are kept with source trust ranking; nothing is overwritten. Duplicate places from several sources are scored on name, address and point and flagged, never merged on name alone (DEC-ENTITY-MATCHING). Moves and closures end occupancies, never delete places. Depends on the content-section crawler for documents.

## Acceptance checklist
- [ ] Parse the constituency offices PDF into candidate places with fuzzy geography matching.
- [ ] Create refill jobs that attach address, point and contact claims with attributions.
- [ ] Resolve expectations to occupancies only when a verified or corroborated claim exists.
- [ ] Record moves, splits, closures and disputes through links and verification states.
- [ ] Report expectation coverage by status and by institution.
