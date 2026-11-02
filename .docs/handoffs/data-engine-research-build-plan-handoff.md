---
{id: HANDOFF-DATA-ENGINE-PLAN,name: Handoff - research and plan a working data engine,type: handoff,tags: [data-engine,db-engine,migration,planning]}
---

# Handoff: research, plan and start building a working data engine

Written for an agent starting a fresh chat. It states intent, what exists, what is missing and where to look. Verify claims against the repository before relying on them; this file is a map, not the territory.

## The ask

Make Mzizi's **data engine** real: a pipeline that takes preserved source evidence, extracts and normalises it, produces candidate records, lets them be reviewed, and promotes them into the canonical database that the NestJS API already serves. Today the API, its contracts and its tests exist, but **nothing populates the database except two test fixtures**. The first deliverable of this chat is research, a decision record and a task plan, then a thin working vertical slice.

## Start here: survey the schemas, then plan how data enters

The database now exists as 18 schemas and 91 tables with nothing in them except test fixtures. Before designing the engine, **look at what is there**, then plan how real data gets in.

### How to inspect it

```bash
docker start postgis                                   # shared no-auth PostGIS on 127.0.0.1:5432; never touch other projects' databases
docker exec postgis psql -U postgres -c "CREATE DATABASE mzizi_dev"   # first time only
cd source/backend/api && bun install
export DATABASE_URL=postgres://postgres@localhost:5432/mzizi_dev
bun run db:reset                                       # dev only: creates the 18 schemas, loads fixtures
docker exec postgis psql -U postgres -d mzizi_dev -c "\dn" -c "\dt geography.*"
bun run start                                          # 167 routes on :3000
```

Read the contracts for exact columns: `dryv/contracts/**/index.ts`, or the generated entities in `source/backend/api/src/modules/<group>/entities`.

### Schema inventory and intake

Load order follows the soft references (a record can only point at ids that exist). "Route" is how data should normally arrive; deciding that properly is your job.

| Order | Schema | Holds | Typical real sources | Intake route to plan |
| --- | --- | --- | --- | --- |
| 1 | `reference` | jurisdictions, classifications (levels, kinds, types, schemes) | none: curated vocabularies | reference seed, versioned in the database package |
| 1 | `source` (publishers, methods), `filesystem` (stores, formats, folders) | bootstrap rows | none | reference seed (formats come from `fixtures/reference/media-formats.json`) |
| 2 | `geography` | units, boundaries, names, relationships, lineage | boundary GeoJSON or shapefiles, gazettes, census geography | file import then extraction then candidates |
| 3 | `legal` | instruments, provisions, amendments, authority links | constitutions, statutes, gazettes (PDF, HTML) | document extraction with pinpoint structure |
| 4 | `person`, `governance`, `political`, `electoral` | people, institutions, offices and holders, parties, elections and results | government and electoral commission sites, gazettes, results PDFs and sheets | extraction plus entity resolution (one human, one row) |
| 5 | `organization`, `finance`, `debt`, `procurement` | legal entities, budgets, transfers, loans, tenders, contracts | budget PDFs and sheets, open-data portals, procurement notices | table extraction, currency and fiscal-year mapping |
| 6 | `statistical`, `civic`, `calendar` | indicators and observations, facilities and services, events | census and survey tables, facility registers | dataset parsing |
| runtime | `audit`, `identity` | comments, evidence submissions, decisions; accounts | people using the product | written by the API and the account system, never bulk-loaded |
| side effect | `source`, `filesystem` | documents, captures, attributions, verifications; files, versions, objects | every import | **every import must also write these** |

Every record that enters must come with its provenance: a `source.documents` row, a `source.captures` row pointing at a `filesystem` file version holding the preserved bytes, a `source.attributions` row per target record (with method and locator), and a `source.verifications` row (starts `unverified`). Data tables themselves carry no provenance columns.

### What to produce for this part

A document `.docs/docs/DATA_INTAKE_PLAN.md` (with Task tasks for what it implies) that answers, per schema group in the table above:

