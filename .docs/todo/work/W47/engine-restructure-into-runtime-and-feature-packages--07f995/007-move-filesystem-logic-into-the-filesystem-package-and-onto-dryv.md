---
{id: TSK-EC2E2EB98972,name: Move filesystem logic into the filesystem package and onto Dryv,type: task,status: planned,priority: medium,created_at: 2026-11-16T07:35:54.303Z,updated_at: 2026-11-16T07:35:54.303Z,order: 7168}
---

# Move filesystem logic into the filesystem package and onto Dryv

## Goal

Make the filesystem capability follow the target design: the package holds all filesystem logic (folder and file rules, versions, lineage, transitions, authorisation decisions, sync planning, upload and cleanup flows) behind one orchestrator with typed contracts and ports, and the engine reads and writes the database only through Dryv-generated repositories. The raw SQL in `mzizi_engine.filesystem`, the hand-written `filesystem_api` routes and `ports/database.py` disappear.

## Context

Today `mzizi_filesystem` is a small pure library (about 690 lines: store, keys, hashing, codes, access, authz) with loose modules in its root. The business logic lives in `source/backend/engine/src/mzizi_engine/filesystem` (about 2,380 lines, four modules import `psycopg`) and `filesystem_api` (650 lines of hand-written FastAPI, one module imports `psycopg`). `ports/database.py` is the shared connection port. The Dryv database contracts under `dryv/` must own the filesystem tables so repositories are generated. The boundary check currently counts these as engine-imports-database violations. This task starts after the CLI move and is also delivered in milestones with a stop after each.

## Milestone 1: schema and ports

- [ ] The filesystem tables and operations exist as Dryv contracts and the generated repositories are checked in and verified.
- [ ] The package defines the repository and object-store ports it needs as typed protocols, with no database knowledge.

## Milestone 2: logic move

- [ ] Transitions, lineage, authorisation decisions, uploads and sync planning move into `features/` folders with one orchestrator and tests.
- [ ] The engine binds the ports to the generated repositories and `repository.py`, `service.py`, `sync.py` and `reset.py` are deleted.

## Milestone 3: routes and cleanup

- [ ] `filesystem_api` becomes Dryv-defined routes that call the runtime, and `ports/database.py` is deleted.
- [ ] The package root holds only `__init__.py`, `py.typed` and folders, and `bun run boundaries` no longer reports the filesystem violations.

## Acceptance checklist

- [ ] The package holds the filesystem logic and the engine holds no filesystem SQL.
- [ ] The filesystem tables are Dryv-generated, and the hand-written routes and `ports/database.py` are gone.
- [ ] The filesystem tests pass and `bun run boundaries` no longer lists the filesystem files.
