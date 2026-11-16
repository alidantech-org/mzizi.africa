# Mzizi engine

The Python runtime. It does three things: it assembles package capabilities into one `EngineRuntime` and schedules their work, it persists through PostgreSQL adapters over the Dryv-generated row models, and it exposes the runtime to front doors (its own command line and a local HTTP API). Every capability lives in a package under `source/packages/` with one orchestrator; the engine imports orchestrators only in the runtime's composition root. Design: [ENGINE_RUNTIME_AND_PACKAGES](../../../.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md), module history: [ENGINE_MODULE_INVENTORY](../../../.docs/design/architecture/ENGINE_MODULE_INVENTORY.md).

```text
src/mzizi_engine/
  runtime/
    runtime.py, operations.py     EngineRuntime: registration, config snapshots, concurrency plans, operations registry, call()
    assembly/                     composition root: default operations, filesystem, search and spec-run wiring
    runs/                         job specs, local run store, worker, supervisor, and host governor
    executor/                     job queue, retries, cancellation, events, outbox; the in-memory job store
    http/                         the local FastAPI app, authentication, settings
    policy/                       the collection gate (typed assessments, checks, decision)
    contracts/, tools/            runtime contracts and helpers
  persistence/                    postgres/ (filesystem registry over the generated row models), mongo/ (activity, run ledger and host permits), redis/ (host permits), vector/ (skeleton); see ENGINE_PERSISTENCE
  cli/                            `mzizi-engine` (serve, capabilities, check)
  api/                            Dryv-generated routes and schemas (never hand-edited)
```

The developer command line `mzizi` is the separate [`mzizi-cli`](../../packages/cli/README.md) package; the engine knows nothing about it.

## Run

```bash
uv sync --all-packages --all-extras
uv run mzizi-engine serve                       # 127.0.0.1:8760 with the settings below
uv run mzizi-engine capabilities                 # the operations the runtime exposes
uv run pytest source/backend/engine/tests
```

The internal API binds to loopback by default. Set `ENGINE_AUTH=service` and generate `ENGINE_SERVICE_TOKEN` with `openssl rand -hex 32`. Give the main API the same token and set its `ENGINE_URL`. It sends the key as an Authorization bearer token and owns end-user authorization. Service calls carry no end-user account ID. The engine also supports the existing OIDC mode when an OIDC authority is available, and the unauthenticated development mode is limited to loopback. HTTP executor jobs, runs and events are kept in memory (`ENGINE_STORE=memory`, the only store): the Bun database service that once held them was removed, and persistent job state returns with the engine's own persistence. Account and permission lookups that used that service are likewise not available yet.

## Configuration

One file reads the environment: [`config/engine_config.py`](src/mzizi_engine/config/engine_config.py). `EngineConfig.load()` reads the git-ignored root `.env` (without overriding variables already set) and builds the sections: `server`, `postgres` (`DATABASE_WRITE_URL`), `mongo` (`MZIZI_MONGO_URL`, `MZIZI_MONGO_DATABASE`), `vector`, `s3` (`S3_ENDPOINT`, `S3_BUCKET`, credentials from `S3_ACCESS_KEY` or `AWS_ACCESS_KEY_ID` and so on, public endpoint from `S3_PUBLIC_ENDPOINT` or `S3_PUBLIC_ORIGIN`), `filesystem` (`FILESYSTEM_PROTECTED_PREFIXES`, `FILESYSTEM_RESERVED_ROOTS`, `FILESYSTEM_TEMP_PREFIX`), `search`, `crawler` and `runs`. A section whose variables are missing is absent, and the first use of it raises one error naming every missing variable; nothing is guessed. `ENGINE_STORE_MEMORY=1` swaps S3 for an in-memory store (development only); `ENGINE_ACTIVITY_STORE=files` turns the MongoDB activity store off. `.env.example` lists every variable. Where files go is decided by the caller of each operation, never by the engine. Database tests: `MZIZI_FS_TEST_DATABASE_URL=postgres://… uv run pytest source/backend/engine/tests/filesystem` against a scratch database migrated with `bun run db migrate`.

## Seed upload

`mzizi fs sync` (operation `filesystem.sync_seed`) registers the files `seed/manifest.yaml` lists. The manifest and each folder's `_folder.yaml` decide everything: the logical root, the folders, the access class, versioned or current-only, pinned or not, and the role (`mzizi_manifest` resolves the inherited metadata). Without `--apply` it only plans. With it, bytes go to S3 at `<access>/<logical_root>/<path>` and folders, files and versions go to the Postgres `filesystem` schema; a second run reports every file `unchanged`. Folder roles are reference values: the engine creates a `filesystem.folder_roles` scheme and one value per role on first use. It needs the `filesystem` settings (see Configuration). Verified against a real PostgreSQL schema (151 files, 52 folders, 8 roles) and, for single files, a live object store.

## Operations and jobs

