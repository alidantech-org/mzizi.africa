# mzizi-cli

The `mzizi` developer command line: it builds the engine runtime, starts it, calls its operations on local files and URLs, shows the result and records each run under the git-ignored `.dev/` workspace. It holds no extraction, scraping or fetching logic. The engine knows nothing about it; the CLI depends on the engine runtime and on the packages whose request types it builds payloads for.

```bash
uv run mzizi                       # interactive menu (missing values are asked for on a terminal)
uv run mzizi dev init              # create the .dev workspace
uv run mzizi status [--group web]  # every port: ready / needs setup / not yet added, and why
uv run mzizi doctor                # tools, libraries and search-provider settings
export MZIZI_USER_AGENT='Name/1.0 (+https://your.site/bot; you@your.site)'   # required for live requests
uv run mzizi capability list       # the operations the runtime exposes
uv run mzizi capability run filesystem.lineage --payload payload.json
```

| Group | Commands |
|---|---|
| `extract` | `pdf`, `markdown`, `csv`, `json`, `geojson` |
| `web` | `links`, `robots`, `challenge`, `markdown`, `crawl`, `resume`, `export`, `survey`, `profile`, `family`, `draft`, `diff`, `sections` and more |
| `fetch`, `download`, `browser` | single requests, safe downloads, browser sessions (`open`, `snapshot`, `click`, `fill`, `compare`) |
| `scrape`, `search` | scraping with a site module, selectors, links; web search |
| `manifest` | `check`, `validate-structure`, `explain` |
| `fs` | `sync` (seed upload; plan only without `--apply`), `lineage`, `download` (the rest of `filesystem.*` through `capability run`) |

The [developer portal design](../../../.docs/design/architecture/DEVELOPER_PORTAL.md) requires the same typed operations over HTTP for the CLI, portal and agent. The current CLI calls the runtime in process. Use `mzizi web replay EXPECTATIONS.json` with a suite and captures under `.dev/inputs`. The same replay operation is callable through engine HTTP jobs.

Layout, in the `orchestrator/`, `shared/`, `features/<capability>/` shape: `orchestrator/` (the Typer app and the command runner), `features/catalog/` (every command as data, with payload builders), `features/ports/` (declared capability ports and their live state), `features/terminal/` (theme, prompts, bounded path search), `shared/` (types, errors, the workspace, local extraction helpers). Exit codes: 0 ok, 1 failed, 2 usage, 3 not yet added, 4 unavailable, 130 cancelled. Tests: `uv run pytest source/packages/cli` (the loopback site is `tests/web_site.py`).
