---
{id: TSK-F8FC52A3AD73,name: "People, legal text and NG-CDF data from live Kenyan sources",type: task,status: planned,priority: medium,created_at: 2026-11-02T17:57:42.720Z,updated_at: 2026-11-02T17:57:42.720Z,order: 40960}
---

## Goal

Bring real public data about Kenya's office holders, legal text, constituency funds and electoral body into the canonical tables through the gated fetch, staging, review and promotion path.

## Context

DEC-AUTO-APPROVAL allows the agent account to approve. Sources: Parliament member lists, IEBC, KLRC Constitution pages, NG-CDF API. See DATA_ENGINE_STATUS_AND_GAPS.md (night update) for the table of what was loaded.

## Acceptance

- [x] Members of the National Assembly and Senate with seats, parties and portraits promoted.
- [x] IEBC commissioners promoted.
- [x] Constitution of Kenya, 2010 (instrument, chapters, articles) promoted from KLRC.
- [x] NG-CDF allocations and disbursements for all constituencies promoted.
- [x] Extractor and mapping tests; data engine suite green.
- [ ] IEBC constituency offices PDF, county governors and assemblies, Acts and Hansard, county workers.
