# Packages

Reusable Python capability libraries. They are libraries, not services: no package starts a server or schedules work. The engine (`source/backend/engine`) orchestrates them behind one execution boundary; packages never import engine internals, and they use each other only through public interfaces.

| Package (import) | Owns | Does not own |
|---|---|---|
| `mzizi-filesystem` (`mzizi_filesystem`) | S3 object store (existing bucket `mzizi`), hashing, access-prefix rules, deduplication within access boundaries, registry port and adapters, **seed publication** (`mzizi-publish-seed`) | The filesystem schema (task TSK-3EA8C40B0F60); a PostgreSQL registry adapter |
| `mzizi-database` (`mzizi_database`) | Safe connections and transactions, ordered SQL application, verified reset of `mzizi_new`, the `auth.baseline` seed loader, `mzizi-db` | Schema definitions: those live in `source/schema/database/<schema>` |
| `mzizi-source` (`mzizi_source`) | Polite identified fetching, rate limits, challenge detection, the collection-gate rule | Source policy and approvals (data, DB records) |
| `mzizi-scraping` (`mzizi_scraping`) | css/xpath/jsonpath/regex selection, field extraction, transforms, link discovery | Any site's structure (manifests) |
| `mzizi-extraction` (`mzizi_extraction`) | PDF text/tables, GeoJSON, CSV, JSON into segments with diagnostics | Source-specific parsers |
| `mzizi-ocr` (`mzizi_ocr`) | OCR through system Tesseract | Page layout understanding |
| `mzizi-agent` (`mzizi_agent`) | Provider-neutral model interface, tool registry, attributable proposals | Any provider, classification logic, canonical decisions |
| `mzizi-manifest` (`mzizi_manifest`) | Seed manifest and folder-metadata resolution and lock, site-structure bundle validation against `source/schema`, `mzizi-manifest` | Execution of manifests |

Country, institution, publisher and indicator knowledge is data: it lives in `seed/` manifests and database records, never in these packages.

## Workspace and commands

One uv workspace (root `pyproject.toml`, `uv.lock` committed) covers the packages and the engine; members install in editable mode so the repository checkout is the source of truth (paths to `seed/` and `source/schema/` are found from the checkout, or via `MZIZI_REPO_ROOT`, `MZIZI_SEED_ROOT`, `MZIZI_SCHEMA_ROOT`).

```bash
uv sync --all-packages              # reproducible install from uv.lock
uv run pytest source                # every package and engine test (the archive under .docs is never collected)
uv run mzizi-manifest check         # seed registry validation
uv run mzizi-publish-seed           # seed publication dry run
uv run mzizi-db init                # mzizi_new schemas and auth seed (local PostgreSQL)
```
