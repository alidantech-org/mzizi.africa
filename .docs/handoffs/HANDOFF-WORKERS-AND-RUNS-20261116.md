---
id: HANDOFF-WORKERS-AND-RUNS-20261116
name: Workers, runs and sealed run bundles, handoff for the implementing agent
type: handoff
tags: [engine, workers, runs, s3, mongo, handoff, production]
extra: {status: ready_to_start, date: 2026-11-16, implementation: not_started, base_commit: dd610b05}
---

# Workers, runs and sealed run bundles: handoff for the implementing agent

You are taking over a design that the project owner approved on 16 November 2026. **Nothing in it is implemented.** This document tells you the project rules, the exact state of the code, how to run every dependency, what to build in which order, how to prove each step, and what not to do. Read all of it before editing a file. The design itself is [WORKERS_AND_RUNS](../design/architecture/WORKERS_AND_RUNS.md); the decision is [DEC-WORKERS-AND-RUNS-20261116](../decisions/DEC-WORKERS-AND-RUNS-20261116.md). Work is tracked in the Task group "Engine restructure into runtime and feature packages" (five tasks: TSK-30C5570B6244 phase 1, TSK-BA70FC4E22AB phase 2, TSK-8FB61DCFD367 phase 3, TSK-1F71EC3D265C phase 4, TSK-CBB8B40CF8E0 phase 5).

**Be very careful.** This is production-grade infrastructure: it fetches third-party websites, stores evidence that must stay intact, and decides what becomes public data. Prefer small verified steps over big rewrites. If something here contradicts what you find in the code, trust the code, then stop and report the contradiction.

## 1. Rules that bind you (from the repository; read the originals too)

Read first, in this order: `AGENTS.md`, `.docs/rules/branching-and-task-usage.md`, `.docs/rules/task-writing.md`, `.docs/rules/typed-code.md`, `.docs/rules/coding.md`, `.docs/rules/security.md`, `.docs/rules/testing.md`, `.docs/rules/git.md`, then the design guides listed in section 3.

- **Branch**: work only on `develop`, in the main checkout. Never create or switch branches or worktrees. Never push to `main`. Do not touch `.github/**`.
- **Commits and pushes**: commit only when the user asks. Never push unless asked. Preserve unrelated uncommitted changes.
- **Task CLI is mandatory**: `task list`, `task show <id>`, `task start <id>`, tick checkboxes with `task check <id> --item N` or `--section "Heading"`, record findings under `## Progress` in the same task file, `task update <id> --status completed` only when every acceptance item is true, run `task validate` after any `.docs/` edit. Never hand-edit managed frontmatter (`id`, `status_history`). Gotcha: a group whose tasks are all completed refuses new tasks; keep a planned task open, or temporarily set a finished task back to `planned`, create the new task, and set it back.
- **Run everything from the repository root** with Bun (`bun run ...`); Python with uv (`uv run ...`). Do not add another package manager or task runner.
- **Typed code** (`.docs/rules/typed-code.md`): named, frozen, strict pydantic contracts (`ConfigDict(frozen=True, strict=True, extra="forbid")`); no free `dict`, `Any`, `object` past a parsing boundary; one parsing boundary per untyped input; enums and literals instead of status strings; no hard-coded source, country or classification knowledge (it lives in manifests); no regular expression outside the pattern modules; absolute imports from the package root only (no relative imports); every source file starts with a docstring that says what it is for; files stay under 400 lines (tests 600), split by responsibility, never raise the limit.
- **One configuration file**: the engine reads the environment in exactly one place, `source/backend/engine/src/mzizi_engine/config/engine_config.py`. Add settings there as a new section and nowhere else. Do not add `os.environ` reads, `.env` loaders or "entry points for env" anywhere else. Packages never read the environment; the engine injects values.
- **Layering**: packages (`source/packages/*`) never import `mzizi_engine` and never open a database; the CLI package is the only package allowed to import the engine runtime. The engine imports packages only in `runtime/assembly/`. Data types and models belong to the engine (`mzizi_engine.jsonvalue`, `runtime/operations.py`, `runtime/contracts`). Persistence (PostgreSQL, MongoDB, vector skeleton) belongs to the engine under `persistence/`. `bun run boundaries` enforces this and is part of `bun run check`.
- **Do not recreate** things the owner removed: no `contracts`, `policy`, `devservices`, `watch`, `scraping` or `testing` packages; no "dev services"; no `source/testing` or `source/conftest.py` (test fixtures sit beside the tests that use them); no `.env`-reading helpers outside the config file; no persistence code inside packages.
- **Security and compliance** (`.docs/rules/security.md`, `AGENTS.md` research section): treat `robots.txt` as a recorded signal (default respect; an override needs recorded authority and rationale); never silently work around blocks or CAPTCHAs; record method, authorisation, client configuration, request volume and challenge outcomes; keep request budgets; never log credentials, page bodies or personal data; AI and tool output is a reviewable proposal, never silent canonical truth; keep raw source bytes intact and derive from them.
- **Report accurately**: say what you ran and what it showed. If a check fails or is skipped, say so. Do not claim something works because it should.

