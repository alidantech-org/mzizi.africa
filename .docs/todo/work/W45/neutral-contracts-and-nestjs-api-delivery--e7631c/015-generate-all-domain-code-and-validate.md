---
{id: TSK-0DB63553ABBA,name: Generate all domain code and validate,type: task,status: planned,priority: medium,created_at: 2026-11-02T05:14:40.368Z,updated_at: 2026-11-02T05:14:46.840Z,order: 15360,due_at: 2026-11-02}
---

# Generate all domain code and validate

## Goal

After every domain contract is authored and passes the contract checks, generate the full NestJS API in one pass and validate it: typecheck, generated specs, and a real PostgreSQL run, so any generator or contract problem is found across the whole model rather than domain by domain.

## Context

The group plan changed to contracts first, generation second. The Dryv engine runs locally (dryv-api on port 8750) with dryv.yaml at the repository root pinning engine 6dba3100 and packs 7fdaa6f0. Generation writes into source/backend/api/src/modules, types, app.module.ts and database. Known generator limits: two relations to one entity collide, string maximum lengths become varchar, and the database module is only wired when an operation reads an entity. The geography slice already proves the approach with an integration test through a SELECT-only role. See dryv/README.md.

## Acceptance checklist

- [ ] Run bun run check in dryv/ and fix every contract finding before generating.
- [ ] Generate with the local Dryv API and confirm the post-generation typecheck passes for all groups.
- [ ] Run the generated specs and the PostgreSQL schema synchronisation against PostGIS, and fix contract or pack problems found.
- [ ] Record generator limits and workarounds in dryv/README.md and the decision documents.
- [ ] Commit the generated output and confirm a second generation reports no changes.
