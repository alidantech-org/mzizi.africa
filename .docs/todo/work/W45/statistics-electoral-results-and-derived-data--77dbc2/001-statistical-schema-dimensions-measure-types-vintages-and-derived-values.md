---
{id: TSK-1F02AF48DAD0,name: "Statistical schema: dimensions, measure types, vintages and derived values",type: task,status: completed,priority: medium,created_at: 2026-11-02T19:25:51.207Z,updated_at: 2026-11-02T21:45:13.471Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T21:45:01.180Z},{from: in-progress,to: completed,at: 2026-11-02T21:45:13.471Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-1F02AF48DAD0/1793655901182-start,started_at: 2026-11-02T21:45:01.705Z,end_ref: refs/tracking/TSK-1F02AF48DAD0/1793655913472-end,ended_at: 2026-11-02T21:45:13.471Z,summary: {files: 1,insertions: 232,deletions: 0}}]}}}
---

# Statistical schema: dimensions, measure types, vintages and derived values

## Goal

Make the statistical schema able to hold what KNBS, DHS and other Kenyan publishers actually publish: a figure that is broken down by several dimensions at once (county, sex, age group, ethnic community, religion, urban or rural), that has a measure type, and that may be a census count, a projection, a survey estimate or something the system computed itself.

## Context

The current schema has categories, indicators, datasets, fields, periods and observations. An observation points to one indicator, one period, one dataset, one geography unit and one dataset column, with a numeric or text value and a confidence level. That is enough for total population by county and year. It cannot say that a figure is the Kikuyu population aged 15 to 19 in a ward, because there is only one column slot and no dimension table. It also lacks a measure type (count, rate, ratio, percentage, index), a denominator, a margin of error or standard error, a flag for count versus projection versus estimate, a release or revision label, and any record that a value was derived from other values. Changes must be additive and generated through the Dryv contracts so the API and the database engine stay in step; see `.docs/docs/DATABASE_DESIGN.md` and the decision on staging and promotion.

## Acceptance checklist

- [x] Write a design note comparing a dimension-table design with a dimensions JSON column, and decide.
- [x] Add dimensions and dimension members (sex, age group, ethnic community, religion, urban or rural, education level, and others) with hierarchies and reference codes.
- [x] Add measure type, denominator link, margin of error, estimate kind (census, projection, survey, administrative, derived) and release label to observations.
- [x] Add derived-from links so a computed value names its inputs and the method.
- [x] Author the contracts in Dryv, regenerate, add the migration, and keep the database engine drift check clean.
- [x] Add engine tests that store a multi-dimensional figure, a rate with a denominator and a derived value.