## 2. State of the repository when you start

The seed upload (`mzizi fs sync`, operation `filesystem.sync_seed`) is committed as `760405cc` on `develop`; the working tree should be clean when you start (this handoff and the design docs are committed separately right after). Run `git status` first; if it is not clean, stop and ask.

Baseline checks at that point (re-run them to confirm before you change anything): `uv run ruff check source scripts`, `uv run ruff format --check source`, `uv run mypy` (strict, 516 files), `bun run boundaries` (total 0), `bun run structure` (clean), `bun test scripts` (28 pass), `task validate`, and `uv run pytest source -q` (401 passed, 6 skipped: five PostgreSQL tests that need `MZIZI_FS_TEST_DATABASE_URL`, and one missing archive fixture). The suite must pass **without** the developer's `.env`: an earlier agent saw 11 failures when it bypassed `.env` and did not supply `MZIZI_USER_AGENT`. Tests must not depend on a local `.env`; if some do, that is a defect to fix in phase 1 (set the identity through the test fixtures), not something to work around by exporting variables.

## 3. What exists and where

Read these design guides: `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md`, `.docs/design/data/ENGINE_PERSISTENCE.md`, `.docs/design/data/DATABASE_ARCHITECTURE.md`, `.docs/design/acquisition/WEB_ACQUISITION_RUNTIME.md`, `SITE_STRUCTURE_SPEC.md` (ranking and `expect`), `CRAWL_AND_PURPOSE_DETECTION.md`, the previous site-batch handoff `.docs/handoffs/HANDOFF-SITE-SCRAPING-BATCH-20261114.md`, and `.docs/decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md`.

```text
source/backend/engine/src/mzizi_engine/
  config/engine_config.py      the one configuration; EngineConfig.load(); sections server, postgres, mongo, vector, s3, filesystem, search, crawler
  jsonvalue/                   JsonValue and Payload (the engine's payload types)
  runtime/
    runtime.py, operations.py  EngineRuntime (register, run, call, health, drain, stop); Operation, OperationRegistry, OperationSpec
    assembly/                  composition root: build_default_runtime(), default_operations, crawler_operations, filesystem_*, search_*
    executor/                  Executor (asyncio queue, retries, cancel, events, outbox, ProcessPoolExecutor), MemoryStore (the only job store)
    http/                      FastAPI app (/health, /capabilities, /v1/jobs, /v1/runs, SSE events), auth
    policy/                    the collection gate (source.gate)
  persistence/
    postgres/                  connection.py, filesystem.py (PostgresRegistry), reference.py (folder role values)
    mongo/                     store.py (MongoStore), activity.py (the crawler's Activity port: retry, disk spool)
    vector/                    skeleton only: port and UnimplementedVectorStore
  cli/main.py                  mzizi-engine serve | capabilities | check
source/packages/
  crawler/   shared/engine (crawl engine), shared/pipeline.py (MarkdownPool, DownloadPool), shared/worker.py, shared/sitestore/,
             shared/layout.py (DevLayout, the .dev folder), shared/activity.py (Activity port), shared/bundles/, shared/scraping/,
             features/{crawl_site,scrape,survey,sections,attachments,rank,inspect,replay,downloads,queue,site,batch,changes}
  browser/   BrowserOrchestrator, sessions, tabs, pagination, challenge detection
  filesystem/ FilesystemOrchestrator: register, StoredObject promotion, uploads, lineage, relocation; S3ObjectStore, MemoryObjectStore
  extraction/ fetch/ manifest/ search/ cli/
```

