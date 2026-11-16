---
{id: TSK-4C1DEE9F5984,name: Add the EngineRuntime skeleton with typed configuration,type: task,status: planned,priority: medium,created_at: 2026-11-16T07:21:18.925Z,updated_at: 2026-11-16T07:21:18.925Z,order: 4096}
---

# Add the EngineRuntime skeleton with typed configuration

## Goal

Create the single runtime class that the design describes, without moving any capability yet. `EngineRuntime` takes a typed configuration, builds capabilities, exposes them as members, swaps immutable configuration snapshots with a generation number, and has a lifecycle (start, stop, health, drain) and an execution plan per capability. One stub capability proves the shape end to end, so later moves only add capabilities to something that already works.

## Context

The design is in `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md`. Scheduling ideas already exist in `executor.py` (queue, admission limits, retries, cancellation) and `capabilities.py` (named, versioned capabilities); the skeleton reuses their vocabulary and does not delete them yet. The runtime lives in the engine under a new folder, with frozen pydantic contracts, absolute imports, no `Any` and files within the size limit. It must not import any capability package except the stub.

## Acceptance checklist

- [ ] `EngineRuntime`, `RuntimeConfig`, the execution-plan contract and the capability protocol exist as typed contracts with tests.
- [ ] `reconfigure` swaps a snapshot and bumps the generation, and a running job keeps the snapshot it started with.
- [ ] Lifecycle methods and per-capability concurrency ceilings are tested with the stub capability.
- [ ] mypy strict, ruff and `bun run structure` pass; the README of the engine describes the runtime as the target entry point.
