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
bun src/cli.ts grants <role>           # per-schema USAGE and SELECT for the API role
bun src/cli.ts reset                   # _dev and _test only: drop everything, migrate, seed
TEST_DATABASE_URL=postgres://postgres@localhost:5432/postgres bun test test
```

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
