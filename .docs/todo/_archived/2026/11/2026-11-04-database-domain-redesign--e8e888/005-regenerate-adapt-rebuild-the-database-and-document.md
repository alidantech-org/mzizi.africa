---
{id: TSK-C9C28F18E04D,name: "Regenerate, adapt, rebuild the database and document",type: task,status: completed,priority: medium,created_at: 2026-11-02T06:41:22.755Z,updated_at: 2026-11-02T06:59:01.169Z,due_at: 2026-11-02,order: 1536,extra: {status_history: [{from: planned,to: completed,at: 2026-11-02T06:59:01.169Z}]},archived_at: 2026-11-04T15:53:07.952Z}
---

# Regenerate, adapt, rebuild the database and document

## Goal

After the contracts are rewritten, regenerate the API once, repair project-owned code and tests, recreate the development database on the new schemas, run every suite on PostGIS and update the documentation and handoffs.

## Context

The rewrite changes table names, removes provenance columns, adds four schemas and removes people from governance. Project-owned files that must change: service implementations (new operations), hand-written SQL in geography use cases and governance, the fixture loader and fixtures, dev-db script, integration tests and their grants, and the data engine handoff. The shared PostGIS container holds other projects' databases; only mzizi_dev is dropped and recreated. Use the schema creation helper before synchronizing.

## Acceptance checklist

- [x] Run the contract checks, regenerate, and fix the post-generation typecheck.
- [x] Update hand-written SQL, service implementations, fixtures, loaders and tests.
- [x] Drop and recreate mzizi_dev, load fixtures, boot the API and exercise the new endpoints.
- [x] Run the full suite against PostGIS.
- [x] Update the naming rule, domain catalog, architecture notes and data engine handoff; run task validate.

## Progress

Regenerated the API (18 schemas, 91 tables, 167 routes). Removed unmodified scaffolds that mapped dropped provenance fields and regenerated them, then re-adopted the shared list helper (77 use cases). Found and fixed: Dryv leaves stale entities for removed contracts, which created phantom tables (added dryv/tools/check-stale-generated.ts to generated:check); parallel PostgreSQL suites needed a longer hook timeout. mzizi_dev was dropped and recreated with db:reset (58 fixture rows, 56 attributions); the API booted and answered people, source, filesystem, geography and governance reads, and identity correctly has no endpoint. Full suite on PostGIS: 612 files, 11989 tests; bun run check and generated:check pass. Docs updated: naming rule, catalog, architecture, migration accounting, handoff, READMEs.
