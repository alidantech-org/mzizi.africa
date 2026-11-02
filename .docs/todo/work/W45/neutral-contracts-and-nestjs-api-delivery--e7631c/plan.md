---
{id: GRP-B728EBE7631C,name: Neutral contracts and NestJS API delivery,type: documentation,extra: {created_at: 2026-11-02T04:56:54.949Z}}
---

# Plan

## Approach

Continue from the inventory. First settle the technical decisions (Dryv pack source, PostGIS and JSONB support, auth, evidence handling). Then author the shared contracts, then the geography pilot contracts, then scaffold the NestJS app beside the Python service and generate the geography read slice. After that migrate the remaining domains in batches, add the limited write paths, prove neutrality with fixtures for two countries, and reconcile the documentation.

## Milestones

1. Decisions recorded and shared contracts compile to Runtime IR.
2. Geography contracts and the NestJS scaffold exist.
3. Geography read slice generated and tested.
4. Remaining domain contracts authored in batches.
5. Write paths and fixtures for two countries pass.
6. Documentation reconciled and boundaries audited.

## Risks

Dryv packs may not express PostGIS or JSONB. Boundary violations are the main risk: ingestion, cleaning and migrations must not leak into the API. The Python service shares the folder with the new app, so the layout must be documented before any removal.
