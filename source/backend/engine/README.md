# Mzizi engine

One complete Python project: orchestration, an operational API, workers and the callback outbox. It orchestrates the packages in `source/packages`; it does not duplicate the NestJS product API, has no user interface, no user accounts, and never writes domain schemas. The NestJS API owns decisions, the UI and canonical database writes; the engine prepares data into artifacts and proposals and delivers results to NestJS.

## Run

The Python workspace installs cleanly from a checkout (`uv sync --all-packages`): no package or the engine depends on a `mzizi-database` project that does not exist. `mzizi_engine.ports.database` is the one module in the workspace that opens a database connection (`Connection`/`Cursor` protocols, a psycopg adapter today); `source/packages/filesystem` and the other packages hold no database code at all (TSK-E55B1BC4011A).

```bash
uv sync --all-packages
bun run db migrate                                       # ordered schema releases are applied by the Bun database owner
bun run db provision-local-roles && bun run db verify
ENGINE_AUTH=off ENGINE_STORE=database_service DATABASE_SERVICE_URL=http://127.0.0.1:3301 DATABASE_SERVICE_TOKEN=local-token uv run mzizi-engine serve   # 127.0.0.1:8760
uv run mzizi-engine capabilities                         # print the registered capability contracts
uv run pytest source/backend/engine/tests
```

The API is local: it binds to loopback by default, and `ENGINE_AUTH=off` (development only) is refused on any other address. In normal mode a bearer token is verified against the same OIDC issuer as the NestJS API (`AUTH_ISSUER`, `AUTH_JWKS_URL`), then account resolution and platform permissions go through named TypeScript database-service operations (`DATABASE_SERVICE_URL`, `DATABASE_SERVICE_TOKEN`). Persistent jobs, events, and callback outbox records also go through those operations; the Python engine no longer has a PostgreSQL-backed job store. Filesystem folder/file detail reads, download-key authorization, folder creation, upload reservation/cleanup, exact-version lineage writes, and scoped authorization use named database-service operations; Python handles object-store transfer and signing. Failed cleanup remains retryable because the DB owner keeps the session until the object operation succeeds. Other filesystem metadata operations (repository, service, authz, sync, uploads, lineage, transitions, reset, secure, cli) still use direct PostgreSQL through `mzizi_engine.filesystem`, behind the port above; these remain migration gaps against the TypeScript/Rust database service, and that module's raw-SQL rows are still typed loosely (`Row = Mapping[str, Any]`), not as named per-query contracts. Those legacy routes require an explicit `ENGINE_FILESYSTEM_LEGACY_DATABASE_URL`; they no longer inherit `DATABASE_URL` or the database administrator connection. TypeScript services and tools run with Bun only, including the Temporal worker.

## Developer CLI (`mzizi`)

`uv run mzizi` runs capabilities on local files and URLs and shows the result; it holds no extraction, scraping or fetching logic, only typed payload building over registered capability handlers (`mzizi_engine.devcli`). Run it with no arguments for an interactive menu; missing values are asked for on a terminal (bounded file search, recent-URL completion) and are a usage error otherwise. Plan: [`.docs/_plan/mzizi-engine/`](../../../.docs/_plan/mzizi-engine/README.md); runtime design: [`WEB_ACQUISITION_RUNTIME.md`](../../../.docs/design/acquisition/WEB_ACQUISITION_RUNTIME.md).

```bash
uv run mzizi dev init                  # create the git-ignored .dev workspace
uv run mzizi status [--group web]      # every port: ready / needs setup / not yet added, and why
uv run mzizi doctor                    # tools, libraries, services and search-provider settings
export MZIZI_USER_AGENT='Name/1.0 (+https://your.site/bot; you@your.site)'   # required for live requests
```

| Group | Commands |
|---|---|
| `extract` | `pdf`, `markdown` (structured PDF to Markdown, figures, tables, per-page OCR), `csv`, `json`, `geojson` |
| `web` | `links URL`, `robots`/`fetch robots URL`, `challenge`, `markdown URL`, `crawl URL`, `resume FOLDER`, `export FOLDER` |
| `fetch` | `url`, `robots` |
| `download` | `get URL`, `many FILE`, `status` |
| `browser` | `open`, `snapshot`, `navigate`, `click`, `fill`, `compare` with optional `--adapter playwright\|patchright` |
| `web survey/profile/family/draft/diff` | `survey URL` crawls, profiles and drafts a bundle in one run; `profile --source RUN`, `family --left RUN --right RUN` (template similarity and the varying host part), `draft --source RUN` (draft bundle under `draft-bundle/`, validated, every selector a low-confidence proposal), `diff --baseline RUN --current RUN` |
| `scrape` | `url URL --manifest MODULE`, `file HTML --manifest MODULE`, `select HTML --css SELECTOR`, `links` |
| `search` | `web QUERY --engine brave\|google` |
| `mongo` | `test`, `stats`, `load --run`, `find COLLECTION`, `drop-dev` (dev MongoDB, database `mzizi_dev`) |
| `vector` | `test`, `status`, `index --run`, `search QUERY`, `classify FILE --labels`, `drop-dev` (dev Qdrant) |
| `manifest`, `capability`, `dev` | seed/structure checks, registry inspection, workspace |