`GET /capabilities` lists the registered operations; `POST /v1/jobs` runs one (`{"kind", "input"}`) through the executor with limits, retries and cancellation (`ENGINE_CAPABILITY_LIMITS="name=n,..."`), and results are delivered to `NESTJS_CALLBACK_URL` through an outbox with `Idempotency-Key` retries. For `filesystem.*` kinds the engine stamps the authenticated principal into the payload as `actor`; a client-supplied actor is overwritten.

## Spec-driven runs

The Python entry point `mzizi_engine.runtime.assembly.run_operations.run_job_spec` accepts version-1 JSON and returns a run record plus operation outputs. Phase 1 runs `scraping.crawl` and `site.watch` in process. The registry validates each stage's parameters against its request model before starting work. Keep the caller's crawl output folder and the existing `.dev/websites/` location. The run store writes its audit logs under `.dev/runs/<run_id>/logs/` and exposes an artifact-bytes API for explicit staging.

Set `MZIZI_USER_AGENT`, `MZIZI_MONGO_URL`, `MZIZI_MONGO_DATABASE` and `ENGINE_RUN_LOG_RETENTION_DAYS` for a spec run. `ENGINE_RUN_LOCAL_ROOT` overrides the run-store location. See the [workers and runs design](../../../.docs/design/architecture/WORKERS_AND_RUNS.md) for status and the [Mongo contracts](../../../dryv/contracts/schemas/mongo/run-ledger.ts) for document shapes.

For the real Mongo integration test, use a local MongoDB and an empty scratch database. The test removes it on exit.

```bash
MZIZI_ENV_FILE=/dev/null MZIZI_MONGO_URL=mongodb://127.0.0.1:27017 MZIZI_MONGO_DATABASE=mzizi_runs_test \
  uv run pytest source/backend/engine/tests/runs -q
```

## Subprocess workers

Choose `ENGINE_HOST_REQUESTS_PER_SECOND`, `ENGINE_HOST_CONCURRENCY`, and `ENGINE_HOST_DAILY_BUDGET` for worker traffic. Set `ENGINE_WORKER_CEILING` for the total subprocess limit and `ENGINE_CAPABILITY_LIMITS` for tighter operation limits. The supervisor checks free space using `MZIZI_MIN_FREE_GB`. Use one supervisor per Mongo run ledger. The local run root holds a lock to prevent two supervisors using the same directory.

```bash
uv run mzizi-engine supervise            # run in one terminal
uv run mzizi-engine submit-run spec.json  # use the returned run ID
uv run mzizi-engine show-run <run-id>
uv run mzizi-engine cancel-run <run-id>
```

The supervisor starts and reaps `mzizi-engine worker --run <id>` subprocesses. Each owns one lease and checkpoints after each completed stage. A failed attempt retries from the first unfinished stage with backoff. Mongo shares host permits by default. Set `ENGINE_REDIS_URL` to use Redis and give every worker the same endpoint and limits. The governed subprocess path currently accepts HTTP rendering. Standalone browser acquisition remains available through its existing entry points.

## Sealed S3 runs and release

Set `ENGINE_RUN_STORE=s3` with the existing S3 settings and the worker governor settings. A supervised crawl stages output in local scratch, uploads it to the run prefix, writes its upload receipt, and checkpoints. A successful worker seals its bundle. `seal-run` can finish the transition after an interruption. Use one supervisor and a common local run root for all engine processes accessing these bundles.

```bash
uv run mzizi-engine show-run <run-id>
uv run mzizi-engine seal-run <run-id>
uv run mzizi-engine plan-release <run-id> placements.json
uv run mzizi-engine release-run <run-id> placements.json --approval approval.json
uv run mzizi-engine sweep-runs
```

The placement JSON contains `entries`, with one `path` and `placement` per artifact. Placement supplies `folders`, `file_name`, `access`, `retention`, `role_id`, and `authorization`. Add `relation_kind_id` where the manifest has raw-to-derived links. The plan output gives the hash to place in an approval JSON file alongside `approver`, `method` (`human` or `ai`), and `reason`. Apply uses the filesystem registry and server-side copy. A different content hash at an existing destination is a conflict.

Set `ENGINE_RUN_RETENTION_DAYS` to enable automated temporary-artifact expiry. Gzip JSON Lines logs use `ENGINE_RUN_LOG_RETENTION_DAYS`. Mongo keeps the permanent summary. Supervised S3 `site.watch` requires `download=false` and `hunt=false` while the staged download pipeline is pending. Governed workers accept HTTP rendering.

## Status

Built and tested: the runtime and its operations registry, queue, limits, retries, cancellation, worker processes, event replay, outbox delivery, the filesystem adapter against a real PostgreSQL schema, and every package's own tests. Not built: persistent HTTP executor job state, browser request interception for governed workers, staged download pipelines, per-folder authorization, Dryv-defined HTTP routes for the filesystem, and typed contracts for the legacy runtime modules still excused from strict typing in the root `pyproject.toml` (`runtime/http`, `runtime/executor`, `runtime/assembly/default_operations`).
