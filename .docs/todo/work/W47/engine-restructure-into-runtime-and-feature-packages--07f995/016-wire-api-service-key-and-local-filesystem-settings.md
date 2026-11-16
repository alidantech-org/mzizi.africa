---
{id: TSK-665DE7B8C580,name: Wire API service key and local filesystem settings,type: task,status: completed,priority: medium,created_at: 2026-11-16T11:08:14.800Z,updated_at: 2026-11-16T11:11:29.802Z,order: 16384,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T11:08:49.469Z},{from: in-progress,to: completed,at: 2026-11-16T11:11:29.802Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-665DE7B8C580/1794827329471-start,started_at: 2026-11-16T11:08:49.702Z,end_ref: refs/tracking/TSK-665DE7B8C580/1794827489803-end,ended_at: 2026-11-16T11:11:29.802Z,summary: {files: 12,insertions: 97,deletions: 35}}]}}}
---

# Wire the main API to the engine with a service key

## Goal

Configure the existing local environment so the main API can authenticate to the engine with one generated bearer key. The engine should start and accept legitimate internal requests with no dependency on the old database-service authority. Make the environment's filesystem settings agree with the documented object store and folder layout.

## Context

The old HTTP runtime checks the shared token only at the compute activity endpoint, while its normal job routes depend on OIDC and a removed service. The existing Dryv engine contract calls for a single service key and leaves end-user decisions to the main API. Add a narrow service mode and server-side client without changing the public API routes or their authentication. Configure the documented bucket and private temporary root without mutating bucket contents. Use a local Mongo log TTL and preserve the permanent run summary. This task is independent of subprocess workers.

## Acceptance checklist

- [x] Generate a key with OpenSSL, configure the ignored environment, and verify that protected engine endpoints reject absent and incorrect keys.
- [x] Verify a genuine main API client call against the engine in service mode, and typecheck both implementations.
- [x] Configure the existing filesystem backend and document the public and private layout, the chosen log TTL, and what was verified.

## Comments

### 2026-11-16T11:11:29.226Z · PETER IRUNGU

Configured service mode with an OpenSSL-generated 32-byte key, shared via the ignored root .env, and an internal NestJS EngineClient. The key protects jobs, runs and capabilities without requiring the removed OIDC authority in service mode. Live loopback proved missing key 401, wrong key 403, valid capabilities 200, and job submission 202. The local log TTL was set to 30 days. Configured bucket mzizi, staging private/tmp/, reserved root tmp, no additional immutable prefixes, and the documented public origin and signing host. Verified access-prefix behavior and presigned URL shape offline without contacting the bucket. Passed 20 engine tests, 3,311 NestJS tests (15 todo), API/Python typechecks, Ruff, structure, boundaries and Task validation. Stopped the loopback engine. Phase 2 remains planned.
