---
{id: TSK-4C1014E51336,name: "Population breakdowns: ethnic community, religion, education, ICT access and economy",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T19:25:52.135Z,updated_at: 2026-11-03T06:13:09.782Z,order: 6144,depends_on: [TSK-1DDA156356D5],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-03T01:24:42.050Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-4C1014E51336/1793669082052-start,started_at: 2026-11-03T01:24:42.615Z}]}},due_at: 2026-11-03}
---

# Population breakdowns: ethnic community, religion, education, ICT access and economy

## Goal

Load the distributions that make the population meaningful: ethnic community and nationality, religion, age and sex pyramids, education, disability, access to the internet, mobile phones and computers, and economic indicators such as employment, poverty and household income, each linked to its geography unit and period.

## Context

These are the multi-dimensional figures that need the dimension design to land first. The 2019 census volumes publish ethnic community and nationality by county and sub-county, religion by county, education attendance, disability, and household access to ICT such as mobile phones, internet and computers; the Kenya Integrated Household Budget Survey and the Kenya Demographic and Health Survey add poverty, income and health indicators at county level; the Communications Authority publishes internet and mobile subscriptions; the Commission on Revenue Allocation publishes marginalisation indices. Ethnic and religious data is sensitive: it describes groups, never individuals, must keep the source's category names and definitions (categories changed between censuses and are not always comparable), and must never be combined with other data to identify a person. Each loaded table keeps its source, period, dimension definitions and estimate kind.

## Acceptance checklist

- [x] Map each source table's categories to dimension members, keeping the original labels and recording definition changes between censuses.
- [ ] Load ethnic community and nationality by county from the census volume.
- [x] Load religion by county, then age and sex distributions.
- [ ] Load education, disability and ICT access (internet, mobile, computer) by county and by lower levels where published.
- [ ] Load economic indicators (employment, poverty, income, county fiscal and marginalisation measures) with their surveys and years.
- [x] Add a note on sensitivity to the status document and a rule that these tables are published only as group counts.
