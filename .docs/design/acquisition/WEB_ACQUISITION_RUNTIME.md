---
{id: DOC-WEB-ACQUISITION-RUNTIME,name: WEB_ACQUISITION_RUNTIME,type: documentation,tags: [website,crawl,browser,download,search,engine]}
---

# Web acquisition runtime (implemented state)

This document describes what the code does today. Proposals stay in `design/acquisition/CRAWL_AND_PURPOSE_DETECTION.md` and `.docs/_plan/mzizi-engine/`.

## Layers and owners

| Layer | Package / module | Responsibility | Status |
|---|---|---|---|
| URL handling | `mzizi_fetch.web.urls` | normalisation, tracking-parameter removal, scope, classification, deduplication | Implemented |
| Classification data | `source/schema/web/vocabulary.v1.yaml` (+ `.schema.json`) | extensions by URL kind, challenge markers, file signatures, default block responses | Implemented (data, not code) |
| Source policy | `mzizi_fetch.web.policy` | allowed hosts/paths, budgets, robots mode, authorisation record, audited decisions | Implemented |
| Block policy | `mzizi_fetch.web.blocks` | classify failures, configured response, recorded reason | Implemented |
| HTTP client | `mzizi_fetch.web.client` | GET/HEAD, conditional requests, retries with backoff and jitter, spacing, concurrency, provenance | Implemented |
| Downloads | `mzizi_fetch.web.download` | streaming, resume, size check, SHA-256, duplicate detection, type sniffing, private-address refusal | Implemented |
| Page discovery | `mzizi_scraping.links` | references (links, images, media, embeds), canonical, pagination, sitemaps | Implemented |
| HTML to Markdown | `mzizi_extraction.document` | structure, inline emphasis, link targets, table cells, learned header/footer/navigation removal | Implemented |
| Browser | `mzizi_engine.web.browser` | Playwright on system Chrome, Patchright on bundled Chromium, action scripts and challenge detection | Implemented |
| Single-page extraction | `mzizi_engine.web.handlers.scrape` | site module validation, field extraction from saved, fetched or rendered HTML, capture and audit | Implemented |
| Site profile, family and draft | `mzizi_scraping.profile`, `mzizi_engine.web.handlers.survey` | sections, coarse page templates, repeated blocks, shared navigation, family similarity score, draft bundle for review | Implemented; heuristics, drafts are proposals |
| Crawler | `mzizi_engine.web.crawl` | breadth-first crawl, inventories, resume, exports | Implemented |
| Search | `mzizi_engine.web.search` | Brave Search API and Google Custom Search JSON API behind one interface | Implemented, tested with mocked APIs only |

## Policy

- `robots.txt` is read once per origin with the crawler's identity and recorded for every request. The default mode is `respect`.
- A source-specific `override` mode exists in `SourcePolicy`. It is refused unless an `Authorization` (reference, approved hosts, rationale) is supplied, applies only to those hosts, and is written to `policy_audit.json` with the reference. The code cannot verify an authorisation; the source assessment that backs it is the caller's responsibility (`AGENTS.md`, "Research acquisition and browser automation").
- The crawler queues links within the configured scope. Browser collection checks scope and robots before each requested page and rejects captures whose final URL is outside policy. Chromium can still follow redirects or load embedded resources during rendering. Choose HTTP for collection that requires outbound destination controls at the application layer. Downloads use their own `DownloadPolicy`, which refuses private, loopback, link-local and reserved addresses unless allowed.
- A request needs an identified user agent with a monitored contact (`MZIZI_USER_AGENT`), as `mzizi_fetch.resolve_user_agent` requires.

## Blocks and challenges

Failures are told apart (`connection`, `dns`, `timeout`, `http_401`, `http_403`, `http_404`, `http_429`, `http_5xx`, `captcha`, `challenge`, `block_notice`). Each gets a configured response (`retry`, `back_off`, `slow_down`, `pause`, `retry_later`, `skip`, `stop`, `human_review`), a wait that honours `Retry-After`, and a `BlockDecision` record. Repeated consecutive blocks escalate to `stop`. A blocked URL never ends unrelated work: it is recorded in `errors.*`/`blocks.json` and the crawl continues.

