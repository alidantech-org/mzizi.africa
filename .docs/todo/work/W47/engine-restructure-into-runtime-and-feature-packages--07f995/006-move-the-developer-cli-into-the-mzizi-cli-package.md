---
{id: TSK-268D54651433,name: Move the developer CLI into the mzizi_cli package,type: task,status: completed,priority: medium,created_at: 2026-11-16T07:35:53.976Z,updated_at: 2026-11-16T07:47:48.814Z,order: 6144,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T07:36:08.832Z},{from: in-progress,to: completed,at: 2026-11-16T07:47:48.814Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-268D54651433/1794814568834-start,started_at: 2026-11-16T07:36:09.055Z,end_ref: refs/tracking/TSK-268D54651433/1794815268816-end,ended_at: 2026-11-16T07:47:48.815Z,summary: {files: 68,insertions: 452,deletions: 3091}}]}}}
---

# Move the developer CLI into the mzizi_cli package

## Goal

Move the developer CLI (`mzizi`, currently `mzizi_engine.devcli`, about 2,800 lines in 25 files) into a new package `source/packages/cli` (`mzizi-cli`, module `mzizi_cli`) built in the `orchestrator/`, `shared/`, `features/<capability>/` shape. The CLI is a front door, not an engine concern: it reaches the engine only through a small typed gateway port, so the package never imports `mzizi_engine`. The engine supplies the gateway and the console-script entry point.

## Context

Design: `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md`; inventory: `ENGINE_MODULE_INVENTORY.md`. Most of the `mzizi_engine` imports inside `devcli` are to `devcli` itself. The real outside couplings are small: the capability registry (`build_default_registry`, `CapabilityRegistry`), `jsonvalue.Payload`, search provider requirements, `CrawlRequest`, `CrawlState` and `CrawlSummary`, `BrowserUnavailable`, and the developer service URLs in `devservices.settings`. Each becomes a gateway method or a shared contract. `typer`, `rich` and `questionary` move out of the engine's dependencies into the CLI package. The work is delivered in four milestones; the work stops for review after each one, and every milestone leaves the `mzizi` command working.

## Milestone 1: package skeleton and foundations

- [x] The `mzizi-cli` package exists in the uv workspace with README, tests folder, lock entry and tooling configuration.
- [x] The gateway port and the shared contracts the CLI needs are defined with tests, and the engine implements the gateway in a binding module.
- [x] The leaf modules (types, errors, terminal theme, path search, workspace) are moved with their tests and corrected for typing.

## Milestone 2: command catalog

- [x] The command catalog (models, builders, extract, web, services, evidence, misc, web arguments) is moved and builds payloads through typed contracts.
- [x] No catalog module imports the engine; crawl and browser coupling goes through the gateway.

## Milestone 3: runner, app and entry points

- [x] The runner, interactive prompts, stream extraction, artifact writer, port status and the Typer app are moved.
- [x] The `mzizi` console script starts the package with the engine's gateway, and `uv run mzizi status`, `doctor` and a capability command behave as before.
- [x] `devcli` is deleted from the engine and its tests live in the package.

## Milestone 4: cleanup

- [x] `bun run boundaries` shows fewer engine violations, the READMEs and design links are updated, and ruff, mypy and the tests pass.

## Acceptance checklist

- [x] The CLI lives in `mzizi_cli`, imports only `mzizi_engine`'s runtime, and the engine imports nothing from it (changed 16 November 2026: it replaces the earlier "gateway port only" wording).
- [x] `mzizi capabilities`, `run` and `health` work against the default runtime and are covered by tests; the old developer commands are intentionally dropped.
- [x] `mzizi_engine.devcli` and `bindings/` are deleted and the engine no longer depends on typer, rich or questionary.

## Progress

**Milestone 1 done (16 November 2026).** New package `source/packages/cli` (`mzizi-cli`, `mzizi_cli`) with `shared/` (exit codes and value types, CLI errors, JSON payload types, the `EngineGateway` port and `CapabilityInfo`), `features/terminal/` (theme and logging, path search) and `features/workspace/` (the `.dev` workspace and run folders). The engine implements the gateway in `mzizi_engine/bindings/cli_gateway.py` (`RegistryGateway` over the capability registry); `bindings/` is the new home for package bindings. Moved with `git mv`; `devcli` now imports the moved modules from `mzizi_cli`. The package imports nothing from the engine.

