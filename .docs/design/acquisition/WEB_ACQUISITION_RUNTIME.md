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
| Browser | `mzizi_engine.web.browser` | adapter interface, Playwright adapter on installed Chrome, action scripts, challenge detection | Implemented (one adapter) |
| Crawler | `mzizi_engine.web.crawl` | breadth-first crawl, inventories, resume, exports | Implemented |
| Search | `mzizi_engine.web.search` | Brave Search API and Google Custom Search JSON API behind one interface | Implemented, tested with mocked APIs only |

## Policy

- `robots.txt` is read once per origin with the crawler's identity and recorded for every request. The default mode is `respect`.
- A source-specific `override` mode exists in `SourcePolicy`. It is refused unless an `Authorization` (reference, approved hosts, rationale) is supplied, applies only to those hosts, and is written to `policy_audit.json` with the reference. The code cannot verify an authorisation; the source assessment that backs it is the caller's responsibility (`AGENTS.md`, "Research acquisition and browser automation").
- External hosts are listed, never requested, by the crawler. Downloads may fetch from any public host under an explicit `DownloadPolicy`; hosts resolving to private, loopback, link-local or reserved addresses are refused unless allowed.
- A request needs an identified user agent with a monitored contact (`MZIZI_USER_AGENT`), as `mzizi_fetch.resolve_user_agent` requires.

## Blocks and challenges

Failures are told apart (`connection`, `dns`, `timeout`, `http_401`, `http_403`, `http_404`, `http_429`, `http_5xx`, `captcha`, `challenge`, `block_notice`). Each gets a configured response (`retry`, `back_off`, `slow_down`, `pause`, `retry_later`, `skip`, `stop`, `human_review`), a wait that honours `Retry-After`, and a `BlockDecision` record. Repeated consecutive blocks escalate to `stop`. A blocked URL never ends unrelated work: it is recorded in `errors.*`/`blocks.json` and the crawl continues.

Detection and resolution are separate. Detection is implemented. Resolution is a `ChallengeHandler`; the only implementation is `ManualChallengeHandler`, which asks a person to complete the check in the visible window (`--on-block pause --headed`). **No automated CAPTCHA solving, stealth patching or fingerprint spoofing exists.** An adapter approved by a source owner would implement the same interface.

## Browser

`BrowserSession` is a protocol (`goto`, `wait_for`, `click`, `fill`, `press`, `scroll`, `page_state`, `links`, `images`, `screenshot`, `close`) and `register_adapter` adds implementations. The Playwright adapter launches the installed Chrome in an isolated profile (`.local/dev/browser-profile` by default; personal browser profiles are refused), with configurable viewport, locale, headers, timeouts, download and screenshot folders, and records console errors, failed requests, redirects and captured downloads. Playwright is an optional extra (`uv sync --all-packages --extra browser`); HTTP-only installs are unaffected.

## Crawl outputs

`mzizi web crawl` writes, in the run folder: `pages`, `paths`, `links`, `internal_urls`, `external_urls`, `external_hosts`, `images`, `documents`, `files`, `media`, `errors` (each as CSV and JSON; JSON Lines with `--jsonl`), plus `summary.json`, `site_tree.json`, `blocks.json`, `policy_audit.json`, `provenance.jsonl`, `raw/`, `markdown/` and `state.json`. Rows are sorted by their columns, so equal inputs give equal files. `mzizi web resume FOLDER` continues from `state.json`; the state is bound to a digest of the crawl's scope.

## Not implemented

Manifest-driven field extraction (`scrape file|url`), `fetch policy`, `fetch replay`, DuckDuckGo search (no official API), MongoDB and vector sandboxes, challenge-solving integrations, crawl-time resource `HEAD` for external hosts (by design), and live verification of the search integrations with real credentials.
