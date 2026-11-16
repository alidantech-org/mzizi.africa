---
{id: TSK-30C5570B6244,name: "Workers and runs, phase 1: job spec, run store, ledger and worker context",type: task,status: completed,priority: medium,created_at: 2026-11-16T09:48:44.649Z,updated_at: 2026-11-16T10:54:41.297Z,order: 10240,extra: {status_history: [{from: planned,to: blocked,at: 2026-11-16T10:24:02.379Z},{from: blocked,to: in-progress,at: 2026-11-16T10:32:46.324Z},{from: in-progress,to: completed,at: 2026-11-16T10:54:41.297Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-30C5570B6244/1794825166327-start,started_at: 2026-11-16T10:32:46.756Z,end_ref: refs/tracking/TSK-30C5570B6244/1794826481299-end,ended_at: 2026-11-16T10:54:41.297Z,summary: {files: 64,insertions: 2249,deletions: 91}}]}}}
---

---
{id: TSK-30C5570B6244,name: "Workers and runs, phase 1: job spec, run store, ledger and worker context",type: task,status: in-progress,priority: medium,created_at: 2026-11-16T09:48:44.649Z,updated_at: 2026-11-16T10:32:46.324Z,order: 10240,extra: {status_history: [{from: planned,to: blocked,at: 2026-11-16T10:24:02.379Z},{from: blocked,to: in-progress,at: 2026-11-16T10:32:46.324Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-30C5570B6244/1794825166327-start,started_at: 2026-11-16T10:32:46.756Z}]}}}
---

# Workers and runs, phase 1: job spec, run store, ledger and worker context

## Goal

Introduce the typed job spec, the run record, the local run store, the MongoDB run ledger and a worker context that is built from only what a spec's stages require, and run the existing crawl operations through them with no change in output. This phase proves the shapes before any process management or S3 work.

## Context

Design: `.docs/design/architecture/WORKERS_AND_RUNS.md`; decision `DEC-WORKERS-AND-RUNS-20261116`; handoff `HANDOFF-WORKERS-AND-RUNS-20261116` (read it first, it holds the project rules, the environment cookbook and the pitfalls). Data types belong to the engine (`runtime/runs/contracts`), persistence to `persistence/mongo/`, and all settings enter through `engine/config/engine_config.py`. Packages must not import the engine or touch a database; the crawler gets a port when it needs one. The existing crawl engine, site store and pipelines are wrapped, not rewritten. Use the Mongo database name `mzizi_runs_test` for tests and never touch `mzizi_dev`.

## Build

