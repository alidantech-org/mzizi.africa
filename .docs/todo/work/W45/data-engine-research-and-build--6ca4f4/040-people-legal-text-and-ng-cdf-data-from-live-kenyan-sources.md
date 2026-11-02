---
{id: TSK-F8FC52A3AD73,name: "People, legal text and NG-CDF data from live Kenyan sources",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T17:57:42.720Z,updated_at: 2026-11-02T17:57:50.339Z,order: 40960,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T17:57:50.339Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-F8FC52A3AD73/1793642270349-start,started_at: 2026-11-02T17:57:51.039Z}]}}}
---

## Goal

Bring real public data about Kenya's office holders, legal text, constituency funds and electoral body into the canonical tables through the gated fetch, staging, review and promotion path.

## Context

The platform exists to research, preserve and structure African public knowledge with provenance, so the next step after proving the pipeline on one budget table was to load several real sources at once: who holds public office, what the supreme law says, how constituency funds are allocated and spent, and who runs the electoral commission. Every item keeps its source URL, capture, assessment and approving account, so a reader can trace any value back to the page or API response it came from. Only public-office facts are stored; private contact details are deliberately left out. 
DEC-AUTO-APPROVAL allows the agent account to approve. Sources: Parliament member lists, IEBC, KLRC Constitution pages, NG-CDF API. See DATA_ENGINE_STATUS_AND_GAPS.md (night update) for the table of what was loaded.

## Acceptance

- [x] Members of the National Assembly and Senate with seats, parties and portraits promoted.
- [x] IEBC commissioners promoted.
- [x] Constitution of Kenya, 2010 (instrument, chapters, articles) promoted from KLRC.
- [x] NG-CDF allocations and disbursements for all constituencies promoted.
- [x] Extractor and mapping tests; data engine suite green.
- [ ] IEBC constituency offices PDF, county governors and assemblies, Acts and Hansard, county workers.
