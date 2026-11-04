---
{id: GRP-FBFFB0FF973E,name: Database-backed mobile experience,type: documentation,extra: {created_at: 2026-11-02T21:01:49.562Z}}
---

# Database-backed mobile experience plan

## Approach

Use the evidence-first product docs and current Dryv/NestJS contracts as the product boundary. Start by confirming which canonical records are present and approved in the real database and which API queries return them. Build thin Flutter clients around API domains and reusable presentation components for place, time, evidence and confidence. Reuse canonical IDs end to end. Keep extraction, review, schema and file custody in their backend owners.

## Milestones

1. Define screen journeys and a dataset/API readiness matrix; confirm production-safe fields and source linkage.
2. Build shared mobile API transport, domain DTO parsing, retry/cache states and evidence/time cards.
3. Connect the place profile and verified geography slice to governance, people and published events.
4. Replace History samples with API-backed historical events and source details; preserve date precision and disputed/approximate state.
5. Replace Money samples with sourced budget, transfer, expenditure and procurement records after domain/data mapping is checked.
6. Persist saved record IDs, integrate additional public domains when contracts and data are ready, and complete accessibility/device validation.

## Constraints and risks

Never let mobile connect directly to PostgreSQL, show staging candidates as canonical, or invent missing source, date, currency, confidence or geography metadata. A route existing does not prove data presence, public exposure, joined source details or a useful query shape. Use aggregate public finance views when individual identifiers are restricted. Keep the first release Kenya-focused only where records support it, while keeping screen and contract logic jurisdiction-neutral. The latest documented DB inventory may be stale and must be rechecked when the database service is accessible.
