---
{id: TSK-14940C3CE33C,name: Expose engine job progress through the API to the frontend,type: task,status: archived,priority: medium,created_at: 2026-11-15T16:54:06.673Z,updated_at: 2026-11-24T19:24:52.058Z,order: 9216,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:52.058Z}]},archived_at: 2026-11-24T19:25:24.571Z}
---

# Expose engine job progress through the API to the frontend

## Goal

Let the frontend see what the engine is doing: the API watches engine jobs and exposes their progress, work items and outputs through its own authenticated endpoints, so the review dashboard can show live status and results without talking to the engine directly.

## Context

The engine job model is described in `.docs/design/architecture/ENGINE_JOB_MODEL.md`; job runs and events are stored in MongoDB by the engine task. The API calls the engine's internal HTTP API and relays status with server-sent events or polling, chosen by the first prototype. Authorization uses the API's existing guards: a user sees only jobs they may see. Outputs link to files by their Filesystem record, not by raw object URLs. The Temporal worker may also start jobs, so the API reads job state from the engine and does not own it.

## Acceptance checklist

- [ ] The API exposes job list, job detail with events and progress, and outputs endpoints with documented response shapes.
- [ ] A live progress channel (server-sent events or polling, with the choice recorded) delivers updates to a client in a test.
- [ ] Access is limited by the caller's permissions and a test shows an unauthorized caller is refused.
- [ ] The review dashboard has a minimal job status view wired to these endpoints, or the missing piece is recorded here.
