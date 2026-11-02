---
{id: TSK-8CF76EC741B3,name: Move engine packages to source/backend/engine and fix references,type: task,status: planned,priority: medium,created_at: 2026-11-02T07:13:40.300Z,updated_at: 2026-11-02T07:13:40.300Z,due_at: 2026-11-04,order: 2048}
---

# Move engine packages to source/backend/engine and fix references

## Goal
Group the data and database engines under source/backend/engine as two independent packages, as decided in DEC-ENGINE-LAYOUT, so later build tasks have their final home and no stale paths remain in documentation or code.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. The old folders data-engine and db-engine contain only READMEs and the fixtures directory. The API fixture loader points at db-engine/fixtures, so the move must keep the API tests green. Grep for data-engine and db-engine across the repository including AGENTS.md, .docs and source/backend/README.md.

## Acceptance checklist
- [ ] git mv data-engine to engine/data and db-engine to engine/database, with a README for engine/ stating it groups packages and holds no shared code.
- [ ] Update every reference found by grep, including fixturesDir in api/src/neutral/fixture-loader.ts.
- [ ] Run the API unit tests and bun run db:reset successfully.
- [ ] Run task validate and confirm no remaining references to the old paths.