- [x] Typed contracts: `JobSpec`, `StageSpec` (params validated by the operation's request model), `RunRecord`, `RunState`, `ArtifactRecord`, `RunManifest`; a canonical spec hash.
- [x] `Operation.requires` with a `Requirement` enum, declared for every registered operation; `WorkerContext` built from the union through `EngineConfig.require_*`, failing at spin time with one error naming all missing variables.
- [x] `RunStore` port and the local backend (`.dev/runs/<run_id>/artifacts|logs|manifest.json`); hash computed while writing.
- [x] Mongo ledger (`runs`, `run_events`, `run_artifacts`, `run_summaries`) with a TTL index on events; config section `runs` added to the one config file and to `.env.example`.
- [x] `scraping.crawl` and `site.watch` run through a spec and a run in process with output identical to today's.

## Acceptance checklist

- [x] All new code is typed and strict, formatted, linted and within file limits; `bun run boundaries` is 0 and `bun run structure` is clean.
- [x] Unit tests with fakes and integration tests against the real MongoDB (test database dropped afterwards) cover success, empty, error and unmet-requirement paths.
- [x] The existing suite passes with the same or better counts; `task validate` passes; docs and the task `## Progress` note are updated; nothing is committed unless the user asked.

## Comments

### 2026-11-16T10:24:42.503Z · PETER IRUNGU

Preflight on develop at dd610b05. Blocked before implementation: filesystem.sync_seed work is uncommitted and needs its own commit. The registry exposes 54 operations including that change, while the handoff lists 53. Typed crawler request models are captured inside handler closures, legacy operations have JSON schemas without request models, and existing crawler paths read workspace and other settings from the environment. Owner direction is needed on validator coverage and the configuration migration scope. The site watch store uses the existing per-site paths and caller output directory. Baseline: uv run ruff check source scripts passed, uv run ruff format --check source passed (642 files), uv run mypy passed (516 files), bun run boundaries reported 0 violations, bun run structure passed (648 files), bun test scripts passed (28), task validate passed. uv run pytest source -q initially returned 390 passed, 11 missing-user-agent failures and 6 skips with the owner env file bypassed. A full rerun with the repository test identity returned 401 passed and 6 skipped (five Postgres tests without a scratch URL, one missing archive fixture). No code or infrastructure changes.

## Decisions on scope (answers to the first agent's questions)

Recorded in the handoff section "Phase 1 scope": expose request models through `OperationSpec.request_model` set by the `operation(...)` builder (operations without one are not spec-able yet); limit spec execution to `scraping.crawl` and `site.watch`; inject the crawler's environment-read settings through the `crawler` section of `EngineConfig` with unchanged defaults and unchanged output locations, removing those `os.environ` reads from the touched paths; the test suite must pass without a developer `.env`.

## Progress

Phase 1 was implemented on develop after the seed and design commits. Operation registration carries the request model and requirements. The spec parser creates validated requests and hashes canonical JSON. The engine's internal `run_job_spec` entry point executes `scraping.crawl` and `site.watch` using the worker context, local run store, and Mongo ledger. Run and event state remains separate from the HTTP executor. The local store stages explicitly supplied artifacts and hashes streamed writes. Stage output collection, recovery, and sealing are later work.

The Mongo document source is `dryv/contracts/schemas/mongo/run-ledger.ts`. The engine Mongo pack generated nine model/enum modules and their contract tests. The adapter resolves the event TTL key from the generated alias and writes a native BSON expiration date. The event retention must be set explicitly in `ENGINE_RUN_LOG_RETENTION_DAYS`. The in-process runner records `completed` for a successful unsealed run.

Explicit loopback parity against the pre-change runtime matched 25 paths for crawl and 24 for watch, including both returned payloads. Raw HTML SHA-256 matched byte for byte on all six captures. Markdown bodies, front matter, and other output matched after normalizing observation timestamps and measured HTTP response durations. The initial watch harness needed its existing output-directory precondition handled, so the comparison excluded five files left by the incomplete setup attempt.

Ruff lint (`uv run ruff check source scripts`), Ruff format check (`uv run ruff format --check source`), root mypy (`uv run mypy`), explicit run-test mypy, `bun run boundaries` (0), `bun run structure`, `bun test scripts` (28), `bun run dryv:check`, targeted Dryv generation (`generate --app engine --pack python-mongo`), and `task validate` passed. The pre-change no-.env suite reproduced 11 missing-user-agent failures. The crawler fixture now supplies the identity and the suite runs with the developer .env bypassed.

The full root check (`bun run check`) still reported existing Biome formatting failures in the untouched Dryv engine runtime, staging and system app contracts and Mongo runtime/staging schemas. The untouched dashboard test comparing its canonical catalog with API controller routes also failed. The phase does not include dashboard or unrelated Dryv reformatting.

Remaining environment reads outside the spec execution path include `MZIZI_REPO_ROOT`, `MZIZI_SEED_ROOT`, and `MZIZI_SCHEMA_ROOT` in the manifest package, and the legacy CLI workspace, browser-mode and prerequisite checks. Crawler/fetch environment reads used by the two touched operations were moved into the engine configuration.

Final verification used `MZIZI_ENV_FILE=/dev/null ENGINE_ACTIVITY_STORE=files MZIZI_MONGO_URL=mongodb://127.0.0.1:27017 MZIZI_MONGO_DATABASE=mzizi_runs_test uv run pytest source -q -rs` with no exported user agent. It passed 423 tests, with the same five PostgreSQL skips and one missing archive fixture as baseline. The 22 focused run tests and generated Mongo contract tests also passed after final generation. The Mongo integration checked both loopback stages, all four collections, native BSON TTL index configuration, and idempotent writes. Confirmed that the scratch database was dropped and the temporary Dryv server was stopped. The CLI still lists 54 operations. Phase 2 awaits owner approval.
