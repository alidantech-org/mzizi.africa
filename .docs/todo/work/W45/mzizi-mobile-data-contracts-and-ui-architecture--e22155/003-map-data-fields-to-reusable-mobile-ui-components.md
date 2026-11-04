---
{id: TSK-B675E53E04A2,name: Map data fields to reusable mobile UI components,type: task,status: planned,priority: medium,created_at: 2026-11-04T15:55:45.864Z,updated_at: 2026-11-04T15:55:45.864Z,order: 3072}
---

# Goal

Create a reusable mapping from MZIZI data semantics to mobile interface components. The outcome should tell designers and developers when to display a summary card, key-value details, table, bar chart, line chart, map, timeline, comparison, profile, badge, citation, or empty state. Visualizations must be selected for a reason grounded in actual data meaning, not merely because a numeric column exists.

## Context

Geospatial boundaries, historical leadership periods, disputed claims, census observations, election results, and public spending have different rendering needs. Mobile screens also need explicit handling for narrow widths, long labels, low-confidence values, incomplete source coverage, and inaccessible visualizations. Components should consume the proposed JSON presentation contracts rather than embedding database schema assumptions in widgets. Map, chart, and table interactions must preserve provenance and observed-versus-valid time distinctions.

## Acceptance checklist

- [ ] Establish field-to-component mapping rules for identifiers, categories, hierarchies, numeric measures, dates, relationships, and rich narratives.
- [ ] Define chart selection rules, including comparison, trends, composition, geographic distribution, and when no chart is appropriate.
- [ ] Specify reusable component input contracts and states for loading, null, no data, error, uncertainty, and historical versions.
- [ ] Document presentation of sources, confidence, revisions, disputed claims, units, rounding, and data freshness.
- [ ] Include responsive and accessibility guidance for tables, legends, maps, charts, and screen-reader alternatives.
- [ ] Provide component examples grounded in the verified inventory and flag any dependencies on unimplemented aggregates.

## Deliverables

A component mapping matrix, reusable widget specification, chart decision guide, and representative component examples. No visual redesign or production UI edits are authorized by this task.
