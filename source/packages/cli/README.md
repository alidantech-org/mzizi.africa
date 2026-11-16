# mzizi-cli

The `mzizi` command line: a front door over the engine runtime. It builds `mzizi_engine.runtime`'s default runtime, starts it, calls what it exposes and stops it. It holds no extraction, scraping or fetching logic. The engine knows nothing about the CLI (no import, no dependency); the CLI depends on the engine's runtime only.

```bash
uv run mzizi capabilities [--json]                 # operations the runtime exposes
uv run mzizi run scraping.links --payload p.json   # run one operation with a JSON object payload
uv run mzizi health                                # runtime state
```

Exit codes: 0 ok, 1 the operation failed, 2 usage (unknown operation, unreadable or non-object payload).

The earlier, much larger developer CLI (command catalog, prompts, run folders, port status) was deliberately dropped, not ported: it was built around the old capability registry and returns in small pieces as capabilities are connected to the runtime. It is in git history (`mzizi_engine/devcli`).

Layout, in the `orchestrator/`, `shared/`, `features/<capability>/` shape of `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md`: `orchestrator/app.py` (the Typer app), `features/operations/` (payload parsing and rendering), `features/terminal/` (console theme and logging), `shared/exit_codes.py`. Tests: `uv run pytest source/packages/cli`.
