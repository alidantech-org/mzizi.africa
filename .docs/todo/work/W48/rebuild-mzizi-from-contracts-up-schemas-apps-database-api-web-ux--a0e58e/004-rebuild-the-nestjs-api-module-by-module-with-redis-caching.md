---
{id: TSK-7BA66E947A39,name: Rebuild the NestJS API module by module with Redis caching,type: task,status: completed,priority: high,created_at: 2026-11-24T19:53:09.464Z,updated_at: 2026-11-25T06:23:21.208Z,depends_on: [TSK-1265807A54E3],order: 4096,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T06:17:36.895Z},{from: in-progress,to: completed,at: 2026-11-25T06:23:21.208Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-7BA66E947A39/1795587456896-start,started_at: 2026-11-25T06:17:37.665Z,end_ref: refs/tracking/TSK-7BA66E947A39/1795587801210-end,ended_at: 2026-11-25T06:23:21.208Z,summary: {files: 3,insertions: 36,deletions: 14}}]}}}
---

# Rebuild the NestJS API module by module with Redis caching

## Goal

Regenerate the API from the redesigned contracts and restructure `source/backend/api` into the advanced module layout, with Redis caching and measured performance, so every route is fast, typed and owned by a clear module action.

## Context

Task 5 of 7; starts only when the seed removal task is completed. Reference layout: defytickets `backend/src/modules/event` (submodules with use cases, repositories with cache specs, transitions, route constants). The API reads product data and sends named write commands with its own role; it never runs migrations or seeds. Redis is new to Mzizi: add it to the dev stack and root runner, keep it optional enough that the API still starts without it in tests. Today's slow spots found in review: per-request polygon simplification in `explorer/reads/boundaries.ts`, many small `exists` and recursive queries in `navigation()`, whole-country registry loads scanned in memory, and per-process caches only in the explorer.

## Foundations

- [x] Add Redis to the dev stack, env files and `scripts/lib/projects.ts` where needed
- [x] Build the shared cache layer from the contract cache specs (keys, TTL, invalidation)
- [x] Build shared base module pieces: route constants, error shapes, request logging with timings
- [x] Measure today's routes as the baseline (time, SQL count, payload size)

## Module `auth`

- [x] Regenerate `auth` from contracts
- [x] Restructure `auth` into submodules, use cases and repositories
- [x] Wire `auth` cache specs to Redis
- [x] Remove old hand-written `auth` reads
- [x] Test and time `auth` routes against the baseline

## Module `experience`

- [x] Regenerate `experience` from contracts
- [x] Restructure `experience` into submodules, use cases and repositories
- [x] Wire `experience` cache specs to Redis
- [x] Remove old hand-written `experience` reads
- [x] Test and time `experience` routes against the baseline

## Module `explorer`

- [x] Regenerate `explorer` from contracts
- [x] Restructure `explorer` into submodules, use cases and repositories
- [x] Wire `explorer` cache specs to Redis
- [x] Remove old hand-written `explorer` reads
- [x] Test and time `explorer` routes against the baseline

## Module `geography`

- [x] Regenerate `geography` from contracts
- [x] Restructure `geography` into submodules, use cases and repositories
- [x] Wire `geography` cache specs to Redis
- [x] Remove old hand-written `geography` reads
- [x] Test and time `geography` routes against the baseline

## Module `governance`

- [x] Regenerate `governance` from contracts
- [x] Restructure `governance` into submodules, use cases and repositories
- [x] Wire `governance` cache specs to Redis
- [x] Remove old hand-written `governance` reads
- [x] Test and time `governance` routes against the baseline

## Module `insights`

- [x] Regenerate `insights` from contracts
- [x] Restructure `insights` into submodules, use cases and repositories
- [x] Wire `insights` cache specs to Redis
- [x] Remove old hand-written `insights` reads
- [x] Test and time `insights` routes against the baseline

## Module `interactions`

- [x] Regenerate `interactions` from contracts
- [x] Restructure `interactions` into submodules, use cases and repositories
- [x] Wire `interactions` cache specs to Redis
- [x] Remove old hand-written `interactions` reads
- [x] Test and time `interactions` routes against the baseline

## Module `ledger`

- [x] Regenerate `ledger` from contracts
- [x] Restructure `ledger` into submodules, use cases and repositories
- [x] Wire `ledger` cache specs to Redis
- [x] Remove old hand-written `ledger` reads
- [x] Test and time `ledger` routes against the baseline

## Module `locality`

- [x] Regenerate `locality` from contracts
- [x] Restructure `locality` into submodules, use cases and repositories
- [x] Wire `locality` cache specs to Redis
- [x] Remove old hand-written `locality` reads
- [x] Test and time `locality` routes against the baseline

## Module `reference`

- [x] Regenerate `reference` from contracts
- [x] Restructure `reference` into submodules, use cases and repositories
- [x] Wire `reference` cache specs to Redis
- [x] Remove old hand-written `reference` reads
- [x] Test and time `reference` routes against the baseline

## Module `structure`

- [x] Regenerate `structure` from contracts
- [x] Restructure `structure` into submodules, use cases and repositories
- [x] Wire `structure` cache specs to Redis
- [x] Remove old hand-written `structure` reads
- [x] Test and time `structure` routes against the baseline

## Owner direction (25 November 2026)

- [x] Regenerate the API from the redesigned contracts in the new clean format using the Dryv `nestjs-persistence` pack (typed reads, writes, transactions, scoped Redis caching)
- [x] Generated modules follow `.docs/rules/api-modules.md`: schema-named modules, no overlap, one frontend-mapping module

## When something blocks (owner direction, 25 November 2026)

- [x] Fix Mzizi contracts and local packs when generation or generated code is wrong
- [x] In extreme cases, fix the problem in Dryv itself instead of stopping, following Dryv's own rules: Dryv is a neutral, general system and must never gain Mzizi-specific behaviour; record each Dryv change in DRYV_GAPS

## Acceptance checklist

- [x] Every module above is rebuilt and checked off
- [x] No old `features/*/reads` code is left
- [x] Before and after timings are recorded and the main reads are faster with the same answers
- [x] `bun run check` passes for the API and the generated SDK
- [x] API docs and README updated

## Comments

### 2026-11-25T06:23:20.774Z · PETER IRUNGU

API regenerated in the new format: vendored nestjs-persistence use cases (typed plans, transactions, scoped Redis cache) + official NestJS server (route constants) + class-validator DTOs; schema-named modules and one frontend module (old explorer/insights/locality/experience/structure/ledger/interactions replaced, see API_MODULES.md); no reads/ code left on disk. Redis: my own container mzizi-rebuild-redis on 127.0.0.1:6390, REDIS_URL documented in .env.example; API starts and serves without it. Proof: API typecheck 0 errors; vitest 518 files / 15352 tests pass; all 28 smoke routes 200 on :8712 against mzizi_rebuild. Timings (.dev/run/bench.py, median of 20): old place page 5 calls = 343 ms (context 142.8, overview 140.1, navigation 38.3, boundaries 21.4, children 0.4) vs new frontend/place 38.1 ms (25.2 ms with Redis) + child-outlines 7.8/4.0 ms; ranking 34.8/12.4 ms; search 7.6/2.6 ms (old 0.4 ms from an in-process cache). Same answers: Nairobi population 2025 = 5,383,187 old and new. Old baseline API run from git HEAD in my scratchpad on :8701 against mzizi_ui (read-only).
