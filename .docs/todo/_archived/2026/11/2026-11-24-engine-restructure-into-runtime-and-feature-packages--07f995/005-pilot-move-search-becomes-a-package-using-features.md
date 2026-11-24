---
{id: TSK-AD0B1F21D30D,name: "Pilot move: search becomes a package using features/",type: task,status: archived,priority: medium,created_at: 2026-11-16T07:21:19.260Z,updated_at: 2026-11-24T19:24:25.797Z,order: 5120,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T07:30:37.283Z},{from: in-progress,to: completed,at: 2026-11-16T07:32:55.787Z},{from: completed,to: planned,at: 2026-11-16T07:35:53.637Z},{from: planned,to: completed,at: 2026-11-16T07:35:55.004Z},{from: completed,to: archived,at: 2026-11-24T19:24:25.797Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-AD0B1F21D30D/1794814237284-start,started_at: 2026-11-16T07:30:37.522Z,end_ref: refs/tracking/TSK-AD0B1F21D30D/1794814375789-end,ended_at: 2026-11-16T07:32:55.787Z,summary: {files: 39,insertions: 662,deletions: 284}}]}},archived_at: 2026-11-24T19:25:23.410Z}
---

# Pilot move: search becomes a package using features/

## Goal

Move the smallest self-contained capability, web search, out of the engine into a new package with the `orchestrator/`, `shared/` and `features/<capability>/` shape, and wire it into the runtime through a sink port. The move proves the pattern and the migration rules before the larger browser, crawl and filesystem moves copy it. Behavior does not change.

## Context

`web/search/` holds `models.py` (47 lines), `providers.py` (156, uses `httpx`) and `service.py` (27, uses `mzizi_fetch`), covered by `tests/test_web_search.py`. The design is in `ENGINE_RUNTIME_AND_PACKAGES.md` and the module is listed in `ENGINE_MODULE_INVENTORY.md`. Providers become adapters behind a protocol, provider and query knowledge comes from manifests and not code, and any untyped value is parsed at one boundary. Tests move with the code, and the engine keeps only a binding that persists results.

## Acceptance checklist

- [x] A new package exists with one orchestrator class, typed contracts and the three folders, registered in the workspace and the root project list.
- [x] Providers, models and service logic are moved and corrected for typing and hard-coding, with the engine's search module removed.
- [x] The runtime exposes the capability: the orchestrator is registered as a runtime capability in a test, and results are returned as typed contracts that the engine writes (the return-a-result method; search needs no sink).
- [x] Tests moved with the code pass, the boundary check reports no new violation, and READMEs and links are updated.

## Progress

New package `source/packages/search` (`mzizi-search`, `mzizi_search`): `orchestrator/` (`SearchOrchestrator`, `SearchSettings`), `shared/` (contracts, error, provider port, one HTTP helper) and `features/{brave,google,collect}/`. Behavior is unchanged except where noted below. The engine keeps only `web/search/environment.py`, which reads the environment and builds the package settings; the three old modules are deleted and `inspect.py` and `devcli/app.py` use the binding.

Corrected on the way: the package never reads `os.environ`; credentials, timeout and the 100-result ceiling are required typed settings with no defaults; provider replies are parsed in one `parse.py` per provider; provider names are an enum; each provider's own URL and paging limits sit in one `protocol.py`. Two behavior notes: the engine search handler now clamps `count` to at least 1 and `offset` to at least 0 before building the typed query, and `SearchResult.provider` is an enum that serialises as the same string. The 30 second timeout and the 100 ceiling are still constants in the engine binding and should move to a policy manifest.

Checks: package tests (5), engine search binding tests (3, including registration as a runtime capability), ruff, mypy strict over 476 files. `bun run boundaries` still reports 70 violations (none new); `bun run structure` still has its three earlier problems. `uv.lock` gained `mzizi-search`.
