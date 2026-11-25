# Product API (NestJS)

`source/backend/api` is the NestJS HTTP API for the public, research and mobile clients. It exposes domain and review endpoints. The API connects directly to PostgreSQL through its TypeORM data source and dedicated role. The API does not apply migrations, load seeds, scrape sources, extract documents or manage object bytes.

Modules are named after the schemas they read, plus one composition module, `frontend` ([API modules](../../../.docs/design/architecture/API_MODULES.md)). Controllers, DTOs, route constants and one use case per query-bound operation are generated from the contracts in [`dryv/`](../../../dryv/README.md); use cases execute typed plans through the persistence runtime in `src/database/persistence/` (generated) wired by `src/database/database.module.ts` (project-owned). Operations without a query are implemented by hand in `src/implementations/` (the `frontend` screens, the point lookup and view counting).

## Local development

The API listens on port `8700` by default. Start the local database and API through the repository-root runner; [`scripts/README.md`](../../../scripts/README.md) documents database setup, roles, environment variables and service commands. Do not use archived Python API commands.

The API configures PostgreSQL with `DATABASE_URL` and, optionally, Redis with `REDIS_URL` (scoped cache: keys include store, operation, inputs and principal; writes bump the operation's cache generation after commit). The Bun [database CLI](../database/README.md) owns migrations and role provisioning. No sign-in is resolved yet, so operations behind a policy fail closed.

## Checks

From this directory, the project provides `bun run typecheck` and `bun run test`. PostgreSQL integration suites require a configured `TEST_DATABASE_URL`; see the root command guide before running the full repository checks.

The inherited Python API is historical under `.docs/_archives/2026-11-08-rewrite-snapshot/`, not at `source/backend/api-legacy`.


## Internal engine client

NestJS modules that send engine requests can import `EngineModule` and inject `EngineClient`. Set `ENGINE_URL` to the internal engine address and use the same `ENGINE_SERVICE_TOKEN` as the engine in service mode. Apply product authorization before calling the engine. The client sends the bearer key from the server and refuses redirects.

The [developer portal design](../../../.docs/design/architecture/DEVELOPER_PORTAL.md) describes the planned server-side bridge for authorized engine jobs, run artifacts and drafts.

## Performance (25 November 2026)

Measured with `.dev/run/bench.py` (20 sequential requests after a warm-up, median), the old API on the old dev database (`mzizi_ui`) against the rebuilt API on `mzizi_rebuild` (seeded from the same data):

| Screen | Before | After, no cache | After, Redis |
|---|---|---|---|
| Place page (Nairobi) | 5 calls: context 142.8, navigation 38.3, children 0.4, boundaries 21.4, overview 140.1 = 343 ms | 1 call `frontend/place` 38.1 ms + map `geography/child-outlines` 7.8 ms | 25.2 ms + 4.0 ms |
| Place search ("Nai") | 0.4 ms (old in-process cache) | 7.6 ms | 2.6 ms |
| County ranking (population) | no equivalent read | 34.8 ms | 12.4 ms |
| Home (countries and languages) | no equivalent read | 34.8 ms | 30.3 ms |

The same answers were checked on the same data (Nairobi population 2025: 5,383,187 in both). Old reads simplified polygons per request; the new map reads prepared outlines.
