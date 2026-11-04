---
{id: TSK-D3CB7D9CC4B2,name: Generate and test the geography read slice,type: task,status: completed,priority: medium,created_at: 2026-11-02T04:56:58.525Z,updated_at: 2026-11-02T05:10:56.596Z,order: 5120,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:00:46.270Z},{from: in-progress,to: completed,at: 2026-11-02T05:10:56.596Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-D3CB7D9CC4B2/1793595646272-start,started_at: 2026-11-02T05:00:46.330Z,end_ref: refs/tracking/TSK-D3CB7D9CC4B2/1793596256598-end,ended_at: 2026-11-02T05:10:56.596Z,summary: {files: 218,insertions: 13831,deletions: 733}}]}},archived_at: 2026-11-04T15:53:08.080Z}
---

# Generate and test the geography read slice

## Goal

Generate the NestJS geography module from the Dryv packs and prove it serves the mobile geography contract from a read-only role.

## Context

Builds on the geography contracts and the scaffold. Only service implementations are hand-written; controllers, DTOs and entities come from Dryv. The existing Python endpoints /units, /levels, /hierarchy and /v1/geography/* define expected behaviour, and .docs/docs/geography-api-contract.md defines the contract. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [x] Generate controllers, DTOs and TypeORM entities into the NestJS app from the geography contracts.
- [x] Hand-write the use cases for search, entity lookup, verified boundary and child boundaries (map context, hierarchy and the boundaries-by-level list stay open; recorded in .docs/docs/geography-model.md).
- [x] Add integration tests against a PostgreSQL test database with PostGIS or the chosen geometry approach.
- [x] Verify the API connects with the read-only role and cannot write.
- [x] Compare response shapes with the legacy Python mobile contract (api-legacy mobile_api.py) and record differences in .docs/docs/geography-model.md; a live side-by-side run needs seeded data and is left open.

## Progress

Contracts were rewritten in TypeScript and generated with the Alidantech backend structure (see DEC-DRYV-PACK-SOURCE). Hand-written use cases for search, entity, boundary and child boundaries pass 8 integration tests against PostGIS 18 through a SELECT-only role, including a historical polity under its own jurisdiction, unverified boundaries being hidden, and writes being refused. The generated e2e spec boots every route. Not done: map-context, hierarchy and the by-level boundaries list, and a live comparison with the Python service.
