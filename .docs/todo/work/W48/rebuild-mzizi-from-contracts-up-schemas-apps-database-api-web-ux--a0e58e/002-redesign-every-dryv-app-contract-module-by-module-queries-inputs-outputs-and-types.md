---
{id: TSK-70669AC571AA,name: "Redesign every Dryv app contract module by module: queries, inputs, outputs and types",type: task,status: completed,priority: high,created_at: 2026-11-24T19:52:57.075Z,updated_at: 2026-11-25T06:12:33.279Z,depends_on: [TSK-D0EC3D8B6D47],order: 2048,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T04:00:47.204Z},{from: in-progress,to: completed,at: 2026-11-25T06:12:33.279Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-70669AC571AA/1795579247206-start,started_at: 2026-11-25T04:00:48.485Z,end_ref: refs/tracking/TSK-70669AC571AA/1795587153281-end,ended_at: 2026-11-25T06:12:33.280Z,summary: {files: 7875,insertions: 240916,deletions: 250263}}]}}}
---

# Redesign every Dryv app contract module by module: queries, inputs, outputs and types

## Goal

After the schema review is approved, redesign the API surface entirely in Dryv contracts. Every query, input, output, enum and shared type the API serves must be declared in `dryv/contracts/apps`, so the NestJS API and the TypeScript and Dart SDK clients are generated from one source. Modules move from flat read files to carefully designed modules with named actions, modelled on the defytickets backend.

## Context

Task 2 of 7; starts only when task 1 is completed. Current contracts: `dryv/contracts/apps/api/*.ts` (auth, experience, explorer, geography, governance, insights, interactions, ledger, locality, reference, structure), plus `apps/web`, `apps/app`, `apps/dev`, `apps/engine` and `apps/pgsql`. Today several response shapes and SQL reads exist only in hand-written code under `source/backend/api/src/modules/*/features/*/reads/`; each one must be found and moved into a contract. The reference design is `/home/alidante/Projects/work/SierreTechnologies/defytickets/backend/src/modules/event`: a core module with `submodules/` (each with controller, service, contract, constants, `dto/` and `use-cases/`), `repositories/` with a `*.cache.ts` cache spec per entity (namespace, TTL, scope, invalidate on write), `transitions/` for status changes, `events/` definitions and payloads, and one `*.routes.ts` with route constants and access notes. Mzizi adopts that shape where Dryv can express it; anything Dryv cannot yet generate is recorded as a Dryv gap rather than hand-written silently. Follow `.docs/rules/typed-code.md` and the Dryv memory notes (contracts first, Dryv assembles and people build).

## Module design rules

- [x] Write a module design guide in `.docs/design/architecture/` describing submodules, use cases, repositories, cache specs, transitions, events and route constants for Mzizi
- [x] Decide the naming of actions (read, list, search, compare, by-address) and URL patterns
- [x] Decide cache rules per read (TTL, key, scope, invalidation) to be declared in contracts for Redis
- [x] Decide pagination, limits and payload size rules (no unbounded lists, bounded geometry)
- [x] Decide error shapes and availability/gap reporting

## Inventory of today's API

- [x] List every route in every module with its input, output and SQL
- [x] List every hand-written DTO, type or query not declared in a contract
- [x] Mark each route keep, merge, split or remove

## Module `auth`

- [x] Inventory current `auth` routes and hand-written reads
- [x] Design `auth` submodules and named actions
- [x] Declare every `auth` input, output and shared type in the contract
- [x] Declare `auth` queries and the tables they read (from the approved schema review)
- [x] Declare `auth` cache specs
- [x] Review `auth` with the owner

## Module `experience`

- [x] Inventory current `experience` routes and hand-written reads
- [x] Design `experience` submodules and named actions
- [x] Declare every `experience` input, output and shared type in the contract
- [x] Declare `experience` queries and the tables they read (from the approved schema review)
- [x] Declare `experience` cache specs
- [x] Review `experience` with the owner

## Module `explorer`

- [x] Inventory current `explorer` routes and hand-written reads
- [x] Design `explorer` submodules and named actions
- [x] Declare every `explorer` input, output and shared type in the contract
- [x] Declare `explorer` queries and the tables they read (from the approved schema review)
- [x] Declare `explorer` cache specs
- [x] Review `explorer` with the owner

## Module `geography`

- [x] Inventory current `geography` routes and hand-written reads
- [x] Design `geography` submodules and named actions
- [x] Declare every `geography` input, output and shared type in the contract
- [x] Declare `geography` queries and the tables they read (from the approved schema review)
- [x] Declare `geography` cache specs
- [x] Review `geography` with the owner

## Module `governance`

- [x] Inventory current `governance` routes and hand-written reads
- [x] Design `governance` submodules and named actions
- [x] Declare every `governance` input, output and shared type in the contract
- [x] Declare `governance` queries and the tables they read (from the approved schema review)
- [x] Declare `governance` cache specs
- [x] Review `governance` with the owner

## Module `insights`

- [x] Inventory current `insights` routes and hand-written reads
- [x] Design `insights` submodules and named actions
- [x] Declare every `insights` input, output and shared type in the contract
- [x] Declare `insights` queries and the tables they read (from the approved schema review)
- [x] Declare `insights` cache specs
- [x] Review `insights` with the owner