`web crawl` options include `--max-pages --max-depth --delay --render http|browser --adapter playwright|patchright --on-block backoff|skip|stop|pause --allowed-hosts --allowed-paths --excluded-paths --include-subdomains --no-sitemap --no-markdown --inspect-resources --jsonl --headed`. Brave uses `BRAVE_API_KEY`. Google Custom Search uses `GOOGLE_CSE_API_KEY` and `GOOGLE_CSE_ID`.

```bash
uv sync --all-packages --extra browser
uv run --package mzizi-engine --extra browser patchright install chromium
uv run --no-sync mzizi --allow-outside-inputs scrape url https://example.org/ \
  --manifest ./example-module.yml --render browser --adapter patchright
```

Use `--allow-outside-inputs` for files outside the CLI's `.dev/inputs` directory. The manifest argument takes a [site module YAML](../../../.docs/design/acquisition/WEB_ACQUISITION_RUNTIME.md#single-page-extraction). The run saves the captured HTML and records the module and capture hashes. Public page scraping uses `MZIZI_USER_AGENT` and requires no API key. Playwright remains the default driver and uses system Chrome. Patchright uses its bundled Chromium. `web crawl` and `web markdown` accept the same browser flags.

**Dev-mode browser default:** `mzizi` web, scrape and browser commands load pages in a visible Patchright window automatically. Pass `--headless` to hide the window, `--adapter playwright` to change driver, or `--render http` to skip the browser. The window and its tab persist between commands (one shared browser attached over CDP); `uv run mzizi browser start` opens it explicitly (any web command also starts it if none is open); starts are serialised by a lock so only one window is ever valid, and a new one opens only after the first is closed. `uv run mzizi browser stop` closes it. **Tabs:** every site gets its own tab in that one window (`.dev/browser/tabs.json`), so commands for different sites run at the same time; a command takes a lease on its site, so two commands never drive one site's tab. A site has at most two tabs: its working tab and one pop-up (`target=_blank`, `window.open`) at a time; pop-ups are recorded in the page result (`popups`, `deferred_popups`, `blank_links`) and closed once seen. Above 24 tabs the least recently used idle ones are closed. A site's extra CA bundle in `.dev/secure/<name>-ca-bundle.pem` (for example `knbs-ca-bundle.pem`) is added to the HTTP client's trust store. Set `MZIZI_DEV_BROWSER=headless` to disable windows (tests do). A module listing's `paginate` rule (query, path or next_link) is followed by `scrape url`. The engine API itself is unchanged and stays headless.

**Pages are waited for:** after load the browser waits for the network to go quiet, then until the app root is filled, no loader or spinner is visible (selectors in the vocabulary), enough text is present and no content has changed for 0.8 s, up to 25 s per page (`stable_max_ms`); the result reports `ready: stable|timeout`. **Pagination:** `mzizi_scraping.pagination` finds `rel=next`, next links, page numbers (with a URL template), next *buttons* (single-page apps), `load more` buttons and infinite-scroll hints; crawls follow next links, and in the browser click next buttons, load more and scroll, saving each further page as `<path>#page-N` (up to `--max-list-pages`, 25 by default; `--no-paginate` turns it off). A row of identical `View More` buttons is not treated as pagination. A click that cannot complete because the window is not painting falls back to a script click, and screenshots fall back to a browser-side capture.

