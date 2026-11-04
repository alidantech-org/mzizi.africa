---
{id: GRP-56FB9A8A6662,name: Mobile database-backed implementation,type: documentation,extra: {created_at: 2026-11-02T21:15:38.251Z}}
---

# Mobile database-backed implementation plan

## Milestones

1. Verify canonical database availability, public-ready rows and NestJS DTO behavior for mobile data slices.
2. Improve the existing geography place detail so boundary provenance, verification and temporal context are easy to inspect.
3. Build the mobile read transport and typed models required for sourced events/history, then replace the bundled timeline examples.
4. Replace Money sample content with public-safe finance and procurement records after the canonical NG-CDF mapping, currency, geography links, evidence and pagination are verified.
5. Persist saved canonical IDs after stable detail routes exist; then add further domains and accessibility/offline polish.

## Sequencing and gates

The geography evidence task can proceed using metadata already parsed by `GeographyApiClient`. History and Money tasks depend on the read-only data/API readiness task. Saved-item persistence follows the first API-backed detail routes. Keep each slice tied to canonical IDs, prefer server-side filters and aggregates, and never present staging candidates as public truth.

## Risks

Database service access may remain unavailable in the coding environment. A route existing does not prove records or complete evidence joins exist. Date precision, disputed states, currency, licensing and privacy restrictions must be preserved. Historical maps need a dedicated valid-time query contract before the map changes its boundary layer.