1. which real datasets or documents would feed it (name concrete, openly licensed candidates and check their licences), and what format they are in;
2. the intake path from raw artifact to canonical row, using the lifecycle in `DATA_LIFECYCLE.md`: register the artifact, preserve it, extract, normalise, produce candidates, validate, review, promote, with the exact rows written to `source` and `filesystem` at each step;
3. the staging shape and where validation rules live (which rules are per-domain, which are cross-domain such as geometry validity, parent containment, currency present, dates with precision, plain-id references resolving);
4. entity resolution needs (people, institutions, places, legal entities) and how duplicates and aliases are handled;
5. idempotency and re-runs: how re-importing the same document, or a corrected one, avoids duplicates and supersedes rather than overwrites;
6. the order and the smallest vertical slice that proves the path end to end (the geography boundary slice below is the proposal);
7. the legacy CSV seeds under `source/backend/api-legacy/app/routes/*/_seed` and how each maps to the neutral model (use `.docs/docs/audits/LEGACY_MODEL_INVENTORY.md`), with what to drop;
8. what is out of scope for now and why.

## Hard rules (repeat of the repository contract)

- Work only on `develop` in the main checkout. No branches, no worktrees, no push, no `.github/**` changes.
- Every unit of work goes through the Task CLI. Read `.docs/rules/task-writing.md` and `.docs/rules/branching-and-task-usage.md` first. Give tasks a due date.
- Read `AGENTS.md` sections 2 to 7 before designing anything. The boundaries are the point:
  - data extraction is not the API; AI classification is not extraction; AI output is not canonical truth;
  - migrations and seeding are not API responsibilities; file storage is not database record storage;
  - raw evidence is never overwritten; AI-produced data keeps method, model and inputs.
- Update the matching `.docs/docs/` file in the same change as any architectural decision.

## Proposed layout (needs your confirmation first)

The user proposed grouping the two engines under one folder:

```text
source/backend/engine/
  data/        extraction and candidate production (Python)
  database/    schema lifecycle, seeds, imports, integrity, promotion
```

in place of today's sibling `source/backend/data-engine` and `source/backend/db-engine` (each currently a README only). The recommendation to the user is: **yes, as a grouping, not a merge.** Keep two independently runnable packages with their own README, toolchain and tests, that talk only through the documented contracts below. `files` and `intelligence` stay siblings of `engine/`, because file custody and AI evaluation are separate owners. Do not let `engine/` become a shared-code pile.

If confirmed, the move is a small task of its own and touches these references (grep for `data-engine` and `db-engine`): `AGENTS.md`, `.docs/docs/{ARCHITECTURE,MIGRATION,DATA_LIFECYCLE,DOMAINS,ROADMAP,repository-map,project-overview,development-setup}.md`, `source/backend/README.md`, `.docs/docs/audits/LEGACY_MODEL_INVENTORY.md`, the decision documents, and the API's `src/neutral/fixture-loader.ts` (`fixturesDir` points at `db-engine/fixtures`). Record it in `.docs/decisions/` and run `task validate`.

## What already exists (all committed on `develop`)

**Product API, `source/backend/api`.** NestJS, generated by Dryv from TypeScript contracts in `dryv/contracts` (about 337 schemas and 135 operations across shared, reference, geography, legal, governance, elections, political, events, entities, finance, debt, procurement, statistics, services and audit). 91 tables in 18 full-word domain schemas (`reference`, `geography`, `legal`, `person`, `identity`, `governance`, `electoral`, `political`, `calendar`, `organization`, `finance`, `debt`, `procurement`, `statistical`, `civic`, `filesystem`, `source`, `audit`), named per `.docs/rules/database-naming.md`; nothing lives in `public` and no foreign key crosses a schema. Read `.docs/docs/DATABASE_DESIGN.md`, `SOURCING_DESIGN.md`, `FILESYSTEM_DESIGN.md` and `PEOPLE_DESIGN.md` first; they supersede the earlier evidence-column design. Read-only for domain data; the only writes are append-only comments, evidence references and review decisions. Run it with `bun run db:reset && bun run start` against the local PostGIS container (see the API README). The API never owns schema or seeds.

**Schema today** exists only as the generated TypeORM entities in `source/backend/api/src/modules/*/entities`. There are no migrations. `source/backend/api/scripts/dev-db.ts` creates the domain schemas and synchronises the tables into a `*_dev` database for development only (TypeORM does not create a schema before its enum types, so schema creation must come first; `dropSchema` only affects `public`, so resets drop each domain schema). The db engine must take over this job.

**Evidence model.** Data rows carry only valid time (with date precision), record time and a version chain. Provenance is in the `source` schema: `source.attributions` points at any record by `schema.table` and id through a document, a capture (which points at a `filesystem` file version) and a method (extracted, inferred, curated, ai_assisted, with tool and model), with a locator and confidence; `source.verifications` is the append-only verification ledger (unverified, under_review, verified, disputed, superseded, rejected). Importers and promotion must write these rows with every record they create. Jurisdictions and classification records (levels, institution types, election types, fiscal stages and so on) are data, not enums.

