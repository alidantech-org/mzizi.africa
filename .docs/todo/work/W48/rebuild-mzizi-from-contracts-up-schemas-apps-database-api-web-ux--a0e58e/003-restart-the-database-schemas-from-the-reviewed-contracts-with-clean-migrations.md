---
{id: TSK-1265807A54E3,name: Restart the database schemas from the reviewed contracts with clean migrations,type: task,status: planned,priority: high,created_at: 2026-11-24T19:53:02.515Z,updated_at: 2026-11-24T19:53:02.515Z,depends_on: [TSK-70669AC571AA],order: 3072}
---

# Restart the database schemas from the reviewed contracts with clean migrations

## Goal

Apply the approved schema design to the real database layer: regenerate the SQL from the reviewed Dryv schema contracts, replace the migrations with a clean baseline, restart the development database from it, add the indexes the designed reads need, and reload development data so the API can be rebuilt on top.

## Context

Task 3 of 7; starts only when tasks 1 and 2 are completed. The database project is `source/backend/database` (Bun CLI, `sql/schema.sql`, `migrations/0001_init.sql`, `migrations/0002_subject_integrity.sql`). Migrations are immutable once applied anywhere that matters; restarting is allowed only for local dev and scratch databases. Follow `.docs/design/data/DATABASE_ARCHITECTURE.md`, `source/backend/database/migrations/README.md`, and the regenerate-reset-reseed recipe. Keep one `mzizi_test` scratch database and drop any extra test databases created. Never touch production or delete S3 artifacts. Seed files are added only with owner approval.

## Prepare

- [ ] Confirm which databases may be reset and back up the dev database
- [ ] Confirm the approved design decision from task 1

## Regenerate

- [ ] Regenerate `schema.sql` from the reviewed contracts
- [ ] Compare it with the old SQL and list every difference
- [ ] Write the new baseline migration and retire the old ones per the migration rules
- [ ] Generate the named database operations the API will call

- [ ] `reference` schema created cleanly with constraints and indexes
- [ ] `auth` schema created cleanly with constraints and indexes
- [ ] `geography` schema created cleanly with constraints and indexes
- [ ] `source` schema created cleanly with constraints and indexes
- [ ] `filesystem` schema created cleanly with constraints and indexes
- [ ] `official` schema created cleanly with constraints and indexes
- [ ] `legal` schema created cleanly with constraints and indexes
- [ ] `governance` schema created cleanly with constraints and indexes
- [ ] `politics` schema created cleanly with constraints and indexes
- [ ] `civic` schema created cleanly with constraints and indexes
- [ ] `finance` schema created cleanly with constraints and indexes
- [ ] `statistics` schema created cleanly with constraints and indexes
- [ ] `event` schema created cleanly with constraints and indexes
- [ ] `community` schema created cleanly with constraints and indexes

## Indexes and performance

- [ ] Add indexes for every read declared in task 2 (feature ids, scope units, parent relationships, codes, addresses)
- [ ] Store precomputed simplified map outlines per zoom level instead of simplifying per request
- [ ] Add a precomputed place-subject availability view if the design needs it
- [ ] Run `EXPLAIN (ANALYZE, BUFFERS)` on each designed read on the dev data and record results

## Reload and verify

- [ ] Restart the dev database from the baseline
- [ ] Reload dev data and approved seed inputs
- [ ] Run `uv run mzizi-manifest check` and the database checks
- [ ] Update database docs and links

## Partitioning

- [ ] Declare the approved partitioning in the Dryv schema contracts, or record a Dryv gap if the pack cannot express it yet
- [ ] Generate the partitioned tables and initial partitions in the baseline migration
- [ ] Add the operation that creates future partitions (new periods, new countries)
- [ ] Verify partition pruning with `EXPLAIN` on the designed reads
- [ ] Document partition maintenance in the database docs

## Acceptance checklist

- [ ] Approved partitioning is built and pruning is verified
- [ ] A fresh database builds from the baseline with no errors
- [ ] Dev data is loaded and the engine and API connect with their roles
- [ ] Query plans for the designed reads are recorded
- [ ] Docs match the new state and `task validate` passes
