# MIGRATION — From Consolidated Legacy Code to the Target Mzizi Architecture

## Purpose

The repository is consolidated, but the architecture is not yet consolidated around the final Mzizi system boundaries.

`services/api` currently contains the inherited Python political-governance backend. It is valuable because it contains domain thinking, SQLAlchemy models, Alembic migrations, seed data, file routes, scraping/extraction utilities and early API behavior.

It should be treated as **source material to decompose**, not as the long-term backend shape.

The target product API is NestJS.

## Current inherited responsibilities

The Python service currently contains or references responsibilities for domains such as:

- geographic data;
- legal/constitutional data;
- offices;
- people;
- governance;
- political parties;
- elections;
- finance;
- debt;
- procurement;
- statistics;
- events;
- entities;
- files;
- scraping/extraction utilities;
- database migrations/seeding.

These concerns do not belong permanently in one service.

## Migration principle

Do not rewrite everything at once.

For each legacy responsibility:

```text
inventory
  -> understand
  -> document
  -> assign target owner
  -> extract contract/schema
  -> implement replacement
  -> migrate/verify data
  -> switch callers
  -> remove legacy responsibility
```

No old module should be deleted simply because a new directory exists.

## Target ownership map

| Current concern in Python service | Target owner |
| --- | --- |
| Web/document discovery | `services/data-engine` |
| Web fetching/scraping | `services/data-engine` |
| PDF/text/table extraction | `services/data-engine` |
| OCR and document parsing | `services/data-engine` |
| Source file metadata/storage routes | `services/files` |
| Raw/derived artifact lifecycle | `services/files` |
| AI classification | `services/intelligence` |
| AI-assisted cleaning | `services/intelligence` |
| Entity resolution suggestions | `services/intelligence` |
| Contradiction/evidence evaluation | `services/intelligence` |
| SQLAlchemy domain models | design input for canonical schema/contracts |
| Alembic migrations | `services/db-engine` migration source |
| Seed scripts/data | `services/db-engine` after classification by seed type |
| Data repair/backfill scripts | `services/db-engine` |
| Public/query HTTP endpoints | future NestJS `services/api` |
| Dashboard workflow endpoints | future NestJS `services/api` |
| Authentication/authorization | future NestJS API / platform auth design |

## Phase 1 — Freeze architectural expansion inside FastAPI

Until a migration decision is made for a responsibility, preserve working behavior.

However, avoid adding new major platform capabilities directly into the Python API merely because that is where older code lives.

New architecture work should follow the target boundaries.

## Phase 2 — Inventory database design

The Python backend contains useful model work. Extract a complete domain inventory before changing ORM technology.

For every table/model capture:

- domain;
- table/schema name;
- business meaning;
- fields;
- constraints;
- indexes;
- relationships;
- temporal fields;
- provenance fields;
- status/version behavior;
- seed dependencies;
- API usage;
- known problems.

### Important review

The old code includes cases where code-reference conventions and database foreign-key IDs coexist. Do not copy such inconsistencies blindly.

The canonical redesign should decide identity/reference rules explicitly.

## Phase 3 — Separate source/file concepts

Move the concept of preserved evidence out of the general API design.

Create stable contracts for:

```text
Source
SourceVersion
FileArtifact
DerivedArtifact
ArtifactHash
ArtifactMetadata
```

The file service should become the single owner of raw/derived artifact custody.

Existing file-related code can be reused where it matches this responsibility.

## Phase 4 — Build the data engine

Move or reimplement extraction capabilities in a dedicated Python data engine.

First capabilities should come from functionality that already exists or is clearly needed:

- website -> clean document/Markdown;
- PDF extraction;
- table extraction;
- OCR;
- structured metadata extraction;
- source discovery;
- basic normalization;
- extraction diagnostics.

### Output contract first

Before adding many extractors, define a versioned `ExtractionResult` contract.

This prevents every extractor from writing directly into domain tables in a different format.

## Phase 5 — Build the intelligence layer

Introduce a separate service/tool layer for reasoning over extraction results.

Start with narrow structured tools:

1. document classification;
2. segment classification;
3. entity extraction;
4. entity resolution suggestion;
5. OCR-cleaning suggestion;
6. contradiction detection;
7. extraction-quality evaluation;
8. candidate-data evaluation.

