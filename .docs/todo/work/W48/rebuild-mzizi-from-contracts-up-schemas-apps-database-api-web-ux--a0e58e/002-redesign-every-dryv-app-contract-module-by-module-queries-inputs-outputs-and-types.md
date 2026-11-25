---
{id: TSK-70669AC571AA,name: "Redesign every Dryv app contract module by module: queries, inputs, outputs and types",type: task,status: planned,priority: high,created_at: 2026-11-24T19:52:57.075Z,updated_at: 2026-11-24T19:52:57.075Z,depends_on: [TSK-D0EC3D8B6D47],order: 2048}
---

# Redesign every Dryv app contract module by module: queries, inputs, outputs and types

## Goal

After the schema review is approved, redesign the API surface entirely in Dryv contracts. Every query, input, output, enum and shared type the API serves must be declared in `dryv/contracts/apps`, so the NestJS API and the TypeScript and Dart SDK clients are generated from one source. Modules move from flat read files to carefully designed modules with named actions, modelled on the defytickets backend.

## Context

Task 2 of 7; starts only when task 1 is completed. Current contracts: `dryv/contracts/apps/api/*.ts` (auth, experience, explorer, geography, governance, insights, interactions, ledger, locality, reference, structure), plus `apps/web`, `apps/app`, `apps/dev`, `apps/engine` and `apps/pgsql`. Today several response shapes and SQL reads exist only in hand-written code under `source/backend/api/src/modules/*/features/*/reads/`; each one must be found and moved into a contract. The reference design is `/home/alidante/Projects/work/SierreTechnologies/defytickets/backend/src/modules/event`: a core module with `submodules/` (each with controller, service, contract, constants, `dto/` and `use-cases/`), `repositories/` with a `*.cache.ts` cache spec per entity (namespace, TTL, scope, invalidate on write), `transitions/` for status changes, `events/` definitions and payloads, and one `*.routes.ts` with route constants and access notes. Mzizi adopts that shape where Dryv can express it; anything Dryv cannot yet generate is recorded as a Dryv gap rather than hand-written silently. Follow `.docs/rules/typed-code.md` and the Dryv memory notes (contracts first, Dryv assembles and people build).

## Module design rules

- [ ] Write a module design guide in `.docs/design/architecture/` describing submodules, use cases, repositories, cache specs, transitions, events and route constants for Mzizi
- [ ] Decide the naming of actions (read, list, search, compare, by-address) and URL patterns
- [ ] Decide cache rules per read (TTL, key, scope, invalidation) to be declared in contracts for Redis
- [ ] Decide pagination, limits and payload size rules (no unbounded lists, bounded geometry)
- [ ] Decide error shapes and availability/gap reporting

## Inventory of today's API

- [ ] List every route in every module with its input, output and SQL
- [ ] List every hand-written DTO, type or query not declared in a contract
- [ ] Mark each route keep, merge, split or remove

## Module `auth`

- [ ] Inventory current `auth` routes and hand-written reads
- [ ] Design `auth` submodules and named actions
- [ ] Declare every `auth` input, output and shared type in the contract
- [ ] Declare `auth` queries and the tables they read (from the approved schema review)
- [ ] Declare `auth` cache specs
- [ ] Review `auth` with the owner

## Module `experience`

- [ ] Inventory current `experience` routes and hand-written reads
- [ ] Design `experience` submodules and named actions
- [ ] Declare every `experience` input, output and shared type in the contract
- [ ] Declare `experience` queries and the tables they read (from the approved schema review)
- [ ] Declare `experience` cache specs
- [ ] Review `experience` with the owner

## Module `explorer`

- [ ] Inventory current `explorer` routes and hand-written reads
- [ ] Design `explorer` submodules and named actions
- [ ] Declare every `explorer` input, output and shared type in the contract
- [ ] Declare `explorer` queries and the tables they read (from the approved schema review)
- [ ] Declare `explorer` cache specs
- [ ] Review `explorer` with the owner

## Module `geography`

