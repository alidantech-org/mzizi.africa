---
{id: TSK-02CA35EA9ED1,name: "Office patterns: seats per geography unit and institution family",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:59:36.185Z,updated_at: 2026-11-02T20:59:36.185Z,order: 4096}
---

# Office patterns: seats per geography unit and per institution family

## Goal
Generate every expected seat and post from patterns so the gaps are known and the data can be filled by reinforcement.

## Context
Like site patterns, an office pattern says that for every geography unit at a level (or every institution of a type) these offices exist, with cardinality, legal basis and selection procedure. A county government is the parent of the County Executive and the County Assembly. Per county: governor, deputy governor, executive committee members, county secretary, speaker, clerk, senator, woman representative. Per ward: one MCA seat plus nominated seats. Per constituency: MP seat and NG-CDF committee posts. Per administrative location: chief and assistant chief when those units are modelled. Staff who are not public figures are counts. The generated rows are `expected` with no holder, and totals are checked (47, 290, 1,450). Existing holders (350 MPs, 67 senators) are linked to their generated seats.

## Acceptance checklist
- [ ] Define the pattern shape and store the patterns as JSON seeds.
- [ ] Generate offices for counties, constituencies and wards and link existing holders.
- [ ] Check the generated totals against geography and report mismatches.
- [ ] Model the county government to executive and assembly structure.
- [ ] Report unfilled seats as the gap queue for reinforcement.
