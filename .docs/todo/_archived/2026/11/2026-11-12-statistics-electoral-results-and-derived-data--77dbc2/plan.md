---
{id: GRP-F74D8A77DBC2,name: "Statistics, electoral results and derived data",type: documentation,extra: {created_at: 2026-11-02T19:24:42.727Z}}
---

# Statistics, electoral results and derived data plan

## Approach

The schema review (2 November 2026) found that the statistical schema (categories, indicators, datasets, fields, periods, observations) can hold a single-dimension series such as total population by county and year, but cannot cleanly hold figures broken down by several dimensions at once (sex by age group by ethnic community by county), has no measure type (count, rate, ratio, percent), no denominators, no margin of error, no distinction between a census count, a projection and a survey estimate, and no way to say that a figure was derived from other figures. The electoral schema holds candidates, seats and per-candidate votes but not the electorate: registered voters, votes cast, valid, rejected and spoilt ballots per area and election, referendum options, or party-list allocations. Geography has no area column although boundary geometry is stored in PostGIS, so area can be computed with a geodesic calculation and stored as a derived measurement.

The plan is design first, then loaders, then derivations, each delivered through the existing gate, staging, review and promotion path with provenance, and each additive: no existing table is dropped.

## Milestones

1. Design: statistical dimensions and measure types, derived-value lineage, electorate tables, area of geography units (tasks 001 to 003).
2. Sources: a catalogue of Kenyan statistical publishers and their machine routes (task 004).
3. Loaders: census population by unit, then breakdowns (ethnicity, religion, ICT, economy), then electoral registers and results (tasks 005 to 007).
4. Derivations and checks: area, density, turnout, vote share, and consistency checks between sources (tasks 008 and 009).
