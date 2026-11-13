---
{id: TSK-401E2BBBF98F,name: Define the engine job model and ports,type: task,status: planned,priority: medium,created_at: 2026-11-13T09:53:30.964Z,updated_at: 2026-11-13T09:53:30.964Z,order: 5120}
---

# Define the engine job model and ports

## Goal

Document and implement the engine's job model so one executor serves the web, the local CLI and Temporal identically. A job kind has a read-only `plan(input, ports)`, idempotent `steps` that pass artifacts by reference, and injected ports for the object store, a read-only database `Reader`, `Http`, `StagingStore` and `Clock`. The engine targets the Rust database service (port 3303) first.

## Context

The engine already has an `Executor` (queue, per-capability limits, retries, cancel, progress events), process workers for CPU-bound capabilities, SSE events and an outbox to NestJS; see `source/backend/engine/README.md`. Its largest module is `filesystem_api.py` at about 526 lines. Engine jobs must stay bounded; long campaigns stay in Temporal. The engine must never write domain data and must plan from real object-store and database reads, for example listing Kenyan counties to search for flag images. See `ENGINE_JOB_MODEL.md`.

## Acceptance checklist

- [ ] Engine source is reorganised into subfolders (for example `api/`, `jobs/`, `ports/`, `adapters/`, `policy/`) with no module over about 300 lines.
- [ ] Plan and step contracts exist with a persisted, hashed `Plan` and a dry-run mode that plans without executing.
- [ ] Adapters exist for the Rust database service reads, the object store and a local mode (directory and in-memory store) so the CLI runs jobs without Postgres.
- [ ] Bounded queues, artifact size caps and per-capability limits are enforced and tested, and a sample job `scrape -> extract -> save` runs identically from the CLI and the API.
- [ ] The engine README, AGENTS.md and the design guide match the implementation.