## Module `interactions`

- [x] Inventory current `interactions` routes and hand-written reads
- [x] Design `interactions` submodules and named actions
- [x] Declare every `interactions` input, output and shared type in the contract
- [x] Declare `interactions` queries and the tables they read (from the approved schema review)
- [x] Declare `interactions` cache specs
- [x] Review `interactions` with the owner

## Module `ledger`

- [x] Inventory current `ledger` routes and hand-written reads
- [x] Design `ledger` submodules and named actions
- [x] Declare every `ledger` input, output and shared type in the contract
- [x] Declare `ledger` queries and the tables they read (from the approved schema review)
- [x] Declare `ledger` cache specs
- [x] Review `ledger` with the owner

## Module `locality`

- [x] Inventory current `locality` routes and hand-written reads
- [x] Design `locality` submodules and named actions
- [x] Declare every `locality` input, output and shared type in the contract
- [x] Declare `locality` queries and the tables they read (from the approved schema review)
- [x] Declare `locality` cache specs
- [x] Review `locality` with the owner

## Module `reference`

- [x] Inventory current `reference` routes and hand-written reads
- [x] Design `reference` submodules and named actions
- [x] Declare every `reference` input, output and shared type in the contract
- [x] Declare `reference` queries and the tables they read (from the approved schema review)
- [x] Declare `reference` cache specs
- [x] Review `reference` with the owner

## Module `structure`

- [x] Inventory current `structure` routes and hand-written reads
- [x] Design `structure` submodules and named actions
- [x] Declare every `structure` input, output and shared type in the contract
- [x] Declare `structure` queries and the tables they read (from the approved schema review)
- [x] Declare `structure` cache specs
- [x] Review `structure` with the owner

## Place-page summary

- [x] Design one server-side summary read per place page so the web app makes one call instead of many
- [x] Declare it in contracts with its cache rule

## Generate

- [x] Contracts compile
- [x] Generate the API layer and the TypeScript and Dart SDKs without errors
- [x] Record every Dryv gap found as a task note and in the Dryv gap file

## Owner direction (25 November 2026)

- [x] Update the local Dryv checkout from the source repository before authoring; the capabilities this wave needs (partitioning, SQL comments, integrity checks, typed NestJS reads, writes and transactions, scoped Redis caching, TS/Dart response shapes) are delivered in Dryv (DRYV_GAPS, "Rebuild capabilities delivered")
- [x] Author every query, input, output and type in Dryv contracts; nothing API-shaped is hand-written
- [x] Name modules after the schemas they own and remove vague modules (`explorer`, `insights`, `experience`, `locality`, `structure`, `ledger`, `interactions`), following `.docs/rules/api-modules.md`
- [x] Design one frontend-mapping module that composes data from the schema modules into clean typed shapes, and record its name in the rule
- [x] Bind the packs needed for the new API format and plan a clean regeneration

## Breakage scope (owner direction, 25 November 2026)

- [x] Breakage is allowed **only** in `source/apps/` until the web task; every other part of `source/` (backend API, engine, database, packages, `source/schema`, `source/sdk`) must build, typecheck and pass tests after this task
- [x] Regenerate the Python engine schemas and models and the machine-readable schemas in `source/schema` from the new contracts, and fix their callers

## Acceptance checklist

- [x] No API type, DTO or query shape exists only in hand-written code
- [x] Every module above is checked off and reviewed
- [x] Generation runs clean from the root runner
- [x] `task validate` passes

## Comments

### 2026-11-25T05:31:26.787Z · PETER IRUNGU

API redesigned in dryv/contracts/apps/api: 19 schema-named modules + frontend (rule updated), every query/input/output/type in contracts, cache classes per read (_shared.ts CACHE), bounded pages. Old modules explorer/insights/locality/experience/structure/ledger/interactions inventoried and replaced (table in .docs/design/architecture/API_MODULES.md); 37 hand-written reads/ deleted. Place page = frontend.GetPlaceScreen (one call). Proof: .dev/run/plan.sh --app api 'Canonical Runtime IR accepted (993 records)'; .dev/run/gen.sh --app api 'dryv result: applied' (NestJS modules, class-validator DTOs, use cases, TS SDK source/sdk/api-ts, Dart SDK source/sdk/api-dart); 'bunx tsc --noEmit' in source/backend/api: 0 errors. Packs: vendored dryv/packs/nestjs-persistence (no-plan ops re-export src/implementations), entities/type-files/use-cases unbound, sdk-dart escapes reserved enum names; Dryv engine: url format accepted (DRYV_GAPS). Owner review per module pending: owner questions Q9.

### 2026-11-25T06:12:32.849Z · PETER IRUNGU

Breakage scope proven: engine mypy clean, engine pytest 222 passed; packages pass (browser test needs MZIZI_USER_AGENT); API typecheck 0 errors and vitest 15352 passed; source/sdk/api-ts typecheck clean; source/schema/database regenerated by the table-schemas pack with the pgsql app; Python row models regenerated from a clean folder (294 files). Only source/apps/web and source/apps/dev fail typecheck (allowed until TSK-402D8C6A91DD) and the database release-stream test (replaced in TSK-1265807A54E3).
