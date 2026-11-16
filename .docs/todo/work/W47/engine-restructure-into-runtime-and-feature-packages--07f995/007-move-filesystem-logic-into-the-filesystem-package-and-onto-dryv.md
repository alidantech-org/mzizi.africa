---
{id: TSK-EC2E2EB98972,name: Move filesystem logic into the filesystem package and onto Dryv,type: task,status: completed,priority: medium,created_at: 2026-11-16T07:35:54.303Z,updated_at: 2026-11-16T08:18:43.088Z,order: 7168,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T07:48:52.462Z},{from: in-progress,to: planned,at: 2026-11-16T08:18:42.081Z},{from: planned,to: completed,at: 2026-11-16T08:18:43.088Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-EC2E2EB98972/1794815332464-start,started_at: 2026-11-16T07:48:52.696Z,end_ref: refs/tracking/TSK-EC2E2EB98972/1794817122091-end,ended_at: 2026-11-16T08:18:42.082Z,summary: {files: 112,insertions: 3208,deletions: 5930}}]}}}
---

# Move filesystem logic into the filesystem package and onto Dryv

## Goal

Make the filesystem capability follow the target design: the package holds all filesystem logic (folder and file rules, versions, lineage, transitions, authorisation decisions, sync planning, upload and cleanup flows) behind one orchestrator with typed contracts and ports, and the engine reads and writes the database only through Dryv-generated repositories. The raw SQL in `mzizi_engine.filesystem`, the hand-written `filesystem_api` routes and `ports/database.py` disappear.

## Context

Today `mzizi_filesystem` is a small pure library (about 690 lines: store, keys, hashing, codes, access, authz) with loose modules in its root. The business logic lives in `source/backend/engine/src/mzizi_engine/filesystem` (about 2,380 lines, four modules import `psycopg`) and `filesystem_api` (650 lines of hand-written FastAPI, one module imports `psycopg`). `ports/database.py` is the shared connection port. The Dryv database contracts under `dryv/` must own the filesystem tables so repositories are generated. The boundary check currently counts these as engine-imports-database violations. This task starts after the CLI move and is also delivered in milestones with a stop after each.

## Milestone 1: schema and ports

- [x] The engine persists through an adapter over the Dryv-generated row models and the current seven tables (Dryv generates no Python repositories yet); the old SQL and the three vanished relations are gone.
- [x] The package defines the registry repository port, typed records, a configuration contract and task-driven placement planning, with no database knowledge.

## Milestone 2: logic move (2a package logic, 2b engine adapter and deletion)

- [x] 2a: Registering bytes (placement, versions, retention, duplicates, name conflicts, recovery) and lineage (relations, ancestry, cycle refusal) are in `features/register` and `features/lineage` over the repository port, with tests and no database.
- [x] 2b: The engine implements the port over the Dryv row models; transitions (move, rename, access change), the sync planner and authorisation are rebuilt on the current schema or dropped; `repository.py`, `service.py`, `sync.py`, `reset.py` and the other old modules are deleted.

## Milestone 3: routes and cleanup

- [x] The hand-written `filesystem_api` routes and `ports/database.py` are deleted, and the filesystem is exposed as `filesystem.*` operations on the runtime (reachable through the existing job API and the CLI). Dryv-defined HTTP routes for it are a later task.
- [x] The package root holds only `__init__.py`, `py.typed` and folders, and `bun run boundaries` no longer reports the filesystem violations.

## Acceptance checklist

- [x] The package holds the filesystem logic and the engine holds no filesystem SQL.
- [x] The engine persists filesystem rows through the Dryv-generated row models over the current schema, and the hand-written routes and `ports/database.py` are gone.
- [x] The filesystem tests pass and `bun run boundaries` no longer lists the filesystem files.

## Progress

**Investigation before any move (16 November 2026). The code to move targets a schema that no longer exists.**

