---
{id: TSK-84B0D19A895B,name: "IEBC: aspirants, candidates, registers, boundaries and constituency offices, linked to geography",type: task,status: blocked,priority: medium,created_at: 2026-11-02T20:02:42.066Z,updated_at: 2026-11-03T06:12:52.743Z,order: 4096,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T22:52:42.339Z},{from: in-progress,to: blocked,at: 2026-11-03T01:12:13.332Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-84B0D19A895B/1793659962342-start,started_at: 2026-11-02T22:52:43.229Z,end_ref: refs/tracking/TSK-84B0D19A895B/1793668333336-end,ended_at: 2026-11-03T01:12:13.332Z,summary: {files: 163,insertions: 9258,deletions: 8}}]}},due_at: 2026-11-04}
---

# IEBC: aspirants, candidates, registers, boundaries and constituency offices, linked to geography

## Goal

Load all IEBC data that exists (aspirants and candidates, voter registers, constituency and ward boundaries and delimitation, constituency offices, results references), linked to our geography units and to people and parties by fuzzy matching and PDF extraction.

## Context

The IEBC site (`www.iebc.or.ke`, already assessed) publishes the commissioners, constituency office locations for 290 constituencies as a 22 page text PDF, party lists and candidate lists as PDFs, registers by area, boundary delimitation documents and results. The registry holds 47 counties, 290 constituencies and 1,452 wards as geography units with boundaries, so each IEBC row is linked by the geography resolver (county then constituency or ward name within the parent, exact then containment, no guess). Constituency offices are organisations with locations linked to their constituency unit. Aspirants and candidates are people and must go through the matching system; the same person across elections and offices is one profile and common names are flagged, never merged on the name alone. IEBC boundary documents may differ from the geoBoundaries and HDX shapes; differences are recorded, not overwritten. This task works with the electoral schema changes planned in the statistics group.

## Acceptance checklist

- [x] Inventory every IEBC publication, its format and URL pattern, and record the machine routes.
- [ ] Load the 290 constituency offices with locations linked to constituency units.
- [ ] Load aspirants and candidates and match them to people and parties.
- [ ] Load registered voters by area once the electorate table exists, with the register version.
- [ ] Record IEBC boundary and delimitation documents and compare them with the loaded boundaries.
- [ ] Report unmatched names and ambiguous matches for review.

## Outcome (Lane C, 3 November 2026)

- Inventory done: `fixtures/seed/ke-iebc-catalogue.json`. Constituency offices were left to the places research task as instructed. Voter registers and 2013 results are being loaded by the statistics electoral loader (`iebc_register`), so they are not duplicated here.
- Not done: the 79 party-list PDFs (2022) were found and one sample read through the gate. They mix public facts with masked IDs, phones, addresses, ethnicity and disability categories; loading nominees as people needs an extractor that keeps only name, party, list, rank and county, and a decision on creating about thousands of name-only person rows (no auto-merge is possible without corroboration). Boundary delimitation documents were not fetched. Left for a follow-up.