Existing behaviour you must reuse, not rewrite: the crawl engine and site store, the markdown and download pools, the per-site batch worker pool (`features/batch`), the executor's retry, cancel and event model, the Activity port and its Mongo implementation, the filesystem package's `StoredObject` promotion path, the seed sync as the model for "manifests decide the placements".

Registered operations (54, including `filesystem.sync_seed`): browser.*, download.*, extraction.{csv,geojson,json,markdown,pdf}, fetch.{robots,url}, filesystem.*, manifest.*, scraping.*, search.web, site.{batch,watch}, source.gate, web.*. Check with `uv run mzizi capability list`.

## 4. Locked decisions and the owner's words

The design and its rejected alternatives are in the decision record; do not reopen them without asking. In the owner's terms: a worker is "a single job or activity" working on "a typed manifest job" (crawl sites, download, convert to Markdown, extract PDFs, serve ready CSV and Markdown while sources stay intact, keep all logs and metadata); it works in a temporary local directory (the `.dev` folder in development mode) and persists to the S3 temporary area with metadata in MongoDB; "approved files like seeds" go to permanent S3 and the PostgreSQL `filesystem` schema; "many workers can run at once"; a worker "has all data needed" but is told exactly what to do and is given only the configuration its requested capabilities need; ranking uses vector search later, and "sometimes it can be forced to hunt files and ranking is only done after extraction"; logs live in S3 with expiry because they are needed for audit. Finding content and making it public are separate stages.

## 5. Environment cookbook (verified on 16 November 2026)

Containers (Docker): `postgis` (127.0.0.1:5432, user `postgres`, no password locally), `mongodb` (127.0.0.1:27017, no credentials), `redis` (127.0.0.1:6379), `qdrant` (6333; vector is a skeleton, ignore it), and `mziziafrica-object-store-1` (SeaweedFS S3, **currently stopped**: `docker start mziziafrica-object-store-1`, stop it again when done; it exits with 137 if left running).

