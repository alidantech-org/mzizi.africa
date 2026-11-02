---
{id: TSK-273482DC61AE,name: "Database package v1: migrations, status, integrity checks, PostGIS derivation",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:13:40.554Z,updated_at: 2026-11-02T08:26:33.162Z,due_at: 2026-11-10,order: 4096,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T08:22:38.694Z},{from: in-progress,to: completed,at: 2026-11-02T08:26:33.162Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-273482DC61AE/1793607758696-start,started_at: 2026-11-02T08:22:39.046Z,end_ref: refs/tracking/TSK-273482DC61AE/1793607993165-end,ended_at: 2026-11-02T08:26:33.163Z,summary: {files: 19,insertions: 2395,deletions: 55}}]}}}
---

# Database package v1: migrations, status, integrity checks, PostGIS derivation

## Goal
Make engine/database the owner of schema lifecycle so the API never creates tables, replacing scripts/dev-db.ts with generated, committed migrations and adding the checks that the soft cross-schema references require.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. The live dev database has 18 schemas and 89 tables; documentation that says 91 is wrong. Schema truth is the Dryv-generated entities, with a drift check. Geometry is GeoJSON text by decision, so PostGIS columns and GIST indexes are derived here. Reference seeds, research seeds and fixtures stay distinct.

## Acceptance checklist
- [x] Generate and apply an initial migration from the entities, and add a drift check that fails when entities and migrations differ.
- [x] Add environment status, a staging schema migration, roles and per-schema grants.
- [x] Implement integrity checks for plain-id links and target_kind values, with tests.
- [x] Derive PostGIS geometry columns and indexes from GeoJSON text, with a test.
- [x] Move the fixtures into a seed class and retire dev-db.ts.

## Progress
Package at source/backend/engine/database (Bun, TypeORM): migrations generated from the Dryv entities with a scratch-database drift check, three migrations (initial 107 tables across 20 schemas, staging, PostGIS boundary shapes), status, seed (reference and fixtures), integrity (declared soft links, every jurisdiction_id, target_kind tables, derived geometry), grants and reset. Five bun tests pass against PostGIS (migrations, no drift, clean fixtures, invalid GeoJSON flagged, orphan reference flagged). The API's db:* scripts now delegate here and dev-db.ts is gone. Limits: seeds still reuse the API's fixture-loader (to be moved with the promotion task); roles are not created, only granted; the integrity registry of soft links is explicit and must grow with new links.
