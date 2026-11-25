---
{id: TSK-1265807A54E3,name: Restart the database schemas from the reviewed contracts with clean migrations,type: task,status: completed,priority: high,created_at: 2026-11-24T19:53:02.515Z,updated_at: 2026-11-25T06:17:33.183Z,depends_on: [TSK-6065C44E5476],order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T06:12:37.491Z},{from: in-progress,to: completed,at: 2026-11-25T06:17:33.183Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-1265807A54E3/1795587157492-start,started_at: 2026-11-25T06:12:38.284Z,end_ref: refs/tracking/TSK-1265807A54E3/1795587453185-end,ended_at: 2026-11-25T06:17:33.183Z,summary: {files: 8,insertions: 20804,deletions: 13229}}]}}}
---

# Restart the database schemas from the reviewed contracts with clean migrations

## Goal

Apply the approved schema design to the real database layer: regenerate the SQL from the reviewed Dryv schema contracts, replace the migrations with a clean baseline, restart the development database from it, add the indexes the designed reads need, and reload development data so the API can be rebuilt on top.

## Context

Task 3 of 7; starts only when tasks 1 and 2 are completed. The database project is `source/backend/database` (Bun CLI, `sql/schema.sql`, `migrations/0001_init.sql`, `migrations/0002_subject_integrity.sql`). Migrations are immutable once applied anywhere that matters; restarting is allowed only for local dev and scratch databases. Follow `.docs/design/data/DATABASE_ARCHITECTURE.md`, `source/backend/database/migrations/README.md`, and the regenerate-reset-reseed recipe. Keep one `mzizi_test` scratch database and drop any extra test databases created. Never touch production or delete S3 artifacts. Seed files are added only with owner approval.

## Prepare

- [x] Confirm which databases may be reset and back up the dev database
- [x] Confirm the approved design decision from task 1

## Regenerate

- [x] Regenerate `schema.sql` from the reviewed contracts
- [x] Compare it with the old SQL and list every difference
- [x] Write the new baseline migration and retire the old ones per the migration rules
- [x] Generate the named database operations the API will call

- [x] `reference` schema created cleanly with constraints and indexes
- [x] `auth` schema created cleanly with constraints and indexes
- [x] `geography` schema created cleanly with constraints and indexes
- [x] `source` schema created cleanly with constraints and indexes
- [x] `filesystem` schema created cleanly with constraints and indexes
- [x] `official` schema created cleanly with constraints and indexes
- [x] `legal` schema created cleanly with constraints and indexes
- [x] `governance` schema created cleanly with constraints and indexes
- [x] `politics` schema created cleanly with constraints and indexes
- [x] `civic` schema created cleanly with constraints and indexes
- [x] `finance` schema created cleanly with constraints and indexes
- [x] `statistics` schema created cleanly with constraints and indexes
- [x] `event` schema created cleanly with constraints and indexes
- [x] `community` schema created cleanly with constraints and indexes

## Indexes and performance

- [x] Add indexes for every read declared in task 2 (feature ids, scope units, parent relationships, codes, addresses)
- [x] Store precomputed simplified map outlines per zoom level instead of simplifying per request
- [x] Add a precomputed place-subject availability view if the design needs it
- [x] Run `EXPLAIN (ANALYZE, BUFFERS)` on each designed read on the dev data and record results

## Reload and verify

- [x] Restart the dev database from the baseline
- [x] Reload dev data and approved seed inputs
- [x] Run `uv run mzizi-manifest check` and the database checks
- [x] Update database docs and links

## Partitioning

- [x] Declare the approved partitioning in the Dryv schema contracts, or record a Dryv gap if the pack cannot express it yet
- [x] Generate the partitioned tables and initial partitions in the baseline migration
- [x] Add the operation that creates future partitions (new periods, new countries)
- [x] Verify partition pruning with `EXPLAIN` on the designed reads
- [x] Document partition maintenance in the database docs

## Owner direction (25 November 2026)

- [x] Create a new, separate database on the local PostgreSQL server for the rebuild (do not reuse or alter the current development databases); record its name and connection settings in the dev environment docs
- [x] **Start migrations afresh:** delete the old migration stream and generate one new baseline migration from the redesigned contracts. Do not write migrations that continue from, or acknowledge, the old design
- [x] Run the new migrations on the new database, then reseed it from the git-ignored seed inputs
- [x] Adopt the Dryv partitioning, SQL comment and integrity capabilities in the SQL pack

## Acceptance checklist

- [x] Approved partitioning is built and pruning is verified
- [x] A fresh database builds from the baseline with no errors
- [x] Dev data is loaded and the engine and API connect with their roles
- [x] Query plans for the designed reads are recorded
- [x] Docs match the new state and `task validate` passes

## Comments

### 2026-11-25T06:17:32.737Z · PETER IRUNGU

New database mzizi_rebuild (template_postgis, local server); old mzizi/mzizix/mzizi_ui/mzizi_ux untouched. Old release stream deleted (0001 old design + 0002_subject_integrity); 'bun run db assemble' -> one baseline 0001_init.sql (25110 lines). 'db migrate' -> 'applied 1 release(s)', 'db roles' -> 'roles ready ... on 24 schema(s)', 'db verify' ok; 647 relations incl. partitions. Roles proven: mzizi_api reads reference.countries (205), mzizi_engine reads geography.features (2092), API role denied on the ledger. New CLI commands (source/backend/database/src/maintenance.ts): 'db refresh' -> outlines 6792 rows/1.4s, pieces 2448/0.7s, figures 56482/2.0s; 'db partitions --through 2028-06' added 6 months to 5 tables. Seed from git-ignored .dev/seed/rebuild (export.py from local dev data, load.py) loaded in 3.9s with all FKs and scheme triggers enforced: 205 countries, 12 languages, 1148 terms, 9702 identities, 9897 names, 2092 Kenyan places, 1698 geometries, 2001 indicators, 56482 observations, 498 institutions, 2305 offices/holders, 2146 messages. Plans (EXPLAIN ANALYZE) recorded in source/backend/database/README.md: all index scans, 0.04-0.17 ms; figures reads prune to one hash partition. 'uv run mzizi-manifest check' no longer exists (seed registry removed in TSK-6065C44E5476). Database tests: 13 pass. Notes: outlines are simplified per feature, not as a shared topology yet (documented).