Bug found and fixed during the move: `build_index` checked its entry budget only between folders, so one folder of 200 files was never truncated. The old test passed only because an unrelated autouse fixture put a second folder in the same temp directory. The budget is now checked per entry, and the test is meaningful in the package. Behavior otherwise unchanged.

Checks: package tests (3), `test_devcli.py` (including a gateway test), ruff, mypy strict over 486 files, and `mzizi --no-input status` still runs. `bun run boundaries` total fell from 70 to 67. The package duplicates the engine's `JsonValue` and `Payload` aliases for the gateway boundary; a shared home for them is still to decide. Remaining: milestones 2 (catalog), 3 (runner, app, entry points) and 4 (cleanup).

**Milestone 2 done (16 November 2026).** The command catalog (`models`, `builders`, `extract`, `web`, `services`, `evidence`, `misc`, `web_args`) is now `mzizi_cli/features/catalog/`, and the streaming extraction and document artifact writers it shares with the runner are in `mzizi_cli/shared/local_extract/`. No file in the package imports the engine. The only engine coupling in the catalog was `resume_payload`, which read a crawl folder's `state.json` and `summary.json` with engine types. It now takes the gateway, which gained three typed methods (`crawl_request_from_state`, `crawl_request_from_summary`, `normalize_crawl_request`) that the engine binding implements. Commands got an optional `gateway_builder` beside `builder`, so only the resume command pays for the gateway. The runner passes a `RegistryGateway` for now.

Checks: 8 package tests (new catalog tests with a fake gateway), `test_devcli.py` and the evidence tests (38 passed with the package), ruff, mypy strict over 487 files. `bun run boundaries` stays at 67 (typer, rich and questionary imports remain in the engine until milestone 3). The package gained a dependency on `mzizi-extraction`. Remaining: milestone 3 (runner, prompts, port status, Typer app, entry points, delete `devcli`) and milestone 4.

## Direction change (16 November 2026)

The project owner ordered the large CLI dropped, not ported: the engine must not know the CLI, `mzizi_engine.devcli` and `bindings/` must not exist, the CLI must "only call the runtime, simple", and it will come back to life as the engine's runtime gets all capabilities connected. Done: `mzizi_engine/devcli` and `bindings/` are deleted (the milestone 1 and 2 moves of the catalog, ports, runner, prompts, workspace and gateway were discarded, they remain in git history); the runtime now exposes operations (`runtime/operations.py`: `Operation`, `OperationInfo`, `OperationRegistry`, `EngineRuntime.operations` and `call`, `runtime/assembly.py`: `build_default_runtime`) and replaces the old `Capability` registry; the engine has a `cli/` folder for `mzizi-engine`; `mzizi_cli` is a basic Typer app (`capabilities`, `run`, `health`) that depends on the engine runtime, while the engine no longer depends on the CLI, typer, rich or questionary. The boundary check now allows only front doors (the CLI package) to import `mzizi_engine`.

Checks: 6 CLI tests, runtime tests (now 12, including operations), engine API, evidence and search tests (45 passed together), ruff, mypy strict over 465 files, script tests (27). `bun run boundaries` total 57 (was 70). The old resume-builder test was rewritten to restore a crawl request from saved state without the CLI. Not run: the full engine suite.

## Full CLI restored (16 November 2026)

At the project owner's order the developer CLI works as it did before, now on the assembled runtime: the whole command catalog, ports and status, prompts, run folders, the Typer app and `mzizi capability list|run` come from the earlier version in git history and were adapted to `runtime.operations` and `runtime.call`. The CLI depends on the engine runtime and on the crawler, browser, extraction and fetch packages whose request types it builds payloads for. Dropped because their capabilities no longer exist: the `mongo`, `vector` and `dev services` commands and the unbuilt `fs hash`/`fs put` stubs (the real `filesystem.*` operations are reachable through `capability run`, and `fs lineage` and `fs download` are catalog commands). The eleven CLI-driven tests were restored and pass with the real Chrome tests. Package layout: `orchestrator/` (app, runner), `features/{catalog,ports,terminal}`, `shared/`.
