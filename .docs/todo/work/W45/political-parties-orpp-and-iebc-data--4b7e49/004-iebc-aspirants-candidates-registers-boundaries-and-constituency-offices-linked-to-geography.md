---
{id: TSK-84B0D19A895B,name: "IEBC: aspirants, candidates, registers, boundaries and constituency offices, linked to geography",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:02:42.066Z,updated_at: 2026-11-02T20:02:42.066Z,order: 4096}
---

# IEBC: aspirants, candidates, registers, boundaries and constituency offices, linked to geography

## Goal

Load all IEBC data that exists (aspirants and candidates, voter registers, constituency and ward boundaries and delimitation, constituency offices, results references), linked to our geography units and to people and parties by fuzzy matching and PDF extraction.

## Context

The IEBC site (`www.iebc.or.ke`, already assessed) publishes the commissioners, constituency office locations for 290 constituencies as a 22 page text PDF, party lists and candidate lists as PDFs, registers by area, boundary delimitation documents and results. The registry holds 47 counties, 290 constituencies and 1,452 wards as geography units with boundaries, so each IEBC row is linked by the geography resolver (county then constituency or ward name within the parent, exact then containment, no guess). Constituency offices are organisations with locations linked to their constituency unit. Aspirants and candidates are people and must go through the matching system; the same person across elections and offices is one profile and common names are flagged, never merged on the name alone. IEBC boundary documents may differ from the geoBoundaries and HDX shapes; differences are recorded, not overwritten. This task works with the electoral schema changes planned in the statistics group.

## Acceptance checklist

- [ ] Inventory every IEBC publication, its format and URL pattern, and record the machine routes.
- [ ] Load the 290 constituency offices with locations linked to constituency units.
- [ ] Load aspirants and candidates and match them to people and parties.
- [ ] Load registered voters by area once the electorate table exists, with the register version.
- [ ] Record IEBC boundary and delimitation documents and compare them with the loaded boundaries.
- [ ] Report unmatched names and ambiguous matches for review.
