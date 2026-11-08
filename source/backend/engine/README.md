# Mzizi engine

One complete Python project: orchestration, an operational API, workers and the callback outbox. It orchestrates the packages in `source/packages`; it does not duplicate the NestJS product API, has no user interface, no user accounts, and never writes domain schemas. The NestJS API owns decisions, the UI and canonical database writes; the engine prepares data into artifacts and proposals and delivers results to NestJS.

## Run

```bash
uv sync --all-packages
uv run mzizi-db init                                     # engine tables live in mzizi_new (PROVISIONAL schema)
ENGINE_AUTH=off DATABASE_URL=postgres://postgres@localhost:5432/mzizi_new uv run mzizi-engine serve   # 127.0.0.1:8760
uv run mzizi-engine capabilities                         # print the registered capability contracts
uv run pytest source/backend/engine/tests
```

The API is local: it binds to loopback by default, and `ENGINE_AUTH=off` (development only) is refused on any other address. In normal mode a bearer token is verified against the same OIDC issuer as the NestJS API (`AUTH_ISSUER`, `AUTH_JWKS_URL`), the account is resolved with `auth.resolve_identity` and permissions come from the `auth` schema (`engine.read`, `engine.edit`, `engine.publish`). Service actors (the NestJS API, scripts, agents) are ordinary accounts there.

## Initial API

| Method and path | Purpose | Permission |
|---|---|---|
| `GET /health` | status, store, auth mode, capability count, active jobs | open |
| `GET /capabilities` | registered package capabilities with version, package, CPU-bound flag and input schema | `engine.read` |
| `POST /v1/jobs` | submit `{kind, input, idempotency_key?, run_id?}`; repeated idempotency key returns the same job | `engine.edit` |
| `GET /v1/jobs`, `GET /v1/jobs/{id}` | list and read jobs | `engine.read` |
| `POST /v1/jobs/{id}/cancel` | cancel a queued or running job | `engine.edit` |
| `POST /v1/runs`, `GET /v1/runs/{id}` | group jobs into a run | `engine.edit` / `engine.read` |
| `GET /v1/events?after=&job_id=&once=` | SSE stream with `id` = event `seq`; resume with `after` or `Last-Event-ID`; `once=true` ends after replay | `engine.read` |
| `POST /v1/manifests/validate` | validate the seed registry | `engine.read` |
| `POST /v1/filesystem/sync` | manifest sync job (preview by default; the actor is the authenticated principal) | any authenticated actor; folder-scoped `filesystem.*` checks in the `auth` schema |
| `GET/POST /v1/filesystem/folders...`, `GET /v1/filesystem/files/{id}`, `GET .../versions/{id}/download`, `POST .../folders/{id}/access`, `POST .../uploads`, `POST .../uploads/{id}/complete`, `POST .../uploads/cleanup`, `POST .../relations`, `POST .../derived`, `GET .../versions/{id}/lineage` | the filesystem operations (see `.docs/docs/FILESYSTEM_SCHEMA.md`) | folder-scoped `filesystem.read`/`edit`/`publish`/`delete` |

## Execution boundary

Everything runs through one `Executor`: a single queue feeding dispatch tasks, per-capability concurrency limits (`ENGINE_CAPABILITY_LIMITS`, capability defaults), retries with exponential backoff (non-retryable errors fail at once), cancellation, and progress events. I/O-bound capabilities run on threads under asyncio; CPU-bound capabilities (PDF, GeoJSON) run in worker processes (`ENGINE_PROCESS_WORKERS`). Jobs interrupted by a restart are requeued from the store.

Delivery to NestJS: every event is also written to an outbox row; a dispatcher POSTs `{event}` to `NESTJS_CALLBACK_URL` with `Idempotency-Key: event-<seq>` and the service bearer token, retrying with backoff and marking an event dead after 8 attempts. NestJS relays the SSE stream to the admin/developer site; the browser never talks to the engine.

## Honest status

Built and tested: health, capability registry and calls, queue/limits/retries/cancel, worker processes, SSE replay, outbox delivery and retry, restart recovery, authorization contract, PostgreSQL and in-memory stores, filesystem endpoints and sync job. **Gaps:** the `engine` schema is provisional and not final (`source/schema/database/engine/0001_engine.sql`); no scheduler or recurring workflows; no NestJS callback endpoint yet (the engine only delivers to a configured URL); a job already inside a worker process cannot be killed mid-run (its result is discarded); no source-specific extractors, candidate staging or promotion (those are later pipeline milestones); the agent package has no model provider; no SSE events for filesystem changes yet.
