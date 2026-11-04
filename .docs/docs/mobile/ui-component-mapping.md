---
id: DOC-MOBILE-UI-MAPPING
name: Mobile UI component mapping
type: documentation
tags: [mobile, ui,charts]
---

# Mapping schema information to mobile components

Each component below has a canonical evidence source, required display semantics and an empty/invalid state. Presentation components never infer canonical truth or alter data.

| Reusable component | Input sources/fields | UI and interaction | Guardrails |
| --- | --- | --- | --- |
| EntityHeader | id, name, kind, alias, code, validity | Title, current/historical tag, bookmark/share | Show stable identifiers only in details; never imply current if historical |
| GeographyHierarchy | geography.units parentId/levelId; geography.relationships | Parent breadcrumb and children list | Level labels resolved by jurisdiction-specific reference classifications |
| BoundaryMap | geography.boundaries geometry, unitId, referenceYear | Zoom/pan/select historical boundary | Geometry loaded lazily; show validity/verification, unknown shape as no-map state |
| MetricCard | statistical.observations, election electorates, finance measure | Value, unit, period, scope, change if comparable | Never show a number without period/unit; null means unavailable |
| TimeSeriesChart | indicator, ordered periods, observations, vintage/dimensions | Line chart with point detail and source notes | Only comparable series; gaps remain gaps, not zeros |
| RankedBarChart | election results, statistical category values | Horizontal bars with counts/units | Same measure, seat, result level, vintage and reporting scope |
| ProportionChart | mutually exclusive exhaustive breakdowns | Stacked bars or donut as optional | Show residual/unknown category; avoid pie for overlapping memberships |
| ComparisonTable | persons, offices, budgets, periods | Sort/filter and CSV/share where authorized | Sticky labels, long names, unit/currency alongside values |
| PersonProfileHeader | person.individuals and public profile, approved portrait attachment | Name, summary, image fallback | `person.contacts.exposure` must equal public |
| OfficeTenureTimeline | governance.offices/holders + person reference | Start/end term and appointment basis | Distinguish current, acting, historical; no invented tenure start |
| InstitutionTree | governance.institutions, relationships, offices | Expandable nested authority graph | Relationship kind shown explicitly; physical place is separate |
| ElectionResultPanel | electoral.candidates/results/electorates | Candidate list, ballots, turnout calculation if valid | Provisional/disputed state visible; never sum overlapping result levels |
| EvidenceSheet | source.attributions/verifications/documents/captures | Supporting and contradicting sources, date, locator | Distinguish retrieval date, publication date and valid time |
| FiscalBreakdown | finance.budgets/revenues/expenditures/entries | Budget vs spending, period and category comparison | Currency, fiscal year, budget revision and accounting basis required |
| DataStatusState | availability metadata | Empty / not collected / restricted / loading / error | Do not render empty as zero or hide unavailable regions |

## Chart choice rules

- **Line:** ordered repeated observations sharing indicator, dimensions, location, compatible vintage/definition, measure type and unit. A methodological break requires visible annotation or separate series.
- **Bar:** discrete categories or comparable candidates. Labels must include vote count, year or explicit measurement unit.
- **Stacked bar:** components of the same non-overlapping total. Check that components represent disjoint categories; mark missing portions.
- **Table:** precise values, many dimensions, unverified ranking, or when a chart would obscure uncertainty.
- **Map:** verified geometry with clear temporal version; choropleth needs normalized comparable observations, complete shape join, legend and no-data pattern.
- **Timeline:** office tenures, legal amendments, boundary evolution, named historical events; approximate dates shown with precision.
- **Network diagram:** governance hierarchy and organizations only where typed edges are available; avoid ambiguous 'connected to' lines.

## Screen density and interaction

Mobile defaults to summaries with drill-down. Cards target meaningful tap areas and readable labels; tables can be horizontally scrolled with a pinned first column; maps and charts have an accessible text/table equivalent. Use explicit loading skeleton, offline/cached, partially sourced, denied, empty and error states. Avoid aggregate charts on a single row simply because its numeric fields exist.

## Component-to-contract mapping

- `geography.detail` → EntityHeader, GeographyHierarchy, BoundaryMap, EvidenceSheet.
- `person.profile` → PersonProfileHeader, OfficeTenureTimeline, EvidenceSheet.
- `election.contest` → ElectionResultPanel, RankedBarChart, ComparisonTable, EvidenceSheet.
- `statistics.series` → MetricCard, TimeSeriesChart, ComparisonTable, EvidenceSheet.
- `finance.summary` → FiscalBreakdown, MetricCard, ComparisonTable, EvidenceSheet.

These are proposed Flutter presentation components, not claims that widgets already exist.
