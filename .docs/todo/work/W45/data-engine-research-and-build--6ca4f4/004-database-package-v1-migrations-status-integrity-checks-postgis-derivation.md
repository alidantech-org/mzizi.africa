---
{id: TSK-273482DC61AE,name: "Database package v1: migrations, status, integrity checks, PostGIS derivation",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:13:40.554Z,updated_at: 2026-11-02T07:13:40.554Z,due_at: 2026-11-10,order: 4096}
---

# Database package v1: migrations, status, integrity checks, PostGIS derivation

## Goal
Make engine/database the owner of schema lifecycle so the API never creates tables, replacing scripts/dev-db.ts with generated, committed migrations and adding the checks that the soft cross-schema references require.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. The live dev database has 18 schemas and 89 tables; documentation that says 91 is wrong. Schema truth is the Dryv-generated entities, with a drift check. Geometry is GeoJSON text by decision, so PostGIS columns and GIST indexes are derived here. Reference seeds, research seeds and fixtures stay distinct.

## Acceptance checklist
- [ ] Generate and apply an initial migration from the entities, and add a drift check that fails when entities and migrations differ.
- [ ] Add environment status, a staging schema migration, roles and per-schema grants.
- [ ] Implement integrity checks for plain-id links and target_kind values, with tests.
- [ ] Derive PostGIS geometry columns and indexes from GeoJSON text, with a test.
- [ ] Move the fixtures into a seed class and retire dev-db.ts.
