---
{id: DOC-3146BB9271CA,name: MIGRATION,type: documentation}
---

# MIGRATION — From Consolidated Legacy Code to the Target Mzizi Architecture

## Schema organization — 12 November 2026

The [schema redesign catalogue](../../_plan/schema-redesign/README.md) records the latest documentation-only scope decision: 7 Operational schemas in a separate Operations database, 12 Phase 01 civic accountability schemas in Main, and 14 retained Phase 02 schema proposals. Every schema not assigned to Phase 01 or Operational belongs in Phase 02 now; it is deferred and unapproved, and relocation does not start its planning.

Phase 01 is Reference, Geography, Legal, Official, Governance, Politics, Finance, Procurement, Civic, Accountability, Source and Filesystem. Official combines person and organization identities without granting authority; Politics combines political and electoral responsibilities in distinct tables; Accountability combines oversight and participation in distinct record types. Geography and PostGIS queries are included, and countrywide institutions reference the whole-country unit. Finance/Procurement and Source/Filesystem remain separate. Domain legal relationships go through Reference; Reference alone links to Legal. This supersedes earlier target text describing direct domain legal links or separate Person/Organization, Political/Electoral and Participation schemas. Historical implementation inventories below are not rewritten as if this target existed.

Operations contains Auth, Acquisition, Engine, Staging, Analytics, Audit and Management. Operational audit is not public accountability evidence. Candidates become accepted civic versions only through validated publication with durable source/file provenance and reconciled acknowledgements. Management stays in Operations; the exact civic-side idempotency contract remains open. No SQL, seeds, application code or database data changes are authorized by this reorganization. Detailed table and column approval remains separate from schema scope.

## Purpose

The repository is consolidated, but the architecture is not yet consolidated around the final Mzizi system boundaries.

