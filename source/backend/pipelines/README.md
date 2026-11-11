# Pipeline service

The pipeline service is a TypeScript Temporal worker and an internal HTTP API. Run both its development and compiled entrypoints with Bun; the repository does not require Node.js to launch the service.

```bash
bun install
bun run dev
bun run typecheck
bun run build
bun run start
bun run verify:bun-runtime
```

`TEMPORAL_ADDRESS` defaults to `127.0.0.1:7233`. The worker requires `PIPELINES_API_TOKEN`, `DATABASE_SERVICE_URL`, and `DATABASE_SERVICE_TOKEN` to start its authenticated command API and outbox dispatcher. Activities call the Python capability engine through `ENGINE_URL` with `ENGINE_SERVICE_TOKEN`. Local Temporal and S3-compatible object storage are started from the repository root with `bun run infra:up`.

The Temporal SDK worker runs under the repository's Bun runtime. Temporal's SDK emits a warning that Bun does not provide `v8.promiseHooks.createHook`; `verify:bun-runtime` exercises the actual pipeline workflow and activity context against a local Temporal server so changes in that compatibility are caught. The warning means Temporal-specific promise stack traces are unavailable under Bun.