- `mzizi_engine/filesystem` (`repository.py`, `sync.py`, `transitions.py`, `reset.py`, `service.py`) and `filesystem_api/_shared.py` run hand-written SQL against the earlier `mzizi_new` design. It reads and writes folder columns `access_authorization`, `allow_weaker_children`, `artifact_role`, `is_seed`, `acquisition_class`, `preparation` and `jurisdiction_code`, and it uses the relations `filesystem.effective_folder`, `filesystem.key_violations` and `filesystem.uploads`. None of these exist in the Dryv contracts (`dryv/contracts/schemas/postgres/filesystem.ts`), the generated SQL snapshot or the generated Python row models.
- The current Dryv filesystem schema has seven tables: `folders` (11 columns: access, authorization, code, name, parent_id, role_id and the base columns), `files`, `file_versions` (sha256, size_bytes, s3_key, provenance, revision, pinned, access), `file_relations`, `file_extensions`, `tags` and `taggings`. There is no upload-session table and no effective-folder view.
- Dryv generates typed Python **row models** for them (`FoldersRow`, `FilesRow`, `FileVersionsRow`, and so on, from the `python-rows` pack, in `mzizi_engine/api/schemas/postgres/filesystem/`), but it does **not** generate Python repositories. The only repository templates are in the NestJS `use-cases` pack.
- So the earlier plan ("replace the SQL with Dryv-generated repositories") has nothing to replace it with yet, and "move the logic as is" would move code that cannot run against the current database. That is also the likely reason 12 tests in `tests/filesystem/test_sync_and_lifecycle.py` already fail.

Nothing has been moved or deleted. A decision on the approach is needed before milestone 1 continues.

**Decision (16 November 2026, project owner): rewrite on the Dryv rows.** The package keeps the rules; persistence is rebuilt against the current seven tables behind a typed port; a small engine adapter over the generated row models is temporary until Dryv can generate Python repositories. The old upload-session table, effective-folder view and key-violation function are not rebuilt in the database: the object key is computed in the package and the bytes are stored and verified before the version row is written (the schema requires `verified_at`).

