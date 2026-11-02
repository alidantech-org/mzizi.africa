# Legacy Python Backend — Migration Source

> **Status:** transitional. This Python FastAPI service is **not** the target Mzizi product API.

The code in this directory was consolidated from the earlier political-governance backend because it contains valuable domain and database work. It should be mined carefully for reusable design, data and behavior while Mzizi moves to the architecture defined in the repository root documentation.

The target public/product API will be implemented in **NestJS** after canonical contracts and database boundaries are established.

## Why this code is being preserved

This service contains useful work for areas such as:

- geographic hierarchy and relationships;
- constitutions and legal sections;
- governance structures;
- offices and office holders;
- people;
- political parties;
- elections, candidates, results and manifestos;
- finance;
- debt;
- procurement;
- statistics/events;
- file handling;
- web/document extraction utilities;
- SQLAlchemy models;
- Alembic migrations;
- seed/research data.

Those concepts should not be lost merely because the service boundary is changing.

## What must not happen

Do not continue turning this service into the long-term monolithic backend.

In particular, do not add new platform responsibilities here by default for:

- large-scale source discovery;
- scraping/OCR/document extraction;
- AI classification/cleaning/evaluation;
- platform file custody;
- new database lifecycle orchestration;
- long-term public API modules.

## Target decomposition

```text
Current Python service
        │
        ├── extraction/scraping ──────> ../data-engine
        ├── file/artifact behavior ───> ../files
        ├── AI/intelligence behavior ─> ../intelligence
        ├── models/migrations/seeds ───> ../db-engine + canonical schema design
        └── product endpoints ────────> future NestJS API
```

## Database-design extraction

Before replacing the Python ORM/migrations, inventory the existing design.

For each model/table record:

- business purpose;
- schema/table name;
- fields;
- indexes;
- constraints;
- identifiers/codes;
- relationships;
- temporal behavior;
- source/provenance behavior;
- seed dependencies;
- API dependencies;
- known inconsistencies.

Do not copy old tables blindly. The existing code contains valuable domain ideas but also inherited architectural assumptions that need review.

## Historical identity and codes

The old system contains a strong code/hierarchy concept for geographic and domain references. Preserve the intent during inventory, but do not treat every old implementation detail as immutable.

The new canonical identity model must be chosen explicitly after reviewing:

- stable internal identity;
- human/business codes;
- URI-safe hierarchical codes where useful;
- aliases and renamed entities;
- temporal identity/versioning;
- external/source identifiers.

## Working rule

Until a responsibility has a verified replacement, preserve working legacy behavior.

But new architecture work should follow:

- [`../../.docs/WHY.md`](../../.docs/WHY.md)
- [`../../.docs/GOALS.md`](../../.docs/GOALS.md)
- [`../../.docs/ARCHITECTURE.md`](../../.docs/ARCHITECTURE.md)
- [`../../.docs/DATA_LIFECYCLE.md`](../../.docs/DATA_LIFECYCLE.md)
- [`../../.docs/MIGRATION.md`](../../.docs/MIGRATION.md)
- [`../README.md`](../README.md)

## Retirement condition

This Python API shell is retired only after its useful responsibilities have been inventoried, migrated or intentionally rejected and the applications no longer depend on FastAPI.

Git history remains the archive for the previous README and implementation evolution.
