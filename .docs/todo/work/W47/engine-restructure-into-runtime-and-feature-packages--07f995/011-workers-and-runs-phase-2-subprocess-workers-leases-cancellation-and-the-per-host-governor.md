---
{id: TSK-BA70FC4E22AB,name: "Workers and runs, phase 2: subprocess workers, leases, cancellation and the per-host governor",type: task,status: planned,priority: medium,created_at: 2026-11-16T09:48:44.959Z,updated_at: 2026-11-16T09:48:44.959Z,order: 11264}
---

# Workers and runs, phase 2: subprocess workers, leases, cancellation and the per-host governor

## Goal

Let the engine spin many workers at once, each a subprocess executing one run, with leases, heartbeats, crash recovery from the last checkpoint, cooperative cancellation, admission control and a per-host governor shared by all workers so politeness limits hold across them.

## Context

Depends on phase 1. Design: `WORKERS_AND_RUNS.md` sections "Workers, concurrency and politeness" and "Run states". A worker is `mzizi-engine worker --run <id>`: it reads its spec from the ledger, so it can later run elsewhere unchanged. The runtime already has per-capability concurrency plans and a limiter; the executor already has retry, cancel and events; the downloads feature has a free-disk check. The governor must be injected into the crawler through a port the crawler defines (the crawler may not import Redis or Mongo). Redis runs locally on 127.0.0.1:6379 (optional config section `redis`); a Mongo lease collection is the fallback. Tests must use the loopback site, never a live site.

## Build

- [ ] `RunSupervisor` in the runtime: spawn, track, reap and requeue; worker ceiling and free-disk admission check from config.
- [ ] Lease and heartbeat in the ledger; an expired lease requeues the run from its last checkpoint; retries with backoff and a `failed` state with the reason.
- [ ] Cooperative cancellation with a hard kill after a grace period; meaningful worker exit codes.
- [ ] Per-host governor port in the crawler with in-memory, Redis and Mongo backends (token bucket, concurrency, daily budget); a refusal is a wait.
- [ ] `mzizi-engine worker` command in `engine/cli`.

## Acceptance checklist

- [ ] Two concurrent runs against the loopback site respect one shared host budget; a worker killed mid-run resumes from its checkpoint; a cancelled run stops and records it.
- [ ] No unbounded process growth: tests show the ceiling holds and every spawned process is reaped.
- [ ] Strict typing, boundaries 0, structure clean, existing suite unchanged or better, `task validate` passes, docs and the task note updated, test databases and containers cleaned up.
