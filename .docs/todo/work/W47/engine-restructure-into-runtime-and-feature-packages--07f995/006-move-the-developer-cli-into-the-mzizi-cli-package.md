---
{id: TSK-268D54651433,name: Move the developer CLI into the mzizi_cli package,type: task,status: in-progress,priority: medium,created_at: 2026-11-16T07:35:53.976Z,updated_at: 2026-11-16T07:36:08.832Z,order: 6144,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T07:36:08.832Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-268D54651433/1794814568834-start,started_at: 2026-11-16T07:36:09.055Z}]}}}
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

- [ ] The command catalog (models, builders, extract, web, services, evidence, misc, web arguments) is moved and builds payloads through typed contracts.
- [ ] No catalog module imports the engine; crawl and browser coupling goes through the gateway.

## Milestone 3: runner, app and entry points

- [ ] The runner, interactive prompts, stream extraction, artifact writer, port status and the Typer app are moved.
- [ ] The `mzizi` console script starts the package with the engine's gateway, and `uv run mzizi status`, `doctor` and a capability command behave as before.
- [ ] `devcli` is deleted from the engine and its tests live in the package.

## Milestone 4: cleanup

- [ ] `bun run boundaries` shows fewer engine violations, the READMEs and design links are updated, and ruff, mypy and the tests pass.

## Acceptance checklist

- [ ] The CLI lives in `mzizi_cli`, imports nothing from `mzizi_engine`, and reaches the engine only through its gateway port.
- [ ] `uv run mzizi status`, `doctor` and one capability command work as before, and the CLI tests pass inside the package.
- [ ] `mzizi_engine.devcli` is deleted and the dependencies on typer, rich and questionary leave the engine.

## Progress

**Milestone 1 done (16 November 2026).** New package `source/packages/cli` (`mzizi-cli`, `mzizi_cli`) with `shared/` (exit codes and value types, CLI errors, JSON payload types, the `EngineGateway` port and `CapabilityInfo`), `features/terminal/` (theme and logging, path search) and `features/workspace/` (the `.dev` workspace and run folders). The engine implements the gateway in `mzizi_engine/bindings/cli_gateway.py` (`RegistryGateway` over the capability registry); `bindings/` is the new home for package bindings. Moved with `git mv`; `devcli` now imports the moved modules from `mzizi_cli`. The package imports nothing from the engine.

Bug found and fixed during the move: `build_index` checked its entry budget only between folders, so one folder of 200 files was never truncated. The old test passed only because an unrelated autouse fixture put a second folder in the same temp directory. The budget is now checked per entry, and the test is meaningful in the package. Behavior otherwise unchanged.

Checks: package tests (3), `test_devcli.py` (including a gateway test), ruff, mypy strict over 486 files, and `mzizi --no-input status` still runs. `bun run boundaries` total fell from 70 to 67. The package duplicates the engine's `JsonValue` and `Payload` aliases for the gateway boundary; a shared home for them is still to decide. Remaining: milestones 2 (catalog), 3 (runner, app, entry points) and 4 (cleanup).
