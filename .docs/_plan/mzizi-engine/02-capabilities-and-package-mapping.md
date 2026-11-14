---
id: DOC-3D7A1F5E2B03
name: Engine capabilities and package mapping
type: documentation
tags: [engine, capabilities, packages, plan]
extra: {status: planning_only, implementation_approved: false}
---

# 02 — Capabilities and package mapping

## How the engine reaches a package

`capabilities.py` registers `Capability(name, version, package, description, handler, input_schema, cpu_bound)`. A handler is a module-level function `dict -> dict`, so it can run in a worker process. File input goes through `_bytes_input`: either `content_base64` or a `path` confined to `ENGINE_INPUT_ROOT` (default: `seed/`). The dev CLI sets `ENGINE_INPUT_ROOT=.dev/inputs` for its own process, so a local PDF path works with no code change to the packages. A website URL is different: no capability currently fetches, so the CLI needs new fetch-based capabilities (below).

## Status per package

| Package | Public surface today | Engine capability today | Gap to prove live |
|---|---|---|---|
| `mzizi-extraction` | `EXTRACTORS` (pdf, geojson, csv, json), `ExtractionProfile`, `Limits`, `encode_output`, OCR | `extraction.pdf/geojson/csv/json` | CLI wrapper, `--pages`, writing text/tables to disk, OCR capability and Tesseract doctor check, `extract auto` |
| `mzizi-fetch` | `PoliteFetcher`, `FetchPolicy`, `RateLimiter`, robots, cache, `GateCheck` injection | none (only `source.gate`) | `fetch.url`, `fetch.robots`, `fetch.policy` capabilities; engine supplies the gate and `detect_challenge` callbacks as designed |
| `mzizi-scraping` | `extract_links`, selectors, fields, transforms, `detect_challenge`, `parse_module/selectors/transform` | `scraping.links` | `scraping.extract` (apply a structure to a document), `scraping.select`, `scraping.challenge` capabilities |
| `mzizi-manifest` | seed registry, lock, effective manifests, structure validation | `manifest.check_seeds`, `manifest.validate_structure` | `manifest.explain`; run against `.dev/manifests` |
| `mzizi-filesystem` | object store protocol (memory, S3), hashing, naming | `filesystem.sync` | `filesystem.hash`, local-directory object store for dev |
| `mzizi-database-client` | typed client for the Rust database service | none | Out of scope here; engine-to-database proof is a separate effort |

## New capabilities (proposed names)

`fetch.url`, `fetch.robots`, `fetch.policy`, `scraping.extract`, `scraping.select`, `scraping.challenge`, `scraping.markdown`, `scraping.crawl`, `browser.render`, `browser.compare`, `extraction.ocr`, `extraction.auto`, `manifest.explain`, `filesystem.hash`, and the dev-only `devservice.mongo.*` / `devservice.vector.*`. Each gets a versioned input schema and a typed output, following the existing pattern. `scraping.crawl` and `browser.*` are long-running and use the executor's job path rather than a synchronous handler.

## Capability contract additions

- `network: bool` and `requires_gate: bool` flags on `Capability`, so the CLI can refuse unsafe combinations and `dev doctor` can list them.
- `artifacts: list[ArtifactKind]` declaring what a run may write (text, tables, raw, screenshot), so the run folder layout is derived, not hand-written per command.
- `dev_only: bool` for Mongo/vector capabilities, which the production HTTP app must not expose.

## Unit-testing strategy per package (what "test as units" means)

1. **Package unit tests stay in-process and pure.** Extraction: bytes in, `Output` out; fixtures generated in code (`tests/pdfmaker.py` already builds PDFs) or tiny committed samples. Scraping: HTML string + selector chain in, fields out. Fetch: inject a fake transport (`http/transport.py`) so rate limits, caches, robots and stop rules are tested without a network. Manifest: temp folder trees.
2. **Engine capability tests** call `registry.get(name).handler(payload)` with the same payloads the CLI builds, and one test per capability asserts the CLI argument → payload mapping.
3. **CLI smoke tests** run `mzizi <cmd> --json` on committed micro-fixtures (a one-page PDF, a 20-line HTML page, a local `http.server` serving it) and assert exit code and result keys. This covers "can the engine connect to a local path / a URL" automatically, without touching the internet: a loopback server stands in for a website.
4. **Live proving** (this plan's main output) uses real files and sites, never in CI.

Reduction rule: a bug found live becomes a minimal fixture + unit test in the owning package in the same change.
