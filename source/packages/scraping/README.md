# mzizi-scraping

Deterministic HTML/JSON scraping primitives.

The engine's `mzizi scrape file|url` commands apply site modules using these primitives. Browser sessions and source policy are owned by the engine. See [single-page extraction](../../../.docs/design/acquisition/WEB_ACQUISITION_RUNTIME.md#single-page-extraction).

Selectors, fields and transforms are named by manifests; arbitrary code is never evaluated.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/scraping`.

## Layout

`selectors/` fallback chains, `extract/` field extraction, `transforms/` allow-listed transforms, `links/` link discovery, `challenge/` access-challenge detection (moved from the former `mzizi-source` package).

`links/page.py` adds `page_meta` (title, canonical, `rel=next` pagination, advertised sitemaps), `parse_sitemap` (URLs and sitemap indexes, without resolving entities) and `sitemaps_from_robots`; `extract_references` lists every link, image, media, embed and frame URL with its tag.
