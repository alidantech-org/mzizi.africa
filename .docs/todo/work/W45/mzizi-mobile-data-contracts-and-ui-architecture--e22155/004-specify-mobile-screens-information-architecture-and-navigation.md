---
{id: TSK-52EB1C4B6DA0,name: "Specify mobile screens, information architecture and navigation",type: task,status: planned,priority: medium,created_at: 2026-11-04T15:55:46.089Z,updated_at: 2026-11-04T15:55:46.089Z,order: 4096}
---

# Goal

Define the initial MZIZI mobile application's screen catalog and navigation model from real data contracts and reusable presentation components. For each proposed screen, identify why it exists, its principal user question, which record or aggregate feeds it, how it links to other screens, and which states must be supported. The result should be implementable by a frontend developer without guessing the information hierarchy.

## Context

MZIZI spans geography, governance, elections, public institutions, people, history, finance, and evidence. Country-to-county-to-constituency exploration may be relevant in Kenya, but administrative hierarchies and legal institutions differ between African countries and historical periods. Screen designs must not assume that every country uses the same units or that present-day leadership applies to past boundaries. Prioritize a coherent mobile experience and trace every panel back to proposed or verified data contracts.

## Acceptance checklist

- [ ] Inventory prioritized screens and navigation paths for exploration, search, details, comparisons, and source inspection.
- [ ] Write screen-by-screen specifications listing sections, components, JSON contracts, filters, actions, and related screens.
- [ ] Define drill-down behavior across geographic units, officeholders, institutions, elections, and historical periods where available.
- [ ] Describe loading, missing-data, restricted, disputed, and version-history states for each representative screen.
- [ ] Identify mobile-specific design considerations such as long lists, deep links, map fallback, performance, and accessibility.
- [ ] Provide a traceability matrix connecting screens to components, entities, and required backend or aggregation work.

## Deliverables

An approved-ready screen inventory, navigation map, and detailed UI specifications with unresolved decisions clearly noted. Implementation and design mockups are separate follow-up work.
