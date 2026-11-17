---
{id: DOC-WEB-ACQUISITION-RUNTIME,name: WEB_ACQUISITION_RUNTIME,type: documentation,tags: [website,crawl,browser,download,search,engine]}
---

# Web acquisition runtime (implemented state)

This document describes what the code does today. Proposals stay in `design/acquisition/CRAWL_AND_PURPOSE_DETECTION.md` and `.docs/_plan/mzizi-engine/`.

## Layers and owners

| Layer | Package / module | Responsibility | Status |
|---|---|---|---|
| URL handling | `mzizi_fetch.web.urls` | normalisation, tracking-parameter removal, scope, classification, deduplication | Implemented |
| Classification data | `seed/engine/web/classification.yaml` (schema: `source/schema/engine/web.schema.json`) | extensions by URL kind, challenge markers, file signatures, default block responses | Implemented (data, not code) |
| Source policy | `mzizi_fetch.web.policy` | allowed hosts/paths, budgets, robots mode, authorisation record, audited decisions | Implemented |
| Block policy | `mzizi_fetch.web.blocks` | classify failures, configured response, recorded reason | Implemented |
| HTTP client | `mzizi_fetch.web.client` | GET/HEAD, conditional requests, retries with backoff and jitter, spacing, concurrency, provenance | Implemented |
| Downloads | `mzizi_fetch.web.download` | streaming, resume, size check, SHA-256, duplicate detection, type sniffing, private-address refusal | Implemented |
| Page discovery | `mzizi_crawler.shared.scraping.links` | references (links, images, media, embeds), canonical, pagination, sitemaps | Implemented |
| HTML to Markdown | `mzizi_extraction.document` | structure, inline emphasis, link targets, table cells, learned header/footer/navigation removal | Implemented |
| Browser | `mzizi_browser` | Playwright on system Chrome, Patchright on bundled Chromium, action scripts and challenge detection | Implemented |
| Single-page extraction | `mzizi_crawler.features.scrape` | site module validation, field extraction from saved, fetched or rendered HTML, capture and audit | Implemented |
| Site profile, family and draft | `mzizi_crawler.shared.scraping.profile`, `mzizi_crawler.features.survey` | sections, coarse page templates, repeated blocks, shared navigation, family similarity score, draft bundle for review | Implemented; heuristics, drafts are proposals |
| Crawler | `mzizi_crawler.shared.engine` | breadth-first crawl, inventories, resume, exports | Implemented |
| Search | `mzizi_search` package (`SearchOrchestrator`); the engine keeps only the environment settings and the `search.web` operation in `runtime/assembly/` | Brave Search API and Google Custom Search JSON API behind one interface | Implemented, tested with mocked APIs only |

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

Pass a `modules/*.yml` file from a [source bundle](site-structure-authoring.md) to `scrape file PAGE.html --manifest MODULE` or `scrape url URL --manifest MODULE`. The engine validates the module schema before requesting a page. The explicit URL identifies the page to retrieve. The module supplies `discover.listing.items` and `extract.fields` for that page.

```yaml
module: headings
discover:
  listing:
    url: /
    items:
      - { css: "h1" }
extract:
  fields:
    title: { from: item_text }
```

Add `--render browser --adapter patchright` to extract from a rendered DOM. The live command saves successful captures as `page.html` and includes the observation time, requested and final URLs, capture and module SHA-256 hashes, policy decisions, selected fallback index and field errors in its result. `scrape select PAGE.html --css "h1"` returns matching text from a saved page.

## Offline coverage replay

Use `mzizi web replay EXPECTATIONS.json` with files under `.dev/inputs`. HTTP clients submit the same `scraping.replay` operation through `POST /v1/jobs` using a suite path relative to the configured `ENGINE_INPUT_ROOT`. Replay works offline. Use an operator-controlled workspace containing files approved for these callers. The existing suite contract lists `views` with `html` and `url` and optional checks for the source SHA-256, table count, data rows, exact cells, Markdown URLs, PDF link count, CSS image occurrences, CSS selector counts and terminal pagination state. Paths are relative to the suite file. A capture can also reference a saved rendered media inventory. Replay checks its recorded URLs and selectors against the saved DOM. Recreating browser-computed styles requires the page's stylesheet and browser state.

