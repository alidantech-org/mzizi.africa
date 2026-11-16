# mzizi-cli

The developer command line (`mzizi`): a front door that builds typed payloads, asks the engine to run capabilities and shows the result. It holds no extraction, scraping or fetching logic and **never imports `mzizi_engine`**. The engine hands it an `EngineGateway` (`shared/gateway.py`) and starts it from the console script.

This package is being moved out of `mzizi_engine.devcli` in milestones (task TSK-268D54651433). Layout, in the `orchestrator/`, `shared/`, `features/<capability>/` shape of `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md`:

- `shared/` exit codes and value types, CLI errors, JSON payload types and the gateway port.
- `features/terminal/` coloured output, logging and bounded path search.
- `features/workspace/` the git-ignored `.dev/` workspace and its run folders.
- `orchestrator/` the single public entry (arrives with milestone 3).

Run the tests with `uv run pytest source/packages/cli`.

## Moved so far

Milestone 1: types, errors, terminal theme, path search, workspace and the gateway port. The catalog, runner, prompts and Typer app are still in `mzizi_engine.devcli` and are moved in later milestones.
