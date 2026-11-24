---
{id: TSK-4C1DEE9F5984,name: Add the EngineRuntime skeleton with typed configuration,type: task,status: archived,priority: medium,created_at: 2026-11-16T07:21:18.925Z,updated_at: 2026-11-24T19:24:18.735Z,order: 4096,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T07:25:00.601Z},{from: in-progress,to: completed,at: 2026-11-16T07:27:59.912Z},{from: completed,to: archived,at: 2026-11-24T19:24:18.735Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-4C1DEE9F5984/1794813900602-start,started_at: 2026-11-16T07:25:00.820Z,end_ref: refs/tracking/TSK-4C1DEE9F5984/1794814079922-end,ended_at: 2026-11-16T07:27:59.913Z,summary: {files: 15,insertions: 703,deletions: 0}}]}},archived_at: 2026-11-24T19:25:23.410Z}
---

# Add the EngineRuntime skeleton with typed configuration

## Goal

Create the single runtime class that the design describes, without moving any capability yet. `EngineRuntime` takes a typed configuration, builds capabilities, exposes them as members, swaps immutable configuration snapshots with a generation number, and has a lifecycle (start, stop, health, drain) and an execution plan per capability. One stub capability proves the shape end to end, so later moves only add capabilities to something that already works.

## Context

The design is in `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md`. Scheduling ideas already exist in `executor.py` (queue, admission limits, retries, cancellation) and `capabilities.py` (named, versioned capabilities); the skeleton reuses their vocabulary and does not delete them yet. The runtime lives in the engine under a new folder, with frozen pydantic contracts, absolute imports, no `Any` and files within the size limit. It must not import any capability package except the stub.

## Acceptance checklist

- [x] `EngineRuntime`, `RuntimeConfig`, the execution-plan contract and the capability protocol exist as typed contracts with tests.
- [x] `reconfigure` swaps a snapshot and bumps the generation, and a running job keeps the snapshot it started with.
- [x] Lifecycle methods and per-capability concurrency ceilings are tested with the stub capability.
- [x] mypy strict, ruff and `bun run structure` pass; the README of the engine describes the runtime as the target entry point.

## Progress

Added `mzizi_engine.runtime` (13 source files, all under 120 lines, mypy strict with no override): `EngineRuntime`, `RuntimeConfig`, `ExecutionPlan` and `Exposure`, `CapabilityConfig`, `ConfigSnapshot` with generation numbers, typed `CapabilityRef` and `Lease` handles, a resizable `Limiter`, `CancellationToken`, health contracts and named errors. A job always receives the snapshot current when it began; `reconfigure` never changes it. Eleven tests with a stub capability cover snapshots, ceilings, replan, exposure, lifecycle order, failed start rollback, cancellation, drain and health. `ruff`, `mypy` and the new tests pass; `bun run boundaries` still reports 70 violations (none new); `bun run structure` still reports its three earlier problems.

Not done, by design: job run timeouts, a process-worker plan for CPU-bound capabilities, and the persistence binding contract. They are the next runtime tasks. Plan fields have no defaults on purpose, so each capability must state its own ceiling.
