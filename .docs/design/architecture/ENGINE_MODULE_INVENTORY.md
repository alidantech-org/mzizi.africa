---
id: DOC-ENGINE-MODULE-INVENTORY-20261116
name: ENGINE_MODULE_INVENTORY
type: documentation
tags: [engine, packages, inventory, migration, proposal]
---

# Engine module inventory

**Status: proposal, 16 November 2026.** This maps every hand-written module in `source/backend/engine/src/mzizi_engine` to its target package under [ENGINE_RUNTIME_AND_PACKAGES](ENGINE_RUNTIME_AND_PACKAGES.md). Nothing here is implemented. Targets marked **(confirm)** are my reading of the code and need the project owner's decision before the move.

## How the numbers were produced

A script parsed the 142 hand-written files (17,635 lines; the ~4,350 lines of Dryv-generated routes and schemas under `api/` are excluded). It recorded line counts, third-party imports, and heuristic flags: `Any`, `dict[str, Any]`, direct regular expressions and module-level constant tables. The flags only point at places to review. A `consts` flag does not mean hard-coded source knowledge; each move task reviews it.

| Area | Files | Lines |
|---|---|---|
| `web/handlers` | 16 | 3,684 |
| `devcli` | 25 | 2,779 |
| `filesystem` | 14 | 2,380 |
| Loose root modules | 14 | 2,431 |
| `web/browser` | 11 | 1,539 |
| `web/crawl` | 11 | 1,340 |
| `devservices` | 19 | 1,036 |
| `web` loose modules | 11 | 978 |
| `filesystem_api` | 6 | 650 |
| `policy` | 9 | 504 |
| `web/search` | 4 | 232 |
| `ports` | 2 | 82 |

## Findings that affect the plan

1. **Stale persistence code.** `database_store.py` (119 lines) and `store.py` say persistent state goes through "the Bun database service". That service was removed on 15 November 2026 ([DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115](../../decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md)). Both modules, and the tests `test_database_store.py` and `test_database_service_authorizer.py`, describe a design that no longer exists.
2. **Hand-written routes beside generated ones.** `filesystem_api/` (650 lines) is FastAPI code written by hand. `filesystem_api/_shared.py` imports `psycopg` directly. This breaks both "routes are Dryv-generated" and "no hand-written SQL".
3. **Raw SQL in four filesystem modules.** `repository.py`, `reset.py`, `service.py` and `sync.py` import `psycopg`; `ports/database.py` is the connection port they share.
4. **Persistence concerns inside capability code.** `sitestore.py` (488 lines) mixes page hashing and versioning logic with MongoDB writes. `web/crawl/persist.py` and `activity.py` write to Mongo from capability code. Each must split into package logic plus an engine binding.
5. **One pattern/data violation found.** `policy/personal_data.py` holds `FIELD_CATEGORIES` and `VALUE_PATTERNS` as code and compiles regular expressions. Its own docstring says the tables belong in a policy manifest. It is the only module flagged for direct regex.
6. **Untyped boundaries.** `Any` appears in `auth.py`, `app.py`, `store.py`, `database_store.py`, `filesystem/cli.py`, `filesystem/reset.py`, `filesystem/repository.py`, all of `filesystem_api/`, `web/handlers/queue.py`, `policy/gate/edge.py`, `policy/gate/parse.py`, `devcli/app.py` and `ports/database.py`. The generic `jsonvalue.py` exists for the capability boundary and should become the single parser module.
7. **Three meanings of "ports".** `ports/database.py`, `devcli/ports/*` (declared capability ports with live state) and the package-level ports in the new design are different things. The engine and CLI ones should be renamed during the move.
8. **Scheduling already exists.** `executor.py` (queue, admission limits, retries, cancellation, progress events, callback outbox) and `capabilities.py` (registry of named, versioned capabilities) are the seeds of `EngineRuntime`, so they are rebuilt into it and not replaced.
9. **Roughly 5,700 lines are acquisition handlers and crawl code with no clear package yet**, notably `web/handlers/*`. Several of them (`scrape`, `survey`, `sections`, `attachments`, `rank`, `inspect`, `replay`) fit `scraping` or `crawl` equally well. See open questions.