Each result must be stored/versionable and linked to its inputs.

Do not let the first AI implementation become a generic chat endpoint that bypasses the data lifecycle.

## Phase 6 — Build the database management engine

Extract database lifecycle ownership from the Python API.

The first DB engine should support:

- environment/database status;
- schema creation/migration;
- migration planning/apply;
- reference seeds;
- research seeds;
- test fixtures;
- integrity checks;
- controlled candidate promotion;
- export/import basics.

### Migrate Alembic deliberately

Existing Alembic migrations are historical design evidence. They should be read and mapped before a new migration system is chosen.

Do not preserve Alembic merely because it exists; do not discard it before extracting its schema history.

## Phase 7 — Define canonical schema v1

Canonical schema v1 should prioritize cross-domain foundations before copying every legacy table.

Foundation concepts:

- entity identity;
- names/aliases;
- temporal validity;
- geography;
- source/evidence;
- claims/relationships;
- confidence/dispute state;
- versioning;
- review status.

Then migrate domains incrementally.

Suggested initial domain order:

1. source/evidence;
2. file metadata;
3. geography/historical geography;
4. historical entities/polities;
5. heritage/culture;
6. linguistics/migration;
7. constitutions/legal;
8. governance/offices/people;
9. politics/elections;
10. finance/debt/procurement;
11. geopolitical/current-world layers.

This order aligns the new platform with Mzizi's wider purpose rather than simply recreating the previous political-finance system first.

## Phase 8 — Build the NestJS API

Only after canonical contracts are stable enough should the new API become the main application boundary.

Initial API responsibilities:

- health/version;
- sources/evidence reads;
- geographic/historical map queries;
- entity/profile queries;
- timelines;
- relationship traversal;
- version/evidence views;
- dashboard candidate/review workflows.

Avoid generic CRUD-first design. Prefer domain/query/workflow endpoints that express Mzizi concepts.

## Phase 9 — Migrate applications

### `apps/www`

Move public data access to the NestJS API while preserving the existing visual direction.

Priority routes remain conceptually aligned with:

- `/explore`;
- `/places/[slug]`;
- `/stories`;
- `/sources`.

### `apps/dashboard`

The old Katiba Book dashboard should evolve into the Mzizi research and stewardship workbench.

Old political-finance screens can remain useful, but the dashboard's core identity changes from a hackathon political-finance product into the internal data/research platform for all Mzizi domains.

## Phase 10 — Retire the Python API shell

The Python API shell can be removed only when its responsibilities have been accounted for.

Retirement checklist:

- [ ] database models inventoried;
- [ ] migrations inventoried;
- [ ] seeds classified/migrated;
- [ ] extraction code moved/replaced;
- [ ] file responsibilities moved/replaced;
- [ ] active API behavior mapped to NestJS or intentionally dropped;
- [ ] data migration tested;
- [ ] applications no longer depend on FastAPI;
- [ ] useful documentation preserved;
- [ ] archived code remains available in Git history.

## What should be preserved from the old backend

Preserve ideas, not accidental boundaries.

High-value material likely includes:

- domain names and historical modeling ideas;
- geographic hierarchy work;
- temporal relationship concepts;
- constitution/section models;
- offices/people/governance models;
- election/manifesto structures;
- finance/debt/procurement schema ideas;
- existing research/seed data;
- extraction scripts;
- file handling ideas;
- database constraints and indexes that encode real domain rules.

## What should not be preserved automatically

- FastAPI as the final API technology;
- current route placement;
- current service boundaries;
- duplicated identifiers/references;
- every old enum/table exactly as written;
- mixed extraction/API/database responsibilities;
- stale Katiba Book naming;
- old assumptions that Kenya political-finance is the entire platform scope.

## Migration success condition

Migration is successful when the repository still contains the useful knowledge accumulated in the earlier projects, but the running system reflects the new Mzizi architecture:

```text
files preserve evidence
Python data engine extracts
intelligence tools classify/evaluate
DB engine validates/promotes/versions
PostgreSQL/PostGIS stores canonical knowledge
NestJS exposes stable contracts
www explores/publishes
Dashboard researches/reviews
```