A suite can also list `pdfs` with saved paths and expectations for page counts, table locations, row counts and exact cells. PDF replay runs the multi-strategy table extractor.

The HTTP job stores its report as the result. The CLI saves it in the run’s `result.json`. A mismatch sets `passed` to false and the CLI exits nonzero. A malformed suite or out-of-workspace reference fails the operation. The small checked fixture that showed the format was in the old seed tree, now archived; it returns with the rebuilt `seed/_fixtures/`. Counts and CSS selectors can be paired with exact row and cell expectations to detect offset columns or omitted references.

## Rendered media inventory

Use `--rendered-media --render browser` with `web markdown`, `web crawl` or `web sections`. Each observed browser view records computed CSS backgrounds, pseudo-element backgrounds, selected images, declared lazy sources, and picture or responsive candidates. References carry their selector, visibility and, when available, label and nearby item URL. In auto mode, a browser startup failure or missing browser response preserves the successful HTTP capture and is recorded as `browser_unavailable` in listing evidence. If rendered media was requested, it also counts as a media gap. Browser refusals and access challenges are preserved. Crawls include the references in their link and image inventories. Markdown links visible backgrounds and selected images. Section reports link their media sidecars and augment each view's references.

The scan covers the top-level DOM and reports its 20,000-element cap. Page and crawl captures scroll up to six declared lazy image targets per view and report the number attempted. Section captures inspect the current panel. Uninspected frame documents and open shadow roots are counted as media gaps. Resource fetches needed by the browser may occur. The acquisition pass cancels browser downloads and saves image URLs as evidence. It cannot establish that a referenced asset loaded successfully or capture assets that exist only inside network activity, shadow roots or frames.

## Tables and weak DOMs

HTML captures keep a structured table sidecar beside Markdown when tables are present. `rowspan`, `colspan` and row groups determine grid positions. Original cells include their positions, spans and Markdown link targets. Markdown combines consecutive header rows into a single pipe-table header. The sidecar retains the original header rows and individual cell spans. One-column HTML tables remain visible in the output.

`scrape url URL --manifest MODULE --render auto` runs the manifest's repeated-item selector chain against HTTP markup first. If the result falls short of the module's `expect.min_items`, `expect.max_items` or `expect.required_fields`, it evaluates a rendered alternative. It records the hashes, capture paths, counts and selected approach. The module result remains reviewable when both alternatives fail the expectations. Crawl evidence also accepts `--listing-selector` for the listing region and `--item-selector` for repeated cards.

## Page readiness and pagination

Chromium waits for a bounded load and DOM stabilization period. A crawl's `listings.json` reports virtual browser states as `#page-N` and records the action, content signature, source hash and new table rows and list items. The URL fetch budget and browser view cap are separate. The crawler follows ordinary Next URLs within source scope and reports whether it captured the continuation. Multiple explicit seed URLs are allowed even when their paths match and only their query strings differ. Transient navigation failures are retained as deferred work and keep the run incomplete. Resume retries those URLs after loading saved pages. Older state files with timeout errors and no deferred-work field are recovered on load. New state files retain the original request for CLI resume. A request with a different scope is refused before overwriting state. State updates use the engine's atomic file writer.

Disabled Next, no continuation, last advertised numbered page, repeated content, timeout, ambiguous control, budget and scroll stabilization have separate stop reasons. Scroll stabilization leaves the listing end unconfirmed. The run summary separately counts gaps in listing evidence, including unsaved continuation destinations. Pagination controls still depend on detectable markup or caller-supplied listing scope.

## Same-document listing sections

