---
{id: GRP-335692406BDF,name: Neutral model and NestJS API,type: documentation,extra: {created_at: 2026-11-02T04:48:03.384Z}}
---

# Plan

## Approach

Work in small reviewable stages. First inventory and classify every model under `source/backend/api/app/routes/*/models` against the country-neutral audit. Second, author shared Dryv contracts for provenance, valid and record time, verification, hierarchical codes and jurisdiction-scoped classifications. Third, migrate domains in order: geography as pilot, legal, governance with offices and people, elections with political and events, entities with finance, debt and procurement, then statistics and services. Fourth, scaffold the NestJS app with TypeORM and bun, generated from the Dryv packs, using a read-only database role for domain tables.

## Milestones

1. Inventory and disposition table published in the docs.
2. Shared contracts compile to Runtime IR.
3. Geography read slice generated and tested.
4. Remaining domains migrated in batches.
5. Country-neutral fixtures pass for Kenya plus one different country.

## Risks

The NestJS app goes in `source/backend/api` and `dryv/` at the repository root (decision DEC-NESTJS-DRYV-PLACEMENT); the Python code in that folder must be inventoried before any scaffold lands beside it. Dryv packs may not express PostGIS or JSONB. Boundary violations are the main risk: ingestion, cleaning and migrations must not leak into the API.
