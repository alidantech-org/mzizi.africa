---
id: DOC-3D7A1F5E2B07
name: Phased delivery, decisions and risks for the engine CLI
type: documentation
tags: [engine, cli, phases, risks, plan]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 06 — Phased delivery, open decisions, risks

Each phase is independently useful and ends with something the user can run. Candidate tasks only; none is created.

| Phase | Deliverable | Done when |
|---|---|---|
| 0 | `mzizi` entry point, `dev init|doctor|runs|show|clean`, run-folder writer, typed result models | `mzizi dev doctor` reports the machine; empty runs recorded |
| 1 | `extract pdf|csv|json|geojson|auto|ocr` | A local PDF path yields `text.md`, tables and diagnostics under `.dev/outputs/` |
| 2 | `manifest check|validate-structure|explain` over `.dev/manifests`; `fs hash`, `fs put --dry-run` | Unofficial manifests validated with the official schemas |
| 3 | `fetch url|robots|policy|replay`, `dev serve` loopback, `scraping.challenge|select|extract`, `scrape file|url|links|select|challenge` | A manifest scrape of a saved page and of the loopback server yields identical records; a live URL fetch is polite and cached |
| 4 | Browser adapter: `browser open|snapshot|compare|navigate`, `--render browser` | Headed Chrome opens a real site; `compare` reports JS-only content |
| 5 | `scrape crawl`, `scrape markdown`; page inventory and link graph files | Bounded crawl respects budgets and the gate |
| 6 | Dev services: `dev services`, `mongo *`, `vector *` | Run results queryable in Mongo; semantic search and classification demo |
| 7 | Reduction loop: promote findings to package unit tests; CLI smoke tests in CI | Each found bug has a fixture and a test |

**Implemented:** the `mzizi` script and ports, PDF extraction, manifest checks, HTTP fetch and robots, links, challenge detection, crawl, Markdown, exports, resume, Playwright and Patchright drivers, safe downloads and official-API search. `scrape file|url` runs a single site module against one HTML page. `scrape select` tests a CSS selector against saved HTML. See the [runtime design](../../design/acquisition/WEB_ACQUISITION_RUNTIME.md). Full bundle execution, Mongo and vector sandboxes, DuckDuckGo search and live search verification remain planned.

Phases 0–2 need no new dependencies. Phase 3 needs none beyond what packages use. Phase 4 adds Playwright (optional group). Phase 6 adds a Mongo driver, a vector client and a local embedding model (optional group).

## Decisions needed from the user

1. Console-script name: `mzizi` (new) with `mzizi-engine` kept as alias, or extend `mzizi-engine` only?
2. Adopt Playwright as the browser adapter (the plan's default, matching document 10), or compare Crawlee/Crawl4AI first?
3. Vector sandbox: Qdrant in docker, or LanceDB embedded for zero services?
4. Mongo role confirmed as dev-only sandbox, or a production candidate to benchmark against Postgres JSONB?
5. May the dev CLI fetch live public sites under the dev gate, or only loopback and saved pages until the gate covers each target?
6. Folder naming: `.dev/{inputs,outputs}` as requested, with the extra `manifests/`, `cache/`, `services/` folders?

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| CLI grows its own logic and diverges from the API | CLI only builds payloads and calls registered handlers; shared test asserts parity |
| Dev outputs mistaken for evidence | `dev_run` flag, location under `.dev/`, explicit flags for any write elsewhere |
| Live scraping harms a site or breaks terms | Gate, robots, rate limits, identified UA, budgets, challenge stop, no evasion |
| Extra datastores creep into production | `dev_only` capabilities refused outside dev; adoption needs a separate decision |
| Browser flakiness hides package bugs | Always keep the saved-HTML path (`scrape file`) as the deterministic baseline |
| Documentation drift | Update `source/backend/engine/README.md`, `scripts/README.md` and package READMEs when commands land; this folder stays the plan |
