---
{id: TSK-3DA7D477F1C9,name: Add a report-only import-boundary check,type: task,status: archived,priority: medium,created_at: 2026-11-16T07:21:18.593Z,updated_at: 2026-11-24T19:24:13.549Z,order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T07:21:45.065Z},{from: in-progress,to: completed,at: 2026-11-16T07:22:16.085Z},{from: completed,to: archived,at: 2026-11-24T19:24:13.549Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-3DA7D477F1C9/1794813705066-start,started_at: 2026-11-16T07:21:45.287Z,end_ref: refs/tracking/TSK-3DA7D477F1C9/1794813736087-end,ended_at: 2026-11-16T07:22:16.085Z,summary: {files: 5,insertions: 203,deletions: 0}}]}},archived_at: 2026-11-24T19:25:23.410Z}
---

# Add a report-only import-boundary check

## Goal

Make the architecture rules measurable. A new `bun run boundaries` command scans the hand-written Python in the packages and the engine and prints every place where a package knows about the engine or a database, where the engine imports a capability library, and where a package root holds loose modules. It reports without failing, so the current violations become a visible baseline that each move task must reduce, and it can be made enforcing at the end of the restructure.

## Context

The design in `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md` says packages never import the engine or a database driver, and that the engine does only orchestration and Dryv-generated persistence. The inventory in `ENGINE_MODULE_INVENTORY.md` lists the known breaks. Today only file size and layout are checked, by `scripts/tasks/structure.ts`. The new check follows the same conventions: a TypeScript module under `scripts/tasks/`, a command in `scripts/mz.ts`, a test beside the runner tests and a row in `scripts/README.md`. Dryv-generated engine code under `api/` is excluded.

## Acceptance checklist

- [x] `scripts/tasks/boundaries.ts` finds imports (including `importlib.import_module` strings) and applies named rules, with no behavior change to any existing command.
- [x] `bun run boundaries` prints violations grouped by rule and exits zero; `--strict` exits non-zero when any violation remains.
- [x] Tests cover import detection and each rule, and `bun run structure` and the scripts tests pass.
- [x] The first report is recorded in this task under Progress, and `scripts/README.md` documents the command.

## Progress

First report, 16 November 2026 (`bun run boundaries`, report only): **70 violations**.

- `package-imports-engine`: 0 and `package-imports-database`: 0. No package imports the engine or a database driver today.
- `engine-imports-database`: 13, in `filesystem/{repository,reset,service,sync}.py`, `ports/database.py`, `filesystem_api/_shared.py` (psycopg), `devservices/mongo/sandbox.py` (pymongo) and `devservices/vector/store.py` (qdrant_client).
- `engine-imports-capability`: 23, in `devcli` (typer, rich, questionary), `web/browser` (playwright), `web/crawl` and `web/handlers` (bs4, soupsieve), `layout.py` (tldextract) and `sitestore.py` (PIL).
- `package-root-module`: 21, so packages already break the "root holds only `__init__.py`" rule: `filesystem` (7), `manifest` (12), `extraction` (1), `fetch` (1).
- `engine-root-module`: 13 loose engine modules.

Separately, `bun run structure` already fails before this change: `web/handlers/site.py` (438 lines) and `sitestore.py` (487) exceed the 400-line limit, and `dryv/tools/check-contract-imports.ts` has no header comment. `scripts/mz.test.ts` also has an unsorted-import Biome error. None of these come from this task.
