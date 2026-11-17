---
id: DOC-CLI-AND-JOBS
name: CLI and engine jobs quickstart
type: documentation
tags: [cli, engine, acquisition, quickstart]
---

# CLI and engine jobs quickstart

Use this guide to take a fresh checkout from a first crawl to an engine job. Start at the repository root on `develop`. Install [uv](https://docs.astral.sh/uv/) and use Python 3.12 or newer. The examples use a POSIX shell. The Python-only workflow uses the committed lockfile and generated contracts. Bun, the Dryv checkout and the dashboard are for other workflows.

## 1. Install and check the CLI

```sh
uv sync --locked --all-packages
uv run --no-sync mzizi dev init
uv run --no-sync mzizi --help
uv run --no-sync mzizi status --group web
uv run --no-sync mzizi-engine capabilities
```

`mzizi` runs a capability in the local runtime. The engine HTTP server runs separately. The CLI creates local run folders under `.dev/runs/`. Use `--no-input` and `--json` before the command group for scripted calls. See the [CLI guide](../../../source/packages/cli/README.md) for command groups and exit codes.

## 2. Crawl a site you are authorized to collect from

Set an identified user agent with a real monitored contact. Replace both values below. Start with one host, a narrow path where practical and a small page budget.

```sh
export ENGINE_ACTIVITY_STORE=files
export MZIZI_USER_AGENT='ResearchBot/1.0 (mailto:REPLACE_WITH_YOUR_MONITORED_EMAIL)'
SITE_URL='https://example.org/'
uv run --no-sync mzizi --no-input web crawl "$SITE_URL" \
  --render http --max-pages 5 --max-depth 1 --delay 2 --no-sitemap
```

Open the run folder printed by the CLI. Check `summary.json`, `errors.csv`, `blocks.json` and `policy_audit.json` before treating the run as complete. `raw/` preserves captured HTML, `markdown/` contains derived text, and `links.csv` and `documents.csv` inventory references. A document link in the inventory does not mean its bytes were downloaded. Read `listings.json` for pagination coverage. Resume the same crawl with `mzizi web resume RUN_FOLDER`. [Acquisition commands and outputs](../acquisition/WEB_ACQUISITION_RUNTIME.md)

A different website needs its own review of source permissions and scope. The crawler respects robots by default and reports challenges, blocked pages and incomplete coverage. Use a validated [website module](../acquisition/site-structure-authoring.md) to turn specific cards or tables into fields, and test it on a saved HTML page with `mzizi scrape file PAGE.html --manifest MODULE.yml`. For permitted JavaScript-driven sources, install the [optional browser dependencies](../acquisition/WEB_ACQUISITION_RUNTIME.md#browser) and choose the corresponding adapter and render mode. Scanned PDF extraction requires Tesseract for OCR.

## 3. Run the same offline check from the CLI and as an HTTP job

This fixture uses local HTML and makes no network requests to the URL in the suite.

```sh
mkdir -p .dev/inputs/replay
printf '%s\n' '<main><h1>Fixture</h1></main>' > .dev/inputs/replay/page.html
cat > .dev/inputs/replay/suite.json <<'JSON'
{"views":[{"html":"page.html","url":"https://example.org/","selectors":[{"selector":"h1","count":1}]}]}
JSON
uv run --no-sync mzizi --no-input web replay .dev/inputs/replay/suite.json
```

Start the engine in another terminal from the repository root. Use a local service token you generate for this instance and keep the server on loopback.

```sh
export ENGINE_AUTH=service
export ENGINE_HOST=127.0.0.1
export ENGINE_SERVICE_TOKEN="$(openssl rand -hex 32)"
export ENGINE_INPUT_ROOT="$PWD/.dev/inputs"
export ENGINE_ACTIVITY_STORE=files
uv run --no-sync mzizi-engine serve
```

Set the same token in the client shell and submit a job. Use the `id` returned by the POST for `JOB_ID`.

```sh
curl -fsS http://127.0.0.1:8800/capabilities \
  -H "Authorization: Bearer $ENGINE_SERVICE_TOKEN"
curl -fsS http://127.0.0.1:8800/v1/jobs \
  -H "Authorization: Bearer $ENGINE_SERVICE_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"kind":"scraping.replay","input":{"expectations":"replay/suite.json"}}'
curl -fsS "http://127.0.0.1:8800/v1/jobs/$JOB_ID" \
  -H "Authorization: Bearer $ENGINE_SERVICE_TOKEN"
```

A successful fixture returns `status: succeeded` with `result.passed: true`. Change the expected count to see how a completed job reports a mismatch. The HTTP executor keeps jobs in memory. A restart discards their state. The CLI saves its replay result under the run folder. [Engine HTTP reference](../../../source/backend/engine/README.md#operations-and-jobs)

## 4. Author a supervised crawl spec

For resumable worker-managed runs, use the separate [job spec schema](../../../source/schema/engine/job.schema.json) and [example spec](../../../source/schema/engine/_example/job.json). Copy the example to your local workspace. Replace the source URL and authority reference with the record for your scope. In the crawl stage, set `params.url`, `params.render` to `http`, a local `params.out_dir` and explicit crawl bounds such as `max_pages` and `max_depth`. Review the source assessment before running the spec.

Run a MongoDB instance and configure `MZIZI_MONGO_URL`, `MZIZI_MONGO_DATABASE`, `ENGINE_RUN_LOG_RETENTION_DAYS`, and the worker governor settings `ENGINE_HOST_REQUESTS_PER_SECOND`, `ENGINE_HOST_CONCURRENCY` and `ENGINE_HOST_DAILY_BUDGET`. Set `ENGINE_RUN_STORE=local` for the first run. Start one supervisor in a separate terminal with the same settings used to submit.

```sh
uv run --no-sync mzizi-engine supervise
```

```sh
uv run --no-sync mzizi-engine submit-run .dev/inputs/crawl-job.json
uv run --no-sync mzizi-engine show-run "$RUN_ID"
```

Use the returned `run_id` for `RUN_ID`. The spec runner currently supports `scraping.crawl` and `site.watch` stages. Governed workers require HTTP rendering. Use the CLI or a registered one-off HTTP job for other operations. The job-spec example describes inputs. It does not demonstrate a general crawl-to-seed pipeline. [Supervised runs and storage](../../../source/backend/engine/README.md#subprocess-workers)
