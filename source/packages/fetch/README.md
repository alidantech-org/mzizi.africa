# mzizi-fetch

Polite, identified HTTP/API fetching: monitored user agent, most-conservative limits, rate limiting, robots handling, caching and stop-on-restriction rules.

The collection gate and challenge detection are injected by the caller (the engine uses its `policy` gate and `mzizi_scraping.detect_challenge`). Nothing here knows about a database.

Layout: `policy/` (typed policy, limits, identity, gate request and decision, errors), `http/` (client, cache, transport, rate limiter), `parse/` (manifest policy block to `FetchPolicy`) and `text/` (the only regex home). Contracts are frozen pydantic models; see `.docs/rules/typed-code.md`.

See [../README.md](../README.md). Tests: `uv run pytest source/packages/fetch`.
