# Python capability packages

`source/packages/` contains reusable Python libraries. They are not separate HTTP services or schedulers, and they must not know a database exists; the engine owns all I/O. The Python engine in [`../backend/engine/README.md`](../backend/engine/README.md) runs their capabilities; publisher, country and other source-specific knowledge belongs in root [`seed/`](../../seed/README.md) or database records, not generic package code.

| Directory | Python distribution | Responsibility |
|---|---|---|
| [`browser/`](browser/README.md) | `mzizi-browser` | Browser automation behind `BrowserOrchestrator`: interchangeable Playwright/Patchright sessions, tabs, navigation, media inventory, pagination detection, challenge detection and actions. |
| [`cli/`](cli/README.md) | `mzizi-cli` | The `mzizi` command line: a front door that builds the engine runtime and calls its exposed operations. The only package allowed to import `mzizi_engine`. |
| [`crawler/`](crawler/README.md) | `mzizi-crawler` | All web acquisition behind `CrawlerOrchestrator`: crawling, selectors and scraping, survey, sections, attachments, downloads, ranking, inspection, site watching, site-structure bundles and the local evidence store. |
| [`extraction/`](extraction/README.md) | `mzizi-extraction` | PDF, GeoJSON, CSV and JSON extraction (and OCR through system Tesseract) into structured representations with diagnostics. |
| [`fetch/`](fetch/README.md) | `mzizi-fetch` | Identified HTTP/API fetching, rate limits and stop rules (gate and challenge checks injected), plus the web core: URL handling, source and block policy, an HTTP client and a safe streaming downloader. |
| [`filesystem/`](filesystem/README.md) | `mzizi-filesystem` | Versioned files at caller-chosen placements: object keys, hashing, deduplication, retention, lineage, relocation, uploads and directory sync behind one `FilesystemOrchestrator`. No database knowledge. |
| [`manifest/`](manifest/README.md) | `mzizi-manifest` | Seed and folder manifest handling and lock generation. |
| [`search/`](search/README.md) | `mzizi-search` | Search through official Brave and Google APIs behind one `SearchOrchestrator`; kept for when API-based search is wanted (search by scraping result pages belongs to the crawler). |

Persistence is not a package: PostgreSQL, MongoDB and the (skeleton) vector store are handled by the engine in `source/backend/engine/src/mzizi_engine/persistence/`, and data types and models (JSON payloads, operations, policy) are the engine's own. Test fixtures (a loopback website and safe environment defaults) sit beside the tests that use them, in each package's `tests/` folder.

## Workspace status

The Python workspace is defined by root `pyproject.toml` and `uv.lock`, with package and engine projects under `source/`. `uv sync --all-packages` resolves cleanly: no package depends on a database. `source/packages/filesystem` holds all filesystem logic and never knows a database exists; the engine implements its registry port in `mzizi_engine.persistence.filesystem`. The active database service is [`source/backend/database/`](../backend/database/README.md).

Root commands cover setup and tests (`uv sync --all-packages`, `uv run pytest source`) and package/engine CLIs such as `uv run mzizi-manifest check` and `uv run mzizi-engine filesystem sync`. Use the [root command guide](../../scripts/README.md) for current runner commands.
