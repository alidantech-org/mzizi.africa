---
{id: TSK-4CB307524034,name: Connect the NestJS API to PostgreSQL and the engine,type: task,status: planned,priority: medium,created_at: 2026-11-15T16:54:06.348Z,updated_at: 2026-11-15T16:54:06.348Z,order: 8192}
---

# Connect the NestJS API to PostgreSQL and the engine

## Goal

Give the NestJS API a direct PostgreSQL connection under the `mzizi_api` role with TypeORM entities derived from the Postgres contracts, remove its dependence on the database service, and add a typed client for the engine's internal HTTP API so the API can instruct the engine to run work. The API may write the schemas it owns, such as authentication and accountability.

## Context

`source/backend/api/src/database/write-database.ts` forwards named writes to `DATABASE_SERVICE_URL` with a token, and the existing modules under `src/modules` were generated from an earlier contract set; the current database application binds only the SQL pack, so TypeORM entities are not generated from `schemas/postgres`. The Dryv entity pack collides when one entity has two relations to the same target (many auth and audit contracts do). Decide whether to fix the pack, rename relations, or use plain id fields. The engine client calls an internal address with a service credential and never exposes engine credentials to browsers.

## Acceptance checklist

- [ ] TypeORM entities for the chosen Postgres schemas are generated from the contracts and the relation collision approach is documented.
- [ ] The API connects with the `mzizi_api` role, writes only the schemas it owns, and the database-service client is removed.
- [ ] A typed engine client starts a job and reads its status, with tests against a stub engine.
- [ ] The API typecheck and test suite pass, or each failure is reported with its cause.
