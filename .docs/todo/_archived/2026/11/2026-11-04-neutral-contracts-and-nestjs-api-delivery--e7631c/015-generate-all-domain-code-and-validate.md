---
{id: TSK-0DB63553ABBA,name: Generate all domain code and validate,type: task,status: completed,priority: medium,created_at: 2026-11-02T05:14:40.368Z,updated_at: 2026-11-02T05:31:24.103Z,order: 15360,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:20:42.965Z},{from: in-progress,to: completed,at: 2026-11-02T05:31:24.103Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0DB63553ABBA/1793596842966-start,started_at: 2026-11-02T05:20:43.036Z,end_ref: refs/tracking/TSK-0DB63553ABBA/1793597484105-end,ended_at: 2026-11-02T05:31:24.103Z,summary: {files: 2022,insertions: 132084,deletions: 1153}}]}},archived_at: 2026-11-04T05:47:26.861Z}
---

# Generate all domain code and validate

## Goal

After every domain contract is authored and passes the contract checks, generate the full NestJS API in one pass and validate it: typecheck, generated specs, and a real PostgreSQL run, so any generator or contract problem is found across the whole model rather than domain by domain.

## Context

The group plan changed to contracts first, generation second. The Dryv engine runs locally (dryv-api on port 8750) with dryv.yaml at the repository root pinning engine 6dba3100 and packs 7fdaa6f0. Generation writes into source/backend/api/src/modules, types, app.module.ts and database. Known generator limits: two relations to one entity collide, string maximum lengths become varchar, and the database module is only wired when an operation reads an entity. The geography slice already proves the approach with an integration test through a SELECT-only role. See dryv/README.md.

## Acceptance checklist

- [x] Run bun run check in dryv/ and fix every contract finding before generating.
- [x] Generate with the local Dryv API and confirm the post-generation typecheck passes for all groups.
- [x] Run the generated specs and the PostgreSQL schema synchronisation against PostGIS, and fix contract or pack problems found.
- [x] Record generator limits and workarounds in dryv/README.md and the decision documents.
- [x] Commit the generated output and confirm a second generation reports no changes.

## Progress

Generated the full model from 330 schemas and 130 operations with the local Dryv API (about 35 seconds): about 2000 files under source/backend/api/src/modules and src/types plus app.module.ts. The post-generation typecheck passes; bun run test passes 477 files and 13695 tests (generated DTO, entity, use-case and e2e specs), twice in a row; a second generation reports no changes and bun run generated:check passes. New project-owned test src/database/schema.integration.spec.ts synchronises every entity on PostgreSQL 18 with PostGIS, checks provenance, valid time and verification columns exist on every evidenced table, and that every money column has a currency. Problems found and fixed: the Contract schema name collided with a generated helper (renamed ProcurementContract and added to the audit as a reserved name); parallel integration suites shared a database (added scratchDatabase); a PostGIS table inflated the table count; stale files after the rename needed deleting. Generator limits are listed in dryv/README.md.
