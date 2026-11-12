# Research and stewardship dashboard

`source/apps/web` is a Next.js/TypeScript application with two distinct sets of screens:

- `/review/*` is the Mzizi review workbench. Its server-side API client defaults to the NestJS product API at `http://127.0.0.1:3000`. It includes pages for assessments, candidates, captures, checks, data records, documents, jobs, runs, sites and site structures.
- `/admin/*` contains inherited Katiba Book / political-finance administration screens. These still use the legacy `SERVER_URL` integration and are not evidence that a corresponding active backend service lives in this repository.

The app uses Bun and runs on port `3100`. Use the repository-root commands and environment setup in [`../../../scripts/README.md`](../../../scripts/README.md); the app-specific development sign-in helper is `bun run dev:env` from this directory. Do not use the old `source/backend/engine/database` path: database operations are owned by [`source/backend/database/`](../../backend/database/README.md).

The review UI consumes NestJS API contracts and does not own canonical domain rules, database migrations, source acquisition, filesystem storage or model lineage. The app is still a mixed inherited and Mzizi codebase; its screens should be treated according to the route and backend they actually call.

## Local checks

From this directory: `bun run typecheck`, `bun run test`, and `bun run dev`. The root runner can include it with `bun run dev --only web` or run the full local stack with `bun run dev`.

## Read first

- [Project purpose](../../../.docs/docs/WHY.md)
- [System responsibilities](../../../.docs/docs/SYSTEM.md)
- [Data lifecycle](../../../.docs/design/architecture/DATA_LIFECYCLE.md)
- [Migration boundaries](../../../.docs/design/architecture/MIGRATION.md)