Detection runs on responses from either browser adapter. A headed crawl with `--on-block pause` can use `ManualChallengeHandler` to hand a check to an operator under source authorisation. Single-page extraction records detected blocks and returns without extracting records.

## Browser

`BrowserSession` is a protocol and `register_adapter` adds implementations. Select `--adapter playwright` for system Chrome or `--adapter patchright` for Patchright's bundled Chromium. The CLI uses separate isolated profiles in the dev workspace. Both drivers come from the optional `browser` extra (`uv sync --all-packages --extra browser`). Install the bundled Chromium with `uv run --package mzizi-engine --extra browser patchright install chromium`. Use `uv run --no-sync mzizi` after syncing to retain the optional dependencies.

## Single-page extraction

Pass a `modules/*.yml` file from a [site structure](SITE_STRUCTURE_SPEC.md) to `scrape file PAGE.html --manifest MODULE` or `scrape url URL --manifest MODULE`. The engine validates the module schema before requesting a page. The explicit URL identifies the page to retrieve. The module supplies `discover.listing.items` and `extract.fields` for that page.

```yaml
module: headings
discover:
  listing:
    url: /
    items: { css: "h1" }
extract:
  fields:
    title: { from: item_text }
```

Add `--render browser --adapter patchright` to extract from a rendered DOM. The live command saves successful captures as `page.html` and includes the observation time, requested and final URLs, capture and module SHA-256 hashes, policy decisions, selected fallback index and field errors in its result. `scrape select PAGE.html --css "h1"` returns matching text from a saved page.

## Browser tabs

The shared dev browser keeps one working tab per site (`mzizi_engine.web.browser.tabs`): a registry maps host to tab, a per-site file lease keeps two commands off one tab, and different sites proceed in parallel. At most two tabs per site (working tab plus one pop-up at a time); pop-ups and `target=_blank` links are tracked on the page result. Above 24 tabs, idle least-recently-used tabs close.

## Site folders, change detection and naming

`mzizi_engine.layout` owns every path under `.dev/` (`websites/<reversed public-suffix labels>/<registrable label>/<host label>/`). `mzizi_engine.names` gives readable deterministic names: pages by URL path, files by server name, URL name or descriptive link text with `--<sha8>`, images by file or alt text, tables by caption or heading. `mzizi_scraping.change` fingerprints a page in layers (raw bytes, normalised DOM, text, link set, per-heading blocks) and compares two visits, ignoring blocks that changed on two visits in a row. `mzizi_engine.sitestore` keeps the current page files, moves the previous ones to `versions/` with a `change.md` only on a meaningful change, and records state in MongoDB (`sites`, `pages`, `page_versions`, `generated_files`, `site_links`). Pages missing from three complete crawls are marked gone. Screenshots are best effort: a stalled capture is skipped and logged.

## Activity store and download queue

Engine-built records live in MongoDB (`mzizi_engine.activity`): crawl rows (`crawl_<table>`), run summaries with the block, policy and site-tree audit (`crawl_runs`), provenance, the download queue (`download_queue`: queued, downloading, done, failed, attempts, error, result), the file catalog (`downloads`), `site_profiles`, `family_reports` and `expectation_scores`. CSV exports, Markdown, raw HTML, screenshots and all downloaded bytes remain files; CSVs are linked in `crawl_csv_files` with path, hash and row count. Without MongoDB the same records are written as JSON files.

## Crawl outputs

`mzizi web crawl` writes, in the run folder: `pages`, `paths`, `links`, `internal_urls`, `external_urls`, `external_hosts`, `images`, `documents`, `files`, `media`, `errors` (each as CSV and JSON; JSON Lines with `--jsonl`), plus `summary.json`, `site_tree.json`, `blocks.json`, `policy_audit.json`, `provenance.jsonl`, `raw/`, `markdown/` and `state.json`. Rows are sorted by their columns, so equal inputs give equal files. `mzizi web resume FOLDER` continues from `state.json`; the state is bound to a digest of the crawl's scope.

## Not implemented

Full bundle execution with inheritance, pagination and mapping, `fetch policy`, `fetch replay`, DuckDuckGo search, MongoDB and vector sandboxes, automated challenge resolution and live verification of the search integrations.
