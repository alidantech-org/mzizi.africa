---
{id: TSK-E55B1BC4011A,name: Move filesystem work into the engine and retire mzizi-database references,type: task,status: planned,priority: medium,created_at: 2026-11-13T09:53:31.557Z,updated_at: 2026-11-13T09:53:31.557Z,order: 7168}
---

# Move filesystem work into the engine and retire mzizi-database references

## Goal

Deferred follow-up. Once the engine job model exists, bring the `filesystem` package's database and registry behaviour into the engine so the package no longer imports the missing `mzizi_database`, and the Python workspace resolves cleanly. Pure helpers such as hashing and object-store access may stay as a small package or become an engine storage module.

## Context

The user chose to leave `filesystem` as is for now. It has about 4200 lines across repository, service, sync, uploads, lineage, transitions, download, authz, store, livecheck, secure and reset modules, and a CLI. Registry persistence belongs behind named Rust database-service operations, with the engine handling object transfer and signing. Seed sync and manifest publishing move to an engine `seed/` module. Existing engine routes for filesystem must keep working.

## Acceptance checklist

- [ ] An inventory maps every filesystem module to its new owner (engine module, pure helper, or database-service operation).
- [x] No Python package imports `mzizi_database` or `psycopg`, and `uv sync --all-packages` succeeds.
- [ ] Engine filesystem routes and the sync job work through the database service with tests passing.
- [x] No module over about 400 lines remains, and docs, FILESYSTEM_SCHEMA references and READMEs are updated.

## Comments

### 2026-11-13T10:58:55.789Z · PETER IRUNGU

Done now: every DB-touching module (repository, service, authz.DatabaseAuthorizer, sync, uploads, lineage, transitions, reset, secure, testing, cli) moved from source/packages/filesystem into source/backend/engine/src/mzizi_engine/filesystem/, behind a new Connection/Cursor port (mzizi_engine/ports/database.py: psycopg adapter, required(), rewrite_url()). source/packages/filesystem is now pure (object store, hashing, keys, codes, catalog, env, the Authorizer shape) with its own test file restored. The engine CLI gained 'mzizi-engine filesystem ...'. uv sync --all-packages now succeeds from a clean checkout -- the long-standing mzizi-database gap is closed. filesystem_api.py (589 lines, already over the limit pre-existing) was split into a filesystem_api/ package (_shared, folders, uploads, relations, sync) while at it. mypy --strict, ruff and bun run structure are clean on the whole Python workspace; packages' own tests (66) and the engine's non-DB tests (45) pass. Not done: item 3 (routes/sync still raw PostgreSQL, not the database service) and the rest of item 1/4 (typed row contracts instead of Row=Mapping[str,Any]; a real inventory mapping each module to a future database-service operation) -- tracked as the remaining, larger part of this task. DB-dependent tests (engine/tests/filesystem, test_filesystem_api.py) were not run here (no live Postgres in this session) but their imports were fixed and mypy/ruff pass.
