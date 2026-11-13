---
id: DOC-3D7A1F5E2B02
name: Mzizi engine CLI command reference (proposed)
type: documentation
tags: [engine, cli, commands, plan]
extra: {status: planning_only, implementation_approved: false}
---

# 01 — Proposed `mzizi` CLI

Today the engine has `mzizi-engine serve|capabilities|check|filesystem`, plus `mzizi-manifest check|lock|report|validate-structure`. This plan adds a `mzizi` console script (the engine's `cli.py` extended; `mzizi-engine` remains an alias) grouped by function. Invoke through the root runner (`uv run mzizi …`).

## Conventions for every command

- `--input <path>`: a file or folder. Relative paths resolve under `.local/dev/inputs/`; absolute paths are accepted only with `--allow-outside-inputs` (dev machine convenience, printed as a warning).
- `--out <name>` (optional): run name; default `<UTC timestamp>-<group>-<verb>`. Output goes to `.local/dev/outputs/<run>/`.
- `--json`: print the machine result instead of the human summary. Human mode prints a short table plus the path of the run folder.
- `--manifest <path>`: a site/API structure or fetch policy YAML (fixtures in `.local/dev/manifests/`, or real ones under `seed/`).
- Exit code non-zero on failure; diagnostics are shown, never swallowed ("honest diagnostics" is a package rule).
- `--dry-run` where a command could write beyond `.local/dev/` (only `fs upload`, `mongo load`, `vector index`).

## Groups

### `mzizi dev` — workspace and health
| Command | Does |
|---|---|
| `dev init` | Create `.local/dev/{inputs,outputs,manifests,services}` and a README stub. Idempotent. |
| `dev doctor` | Report what is available: Python/uv, Tesseract, Chrome/Playwright, docker, Mongo/vector reachability, S3 env, each as ok/missing with the fix. Replaces guessing why a command fails. |
| `dev runs [--last N]` | List run folders with command, status, duration. |
| `dev show <run>` | Print the run's `result.json` summary and artifact list. |
| `dev clean [--older-than 7d]` | Remove old run folders (never inputs/manifests). |
| `dev services up|down|status [mongo|vector|all]` | Docker-compose wrapper, see [05](05-mongodb-and-vector-dev-services.md). |

### `mzizi extract` — package `mzizi-extraction`
| Command | Example | Proves |
|---|---|---|
| `extract pdf` | `mzizi extract pdf --input budget.pdf --pages 1-5` | Text, tables, per-page diagnostics, OCR fallback. Writes `text.md`, `tables/*.csv`, `result.json`. |
| `extract ocr` | `mzizi extract ocr --input scan.pdf` | Tesseract available and used; clear `OcrUnavailable` when not. |
| `extract csv|json|geojson` | `mzizi extract geojson --input wards.geojson` | Row counts, schema guess, invalid-geometry diagnostics. |
| `extract auto` | `mzizi extract auto --input <file>` | Sniffs type, picks an extractor from `EXTRACTORS`. |

### `mzizi fetch` — package `mzizi-fetch`
| Command | Example | Proves |
|---|---|---|
| `fetch url` | `mzizi fetch url https://example.org/page` | Identified user agent, robots check, rate limit, cache hit/miss, size caps; saves raw bytes + headers to the run's `raw/`. |
| `fetch robots` | `mzizi fetch robots https://example.org` | Parsed robots decision for a path and user agent. |
| `fetch policy` | `mzizi fetch policy --manifest site.yaml` | Policy parsed to `FetchPolicy`, effective limits (most conservative wins). |
| `fetch replay` | `mzizi fetch replay <run>` | Second run served from cache, no network. |

### `mzizi scrape` — package `mzizi-scraping` (+ fetch, + browser)
| Command | Example | Proves |
|---|---|---|
| `scrape url` | `mzizi scrape url --url https://… --manifest county.yaml` | Fetch → challenge check → selectors/fields/transforms → records. |
| `scrape file` | `mzizi scrape file --input page.html --manifest county.yaml` | Same, offline, from a saved page. The fastest debugging loop. |
| `scrape links` | `mzizi scrape links --url https://… [--internal-only]` | Link discovery with internal/external classification, URL normalisation. |
| `scrape select` | `mzizi scrape select --input page.html --css "h1, .title"` | One selector chain on one document; shows each fallback tried. |
| `scrape challenge` | `mzizi scrape challenge --input page.html` | Challenge/CAPTCHA/bot-wall detection verdict and the signals. |
| `scrape crawl` | `mzizi scrape crawl --url https://… --max-pages 10 --depth 2` | Bounded discovery with budgets (pages, bytes, depth, rate); writes a page inventory and link graph. Needs the gate. |
| `scrape markdown` | `mzizi scrape markdown --url https://…` | Readable Markdown from main content (see [04](04-scraping-browser-and-site-manifests.md)). |

Add `--render browser` to `scrape url|links|markdown|crawl` to use the real browser instead of plain HTTP; `--headed` to watch it.

### `mzizi browser` — real browser adapter
| Command | Does |
|---|---|
| `browser open --url …` | Launch system Chrome headed, load the URL, print title, final URL, status, load time. Leaves it open with `--hold`. |
| `browser snapshot --url …` | Save rendered HTML, screenshot, and a cookie/console/network summary. |
| `browser navigate --url … --click "a.next" --steps 3` | Scripted navigation proving pagination/JS menus. |
| `browser compare --url …` | Raw HTTP HTML vs rendered HTML: shows what only appears after JavaScript. This decides which pages need the browser. |

### `mzizi manifest` — package `mzizi-manifest`
| Command | Does |
|---|---|
| `manifest check` | Existing `mzizi-manifest check` for `seed/` (and `--root .local/dev/manifests`). |
| `manifest validate-structure <file>` | Validate a site/API structure against `source/schema/site/v1`; show path-level errors. |
| `manifest explain <file>` | Print the resolved (effective) manifest after folder inheritance. |
| `manifest lock` | Existing lock generation (seed only). |

### `mzizi fs` — package `mzizi-filesystem`
| Command | Does |
|---|---|
| `fs hash <path>` | Content hash, size, detected type, dedup key. |
| `fs put --path <folder>` | Upload to a **local in-memory/dir object store** by default; `--s3` targets the configured bucket. `--dry-run` shows planned keys. |
| `fs ls|tree|verify` | Existing `mzizi-engine filesystem …` commands, re-exported. |

### `mzizi mongo` and `mzizi vector` — dev services (see [05](05-mongodb-and-vector-dev-services.md))
`mongo test`, `mongo load --run <run>`, `mongo find`, `mongo drop-dev`; `vector test`, `vector index --run <run>`, `vector search "<query>"`, `vector classify --input <text|run>`, `vector drop-dev`.

### `mzizi capability` — direct and generic
| Command | Does |
|---|---|
| `capability list` | Today's `capabilities` JSON, as a table with version, package, cpu-bound. |
| `capability run <name> --payload payload.json` | Run any registered capability with a raw payload: the escape hatch, identical to `POST` on the HTTP API. |

## Example session

```bash
uv run mzizi dev init && uv run mzizi dev doctor
cp ~/Downloads/county-budget.pdf .local/dev/inputs/
uv run mzizi extract pdf --input county-budget.pdf
uv run mzizi scrape links --url https://example.go.ke --internal-only
uv run mzizi browser compare --url https://example.go.ke/news
uv run mzizi dev show last
```

## Output contract

Every run folder contains `run.json` (command, arguments, versions of packages used, start/end, exit status, `dev-run: true`), `result.json` (typed result), `log.txt`, and command-specific artifacts (`raw/`, `text.md`, `tables/`, `screenshot.png`, `rendered.html`, `records.jsonl`, `links.csv`). The shape is a typed model so the same files can later be fed to the real pipeline.
