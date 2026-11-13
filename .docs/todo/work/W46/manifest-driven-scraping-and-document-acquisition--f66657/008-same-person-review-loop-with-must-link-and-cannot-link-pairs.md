---
{id: TSK-43396C72F565,name: Same-person review loop with must-link and cannot-link pairs,type: task,status: planned,priority: medium,created_at: 2026-11-13T10:25:42.446Z,updated_at: 2026-11-13T10:25:42.446Z,order: 8192}
---

# Same-person review loop with must-link and cannot-link pairs

## Goal

Give regional reviewers a way to decide whether two records in `official.individuals` are the same person, store each decision as a versioned must-link or cannot-link pair, and feed those pairs back into scoring, with reversible merges.

## Context

See `ENTITY_RESOLUTION.md` and `PEOPLE_DESIGN.md`. Reviewers see both records and their evidence side by side (names, aliases, office, term, region, party, source pages, portrait files) scoped to their region. Decisions are attributable and versioned. A merge can later be split without losing downstream evidence. Pairs live in the database as a Dryv contract in the people or review domain, which is an open decision to settle here. NestJS serves the review interface and the database service owns writes. Facial comparison is not part of this task (see `DEC-BIOMETRIC-MATCHING-20261113`).

## Acceptance checklist

- [ ] A Dryv contract for link decisions (must-link, cannot-link, merge, split) is authored, with region scoping and attribution.
- [ ] API operations list candidate pairs for a region, record a decision and reverse a merge, with authorization by region.
- [ ] The review view shows side-by-side evidence and does not display or compute any biometric signal.
- [ ] Recorded pairs constrain the resolution jobs and calibration, and are tested.
