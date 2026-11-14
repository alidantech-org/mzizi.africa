---
id: DOC-3D7A1F5E2B04
name: Local dev workspace for engine proving
type: documentation
tags: [engine, dev, fixtures, local, plan]
extra: {status: planning_only, implementation_approved: false}
---

# 03 — Local dev workspace: `.dev/`

`.dev/` is already git-ignored (`.gitignore`), so unofficial fixtures, downloaded pages and outputs cannot be committed by accident. `mzizi dev init` creates:

```text
.dev/
  README.md              what each folder is; regenerated, safe to delete
  inputs/                PDFs, HTML pages, CSV/GeoJSON you drop in; read-only to the CLI
    pdf/  html/  data/
  manifests/             unofficial site/API structures and fetch policies (YAML) for experiments
    sites/  apis/  policies/
  outputs/<run>/         one folder per CLI run
    run.json  result.json  log.txt
    raw/ text.md tables/ records.jsonl links.csv screenshot.png rendered.html
  cache/                 fetch cache (HTTP bodies, robots) so replays are offline
  browser-profile/       throwaway Chrome profile for headed runs (never the user's profile)
  services/              generated docker-compose + volumes for Mongo/vector
```

The user's request names `.dev/(inputs|outputs)`; the extra folders keep the same convention and can be dropped if not wanted.

## Rules

1. **Inputs are never modified.** Commands read from `inputs/`, write to `outputs/`.
2. **Manifests here are experiments.** Promoting one to `seed/` follows `seed/README.md` (provenance, scope, access metadata, `uv run mzizi-manifest check`). `manifest check --root .dev/manifests` validates them with the same schemas.
3. **Path confinement.** `ENGINE_INPUT_ROOT` is set to `inputs/`; `..` escapes are rejected by the existing check. Absolute paths need an explicit flag.
4. **Labelled non-evidence.** `run.json` has `dev_run: true`. Nothing from `outputs/` may enter the filesystem registry or canonical tables through the CLI except via an explicit `fs put --s3` / `mongo load` flag that prints what will be written first.
5. **Redaction.** Cookies, tokens and auth headers captured by the browser or fetch are masked in `run.json` and logs. Third-party personal data in fetched pages stays under `.dev/`; do not paste it into tasks or commits.
6. **Retention.** `dev clean` prunes runs; `cache/` and `browser-profile/` can be deleted at any time.

## Fixture sources

- Generated: `tests/pdfmaker.py` style helpers produce synthetic PDFs and scans.
- Hand-placed: any public PDF/page you save into `inputs/`.
- Captured: `browser snapshot` and `fetch url` write rendered/raw pages into a run; `dev promote <run> <name>` copies selected files to `inputs/html/` as a stable fixture.
- Loopback: `mzizi dev serve --dir inputs/html --port 8899` serves fixtures over HTTP, so URL scraping can be proven repeatably without any live site.