`mzizi web sections URL` recognizes advertised tabs and disclosures. It reads preloaded panels and renders missing content or supported continuations as needed. Use `--render browser` to verify activation. The run saves the initial page, optional rendered page, per-view HTML, Markdown and table or media sidecars, and `sections.json` with coverage counts, source hashes and terminal reasons. Ordinary URL continuations and unsupported scroll controls are reported for the scoped crawler.

## Attachment planning and download

Start with `web crawl URL --references-only` to keep probable extensionless downloads as references.

`mzizi --allow-outside-inputs download select RUN --rules RULES.yml --max-bytes 1048576 --max-files 10` scores crawl references with the existing ranking schema. It records the source page, anchor and nearby heading. Scoped HEAD probes reserve bytes for candidates above the threshold. Unknown sizes, out-of-scope URLs and budget overflow are reported separately.

`--apply` submits the selected set to the existing downloader with each file capped at its reserved size. `--review USEFUL.json` accepts an array of previously reviewed useful URLs. The ledger records saved bytes, including partial downloads, and can report bytes per distinct reviewed document. It preserves the detected file type and flags. An HTML response at an attachment URL is recorded as an unexpected web response and excluded from the useful-document count. That measure excludes HTTP overhead and any excess data discarded at the limit. The existing crawl, queue and download commands are available independently.

## Browser tabs

The shared dev browser keeps one working tab per site (`mzizi_browser.features.session.tabs`): a registry maps host to tab, a per-site file lease keeps two commands off one tab, and different sites proceed in parallel. At most two tabs per site (working tab plus one pop-up at a time); pop-ups and `target=_blank` links are tracked on the page result. Above 24 tabs, idle least-recently-used tabs close.

## Site folders, change detection and naming

`mzizi_crawler.shared.layout` owns every path under `.dev/` (`websites/<reversed public-suffix labels>/<registrable label>/<host label>/`). `mzizi_crawler.shared.names` gives readable deterministic names: pages by URL path, files by server name, URL name or descriptive link text with `--<sha8>`, images by file or alt text, tables by caption or heading. `mzizi_scraping.change` fingerprints a page in layers (raw bytes, normalised DOM, text, link set, per-heading blocks) and compares two visits, ignoring blocks that changed on two visits in a row. `mzizi_engine.sitestore` keeps the current page files, moves the previous ones to `versions/` with a `change.md` only on a meaningful change, and records state in MongoDB (`sites`, `pages`, `page_versions`, `generated_files`, `site_links`). Pages missing from three complete crawls are marked gone. Screenshots are best effort: a stalled capture is skipped and logged.

## Activity store and download queue

Engine-built records live in MongoDB (the engine's `persistence/mongo/activity.py`, behind the crawler's `Activity` port): crawl rows (`crawl_<table>`), run summaries with the block, policy and site-tree audit (`crawl_runs`), provenance, the download queue (`download_queue`: queued, downloading, done, failed, attempts, error, result), the file catalog (`downloads`), `site_profiles`, `family_reports` and `expectation_scores`. CSV exports, Markdown, raw HTML, screenshots and all downloaded bytes remain files; CSVs are linked in `crawl_csv_files` with path, hash and row count. Without MongoDB the same records are written as JSON files.

## Crawl outputs

`mzizi web crawl` writes, in the run folder: `pages`, `paths`, `links`, `internal_urls`, `external_urls`, `external_hosts`, `images`, `documents`, `files`, `media`, `errors` (each as CSV and JSON; JSON Lines with `--jsonl`), plus `summary.json`, `site_tree.json`, `blocks.json`, `policy_audit.json`, `provenance.jsonl`, `raw/`, `markdown/` and `state.json`. Crawl discovery reuses one parsed HTML tree for page metadata, pagination discovery and contextual references. The raw capture is preserved for replay. Rows are sorted by their columns, so equal inputs give equal files. `mzizi web resume FOLDER` continues from `state.json`; the state is bound to a digest of the crawl's scope.

## Not implemented

Full bundle execution with inheritance, pagination and mapping, `fetch policy`, `fetch replay`, DuckDuckGo search, MongoDB and vector sandboxes, automated challenge resolution and live verification of the search integrations.