`.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/api-legacy` contains the inherited Python political-governance backend. It is valuable because it contains domain thinking, SQLAlchemy models, Alembic migrations, seed data, file routes, scraping/extraction utilities and early API behavior.

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
| Web/document discovery | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/data` |
| Web fetching/scraping | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/data` |
| PDF/text/table extraction | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/data` |
| OCR and document parsing | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/data` |
| Source file metadata/storage routes | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/files` |
| Raw/derived artifact lifecycle | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/files` |
| AI classification | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/intelligence` |
| AI-assisted cleaning | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/intelligence` |
| Entity resolution suggestions | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/intelligence` |
| Contradiction/evidence evaluation | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/intelligence` |
| SQLAlchemy domain models | design input for canonical schema/contracts |
| Alembic migrations | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database` migration source |
| Seed scripts/data | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database` after classification by seed type |
| Data repair/backfill scripts | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database` |
| Public/query HTTP endpoints | NestJS `source/backend/api` |
| Dashboard workflow endpoints | NestJS `source/backend/api` |
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

**Status (2026-11-02):** the NestJS API exists at `source/backend/api` with read endpoints for every contracted domain and the audit write paths; see the responsibility accounting at the end of this file.

## Phase 9 — Migrate applications

### `source/apps/www`

Move public data access to the NestJS API while preserving the existing visual direction.

Priority routes remain conceptually aligned with:

- `/explore`;
- `/places/[slug]`;
- `/stories`;
- `/sources`.

### `source/apps/web`

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


---

# Responsibility accounting (2026-11-02)

What the legacy Python service (`.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/api-legacy`) did, where each responsibility now lives, and whether the legacy code can go. AGENTS.md section 3 allows removal only after equivalent responsibilities are accounted for.

| Legacy responsibility | New owner | Status | Can the legacy code be removed? |
| --- | --- | --- | --- |
| Geographic endpoints and mobile geography contract (`routes/geographic`) | NestJS `geography` group | Contracts, read use cases and tests done, including search, boundaries, children, hierarchy, map context, history, governance by place | Endpoints yes once clients switch; geo seed data (units, relationships, boundaries) not yet migrated |
| Legal endpoints (`routes/legal`) | NestJS `legal` group | Contracts and read use cases done | Endpoints yes once clients switch; constitution seed data not migrated |
| Models without endpoints: governance, offices, people, elections, political, events, entities, finance, debt, procurement, statistics, services | NestJS domain groups | Neutral contracts and read use cases done; inventory dispositions applied | The models can be retired as design reference, but their CSV seeds (below) are still the only data |
| CSV seeds under `routes/*/_seed` | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database` | Not started | No |
| Alembic migrations 001 to 016 (schema mixed with seed loading) | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database` | Not started; the generated entities define the neutral schema but database engine must own DDL and the missing `services` migration | No |
| Files models, S3 client, files routes | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/files` writes bytes; metadata model is the `filesystem` schema (`.docs/design/data/FILESYSTEM_SCHEMA.md`), replacing archived directories, files and file_types; formats seeded from the archived file types | Schema, contracts and read endpoints done; the files service (upload, download, scanning) not built | No |
| Scraper models, web search scraper, crawlers, converters | `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/data`; retrieval records become `source.captures` and results `source.attributions` (`design/data/SOURCING_DESIGN.md`) | Schema done; engine not built | No |
| PDF extractor, OCR, NLP | data engine (extraction) and intelligence (classification) | Not started | No |
| Archived justice, land, constitution amendments, legal instruments, `person_*` models | Review for later contracts | Investigate list in the inventory | Keep as reference |

Nothing in `api-legacy` can be removed yet. Removal needs: neutral data migrated into the canonical schema by database engine, clients switched to the NestJS endpoints, and the data engine and files responsibilities replaced. The contract audit and `check-api-boundary.ts` ensure none of the non-API responsibilities were absorbed into the new API.


## Update 2026-11-02: legacy seeds measured, not imported

See `audits/LEGACY_SEED_FINDINGS.md`. The geographic seed has duplicate and conflicting codes and 7 missing counties, the other seeds are samples without sources, and the people seed contains personal data. The responsibility table above is unchanged: the data engine (`engine/data`), database engine (`engine/database`) and the website registry now exist, but legacy code is not removed until the Tier B extractors (PDF and table), real legal, governance, election and finance imports, and the files service exist.


## Update 2026-11-03: organisation locations and contacts moved into the place model

`organization.locations` (1,747 rows) was mapped to `place.places` (kind site, name = the entity's official name, address text, located in the county unit) plus `place.occupancies` (subject = the entity; role school-campus, service-site or official-workplace by entity type). The 3,402 organisation contact identifiers (contact-phone 1,710, contact-email 1,692) became `contact.points` at entity scope with `restricted` visibility. Attributions and verifications moved to the new targets (copies for the occupancies), the old table, identifiers and the two identifier schemes were removed. Done by `bun src/cli.ts migrate-locations` (one transaction, counts verified before commit) and migration 1794500000100 (refuses to drop while rows or evidence remain). Snapshot: `.data/backups/mzizi-before-h2-locations-*.dump`. The procurement importer now stages places (stage B), contact points (B) and occupancies (C, after the places are promoted). `dedup.py` derives an organisation's geography from its occupancies. 19 places have no containing unit because the source gave no county.

## 2026-11-11 — Package-first active layout and broader domain proposals

The historic path map above describes archived implementations and must not be read as an active-path guide. The old Python API, engine/data, engine/database and related implementation are archived in `.docs/_archives/2026-11-08-rewrite-snapshot/`. Active reusable capabilities live under `source/packages/`; the single Python engine is under `source/backend/engine/`; the NestJS product API is under `source/backend/api/`; database input schemas and SQL are under `source/schema/`; prepared inputs are under root `seed/`; and thin commands are under `scripts/`. Never import, build or run the archive.

The broader system-expansion proposal adds candidate domain responsibilities for Civic infrastructure, Environment, Biology, Agriculture, Economy, History and Heritage. It does not authorize implementation or revise package-first boundaries. The active SQL tree currently contains six schema folders and 13 ordered migrations; Dryv's additional domain contracts do not mean those complete schemas or features are implemented. Review the [system-expansion proposal](../../_plan/guides/advancement-and-system-expansion.md) and [domain briefs](../../_plan/schema-redesign/mzizi-db/phase-02/README.md) before planning downstream design. Task 03 remains scoped to its connected foundation; downstream domain work belongs in its own reviewed task.
