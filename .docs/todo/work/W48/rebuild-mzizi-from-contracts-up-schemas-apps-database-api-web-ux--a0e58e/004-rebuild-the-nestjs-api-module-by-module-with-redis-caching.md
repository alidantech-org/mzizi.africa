---
{id: TSK-7BA66E947A39,name: Rebuild the NestJS API module by module with Redis caching,type: task,status: planned,priority: high,created_at: 2026-11-24T19:53:09.464Z,updated_at: 2026-11-24T20:02:07.861Z,depends_on: [TSK-6065C44E5476],order: 4096}
---

# Rebuild the NestJS API module by module with Redis caching

## Goal

Regenerate the API from the redesigned contracts and restructure `source/backend/api` into the advanced module layout, with Redis caching and measured performance, so every route is fast, typed and owned by a clear module action.

## Context

Task 5 of 7; starts only when the seed removal task is completed. Reference layout: defytickets `backend/src/modules/event` (submodules with use cases, repositories with cache specs, transitions, route constants). The API reads product data and sends named write commands with its own role; it never runs migrations or seeds. Redis is new to Mzizi: add it to the dev stack and root runner, keep it optional enough that the API still starts without it in tests. Today's slow spots found in review: per-request polygon simplification in `explorer/reads/boundaries.ts`, many small `exists` and recursive queries in `navigation()`, whole-country registry loads scanned in memory, and per-process caches only in the explorer.

## Foundations

- [ ] Add Redis to the dev stack, env files and `scripts/lib/projects.ts` where needed
- [ ] Build the shared cache layer from the contract cache specs (keys, TTL, invalidation)
- [ ] Build shared base module pieces: route constants, error shapes, request logging with timings
- [ ] Measure today's routes as the baseline (time, SQL count, payload size)

## Module `auth`

- [ ] Regenerate `auth` from contracts
- [ ] Restructure `auth` into submodules, use cases and repositories
- [ ] Wire `auth` cache specs to Redis
- [ ] Remove old hand-written `auth` reads
- [ ] Test and time `auth` routes against the baseline

## Module `experience`

- [ ] Regenerate `experience` from contracts
- [ ] Restructure `experience` into submodules, use cases and repositories
- [ ] Wire `experience` cache specs to Redis
- [ ] Remove old hand-written `experience` reads
- [ ] Test and time `experience` routes against the baseline

## Module `explorer`

- [ ] Regenerate `explorer` from contracts
- [ ] Restructure `explorer` into submodules, use cases and repositories
- [ ] Wire `explorer` cache specs to Redis
- [ ] Remove old hand-written `explorer` reads
- [ ] Test and time `explorer` routes against the baseline

## Module `geography`

- [ ] Regenerate `geography` from contracts
- [ ] Restructure `geography` into submodules, use cases and repositories
- [ ] Wire `geography` cache specs to Redis
- [ ] Remove old hand-written `geography` reads
- [ ] Test and time `geography` routes against the baseline

## Module `governance`

- [ ] Regenerate `governance` from contracts
- [ ] Restructure `governance` into submodules, use cases and repositories
- [ ] Wire `governance` cache specs to Redis
- [ ] Remove old hand-written `governance` reads
- [ ] Test and time `governance` routes against the baseline

## Module `insights`

- [ ] Regenerate `insights` from contracts
- [ ] Restructure `insights` into submodules, use cases and repositories
- [ ] Wire `insights` cache specs to Redis
- [ ] Remove old hand-written `insights` reads
- [ ] Test and time `insights` routes against the baseline

## Module `interactions`

- [ ] Regenerate `interactions` from contracts
- [ ] Restructure `interactions` into submodules, use cases and repositories
- [ ] Wire `interactions` cache specs to Redis
- [ ] Remove old hand-written `interactions` reads
- [ ] Test and time `interactions` routes against the baseline

## Module `ledger`

- [ ] Regenerate `ledger` from contracts
- [ ] Restructure `ledger` into submodules, use cases and repositories
- [ ] Wire `ledger` cache specs to Redis
- [ ] Remove old hand-written `ledger` reads
- [ ] Test and time `ledger` routes against the baseline

## Module `locality`

- [ ] Regenerate `locality` from contracts
- [ ] Restructure `locality` into submodules, use cases and repositories
- [ ] Wire `locality` cache specs to Redis
- [ ] Remove old hand-written `locality` reads
- [ ] Test and time `locality` routes against the baseline

## Module `reference`

- [ ] Regenerate `reference` from contracts
- [ ] Restructure `reference` into submodules, use cases and repositories
- [ ] Wire `reference` cache specs to Redis
- [ ] Remove old hand-written `reference` reads
- [ ] Test and time `reference` routes against the baseline

## Module `structure`

- [ ] Regenerate `structure` from contracts
- [ ] Restructure `structure` into submodules, use cases and repositories
- [ ] Wire `structure` cache specs to Redis
- [ ] Remove old hand-written `structure` reads
- [ ] Test and time `structure` routes against the baseline

## Owner direction (25 November 2026)

- [ ] Regenerate the API from the redesigned contracts in the new clean format using the Dryv `nestjs-persistence` pack (typed reads, writes, transactions, scoped Redis caching)
- [ ] Generated modules follow `.docs/rules/api-modules.md`: schema-named modules, no overlap, one frontend-mapping module

## Acceptance checklist

- [ ] Every module above is rebuilt and checked off
- [ ] No old `features/*/reads` code is left
- [ ] Before and after timings are recorded and the main reads are faster with the same answers
- [ ] `bun run check` passes for the API and the generated SDK
- [ ] API docs and README updated
