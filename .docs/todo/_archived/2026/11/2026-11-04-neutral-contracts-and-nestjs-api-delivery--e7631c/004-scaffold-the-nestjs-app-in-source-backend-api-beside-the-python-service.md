---
{id: TSK-6A4BD4FD613A,name: Scaffold the NestJS app in source/backend/api beside the Python service,type: task,status: completed,priority: medium,created_at: 2026-11-02T04:56:58.450Z,updated_at: 2026-11-02T05:00:42.614Z,order: 4096,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T04:59:51.485Z},{from: in-progress,to: completed,at: 2026-11-02T05:00:42.614Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-6A4BD4FD613A/1793595591487-start,started_at: 2026-11-02T04:59:51.542Z,end_ref: refs/tracking/TSK-6A4BD4FD613A/1793595642616-end,ended_at: 2026-11-02T05:00:42.615Z,summary: {files: 447,insertions: 932,deletions: 379}}]}},archived_at: 2026-11-04T15:53:08.080Z}
---

# Scaffold the NestJS app in source/backend/api beside the Python service

## Goal

Create the NestJS product API skeleton in source/backend/api with bun and TypeORM, without removing or deepening the Python service that is still the migration source.

## Context

The decision is NestJS in source/backend/api. The folder currently holds the Python FastAPI service (app, alembic, scripts, _archives). AGENTS.md section 3 says remove old code only after responsibilities are accounted for, so the scaffold must coexist, for example in a clearly named subfolder or with the Python code moved under a legacy path as part of a documented step. The API never runs migrations or seeds, and uses a read-only database role for domain tables. See .docs/docs/MIGRATION.md. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [x] Choose and document the coexistence layout and adjust README files.
- [x] Initialise the NestJS project with bun, TypeORM, PostgreSQL config and a health endpoint.
- [x] Configure separate read-only and restricted-writer connections and forbid migration or seed commands.
- [x] Add lint, build and test scripts and confirm they run.
- [x] Update source/backend/README.md and .docs/docs/repository-map.md.

## Progress

Python service moved to `source/backend/api-legacy`; NestJS scaffolded in `source/backend/api` (bun, TypeORM, read and write connections, `/health`). `bun run typecheck`, `bun test` (2 pass) and `bun run lint` pass, and the app started and answered `/health`. Docs and AGENTS.md updated to the new paths. The write connection is configured but not yet used; role-gated writes come in the write-paths task.
