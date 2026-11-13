# mzizi-scraping

Deterministic HTML/JSON scraping primitives.

Selectors, fields and transforms are named by manifests; arbitrary code is never evaluated.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/scraping`.

## Layout

`selectors/` fallback chains, `extract/` field extraction, `transforms/` allow-listed transforms, `links/` link discovery, `challenge/` access-challenge detection (moved from the former `mzizi-source` package).
