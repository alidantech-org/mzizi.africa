---
{id: TSK-339FFB20F9AC,name: Author operational schemas in the new style,type: task,status: completed,priority: medium,created_at: 2026-11-14T05:50:13.228Z,updated_at: 2026-11-14T05:50:13.763Z,order: 15360,extra: {status_history: [{from: planned,to: completed,at: 2026-11-14T05:50:13.763Z}]}}
---

## Goal

Rewrite the seven operational Dryv schema files in the same authoring style as the rebuilt Main schemas, without changing the approved Operations inventory of tables and business columns.

## Context

`dryv/contracts/schemas/mzizi/` uses shared bases from `_base.ts`, `belongsTo` relations, `group.schema()` with direct exports, camelCase fields and fluent `.index()`/`.unique()` storage. `dryv/contracts/schemas/operational/` still hand-repeats `id` and timestamps, writes full `.relation({...})` blocks, assigns `*Schemas` registries typed `Record<string, any>` and names every index manually. The approved inventory (DEC-OPERATIONAL-DATABASE-20261112) fixes the tables and columns, so the rewrite is structural only; `version` and `deletedAt` must not be added to tables that never had them.

## Acceptance checklist

- [x] Add the smallest operational bases needed to `_base.ts` (identity only, created-timestamp, append-only).
- [x] Convert auth and audit to the new style.
- [x] Convert management, acquisition, staging, analytics and engine to the new style.
- [x] Remove the `*Schemas` registries and `Record<string, any>` and keep `apps/database` imports working.
- [x] Compile output keeps the same 46 compiled Operations tables and business columns, with any difference listed.
- [x] `bun run database:check` passes from `dryv/`.
