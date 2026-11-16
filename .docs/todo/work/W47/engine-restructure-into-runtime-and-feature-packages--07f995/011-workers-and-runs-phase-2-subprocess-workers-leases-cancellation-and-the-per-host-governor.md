---
{id: TSK-BA70FC4E22AB,name: "Workers and runs, phase 2: subprocess workers, leases, cancellation and the per-host governor",type: task,status: completed,priority: medium,created_at: 2026-11-16T09:48:44.959Z,updated_at: 2026-11-16T11:33:34.917Z,order: 11264,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T11:16:27.981Z},{from: in-progress,to: completed,at: 2026-11-16T11:33:34.917Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-BA70FC4E22AB/1794827787983-start,started_at: 2026-11-16T11:16:28.232Z,end_ref: refs/tracking/TSK-BA70FC4E22AB/1794828814919-end,ended_at: 2026-11-16T11:33:34.917Z,summary: {files: 34,insertions: 1570,deletions: 60}}]}}}
---

---
{id: TSK-BA70FC4E22AB,name: "Workers and runs, phase 2: subprocess workers, leases, cancellation and the per-host governor",type: task,status: in-progress,priority: medium,created_at: 2026-11-16T09:48:44.959Z,updated_at: 2026-11-16T11:16:27.981Z,order: 11264,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T11:16:27.981Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-BA70FC4E22AB/1794827787983-start,started_at: 2026-11-16T11:16:28.232Z}]}}}
---

# Workers and runs, phase 2: subprocess workers, leases, cancellation and the per-host governor

## Goal

Let the engine spin many workers at once, each a subprocess executing one run, with leases, heartbeats, crash recovery from the last checkpoint, cooperative cancellation, admission control and a per-host governor shared by all workers so politeness limits hold across them.

## Context

Depends on phase 1. Design: `WORKERS_AND_RUNS.md` sections "Workers, concurrency and politeness" and "Run states". A worker is `mzizi-engine worker --run <id>`: it reads its spec from the ledger, so it can later run elsewhere unchanged. The runtime already has per-capability concurrency plans and a limiter; the executor already has retry, cancel and events; the downloads feature has a free-disk check. The governor must be injected into the crawler through a port the crawler defines (the crawler may not import Redis or Mongo). Redis runs locally on 127.0.0.1:6379 (optional config section `redis`); a Mongo lease collection is the fallback. Tests must use the loopback site, never a live site.

## Build

- [x] `RunSupervisor` in the runtime: spawn, track, reap and requeue; worker ceiling and free-disk admission check from config.
- [x] Lease and heartbeat in the ledger; an expired lease requeues the run from its last checkpoint; retries with backoff and a `failed` state with the reason.
- [x] Cooperative cancellation with a hard kill after a grace period; meaningful worker exit codes.
- [x] Per-host governor port in the crawler with in-memory, Redis and Mongo backends (token bucket, concurrency, daily budget); a refusal is a wait.
- [x] `mzizi-engine worker` command in `engine/cli`.

## Acceptance checklist

- [x] Two concurrent runs against the loopback site respect one shared host budget; a worker killed mid-run resumes from its checkpoint; a cancelled run stops and records it.
- [x] No unbounded process growth: tests show the ceiling holds and every spawned process is reaped.
- [x] Strict typing, boundaries 0, structure clean, existing suite unchanged or better, `task validate` passes, docs and the task note updated, test databases and containers cleaned up.

## Progress

Implemented and verified the HTTP subprocess path on develop, building on phase 1 commit `699cb7e0` and preserving the uncommitted service-key work. The supervisor claims work from the Mongo ledger, starts one worker in its own process group, checks per-operation and total capacity plus scratch disk space, and reaps exits. Workers heartbeat against the claim revision, record the stage cursor, and report success, retry, cancellation, or lost lease. Retry resumes at the first unfinished stage. The launcher sends a cooperative signal and kills a blocked process group after the configured grace period. The local run root has a supervisor lock and the scheduler counts live leases after restart. Deploy one supervisor per ledger.

Dryv generated the expanded worker run document and a host permit document for Mongo. Mongo is the default shared governor, Redis is optional, and in-memory state is available for single-process use. The governor shares token start spacing, in-flight permits and the daily budget by hostname. HTTP robots, status and redirects use permits through the crawl client, and stored watch downloads use them through the download transport. Permit wait observes cancellation. Browser and auto rendering are rejected at supervised submission because browser background traffic cannot currently be intercepted by this HTTP governor. Existing standalone browser operations remain available. The choice of production host limits and optional Redis endpoint is configuration, and the owner's local environment file was not edited.

Live loopback integration ran concurrent crawl and site-watch workers with a third run queued, under both Mongo and Redis. Each run completed, observed network concurrency peaked at one, and request-start spacing held. The crash test killed a worker after the first checkpoint, waited for its abandoned permit lease to expire, and verified that the first stage was fetched once. It also verified cancellation and reaping of a worker blocked on a socket. An expired run lease requeued and the old owner was fenced. The in-memory test verified that an exhausted daily budget waits until cancellation. The CLI smoke test exercised `supervise`, `submit-run`, `worker`, and `show-run` against a separate Mongo scratch database.

Verification: full pytest via `bun run check` passed 432 with six baseline skips using the local scratch Mongo and Redis opt-ins and bypassing the developer environment file. The focused host-governor tests rerun after adding the browser-admission assertion passed 2/2. Ruff lint and format, strict mypy and explicit run-test typechecks, Dryv generation/check, the structure check, `bun test scripts`, import boundaries (0), and Task validation passed. The root wrapper still fails the five pre-existing Dryv format checks and the dashboard canonical catalog test. Confirmed scratch Mongo databases and Redis keys were removed, and stopped the temporary Dryv server and all test subprocesses. Phase 3 was not started. No commits were made.
