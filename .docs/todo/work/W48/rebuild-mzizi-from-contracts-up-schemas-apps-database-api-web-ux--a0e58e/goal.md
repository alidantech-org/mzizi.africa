---
{id: GOAL-GRP-1E8DA9A0E58E,name: "Rebuild Mzizi from contracts up: schemas, apps, database, API, web, UX goal",type: documentation,extra: {created_at: 2026-11-24T19:52:40.258Z,group: GRP-1E8DA9A0E58E}}
---

# Goal: rebuild Mzizi from the contracts up — schemas, API, then a fast web app

## Why this wave exists

The civic web app (`source/apps/web`) has grown screen by screen on top of a database and API that were designed quickly. Pages are slow, the NestJS modules are thin read files rather than designed modules, and some queries and response shapes live only in hand-written TypeScript instead of the Dryv contracts. Before more screens are built, the whole stack is revisited in one ordered pass so that every later step stands on a deliberate design.

## What this wave achieves

1. Every PostgreSQL schema in `dryv/contracts/schemas/postgres` is reviewed table by table, its connections understood, and an ERD drawn for it.
2. Every API surface in `dryv/contracts/apps` is redesigned module by module: all queries, inputs, outputs and types are declared in Dryv contracts, nothing is defined only in hand-written code.
3. The database schemas are regenerated and restarted from the reviewed contracts, with clean migrations and the dev data reloaded.
4. The NestJS API is regenerated and its modules restructured into the advanced layout used in defytickets (submodules, use cases, repositories, cache specs, transitions, route constants), with Redis caching.
5. The generated TypeScript SDK client is the only way the web app talks to the API.
6. The web app is redesigned for the problem Mzizi solves, server-rendered by default with almost no client fetches, and measurably faster.
7. Finally the UI and UX are revisited for usability.

## How success is measured

- Every schema has an approved review note and an ERD; every table has been checked off.
- `bun run check` passes; the API and SDK are generated from contracts with no hand-written DTO left over.
- Each main web page is measured before and after (server time, number of API calls, payload size) and is faster afterwards without changing the answer.
- Work happened in order: schemas, apps, database, API, frontend, UI/UX.
