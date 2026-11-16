---
{id: TSK-30C5570B6244,name: "Workers and runs, phase 1: job spec, run store, ledger and worker context",type: task,status: blocked,priority: medium,created_at: 2026-11-16T09:48:44.649Z,updated_at: 2026-11-16T10:24:02.379Z,order: 10240,extra: {status_history: [{from: planned,to: blocked,at: 2026-11-16T10:24:02.379Z}]}}
---

# Workers and runs, phase 1: job spec, run store, ledger and worker context

## Goal

Introduce the typed job spec, the run record, the local run store, the MongoDB run ledger and a worker context that is built from only what a spec's stages require, and run the existing crawl operations through them with no change in output. This phase proves the shapes before any process management or S3 work.

## Context

Design: `.docs/design/architecture/WORKERS_AND_RUNS.md`; decision `DEC-WORKERS-AND-RUNS-20261116`; handoff `HANDOFF-WORKERS-AND-RUNS-20261116` (read it first, it holds the project rules, the environment cookbook and the pitfalls). Data types belong to the engine (`runtime/runs/contracts`), persistence to `persistence/mongo/`, and all settings enter through `engine/config/engine_config.py`. Packages must not import the engine or touch a database; the crawler gets a port when it needs one. The existing crawl engine, site store and pipelines are wrapped, not rewritten. Use the Mongo database name `mzizi_runs_test` for tests and never touch `mzizi_dev`.

## Build

- [ ] Typed contracts: `JobSpec`, `StageSpec` (params validated by the operation's request model), `RunRecord`, `RunState`, `ArtifactRecord`, `RunManifest`; a canonical spec hash.
- [ ] `Operation.requires` with a `Requirement` enum, declared for every registered operation; `WorkerContext` built from the union through `EngineConfig.require_*`, failing at spin time with one error naming all missing variables.
- [ ] `RunStore` port and the local backend (`.dev/runs/<run_id>/artifacts|logs|manifest.json`); hash computed while writing.
- [ ] Mongo ledger (`runs`, `run_events`, `run_artifacts`, `run_summaries`) with a TTL index on events; config section `runs` added to the one config file and to `.env.example`.
- [ ] `scraping.crawl` and `site.watch` run through a spec and a run in process with output identical to today's.

## Acceptance checklist

- [ ] All new code is typed and strict, formatted, linted and within file limits; `bun run boundaries` is 0 and `bun run structure` is clean.
- [ ] Unit tests with fakes and integration tests against the real MongoDB (test database dropped afterwards) cover success, empty, error and unmet-requirement paths.
- [ ] The existing suite passes with the same or better counts; `task validate` passes; docs and the task `## Progress` note are updated; nothing is committed unless the user asked.

## Comments

### 2026-11-16T10:24:42.503Z · PETER IRUNGU

Preflight on develop at dd610b05. Blocked before implementation: filesystem.sync_seed work is uncommitted and needs its own commit. The registry exposes 54 operations including that change, while the handoff lists 53. Typed crawler request models are captured inside handler closures, legacy operations have JSON schemas without request models, and existing crawler paths read workspace and other settings from the environment. Owner direction is needed on validator coverage and the configuration migration scope. The site watch store uses the existing per-site paths and caller output directory. Baseline: uv run ruff check source scripts passed, uv run ruff format --check source passed (642 files), uv run mypy passed (516 files), bun run boundaries reported 0 violations, bun run structure passed (648 files), bun test scripts passed (28), task validate passed. uv run pytest source -q initially returned 390 passed, 11 missing-user-agent failures and 6 skips with the owner env file bypassed. A full rerun with the repository test identity returned 401 passed and 6 skipped (five Postgres tests without a scratch URL, one missing archive fixture). No code or infrastructure changes.

## Decisions on scope (answers to the first agent's questions)

Recorded in the handoff section "Phase 1 scope": expose request models through `OperationSpec.request_model` set by the `operation(...)` builder (operations without one are not spec-able yet); limit spec execution to `scraping.crawl` and `site.watch`; inject the crawler's environment-read settings through the `crawler` section of `EngineConfig` with unchanged defaults and unchanged output locations, removing those `os.environ` reads from the touched paths; the test suite must pass without a developer `.env`.