## Target map

### Runtime (stays in the engine, rebuilt into `EngineRuntime`)

| Module | Lines | Becomes | Notes |
|---|---|---|---|
| `app.py` | 218 | Entry point and route binding | `Any`, `dict[str, Any]`; each handler becomes one runtime call |
| `cli.py` | 47 | Engine process entry point | Keeps `uvicorn` start only |
| `config.py` | 79 | `RuntimeConfig` | Typed, immutable snapshots with generation numbers |
| `executor.py` | 243 | Runtime scheduler and execution plan | Uses `httpx` for the callback outbox; outbox becomes a persistence binding |
| `capabilities.py` | 317 | Runtime assembly (imports four packages) | Registry becomes member capabilities |
| `web/register.py` | 176 | Runtime assembly | Registers web capabilities |
| `jsonvalue.py` | 12 | Shared JSON parsing boundary | Keep as the one parser module |
| `auth.py` | 339 | **(confirm)** auth package or runtime | `fastapi`, `httpx`, `jwt`; 13 `Any` uses |
| `store.py` | 158 | Test fixture only | In-memory store; move under tests |
| `database_store.py` | 119 | Delete | Stale (finding 1); replaced by Dryv-generated repositories |
| `activity.py` | 133 | Engine Mongo binding | Writes activity records; logic stays out |
| `ports/database.py` | 76 | Delete after filesystem move | Replaced by Dryv-generated repositories |

### `browser` package

| Modules | Lines | Features |
|---|---|---|
| `web/browser/playwright_session.py`, `adapter.py`, `scripts.py` | 488 | `session` with Playwright as one adapter behind the adapter port |
| `web/browser/tabs.py`, `traversal.py`, `actions.py` | 535 | `navigation` (tabs, disclosures, actions) |
| `web/browser/challenge.py` | 32 | `challenge` (detection, authorised resolution) |
| `web/browser/media.py` | 276 | `media` (imports `extraction`; dependency direction needs checking) |
| `web/browser/models.py`, `shared.py` | 206 | `shared/` contracts |
| `web/handlers/section_browser.py` | 154 | `navigation` |

### `crawl` package

| Modules | Lines | Features |
|---|---|---|
| `web/crawl/engine.py`, `backends.py`, `state.py`, `cancel.py`, `service.py` | 818 | `traversal` |
| `web/crawl/capture.py`, `evidence.py`, `sitemaps.py` | 336 | `capture` |
| `web/crawl/inventory.py`, `web/records.py`, `web/export.py`, `web/tables.py` | 446 | `inventory` |
| `web/crawl/persist.py` | 67 | Engine binding (Mongo sink) |
| `web/hunt.py`, `web/pipeline.py`, `web/worker.py`, `web/requests.py`, `web/identity.py` | 570 | `hunt`, `pipeline`, job contracts |
| `web/handlers/crawl.py`, `downloads.py`, `queue.py`, `common.py` | 491 | `downloads`; `queue.py` has an `Any` and is the largest |

### `watch` package

| Modules | Lines | Notes |
|---|---|---|
| `web/handlers/site.py` | 438 | The `site watch` use case; mixes threading, hashing, signals; split into logic plus runtime scheduling |
| `web/handlers/batch.py`, `changes.py` | 302 | Many sites at once in a worker pool |
| `sitestore.py` | 488 | Hash/version logic stays; Mongo writes become a sink binding |
| `layout.py`, `names.py` | 274 | **(confirm)** deterministic local layout and naming; may belong in `filesystem` |

### Acquisition handlers: `scraping` or `crawl` **(confirm)**

`web/handlers/scrape.py` (302), `survey.py` (225), `sections.py` (357), `attachments.py` (324), `rank.py` (93), `inspect.py` (338), `replay.py` (263). Together about 1,900 lines. `rank` fits the existing `scraping/rank` folder. The rest are use cases over scraping and crawl contracts.

