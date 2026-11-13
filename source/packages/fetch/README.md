# mzizi-fetch

Polite, identified HTTP/API fetching: monitored user agent, most-conservative limits, rate limiting, robots handling, caching and stop-on-restriction rules.

The collection gate and challenge detection are injected by the caller (the engine uses its `policy` gate and `mzizi_scraping.detect_challenge`). Nothing here knows about a database.

Layout: `policy/` (typed policy, limits, identity, gate request and decision, errors), `http/` (client, cache, transport, rate limiter), `parse/` (manifest policy block to `FetchPolicy`) and `text/` (the only regex home). Contracts are frozen pydantic models; see `.docs/rules/typed-code.md`.

See [../README.md](../README.md). Tests: `uv run pytest source/packages/fetch`.

## Web core (`web/`)

Reusable web transport and policy, separate from the gate-driven `PoliteFetcher`: `urls` (normalise, classify, deduplicate, scope), `vocabulary` (typed classification data from `source/schema/web/vocabulary.v1.yaml`), `policy` (`SourcePolicy`: hosts, paths, budgets, robots mode with a recorded authorisation, audited `Decision`s), `blocks` (failure kinds, configured responses, `BlockDecision` records, challenge detection), `client` (`WebClient`: GET/HEAD, conditional requests, bounded retries with jittered backoff, per-host spacing, concurrency, provenance) and `download` (`Downloader`: streaming, resume with validators, size verification, SHA-256, duplicate detection, type sniffing, private-address refusal, concurrency). Tests use `httpx.MockTransport`; no network. Design: `.docs/design/acquisition/WEB_ACQUISITION_RUNTIME.md`.
