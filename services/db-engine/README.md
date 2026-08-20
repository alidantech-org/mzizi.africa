# Mzizi Database Management Engine

**Status:** architecture scaffold; implementation follows legacy schema/migration inventory.

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
