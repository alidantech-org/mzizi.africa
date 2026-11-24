---
{id: TSK-7C408B6B4D4B,name: Design and prove isolated engine scripting workspaces,type: task,status: archived,priority: medium,created_at: 2026-11-17T07:36:52.614Z,updated_at: 2026-11-24T19:25:17.138Z,order: 30720,depends_on: [TSK-583968232F6B],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T08:28:19.256Z},{from: in-progress,to: completed,at: 2026-11-17T11:57:02.274Z},{from: completed,to: archived,at: 2026-11-24T19:25:17.138Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-7C408B6B4D4B/1794904099259-start,started_at: 2026-11-17T08:28:20.143Z,end_ref: refs/tracking/TSK-7C408B6B4D4B/1794916622277-end,ended_at: 2026-11-17T11:57:02.275Z,summary: {files: 288,insertions: 7327,deletions: 417}}]}},archived_at: 2026-11-24T19:25:25.495Z}
---

# Design and prove isolated engine scripting workspaces

## Goal

Allow the engine to run data-preparation scripts in a workspace shared by authorized clients, preserving the inputs and outputs necessary to inspect, reproduce or continue a draft.

## Context

The portal design calls for Python and Bash with read-only evidence, writable drafts and no production credentials. The engine currently has job execution but no script execution boundary. Before shipping execution, choose and test process isolation, resource and cancellation limits, artifact and output scoping, and how revisions are attributed. The first use case is bounded transformation of an existing CSV or extracted table. Acquisition continues through approved engine operations, and script output is a research artifact that needs independent validation. This is an engine-only task and does not build a user interface.

## Acceptance checklist

- [x] Record the workspace authorization and isolation model with reproducible input and output records.
- [x] Expose typed job and result contracts with cancellation and durable logs.
- [x] Demonstrate isolation, bounds and reviewable outputs on an engine-only fixture.

## Comments

### 2026-11-17T11:57:01.955Z · PETER IRUNGU

Verified: runtime tests pass (19) and the Docker isolation test passes against a local image with Python 3 and Bash.
