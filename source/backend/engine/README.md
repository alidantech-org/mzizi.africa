# Mzizi engine

The Python runtime. It does three things: it assembles package capabilities into one `EngineRuntime` and schedules their work, it persists through PostgreSQL adapters over the Dryv-generated row models, and it exposes the runtime to front doors (its own command line and a local HTTP API). Every capability lives in a package under `source/packages/` with one orchestrator; the engine imports orchestrators only in the runtime's composition root. Design: [ENGINE_RUNTIME_AND_PACKAGES](../../../.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md), module history: [ENGINE_MODULE_INVENTORY](../../../.docs/design/architecture/ENGINE_MODULE_INVENTORY.md).

```text
src/mzizi_engine/
  runtime/
    runtime.py, operations.py     EngineRuntime: registration, config snapshots, concurrency plans, operations registry, call()
    assembly/                     composition root: build_default_runtime(), default operations, filesystem and search wiring
    executor/                     job queue, retries, cancellation, events, outbox; the in-memory job store
    http/                         the local FastAPI app, authentication, settings
    policy/                       the collection gate (typed assessments, checks, decision)
    contracts/, tools/            runtime contracts and helpers
  persistence/                    postgres/ (filesystem registry over the generated row models), mongo/ (activity store), vector/ (skeleton); see ENGINE_PERSISTENCE
  cli/                            `mzizi-engine` (serve, capabilities, check)
  api/                            Dryv-generated routes and schemas (never hand-edited)
```

The developer command line `mzizi` is the separate [`mzizi-cli`](../../packages/cli/README.md) package; the engine knows nothing about it.

## Run

```bash
uv sync --all-packages --all-extras
ENGINE_AUTH=off uv run mzizi-engine serve        # 127.0.0.1:8760
uv run mzizi-engine capabilities                 # the operations the runtime exposes
uv run pytest source/backend/engine/tests
```

The API is local: it binds to loopback by default, and `ENGINE_AUTH=off` (development only) is refused on any other address. In normal mode a bearer token is verified against the same OIDC issuer as the NestJS API (`AUTH_ISSUER`, `AUTH_JWKS_URL`). Jobs, runs and events are kept in memory (`ENGINE_STORE=memory`, the only store): the Bun database service that once held them was removed, and persistent job state returns with the engine's own persistence. Account and permission lookups that used that service are likewise not available yet.

## Configuration

One file reads the environment: [`config/engine_config.py`](src/mzizi_engine/config/engine_config.py). `EngineConfig.load()` reads the git-ignored root `.env` (without overriding variables already set) and builds the sections: `server`, `postgres` (`DATABASE_WRITE_URL`), `mongo` (`MZIZI_MONGO_URL`, `MZIZI_MONGO_DATABASE`), `vector`, `s3` (`S3_ENDPOINT`, `S3_BUCKET`, credentials from `S3_ACCESS_KEY` or `AWS_ACCESS_KEY_ID` and so on, public endpoint from `S3_PUBLIC_ENDPOINT` or `S3_PUBLIC_ORIGIN`), `filesystem` (`FILESYSTEM_PROTECTED_PREFIXES`, `FILESYSTEM_RESERVED_ROOTS`, `FILESYSTEM_TEMP_PREFIX`), `search` and `crawler` (`MZIZI_USER_AGENT`, `ENGINE_INPUT_ROOT`). A section whose variables are missing is absent, and the first use of it raises one error naming every missing variable; nothing is guessed. `ENGINE_STORE_MEMORY=1` swaps S3 for an in-memory store (development only); `ENGINE_ACTIVITY_STORE=files` turns the MongoDB activity store off. `.env.example` lists every variable. Where files go is decided by the caller of each operation, never by the engine. Database tests: `MZIZI_FS_TEST_DATABASE_URL=postgres://… uv run pytest source/backend/engine/tests/filesystem` against a scratch database migrated with `bun run db migrate`.

## Operations and jobs

`GET /capabilities` lists the registered operations; `POST /v1/jobs` runs one (`{"kind", "input"}`) through the executor with limits, retries and cancellation (`ENGINE_CAPABILITY_LIMITS="name=n,..."`), and results are delivered to `NESTJS_CALLBACK_URL` through an outbox with `Idempotency-Key` retries. For `filesystem.*` kinds the engine stamps the authenticated principal into the payload as `actor`; a client-supplied actor is overwritten.

## Status

Built and tested: the runtime and its operations registry, queue, limits, retries, cancellation, worker processes, event replay, outbox delivery, the filesystem adapter against a real PostgreSQL schema, and every package's own tests. Not built: persistent job state, per-folder authorization, Dryv-defined HTTP routes for the filesystem, and typed contracts for the legacy runtime modules still excused from strict typing in the root `pyproject.toml` (`runtime/http`, `runtime/executor`, `runtime/assembly/default_operations`).