### `search` package (the pilot move)

`web/search/models.py` (47), `providers.py` (156), `service.py` (27): 232 lines, one `httpx` dependency, one test file (`test_web_search.py`). It is the smallest self-contained capability.

### `policy` package

`policy/gate/*` (426), `policy/models.py` (18), `policy/personal_data.py` (53). Gate rules already load through `parse.py`; the personal-data tables move into a manifest and matching goes through the pattern-matching package. Also fix `dict[str, Any]` in `edge.py` and `parse.py`.

### `filesystem` package

| Modules | Lines | Notes |
|---|---|---|
| `filesystem/transitions.py`, `lineage.py`, `authz.py`, `secure.py`, `download.py`, `uploads.py` | 576 | Logic moves to the package; the `mzizi_filesystem` library holds the store, keys and hashing already |
| `filesystem/repository.py`, `service.py`, `reset.py`, `sync.py` | 1,254 | Raw SQL; replaced by Dryv schemas and generated repositories, with a port for the package |
| `filesystem/livecheck.py`, `testing.py` | 158 | Developer and test helpers; move to the CLI package and tests |
| `filesystem/cli.py` | 298 | Moves to the `cli` package |
| `filesystem_api/*` | 650 | Becomes Dryv-defined routes calling the runtime |

### `cli` package

`devcli/*` (2,779 lines, 25 files, including `catalog/web.py` at 371), `filesystem/cli.py`, plus the dev-only parts of `devservices`. Uses `typer`, `rich` and `questionary`. It calls `EngineRuntime` in process. `devcli/ports/*` is renamed to avoid the ports clash.

### `devservices`: vector and Mongo sandbox **(confirm)**

`devservices/vector/*` (about 620 lines, `qdrant_client`) matches the semantic index proposed in [PATTERN_MATCHING](PATTERN_MATCHING.md), so it likely becomes a `meaning` or `vector` package. `devservices/mongo/*` is a developer sandbox and loader and belongs with the CLI or the Dryv Mongo pack.

## Proposed move order

1. **Boundary check, report-only** (already planned). It makes the violations above measurable before anything moves.
2. **`EngineRuntime` skeleton**, with typed config and a stub capability, reusing the scheduling ideas in `executor.py` and `capabilities.py`.
3. **Pilot: `search`.** It is the smallest and has one external dependency, so it proves the `features/`, orchestrator and sink pattern cheaply.
4. **Remove stale persistence** (`database_store.py` and its tests), since it describes a removed service.
5. **Dryv schemas for filesystem**, then the `filesystem` package move and deletion of `ports/database.py` and `filesystem_api/`.
6. **`browser`**, then **`crawl`**, because crawl depends on it.
7. **`watch`**, then the acquisition handlers once their package is decided.
8. **`policy`** with its manifest and the pattern-matching package.
9. **`cli`**, then **vector/devservices**.
10. **Cleanup:** delete empty folders, update every README and link.

Reason for the order: steps 1 to 3 cost little and prove the pattern. Step 5 removes the worst rule break but needs Dryv work, so it should not be first. `browser` before `crawl` and `crawl` before `watch` follow the dependency direction.

## Open questions

These block specific moves:

1. **Where do `scrape`, `survey`, `sections`, `attachments`, `inspect` and `replay` go?** It blocks step 7.
2. **Where does auth go?** It blocks the runtime cleanup (`auth.py`).
3. **Are `layout.py` and `names.py` part of `watch`, or `filesystem`?** They define the local evidence layout.
4. **Does `devservices/vector` become a `meaning` package?** It blocks step 9.
5. **Can `media.py` in `browser` depend on `extraction`?** The dependency direction in the design puts both at the same level, so a port may be needed.
6. **Is the `mzizi_filesystem` library the same as the target `filesystem` package, or does the engine's filesystem logic form a separate package beside it?**