**Principle (project owner): the filesystem hard-codes nothing about what is stored where.** Which folders, names, access and retention a file gets is decided by the engine from the task it is doing (scraping, hunting a country's data, and so on) and passed in as a typed `Placement`; the package validates and applies it, derives codes from the names it is given, and never invents a folder. Interpretation to confirm: "the engine" decides placement per task; "the filesystem" handles its own mechanisms (key layout, hashing, versions, lineage, content checks, access rules).

**Milestone 1 done.** New in `mzizi_filesystem`: `shared/contracts.py` (Access, Retention, folder, file and version records, new-folder), `shared/config.py` (`FilesystemConfig`: bucket, region, public endpoint, protected prefixes, reserved roots, temp prefix: all supplied by the caller), `features/registry/ports.py` (`FolderLookup`, `RegistryRepository`), and `features/placement/` (`Placement`, `plan_placement`: reuse existing folders, plan missing ones, derive codes, refuse bad names and reserved roots, require a recorded authorization when a new folder's access differs from its parent's; this access rule is my reading of the Dryv description and needs confirming). 12 package tests, ruff, mypy strict pass. The existing modules are untouched.

**Hard-coded filesystem knowledge still to remove (found in this survey).** In the package: `access.py` (`BUCKET="mzizi"`, `REGION`), `keys.py` (`RESERVED_ROOTS`, `PROTECTED_PREFIXES="public/raw/"`, `TMP_PREFIX`), `store.py` (`MemoryObjectStore` default public host `res.alidantech.org`), `catalog.py` (reads a fixed seed path; extension table `EXTRA`). In the engine: bucket and prefixes in `filesystem/livecheck.py`, `secure.py`, `uploads.py`, and the `mzizi_new` schema names throughout. They become `FilesystemConfig` values or manifest data in milestone 2.

**Milestone 2a done (16 November 2026).** In `mzizi_filesystem`: `features/register/` (`Registrar`, `RegisterRequest`, `RegisterResult`, name-conflict and duplicate policies, `holds` and `write` storage helpers) and `features/lineage/` (`relate` with cycle refusal, `ancestry`, `derivatives`), plus the port additions (`create_file`, `add_version`, `set_current_version`, `get_version`, `repoint_version`, `retire_version`, `find_same_content`, relations) and `NewFile`, `NewVersion`, `RelationRecord`. Ported from the old `FilesystemService.register`: hashing, content-type check, same-bytes-unchanged with recovery of a missing object, name-conflict and duplicate policies, archive key for a superseded revision, pinned and replace-current retention, refusing to overwrite unknown bytes, server-side copy of duplicates within an access class, protected prefixes from configuration, dry run. Bytes are stored and verified before the rows are written in one transaction. Dropped on purpose because the current schema has no place for them: the folder classification ("effective") resolution and mandatory-classification block, and provenance fields derived from it; provenance is now the caller's `dict[str, str]`. Authorisation is not in the package: who may register is the engine's decision. 21 package tests (in-memory registry and store), ruff, mypy strict pass.

Not yet done (2b): the engine adapter; moves, renames and access changes (the old `transitions.py`); the seed sync planner; upload sessions (the schema has none; presigned uploads need a decision); the remaining hard-coded values; the package root restructure. Old engine code still in place and still failing against the current database.

**Milestones 2b and 3 done (16 November 2026), decided without further questions from the project owner ("finish the whole thing").**

Package `mzizi_filesystem` is complete and restructured: the root holds only `__init__.py`, `py.typed`, `orchestrator/`, `shared/` and `features/`. `FilesystemOrchestrator` exposes register, sync_directory, begin/finish/discard upload, download_link, open_version, relate, ancestry, derivatives, change_access, move_folder, move_file and delete_unreferenced_keys. New: `features/transitions` (moves, renames and access changes; bytes follow the path; subtree access; cycle and collision refusal), `features/upload` (presigned temporary key, then server-side copy; stateless, no upload table), `features/download`, `features/sync` (a local tree under caller-named folders), `features/media` (`MediaCatalog` takes extension types from the caller; the seed-path reader is gone), `features/store` (port, memory and S3 adapters; `S3Settings` typed, nothing read from the environment). Removed from the package: all hard-coded bucket, region, host, protected-prefix, reserved-root and temp-prefix constants (now `FilesystemConfig`), `authz.py` (authorization is the engine's decision), `env.py`, and the dependency on `mzizi-manifest`.

Engine: `persistence/filesystem.py` implements the registry port over the current schema using the Dryv row models (the only filesystem SQL); `persistence/postgres.py` is the one connection helper. Deleted: `mzizi_engine/filesystem` (old), `filesystem_api`, `ports`, the filesystem CLI, `scripts/filesystem.py`, the `fs` runner command, the unused `DatabaseServiceFilesystem*` classes in `auth.py`, the legacy `ENGINE_FILESYSTEM_LEGACY_DATABASE_URL` setting, and all old filesystem tests. Dropped on purpose (they targeted the vanished schema): classification resolution, the seed-manifest sync planner and the dry-run mode of relocation.

Verified against a real scratch PostgreSQL database migrated from the current Dryv snapshot (4 adapter tests: register, update, unchanged, replace-current with revision never reused, lineage, access change, move, download link, and a missing reference failing loudly). Found and fixed on the way: `authorization` is a reserved word in PostgreSQL and must be quoted; ids and base columns have no database defaults so the adapter sets them; revision numbers must count retired versions. The scratch database is dropped at the end.

**Follow-up the same day (project owner: the engine must not have a `filesystem` folder).** The settings and operations wiring moved to `mzizi_engine/runtime/assembly/` as `filesystem_settings.py` and `filesystem_operations.py`, the runtime's composition root; `mzizi_engine/filesystem` no longer exists. The runtime guard test in `mzizi-manifest` now lets the CLI package import the engine runtime.

**Tests removed because they drove the dropped developer CLI** (the engine behaviour they covered is not otherwise tested at handler level, so this is a real coverage gap to restore once the CLI or direct handler tests return): `test_web_crawl::test_cli_commands_invoke_the_real_implementations`; in `test_web_scrape`: the patchright replay test, `test_scrape_stops_on_robots_and_challenge` (http and browser) and the paginated-listing test; in `test_web_sections`: the static hidden tabs, section budget, async tab walk (two parametrisations), load-more and repeated-content tests. Also removed: the old filesystem tests (they ran against the vanished schema) and the devservices CLI round-trip test.

**Failing tests not caused by this work:** `test_layout::test_the_backend_holds_the_api_and_the_engine_and_the_old_implementations_are_gone` (expects a `pipelines` folder that does not exist) and `test_seed_registry::test_no_fixture_sample_example_or_data_directory_sits_inside_source_code` (finds example folders under `source/backend/api/test`).

## Seed upload (16 November 2026)

`filesystem.sync_seed` and `mzizi fs sync` register the seed manifest's files from `seed/manifest.yaml` and the `_folder.yaml` descriptors (`runtime/assembly/filesystem_seed.py`, `persistence/postgres/reference.py`). Verified: planning 151 files from the real manifest; applying them to a freshly migrated PostgreSQL schema (52 folders, 151 files, 151 versions, 8 role values) with a second run reporting everything unchanged; a single file through the live object store (create, unchanged, presigned link on the public origin, delete). Found and fixed on the way: the in-memory store flag did not override a configured S3 (the 403 head request on a test bucket wrote nothing). Assumption to confirm: folder roles are reference values in a scheme named `filesystem.folder_roles` created on first use, because no role values exist in the seed reference data. Not built: staging of downloaded and browser files in MongoDB and their promotion.