**Layout (`.dev/, git-ignored, folders appear on first write):** `websites/<reversed suffix>/<registrable label>/<host label>/` per site, for example `websites/ke/go/ngcdf/kasarani/` (the apex host is `_root`, `www` is its own folder), holding `pages/<path>/<slug>.html|md|png`, `pages/<path>/versions/` (only after a meaningful change), `scraped/files/<pdf|document|data|image|media|archive|other>/<label>--<sha8>.<ext>`, `inventory/*.csv` (one current set, rewritten), `visited.txt`, `extracted/`, `drafts/`. Also `runs/<date>/` (newest 50 one-off runs), `browser/`, `logs/`, `cache/`, `inputs/`, `secure/`, `stack/`. Paths and names come from `mzizi_engine.layout` and `mzizi_engine.names` only. `uv run mzizi site watch URL` needs only a URL: it crawls, fingerprints every page (raw, normalised DOM, text, link set, per-heading blocks), writes a new version only when the text, a block or the links change outside blocks that change on every visit, and reports new/changed/unchanged/noise. Markdown carries front matter naming its source HTML and hashes. `download enqueue SITE` and `download run SITE` queue and fetch the site's inventory into readable names.

**Storage:** MongoDB (the existing local `mongodb` container, no credentials; `DEV_MONGO_URL`) holds everything the engine builds: crawl rows and run summaries (`crawl_*`), audit trail, the download queue (`download_queue`), downloaded-file catalog with link context (`downloads`), site profiles, family reports and ranking scores (`expectation_scores`). Files stay files: crawl CSVs (linked in `crawl_csv_files` by path and SHA-256), Markdown, raw HTML, screenshots, and every downloaded file of any type (PDF, image, media, data, archives). A JSON file a site itself returned stays a file. `ENGINE_ACTIVITY_STORE=files` (tests) or an unreachable MongoDB falls back to JSON files so nothing is lost. Downloads: `download enqueue --run RUN`, `download run --run RUN`, `download queue --run RUN`.

Every planned command exists. A command whose capability is not registered prints why, logs it to `.dev/logs/mzizi.log`, records a run folder and exits **3**; a missing tool, library or setting exits **4**; a missing value with no terminal exits **2**. Registering a capability of the declared name turns its command live (state is derived from the registry in `devcli/ports/`).

Run `uv run --no-sync pytest source/backend/engine/tests` after syncing the optional browser dependencies to include the loopback browser tests.

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
| `GET/POST /v1/filesystem/folders...`, `GET /v1/filesystem/files/{id}`, `GET .../versions/{id}/download`, `POST .../folders/{id}/access`, `POST .../uploads`, `POST .../uploads/{id}/complete`, `POST .../uploads/cleanup`, `POST .../relations`, `POST .../derived`, `GET .../versions/{id}/lineage` | the filesystem operations (see `.docs/design/data/FILESYSTEM_SCHEMA.md`) | folder-scoped `filesystem.read`/`edit`/`publish`/`delete` |

## Execution boundary

Everything runs through one `Executor`: a single queue feeding dispatch tasks, per-capability concurrency limits (`ENGINE_CAPABILITY_LIMITS`, capability defaults), retries with exponential backoff (non-retryable errors fail at once), cancellation, and progress events. I/O-bound capabilities run on threads under asyncio; CPU-bound capabilities (PDF, GeoJSON) run in worker processes (`ENGINE_PROCESS_WORKERS`). Jobs interrupted by a restart are requeued from the store.

Delivery to NestJS: every event is also written to an outbox row; a dispatcher POSTs `{event}` to `NESTJS_CALLBACK_URL` with `Idempotency-Key: event-<seq>` and the service bearer token, retrying with backoff and marking an event dead after 8 attempts. NestJS relays the SSE stream to the admin/developer site; the browser never talks to the engine.

## Honest status

Built and tested: health, capability registry and calls, queue/limits/retries/cancel, worker processes, SSE replay, outbox delivery and retry, restart recovery, database-service auth client, scoped filesystem authorization, filesystem endpoints and sync job. The former `mzizi-database` gap is closed: the workspace installs cleanly and every package is free of database code; the one remaining Python database writer is `mzizi_engine.filesystem`, behind `mzizi_engine.ports.database`. **Migration gaps:** that module's raw-SQL repository/service/sync/uploads/lineage/transitions/reset/secure/cli code (and `mzizi_engine/filesystem_api/`, its HTTP routes) still connect to PostgreSQL directly with loosely typed rows, instead of the TypeScript/Rust database service; those writers must move behind it and Temporal pipeline before the target architecture is complete. The `engine` schema remains provisional (`source/schema/database/engine/0001_engine.sql`); source-specific candidate promotion, review evidence lineage, and filesystem upload-recovery acceptance also remain in progress.

## Policy module

`mzizi_engine.policy` holds the typed collection gate (`policy/gate/`: `models`, `parse`, `checks`, `evaluate`, `edge.decide`; moved from the former `mzizi-source` package and tested against `seed/_fixtures/contracts/gate-vectors.json`) and personal-data hints. The `source.gate` capability calls it. `mzizi-fetch` expects the engine to inject the gate and `mzizi_scraping.detect_challenge`. See [ENGINE_JOB_MODEL](../../../.docs/design/architecture/ENGINE_JOB_MODEL.md) (proposal).
