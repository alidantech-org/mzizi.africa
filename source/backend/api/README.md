# Product API (NestJS)

`source/backend/api` is the NestJS HTTP API for the public, research and mobile clients. It exposes domain and review endpoints. Product reads use the API's read-only database role; authorized writes are sent to named operations in [`../database/README.md`](../database/README.md). The API does not apply migrations, load seeds, scrape sources, extract documents or manage object bytes.

Most controllers, DTOs, entities and contract-facing types are generated from authored contracts in repository-root [`dryv/`](../../../dryv/README.md). Hand-written use cases, service implementations and auth/read helpers are maintained in this project. See [`dryv/README.md`](../../../dryv/README.md) for generation and verification commands.

## Local development

The API listens on port `3000` by default. Start the local database and API through the repository-root runner; [`scripts/README.md`](../../../scripts/README.md) documents database setup, roles, environment variables and service commands. Do not use archived Python API commands.

The API uses `DATABASE_URL` for product reads and `DATABASE_SERVICE_URL` plus a service token for named writes. Authentication policies are exported from Dryv contracts and enforced by the API's guards. Protected routes fail closed when authentication is not configured.

## Checks

From this directory, the project provides `bun run typecheck` and `bun run test`. PostgreSQL integration suites require a configured `TEST_DATABASE_URL`; see the root command guide before running the full repository checks.

The inherited Python API is historical under `.docs/_archives/2026-11-08-rewrite-snapshot/`, not at `source/backend/api-legacy`.
