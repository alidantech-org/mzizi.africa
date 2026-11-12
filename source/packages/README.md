# Python capability packages

`source/packages/` contains reusable Python libraries. They are not separate HTTP services or schedulers. The Python engine in [`../backend/engine/README.md`](../backend/engine/README.md) runs their capabilities; publisher, country and other source-specific knowledge belongs in root [`seed/`](../../seed/README.md) or database records, not generic package code.

| Directory | Python distribution | Responsibility |
|---|---|---|
| [`agent/`](agent/README.md) | `mzizi-agent` | Provider-neutral model and tool interfaces; returns attributable proposals, not canonical decisions. |
| [`extraction/`](extraction/README.md) | `mzizi-extraction` | PDF, GeoJSON, CSV and JSON extraction into structured representations with diagnostics. |
| [`filesystem/`](filesystem/README.md) | `mzizi-filesystem` | Object access, hashing, deduplication, artifact metadata, uploads and seed publication. |
| [`manifest/`](manifest/README.md) | `mzizi-manifest` | Seed/folder manifest handling, lock generation and versioned site-structure validation. |
| [`ocr/`](ocr/README.md) | `mzizi-ocr` | OCR through the system Tesseract executable and language packs. |
| [`scraping/`](scraping/README.md) | `mzizi-scraping` | Deterministic selector, field, transform and link-discovery primitives driven by manifests. |
| [`source/`](source/README.md) | `mzizi-source` | Identified fetching, rate limits, challenge handling and collection-gate checks. |

## Workspace status

The intended Python workspace is defined by root `pyproject.toml` and `uv.lock`, with package and engine projects under `source/`. There is currently no `source/packages/database/` directory, although `source/packages/filesystem/pyproject.toml` and `source/backend/engine/pyproject.toml` still reference a `mzizi-database` workspace member and code imports it. As a result, a fresh `uv sync --all-packages` currently fails to resolve. The active TypeScript database service is [`source/backend/database/`](../backend/database/README.md); this does not satisfy the unresolved Python import contract.

Once that workspace mismatch is resolved, root commands cover setup and tests (`uv sync --all-packages`, `uv run pytest source`) and package CLIs such as `uv run mzizi-manifest check` and `uv run mzizi-filesystem sync`. Use the [root command guide](../../scripts/README.md) for current runner commands.