- [ ] Inventory current `geography` routes and hand-written reads
- [ ] Design `geography` submodules and named actions
- [ ] Declare every `geography` input, output and shared type in the contract
- [ ] Declare `geography` queries and the tables they read (from the approved schema review)
- [ ] Declare `geography` cache specs
- [ ] Review `geography` with the owner

## Module `governance`

- [ ] Inventory current `governance` routes and hand-written reads
- [ ] Design `governance` submodules and named actions
- [ ] Declare every `governance` input, output and shared type in the contract
- [ ] Declare `governance` queries and the tables they read (from the approved schema review)
- [ ] Declare `governance` cache specs
- [ ] Review `governance` with the owner

## Module `insights`

- [ ] Inventory current `insights` routes and hand-written reads
- [ ] Design `insights` submodules and named actions
- [ ] Declare every `insights` input, output and shared type in the contract
- [ ] Declare `insights` queries and the tables they read (from the approved schema review)
- [ ] Declare `insights` cache specs
- [ ] Review `insights` with the owner

## Module `interactions`

- [ ] Inventory current `interactions` routes and hand-written reads
- [ ] Design `interactions` submodules and named actions
- [ ] Declare every `interactions` input, output and shared type in the contract
- [ ] Declare `interactions` queries and the tables they read (from the approved schema review)
- [ ] Declare `interactions` cache specs
- [ ] Review `interactions` with the owner

## Module `ledger`

- [ ] Inventory current `ledger` routes and hand-written reads
- [ ] Design `ledger` submodules and named actions
- [ ] Declare every `ledger` input, output and shared type in the contract
- [ ] Declare `ledger` queries and the tables they read (from the approved schema review)
- [ ] Declare `ledger` cache specs
- [ ] Review `ledger` with the owner

## Module `locality`

- [ ] Inventory current `locality` routes and hand-written reads
- [ ] Design `locality` submodules and named actions
- [ ] Declare every `locality` input, output and shared type in the contract
- [ ] Declare `locality` queries and the tables they read (from the approved schema review)
- [ ] Declare `locality` cache specs
- [ ] Review `locality` with the owner

## Module `reference`

- [ ] Inventory current `reference` routes and hand-written reads
- [ ] Design `reference` submodules and named actions
- [ ] Declare every `reference` input, output and shared type in the contract
- [ ] Declare `reference` queries and the tables they read (from the approved schema review)
- [ ] Declare `reference` cache specs
- [ ] Review `reference` with the owner

## Module `structure`

- [ ] Inventory current `structure` routes and hand-written reads
- [ ] Design `structure` submodules and named actions
- [ ] Declare every `structure` input, output and shared type in the contract
- [ ] Declare `structure` queries and the tables they read (from the approved schema review)
- [ ] Declare `structure` cache specs
- [ ] Review `structure` with the owner

## Place-page summary

- [ ] Design one server-side summary read per place page so the web app makes one call instead of many
- [ ] Declare it in contracts with its cache rule

## Generate

- [ ] Contracts compile
- [ ] Generate the API layer and the TypeScript and Dart SDKs without errors
- [ ] Record every Dryv gap found as a task note and in the Dryv gap file

## Owner direction (25 November 2026)

- [ ] Update the local Dryv checkout from the source repository before authoring; the capabilities this wave needs (partitioning, SQL comments, integrity checks, typed NestJS reads, writes and transactions, scoped Redis caching, TS/Dart response shapes) are delivered in Dryv (DRYV_GAPS, "Rebuild capabilities delivered")
- [ ] Author every query, input, output and type in Dryv contracts; nothing API-shaped is hand-written
- [ ] Name modules after the schemas they own and remove vague modules (`explorer`, `insights`, `experience`, `locality`, `structure`, `ledger`, `interactions`), following `.docs/rules/api-modules.md`
- [ ] Design one frontend-mapping module that composes data from the schema modules into clean typed shapes, and record its name in the rule
- [ ] Bind the packs needed for the new API format and plan a clean regeneration

## Acceptance checklist

- [ ] No API type, DTO or query shape exists only in hand-written code
- [ ] Every module above is checked off and reviewed
- [ ] Generation runs clean from the root runner
- [ ] `task validate` passes
