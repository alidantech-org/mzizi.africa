# Mzizi Database Management Engine

**Status:** v1 running: migrations generated from the Dryv entities with a drift check, status, seeds, integrity checks, derived PostGIS shapes, a `staging` schema and per-schema read grants. Promotion and candidate validation are the next tasks.

## Run it

```bash
cd source/backend/engine/database && bun install
export DATABASE_URL=postgres://postgres@localhost:5432/mzizi_dev   # only mzizi_* databases are ever touched
bun src/cli.ts status                  # applied and pending migrations, schema and table counts
bun src/cli.ts migrate                 # apply pending migrations
bun src/cli.ts generate <name>         # write a migration for what the Dryv entities need beyond the existing ones
bun src/cli.ts check                   # drift check: entities vs migrations (also run in CI)
bun src/cli.ts seed [reference|fixtures]   # fixtures: _dev and _test only
bun src/cli.ts integrity               # plain-id references, target kinds, derived geometry
bun src/cli.ts grants <role>           # per-schema USAGE and SELECT for the API role (staging: candidate ids only)
bun src/cli.ts validate [runId]        # validate pending candidates -> invalid or in_review
bun src/cli.ts apply-review            # approve/reject by the newest decision of a reviewer
bun src/cli.ts promote [runId]         # promote approved candidates (record, attribution, verification, promotion decision)
bun src/cli.ts candidates              # counts by status
bun src/cli.ts export-targets          # write contracts/targets.json for mapping validation
bun src/cli.ts reset                   # _dev and _test only: drop everything, migrate, seed
TEST_DATABASE_URL=postgres://postgres@localhost:5432/postgres bun test test
```

## Clean-rewrite database (`mzizi_new`)

Since 2026-11-08 (`.docs/decisions/clean-rewrite-mzizi-new.md`) new schemas are built from scratch in a disposable database, separate from the Dryv-entity migrations above. Plain SQL lives in `rewrite/`, applied by `src/rewrite.ts`, which accepts exactly the database name `mzizi_new` on a local host and checks `current_database()` before any reset. The `_dev`/`_test` rule of the legacy commands is unchanged.

```bash
bun src/rewrite.ts status | init | reset            # reset drops and recreates mzizi_new only
bun src/rewrite.ts bootstrap-admin <issuer> <subject> "<name>" [email]   # first platform administrator
bun test test/rewrite-auth.test.ts                  # auth schema checks (rolled-back transactions)
```

System seed inputs live in the root `seed/` (see `seed/README.md`); `bun src/seed.ts check|lock|report` validates and locks them. Currently built: the `auth` schema (`.docs/improvements/schema-redesign/auth.md`). Override the connection with `REWRITE_DATABASE_URL` (default `postgres://postgres@localhost:5432/mzizi_new`).

## Collection gate

`src/gate.ts` decides whether a request may be made, from the site's current legal/source assessment and its jurisdiction dossier, and fails closed (see `.docs/docs/WEBSITE_DESIGN.md`, "The gate"). The data engine must call it before every fetch and record the returned `assessmentId` on the capture.

## How schema truth works

The Dryv-generated TypeORM entities in `../../api/src/modules/*/entities` are the schema source of truth. `generate` builds a throwaway `<db>_diff` database from the existing migrations and writes a new migration for whatever the entities still need; `check` fails when that difference is not empty. Things the generator does not own are hand-written migrations: the `staging` schema, the PostGIS extension and `geography.boundary_shapes` (derived from the GeoJSON text by a trigger, kept out of the entity so the entity has no derived column). Migration history lives in `engine.migrations`, so nothing is placed in `public`.

## Purpose

The database management engine owns the lifecycle of Mzizi's structured stores. It keeps schema, migrations, seeds, integrity checks and canonical promotion separate from the public API.

## Owns

- schema definition lifecycle;
- migration planning/status/apply;
- reference/taxonomy seeds;
- research-data seeds/imports;
- development/test fixtures;
- integrity validation;
- repair/backfill jobs;
- import/export operations;
- candidate validation;
- controlled staging -> canonical promotion;
- canonical record version creation;
- database initialization for local/test environments.

## Seed classes

Do not mix these:

1. **Reference seeds** — stable system taxonomies and controlled vocabularies.
2. **Research seeds** — real evidence-backed domain data.
3. **Development/test fixtures** — synthetic/minimal data for software testing.

## Canonical store direction

PostgreSQL is the primary relational store direction, with PostGIS for geospatial requirements.

Canonical data must support:

- temporal validity;
- stable identity and aliases;
- typed relationships;
- evidence/provenance;
- confidence/dispute state;
- review/promotion state;
- record versioning.

## Does not own

- document extraction;
- AI classification;
- file blobs;
- application HTTP contracts;
- public presentation.

## Migration source

The Alembic migrations, SQLAlchemy models and seed scripts currently in `../api` must be inventoried before choosing the final schema/migration implementation. Preserve their domain knowledge, not their accidental service boundary.

See `../../.docs/MIGRATION.md`, `../../.docs/ARCHITECTURE.md` and `../../.docs/DATA_LIFECYCLE.md`.
