---
{id: TSK-6A4BD4FD613A,name: Scaffold the NestJS app in source/backend/api beside the Python service,type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:58.450Z,updated_at: 2026-11-02T04:56:58.450Z,order: 4096}
---

# Scaffold the NestJS app in source/backend/api beside the Python service

## Goal

Create the NestJS product API skeleton in source/backend/api with bun and TypeORM, without removing or deepening the Python service that is still the migration source.

## Context

The decision is NestJS in source/backend/api. The folder currently holds the Python FastAPI service (app, alembic, scripts, _archives). AGENTS.md section 3 says remove old code only after responsibilities are accounted for, so the scaffold must coexist, for example in a clearly named subfolder or with the Python code moved under a legacy path as part of a documented step. The API never runs migrations or seeds, and uses a read-only database role for domain tables. See .docs/docs/MIGRATION.md. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Choose and document the coexistence layout and adjust README files.
- [ ] Initialise the NestJS project with bun, TypeORM, PostgreSQL config and a health endpoint.
- [ ] Configure separate read-only and restricted-writer connections and forbid migration or seed commands.
- [ ] Add lint, build and test scripts and confirm they run.
- [ ] Update source/backend/README.md and .docs/docs/repository-map.md.