- **Postgres scratch database** (never use or drop `mzizi`, `mzizi_dev`, `mzizi_new`, `mzizi_test`): `docker exec postgis psql -U postgres -Atc "create database mzizi_fs_scratch"`, then `MZIZI_DB_ADMIN_URL=postgres://postgres@localhost:5432/mzizi_fs_scratch bun run db migrate` (applies the Dryv schema, 94 tables). Tests: `MZIZI_FS_TEST_DATABASE_URL=postgres://postgres@localhost:5432/mzizi_fs_scratch uv run pytest source/backend/engine/tests/filesystem`. **Drop the scratch database when you finish** (`drop database mzizi_fs_scratch`); keep at most one.
- **MongoDB**: the database `mzizi_dev` holds the owner's real crawl data (the 47-site batch: pages, versions, downloads). **Never drop, rewrite or test against it.** Use a separate database name for development and tests (for example `mzizi_runs_test`) and drop it afterwards. Config: `MZIZI_MONGO_URL=mongodb://127.0.0.1:27017`, `MZIZI_MONGO_DATABASE=<name>`.
- **S3**: the root `.env` has `S3_ENDPOINT`, `S3_PUBLIC_ORIGIN`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`. The bucket is **`mzizi`** (verified with a listing) and is the owner's real bucket: set `S3_BUCKET=mzizi` only in the shell for a test. Test only under `private/tmp/` with a unique tag such as `private/tmp/runs-test-<id>/`, and delete everything you wrote. Never write under `public/` or any seed key during tests. The public origin host is `res.alidantech.org`.
- `.env` (root, git-ignored, contains secrets): never print, copy or commit its values. It lacks `S3_BUCKET`, the `FILESYSTEM_*` rules and the Mongo settings; `.env.example` lists every variable. Do not edit `.env` without asking.
- Filesystem settings for an in-memory dry run: `ENGINE_STORE_MEMORY=1 FILESYSTEM_PROTECTED_PREFIXES=- FILESYSTEM_RESERVED_ROOTS=- FILESYSTEM_TEMP_PREFIX=private/tmp/ S3_BUCKET=test`.
- `uv sync --all-packages --all-extras` (without `--all-extras` it removes optional packages). Real-browser tests need Chrome and Playwright and run here.
- Sleep commands are blocked in this tool environment; poll with `until <check>; do sleep 2; done` in a command, or run long jobs in the background.

## 6. What to build, in order

Build **phase by phase, each ending green and reviewable**. Stop after each phase and report. Details and acceptance items are in the five tasks; this is the substance.

**Phase 1: job spec, run store, ledger, worker context (no behaviour change).**
- Add typed contracts under `runtime/runs/contracts` (engine data types): `JobSpec` (`spec_version`, `kind`, `name`, `sources` with authority references, `stages`, `mode` crawl|hunt, `limits`, optional `ranking`, `placement_hints`), `StageSpec` (operation name plus params validated at parse time by that operation's request model), `RunRecord`, `RunState` (enum), `ArtifactRecord`, `RunManifest`. Spec hash = sha256 of canonical JSON.
- Add `requires` to `Operation` (a frozenset of a `Requirement` enum: postgres, s3, mongo, browser, user_agent, search_keys, input_root) and declare it for every registered operation. `WorkerContext` builds only the sections the union needs, using `EngineConfig.require_*`; unmet requirements fail at spin time with one error naming every missing variable.
- Add `RunStore` (port) with the **local backend** (`.dev/runs/<run_id>/artifacts|logs|manifest.json`) and the Mongo **ledger** (`runs`, `run_events`, `run_artifacts`, `run_summaries`) in `persistence/mongo/`. Add the config section `runs` (store, scratch root, retention days, worker ceiling) to the one config file.
- Run `scraping.crawl` and `site.watch` through a spec and a run in-process and prove the output is identical to today's. Existing tests must still pass unchanged.

**Phase 2: subprocess workers, leases, cancellation, per-host governor.**
- `RunSupervisor` in the runtime spawns `mzizi-engine worker --run <id>` as a subprocess; the worker reads its spec from the ledger, holds a lease, heartbeats, honours cancellation (cooperative, then kill after a grace period), and exits with a meaningful code. Expired leases requeue runs from the last checkpoint. Reuse the executor's retry and event ideas; keep the executor for the HTTP job API.
- Admission control: per-capability concurrency from the runtime plans, a worker ceiling, a free-disk check (the downloads feature already has one).
- Per-host governor shared by all workers: token bucket, concurrency and daily budget per host; in-memory for one process, Redis or a Mongo lease collection across processes (config section `redis`, optional). A refusal is a wait, never a skipped request. Make the crawler's fetch path ask the governor (inject it; the crawler package must not import Redis or Mongo; define a port in the crawler).
- Prove with two concurrent runs against the loopback test site that the shared host budget holds, a killed worker's run resumes, and cancellation works.

**Phase 3: S3-temp run store, sealing, expiry, promotion.**
- `S3RunStore`: per-file objects under `private/tmp/runs/<run_id>/artifacts/`, logs under `logs/runs/<run_id>/*.jsonl.gz`, `manifest.json`; hash computed while writing; multipart for large files; same relative layout as local; backend chosen only by config. Sealing writes the manifest (files, logs, decisions, skips with scores, counts), verifies every hash once, records the manifest hash in the ledger, and refuses further writes to a sealed prefix. Scratch deletion in a `finally` block plus a startup sweep.
- Upload-then-record ordering at every stage boundary (never record a stage complete before its outputs are uploaded).
- Expiry: check whether the object store honours lifecycle rules (test with a short rule); if not, an engine sweeper deletes expired prefixes with `delete_many`. Permanent `run_summaries` stay.
- Release step: a worker kind that takes a sealed run id, verifies hashes, builds a release plan (placements from manifests, in the style of `filesystem_seed.py`), records approval (human or AI, with approver and reason), and promotes with `FilesystemOrchestrator.register(request, StoredObject(key=...))`, recording lineage raw to derived with `relate`. Idempotent per file.
- Test against the live object store and a scratch Postgres; clean up every object.

**Phase 4: spec-driven stage pipelines that resume.** Compose crawl, download, convert to Markdown, extract (PDF, tables, CSV) and publish stages from a spec; each stage checkpoints; overlap crawling and downloading as the pipelines already do. Keep raw bytes first and derived files linked with `derived_from`.

**Phase 5: `Ranker` port.** In the crawler, a port and a rule-based implementation driven by the site manifest (`expect` and ranking rules in `SITE_STRUCTURE_SPEC.md`), with criteria mode (rank before fetching) and hunt mode (rank after extraction). Every skip is recorded with score and reason. Do not build vector ranking; the vector store is a skeleton.

### Phase 1 scope, decided by the owner's side after the first agent's report (16 November 2026)

The first agent ran the baseline and asked three things. The answers, which bind phase 1:

1. **Expose request models for spec validation: yes, as part of the registration, not by reaching into handlers.** Give `OperationSpec` and `Operation` an optional `request_model` (a pydantic model type) set by the `operation(...)` builder, which already receives the model. `StageSpec` parameters are validated against it at parse time. An operation without a request model (the legacy ones that only have a JSON schema: `extraction.*`, `manifest.*`, `scraping.links` and others) is simply **not spec-able yet**: parsing a spec that names one fails with a clear error. Do not invent models for those in phase 1.
2. **Limit spec execution to `scraping.crawl` and `site.watch`: yes.** They are the two paths that prove the shapes. Everything else waits for later phases.
3. **Inject the settings those two paths need through `EngineConfig`, preserving current output locations: yes, and this retires a known debt.** The crawler and its dependencies read the environment directly (markdown worker count, minimum free disk, debug stack timer, the `.dev` workspace override, and for the crawl path possibly the fetch vocabulary path). Add these as fields of the `crawler` section of `EngineConfig` with **the same defaults the code uses today** (so output is byte-for-byte the same), and inject them into the crawler through explicit parameters or the same kind of one-time `configure_*` hook already used for the user agent and the activity store. Remove the `os.environ` reads from the code paths you touch; the `.dev` location must resolve exactly as before (override first, then `<repo>/.dev`). If a remaining read is outside these two paths (for example the manifest package's `MZIZI_SEED_ROOT`), leave it, list it in your task note and do not widen the phase.

Prove "unchanged output" concretely: run the same loopback-site crawl before and after your change and compare the resulting files and ledger-independent records (paths, hashes, Markdown front matter).

## 7. Pitfalls found in this codebase (read before you hit them)

- `ruff check --fix` can rewrite imports in surprising ways when the `known-first-party` list in the root `pyproject.toml` changes (it once rewrote hundreds of imports to `source.packages...`). After any `ruff --fix`, run `git diff --stat` and `grep -rn "source\.packages" source --include=*.py`.
- PostgreSQL: `authorization` is a reserved word and must be quoted; ids and base columns (`created_at`, `updated_at`, `version`) have no database defaults, the adapter sets them; revision numbers must count retired versions; the Dryv `verified_at` column is required, so a row is written only after bytes are verified.
- S3: `HeadObject` on a bucket you do not own returns 403; the in-memory store flag must override a configured S3 (a bug of this kind was fixed; keep a test). The presign client needs the public origin.
- `uv lock` and the workspace: every package listed in an `[tool.uv.sources]` must be a workspace member with the exact distribution name.
- mypy overrides for legacy modules are listed in the root `pyproject.toml` (`runtime/http`, `runtime/executor`, `runtime/assembly/default_operations`, `crawler/shared/bundles`). New code must be strict; do not add to that list.
- Mongo `Document` keys: `_id` is the idempotency key for the activity store's upserts; keep that convention.
- The restored CLI builds payloads for the operations; adding or renaming an operation requires a port entry and, if user-facing, a catalog command (`source/packages/cli/src/mzizi_cli/features/{ports,catalog}`), otherwise `test_registered_capabilities_are_all_declared_as_ports_or_internal` fails.
- The loopback test site and its fixtures are duplicated in each package's `tests/` folder on purpose; do not centralise them.
- Real crawling hits third-party sites: tests must use the loopback site (`tests/web_site.py`), never a live site, and never contact real hosts without the owner's say-so.

## 8. Definition of done, for every phase

All of: new code is typed and strict (mypy), formatted, linted, under the file limits; `bun run boundaries` stays 0 and `bun run structure` clean; tests for success, empty, error, retry and crash paths (use fakes for unit tests and the real containers for integration tests, clean up after); the existing test suite still passes with the same counts or better; `task validate` passes; design and README text updated in the same work (`.docs/design/architecture/WORKERS_AND_RUNS.md`, the engine README, `.env.example` for any new setting); the task file has a `## Progress` note with the commands you ran and their results; nothing is committed unless the user asked; every temporary database, bucket prefix and container you started is cleaned up or stopped.

## 9. Do not

Do not rewrite the crawl engine or the site store; wrap them. Do not make S3 the working filesystem. Do not write to PostgreSQL from a worker before approval. Do not zip as the primary handoff. Do not read the environment outside `engine_config.py`. Do not put capability logic in the engine or persistence in a package. Do not drop or modify `mzizi_dev`, the owner's bucket contents or `.env`. Do not add compatibility shims for removed code. Do not weaken tests to make them pass. Do not skip the task workflow. Do not start phase N+1 before the owner has seen phase N.

## 10. Questions to put to the owner, not decide yourself

Retention periods (temporary run objects, detailed logs); whether the first release is single-node only (the governor and leases assume it works across processes either way); who approves promotion by default (human, AI or both); the name and bucket for any new S3 prefix beyond `private/tmp/runs/`; whether Temporal should drive runs later.

## 11. Prompt for the agent

See the final section of this file's companion message to the owner; the same text is kept here so it stays with the code:

> You are the implementing agent for "workers, runs and sealed run bundles" in the Mzizi repository (`/home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa`, branch `develop`). Before doing anything, read in full: `AGENTS.md`, every file in `.docs/rules/`, `.docs/handoffs/HANDOFF-WORKERS-AND-RUNS-20261116.md`, `.docs/design/architecture/WORKERS_AND_RUNS.md`, `.docs/decisions/DEC-WORKERS-AND-RUNS-20261116.md`, `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md` and `.docs/design/data/ENGINE_PERSISTENCE.md`. Follow the handoff exactly: work only on `develop`, use the Task CLI for every step, commit nothing unless the user asks, read the environment only in `engine/config/engine_config.py`, keep packages free of persistence and engine imports, never touch the owner's `mzizi_dev` Mongo database, real S3 contents or `.env`, and clean up every scratch database, test prefix and container you start. Run the baseline checks and report them before changing code; if the uncommitted seed-upload work is still present, ask the user to commit it first. Then implement phase 1 only, in small verified steps (typed contracts, `requires` on operations, the local run store and Mongo ledger, the worker context, the crawl operation running through a spec with unchanged output), prove it with tests and the commands in the handoff, update the docs and the task file, and stop and report what you ran, what passed, what you assumed and what you need decided. Do not begin phase 2 until the user approves. If anything in the handoff conflicts with the code, stop and ask.
