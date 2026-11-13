# Python capability packages

`source/packages/` contains reusable Python libraries. They are not separate HTTP services or schedulers, and they must not know a database exists; the engine owns all I/O. The Python engine in [`../backend/engine/README.md`](../backend/engine/README.md) runs their capabilities; publisher, country and other source-specific knowledge belongs in root [`seed/`](../../seed/README.md) or database records, not generic package code.

| Directory | Python distribution | Responsibility |
|---|---|---|
| [`extraction/`](extraction/README.md) | `mzizi-extraction` | PDF, GeoJSON, CSV and JSON extraction (and OCR through system Tesseract) into structured representations with diagnostics. |
| [`filesystem/`](filesystem/README.md) | `mzizi-filesystem` | Object access, hashing, deduplication, artifact metadata, uploads and seed publication. |
| [`manifest/`](manifest/README.md) | `mzizi-manifest` | Seed/folder manifest handling, lock generation and versioned site-structure validation. |
| [`scraping/`](scraping/README.md) | `mzizi-scraping` | Deterministic selector, field, transform, link-discovery and challenge-detection primitives driven by manifests. |
| [`fetch/`](fetch/README.md) | `mzizi-fetch` | Identified HTTP/API fetching, rate limits and stop rules. Gate and challenge checks are injected by the caller. |

## Workspace status

The Python workspace is defined by root `pyproject.toml` and `uv.lock`, with package and engine projects under `source/`. `uv sync --all-packages` resolves cleanly: no package depends on a database. `source/packages/filesystem` is now a pure object-store/hashing/naming library; its former database layer (repository, service, authz, sync, uploads, lineage, transitions, reset, secure, the CLI) moved into `source/backend/engine/src/mzizi_engine/filesystem/`, which is the only place in the Python workspace that opens a database connection (`mzizi_engine.ports.database`). The active database service is [`source/backend/database/`](../backend/database/README.md).

Root commands cover setup and tests (`uv sync --all-packages`, `uv run pytest source`) and package/engine CLIs such as `uv run mzizi-manifest check` and `uv run mzizi-engine filesystem sync`. Use the [root command guide](../../scripts/README.md) for current runner commands.
