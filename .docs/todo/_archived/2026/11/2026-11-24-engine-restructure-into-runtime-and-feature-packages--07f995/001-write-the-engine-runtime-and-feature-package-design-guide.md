---
{id: TSK-54C604667DE1,name: Write the engine runtime and feature-package design guide,type: task,status: archived,priority: medium,created_at: 2026-11-16T07:17:33.378Z,updated_at: 2026-11-24T19:23:59.865Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T07:17:56.944Z},{from: in-progress,to: completed,at: 2026-11-16T07:18:06.515Z},{from: completed,to: planned,at: 2026-11-16T07:19:21.030Z},{from: planned,to: completed,at: 2026-11-16T07:19:21.741Z},{from: completed,to: archived,at: 2026-11-24T19:23:59.865Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-54C604667DE1/1794813476956-start,started_at: 2026-11-16T07:17:57.389Z,end_ref: refs/tracking/TSK-54C604667DE1/1794813486517-end,ended_at: 2026-11-16T07:18:06.515Z,summary: {files: 6,insertions: 138,deletions: 3}}]}},archived_at: 2026-11-24T19:25:23.410Z}
---

# Write the engine runtime and feature-package design guide

## Goal

Fix the direction of the engine restructure in writing before any code moves. The guide states that the engine is one runtime class plus Dryv-generated persistence, that every capability lives in a package with a single orchestrator class, and that packages keep their code under `features/<capability>/`. It replaces the "engine does all I/O" wording in older proposals, so that agents and contributors stop adding capabilities to `mzizi_engine`.

## Context

The engine has grown to about 21,800 lines of capability code (see the group goal). `ENGINE_JOB_MODEL.md` is an earlier proposal that says packages are pure and the engine does all I/O; the new direction lets a package own its network and browser adapters behind ports while still never knowing a database exists. `AGENTS.md` and `.docs/rules/typed-code.md` repeat the old "no database or network knowledge" wording and must be corrected in the same work. The design comes from the conversation of 16 November 2026 with the project owner and is recorded as a decision.

## Acceptance checklist

- [x] New guide `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md` covers the runtime class, orchestrator pattern, `features/<capability>/` shape, persistence methods, dependency direction and migration order.
- [x] A decision record in `.docs/decisions/` captures the choice and the open questions.
- [x] `AGENTS.md`, `.docs/rules/typed-code.md` and the architecture README are corrected and link to the guide, and `ENGINE_JOB_MODEL.md` is marked superseded in part.
- [x] `task validate` passes and the guide labels everything as a proposal, not implemented.