**Fixtures.** `source/backend/db-engine/fixtures/neutral-model/{kenya,south-africa}.json` (28 rows each, loaded as unverified with source "Test fixture") and the loader in `source/backend/api/src/neutral/fixture-loader.ts`. This is the only existing "seed" mechanism and it is test-only.

**Legacy material to mine, not to extend:** `source/backend/api-legacy` (Python). `.docs/docs/audits/LEGACY_MODEL_INVENTORY.md` classifies every legacy model and assigns non-model concerns to owners. `.docs/docs/MIGRATION.md` ends with a responsibility table: nothing in `api-legacy` is removable until db-engine migrates the data and the data-engine and files service replace the rest.

## What is missing (the work)

1. **Contracts between the layers** (AGENTS.md section 10): `FileArtifactRef`, `ExtractionJob` and `ExtractionResult`, `CandidateRecord`, `IntelligenceEvaluation`, `PromotionDecision`, canonical record version. None exists yet.
2. **A staging model** between extraction and canonical: where candidates, their lineage back to artifacts, validation results and review state live. Not designed; the lifecycle in `.docs/docs/DATA_LIFECYCLE.md` describes it in prose.
3. **Database lifecycle**: migration generation and apply, environment status, reference seeds versus research seeds versus fixtures, integrity checks (many cross-record links are plain ids with no foreign key, see below), and derived PostGIS columns and indexes from the GeoJSON text columns.
4. **Controlled promotion**: how a `ReviewDecision` (the API's audit write) results in a canonical record version, with the verification state applied only by this engine.
5. **Extraction capabilities**: web to clean document, PDF text and tables, OCR, spreadsheets and datasets, geospatial parsing. Legacy code exists in `api-legacy/app/services/pdf_extractor`, `web_search_scraper` and `api-legacy/scripts`; it was inventoried but not evaluated for quality or licence.
6. **Legacy data import**: the CSV seeds under `api-legacy/app/routes/*/_seed` mapped to the neutral model (the inventory's dispositions say which fields become records, identifiers or classification records).

## Known design constraints to respect

- Contracts name no country. Kenyan levels, institution types, election types and fiscal stages are classification records scoped by jurisdiction. Import mapping must produce records, never schema changes.
- Many references are plain ids, not foreign keys, because the entity generator allows one generated relation per target per entity. The db engine must validate those links (an integrity check) and may add real constraints in migrations.
- `ClassificationRecord.scheme` is free text today; a scheme registry (which schemes exist, which contract fields use them) is unspecified and is the engine's concern.
- Geometry is GeoJSON text in contracts and entities by decision (`.docs/decisions/typeorm-postgis-jsonb.md`); PostGIS columns are derived by this engine.
- Money has an explicit currency column and no default. Dates carry precision. Never import a bare year as an exact date.
- Roles and grants are per schema (USAGE on the schema plus SELECT on its tables); there is no `public` grant to lean on. Audit `targetKind` values are schema-qualified table names.
- The audit tables are append-only; promotion must not edit or delete them.

## Research questions (answer in a decision record before building)

1. **Layout**: confirm `source/backend/engine/{data,database}` or choose another; confirm both stay separate packages.
2. **Language and toolchain per package.** The data engine README prefers Python for the document, OCR, table and geospatial ecosystem. For the database package, compare: (a) TypeORM migrations generated from the Dryv entities (one schema source of truth, TypeScript), (b) Alembic, (c) a SQL-first tool. Decide where schema truth lives so the generated entities and the migrations cannot drift.
3. **Shared contracts across languages.** The contracts are TypeScript (Dryv IR). Can Dryv's `fastapi-backend` or other packs generate Python models for `ExtractionResult` and `CandidateRecord`, or should these two contracts be authored in Dryv and exported as JSON Schema? Check `/home/alidante/Projects/personal/alidantech-org/codepot/dryv/sdk/_examples/packs` and `source/schemas`.
4. **Job model.** How are extraction jobs triggered, queued, retried and made idempotent and versioned (a rerun creates a new result, never overwrites)? Options from a simple Postgres job table to a queue; pick the smallest thing that works locally.
5. **Staging storage.** Same PostgreSQL in a `staging` schema, or separate tables beside canonical? What does a candidate record look like for an arbitrary domain: typed per domain (generated from the same contracts) or generic JSON plus a target kind?
6. **Promotion rules.** What must be true to promote (verification state, minimum evidence, reviewer role, no unresolved dispute)? How is a new canonical version created and the previous one superseded without losing history?
7. **Files service boundary.** The `filesystem` schema (stores, content-addressed objects, files, versions, variants, attachments, uploads, events) is designed and in the contracts; the files service owns the bytes and writes it. What is the minimal interface (presigned upload and download, put by hash, derived variant) needed for a first slice, and can the first slice use a local directory store behind it?
8. **Legacy code reuse.** For each legacy extractor, decide reuse, rewrite or drop, based on a quick quality and licence check and a run on a real sample.
9. **First vertical slice.** Proposed: **geography boundaries**. A boundary GeoJSON file (for example an open administrative boundary dataset with a clear licence) is registered as an artifact, extracted to normalised units and geometries, produced as candidate `GeoUnit` and `GeoBoundaryVersion` records with provenance and licence, validated (geometry validity, parent containment, level consistency), reviewed through the audit write path, promoted, and then served by `GET /v1/geography/entities/{id}/boundary`. Confirm or replace it; the slice should touch every layer once.

## Suggested plan shape (refine in the first task)

1. **Decide**: layout, languages, shared-contract approach, job model, staging model, promotion rules. Output: decision records in `.docs/decisions/` and an updated `ARCHITECTURE.md`.
2. **Contracts**: author `FileArtifactRef`, `ExtractionResult`, `CandidateRecord` and `PromotionDecision` with examples and validation, published for both languages.
3. **Database package v1**: schema from the entities as migrations, environment status, reference seeds (classification records for the existing fixtures), integrity checks for the plain-id links, derived PostGIS columns, fixtures moved here as a proper seed class. Replace `scripts/dev-db.ts`.
4. **Data package v1**: job runner, one extractor for the slice, extraction diagnostics, versioned results.
5. **Staging and promotion**: staging tables, validation, candidate review hooks to the audit decisions, promotion that writes a canonical version.
6. **Vertical slice end to end**, with a test that runs the whole chain on a small real dataset against PostGIS.
7. **Legacy import**: map the CSV seeds in priority order (geography, then legal, governance, elections), each as a reviewed import, not a bulk copy.
8. Remove from `api-legacy` only what the responsibility table in `MIGRATION.md` says is now accounted for.

The research phase is done when decision records exist, the plan above is turned into detailed Task tasks with acceptance checklists, and the first vertical-slice task is ready to start.

## Practical notes from the previous session

- **Local database.** A shared no-auth PostGIS container named `postgis` (127.0.0.1:5432, `docker start postgis`) also holds the user's other projects' databases. Never touch those; create only `mzizi_*_dev` or `*_test` databases. Integration suites in the API create their own scratch databases and roles when `TEST_DATABASE_URL` is set.
- **Dryv.** Generation needs the local Dryv API (`dryv-api serve --port 8750`) and the Dryv checkout (default `~/Projects/personal/alidantech-org/codepot/dryv`). Everything is in `dryv/README.md`: `bun run check` validates contracts, `bun run generated:check` verifies generated output. The published `@dryvcode` packages are out of date; use the local checkout.
- **Running the API with Bun** needs the root `source/backend/api/tsconfig.json` (decorator settings); the tests use vitest with SWC instead.
- **Do not** run `pkill -f` with a pattern that also matches your own shell command line; it kills the shell.
- **Generator limits** (one relation per target, no `Contract` schema name, unbounded text must omit a maximum, renames leave stale files) are listed in `dryv/README.md`.
- **Read first:** `.docs/docs/WHY.md`, `STORY.md`, `ARCHITECTURE.md` (sections on data engine, files, intelligence, database), `DATA_LIFECYCLE.md`, `DOMAINS.md`, `MIGRATION.md` (phases 3 to 7 and the responsibility table), `.docs/docs/audits/LEGACY_MODEL_INVENTORY.md`, `COUNTRY_NEUTRAL_GOVERNANCE_MODEL_RESEARCH.md`, `dryv/README.md`, and the READMEs of `source/backend/{data-engine,db-engine,files,intelligence}`.

## First moves for the new chat

1. Run `task list` and `task show TSK-BD46EDE97821` (the research and decide task in the group "Data engine research and build").
2. Read the files above; check `git branch --show-current` is `develop`. Inspect the live schemas as described in "Start here" before reading further.
3. Answer the layout question with the user, then write the decision record.
4. Work through the research questions with small experiments (run a legacy extractor on a sample, try generating a Python model from a contract), recording findings in the task file, then turn the plan into tasks.
