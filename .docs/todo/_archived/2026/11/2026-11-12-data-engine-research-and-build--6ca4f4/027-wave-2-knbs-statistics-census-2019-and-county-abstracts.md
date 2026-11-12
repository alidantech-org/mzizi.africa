---
{id: TSK-0F60439A6B6F,name: "Wave 2: KNBS statistics (census 2019 and county abstracts)",type: task,status: archived,priority: medium,created_at: 2026-11-02T09:55:58.373Z,updated_at: 2026-11-12T05:47:41.701Z,due_at: 2027-01-15,order: 27648,extra: {status_history: [{from: planned,to: archived,at: 2026-11-12T05:47:41.701Z}]},archived_at: 2026-11-12T05:47:56.094Z}
---

# Wave 2: KNBS statistics (census 2019 and county abstracts)

## Goal
Import official Kenyan statistics from the Kenya National Bureau of Statistics into the statistical schema.

## Context
The KNBS website could not be reached from the development machine on 2026-11-02 (connection failed) and was not retried; the cause (network, geo-block, outage) is unknown. First establish what is reachable and what the terms say, prefer downloadable tables, and map census tables to indicators, categories, periods and observations with units and geography. World Bank national totals already exist for population and are not a substitute for census tables by county. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Establish reachability and terms, and record the assessment inputs; if unreachable, record the finding and try an alternative official route.
- [ ] Extract the 2019 census population table by county with a sourced licence.
- [ ] Map to statistical indicators, periods and observations; reconcile unit and geography ids.
- [ ] Import through staging with review and report coverage of 47 counties.
- [ ] Cross-check against the World Bank national total.
