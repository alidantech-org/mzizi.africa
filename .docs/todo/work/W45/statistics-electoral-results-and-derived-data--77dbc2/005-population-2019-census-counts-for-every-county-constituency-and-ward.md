---
{id: TSK-1DDA156356D5,name: "Population: 2019 census counts for every county, constituency and ward",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T19:25:51.954Z,updated_at: 2026-11-03T06:13:04.385Z,order: 5120,depends_on: [TSK-D4BDEB42D93E],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-03T01:24:41.214Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-1DDA156356D5/1793669081216-start,started_at: 2026-11-03T01:24:41.780Z}]}},due_at: 2026-11-03}
---

# Population: 2019 census counts for every county, constituency and ward

## Goal

Load the 2019 Kenya Population and Housing Census counts for every geography unit, with sex totals and household counts, as statistical observations linked to the units and to the KNBS publication they come from.

## Context

This is the base for every rate in the platform: density, per capita funding for NG-CDF, voters as a share of population. The sources are the KNBS census volumes (published as PDFs, some scanned) and machine-readable copies of the same figures on the Humanitarian Data Exchange (COD-PS population statistics by administrative unit) and the Kenya Open Data portal. Each figure keeps its source, page or table, and estimate kind (census count versus projection). Unit matching uses the geography resolver (county then constituency or ward name within its parent) and never guesses: names that match nothing or more than one unit are reported and left out. Totals must agree: wards add up to their constituency and constituencies to their county within the rounding the source shows, and the national total must equal the published 47,564,296. Population by ward needs the census ward volume; where it is not obtainable the gap is recorded.

## Acceptance checklist

- [x] Design the dataset and indicator records for census population (total, male, female, intersex, households, average household size).
- [ ] Load national and county totals from the primary KNBS source and cross-check them against the HDX figures.
- [ ] Load constituency and ward counts and match them to geography units with a report of unmatched names.
- [x] Check that children sum to their parents and the national total is correct; report every difference.
- [x] Promote through the staging and review path with attributions to the KNBS documents.
- [x] Add loader tests with a small census table fixture, including a table that does not add up.
