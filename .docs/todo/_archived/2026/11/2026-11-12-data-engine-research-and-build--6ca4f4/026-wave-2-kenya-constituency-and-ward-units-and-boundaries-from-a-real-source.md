---
{id: TSK-57BCCB56B6C4,name: "Wave 2: Kenya constituency and ward units and boundaries from a real source",type: task,status: archived,priority: medium,created_at: 2026-11-02T09:55:58.214Z,updated_at: 2026-11-12T05:47:41.176Z,due_at: 2027-01-08,order: 26624,extra: {status_history: [{from: planned,to: archived,at: 2026-11-12T05:47:41.176Z}]},archived_at: 2026-11-12T05:47:56.094Z}
---

# Wave 2: Kenya constituency and ward units and boundaries from a real source

## Goal
Add the second and third administrative levels of Kenya (constituencies and wards) with boundaries from an openly licensed, sourced dataset.

## Context
The legacy geographic seed is not fit to import: 156 repeated codes, 7 counties missing and 249 distinct constituencies against 290 real ones. Counties already come from geoBoundaries. Candidate sources are the IEBC boundary delimitation documents and openly licensed datasets (check each licence: some are non-commercial). The level hierarchy is in the Kenya reference seed (constituency order 2, ward order 3); parents are resolved by geometry containment because ADM2 files carry no parent code. Constituency units also unlock the NG-CDF site pattern. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Choose and record a source with a verified licence, and capture its terms.
- [ ] Parent assignment by containment with a reviewable confidence and a report of ambiguous cases.
- [ ] Import units and boundaries through the pipeline; containment findings are reported, never accepted silently.
- [ ] Expand the NG-CDF pattern from the new constituency units.
- [ ] Report counts against the official 290 constituencies and the ward total, naming any gap.
