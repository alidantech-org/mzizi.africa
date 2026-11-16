---
{id: TSK-AD0B1F21D30D,name: "Pilot move: search becomes a package using features/",type: task,status: planned,priority: medium,created_at: 2026-11-16T07:21:19.260Z,updated_at: 2026-11-16T07:21:19.260Z,order: 5120}
---

# Pilot move: search becomes a package using features/

## Goal

Move the smallest self-contained capability, web search, out of the engine into a new package with the `orchestrator/`, `shared/` and `features/<capability>/` shape, and wire it into the runtime through a sink port. The move proves the pattern and the migration rules before the larger browser, crawl and filesystem moves copy it. Behavior does not change.

## Context

`web/search/` holds `models.py` (47 lines), `providers.py` (156, uses `httpx`) and `service.py` (27, uses `mzizi_fetch`), covered by `tests/test_web_search.py`. The design is in `ENGINE_RUNTIME_AND_PACKAGES.md` and the module is listed in `ENGINE_MODULE_INVENTORY.md`. Providers become adapters behind a protocol, provider and query knowledge comes from manifests and not code, and any untyped value is parsed at one boundary. Tests move with the code, and the engine keeps only a binding that persists results.

## Acceptance checklist

- [ ] A new package exists with one orchestrator class, typed contracts and the three folders, registered in the workspace and the root project list.
- [ ] Providers, models and service logic are moved and corrected for typing and hard-coding, with the engine's search module removed.
- [ ] The runtime exposes the capability and its results persist through a sink binding.
- [ ] Tests moved with the code pass, the boundary check reports no new violation, and READMEs and links are updated.
