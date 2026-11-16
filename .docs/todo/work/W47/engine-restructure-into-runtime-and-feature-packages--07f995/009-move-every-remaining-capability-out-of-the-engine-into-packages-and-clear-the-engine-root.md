---
{id: TSK-DC0B356ED404,name: Move every remaining capability out of the engine into packages and clear the engine root,type: task,status: completed,priority: medium,created_at: 2026-11-16T08:18:42.734Z,updated_at: 2026-11-16T09:48:46.235Z,order: 9216,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T08:18:49.347Z},{from: in-progress,to: completed,at: 2026-11-16T08:44:23.181Z},{from: completed,to: planned,at: 2026-11-16T09:48:44.334Z},{from: planned,to: completed,at: 2026-11-16T09:48:46.235Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-DC0B356ED404/1794817129349-start,started_at: 2026-11-16T08:18:49.573Z,end_ref: refs/tracking/TSK-DC0B356ED404/1794818663183-end,ended_at: 2026-11-16T08:44:23.181Z,summary: {files: 279,insertions: 2646,deletions: 3604}}]}}}
---

# Move every remaining capability out of the engine into packages and clear the engine root

## Goal

Finish the restructure so the engine holds only the runtime (including its HTTP front door and executor), persistence adapters, generated Dryv code and its own command line. Every remaining capability moves into a package with one orchestrator and a `features/<capability>/` layout: a new `browser` package, `crawl` (crawling, scraping, survey, sections, attachments, downloads and the acquisition use cases), `watch` (site watching and change tracking), `policy` (the collection gate and personal-data hints), `devservices` (the Mongo and vector developer services), and a tiny `contracts` package for the JSON payload types every package shares. The engine root ends with only `__init__.py`, `py.typed` and folders.

## Context

After the search, CLI and filesystem moves, the engine still holds about 12,000 lines: `web/` (browser, crawl, handlers, hunt, pipeline, records, requests, export), `policy/`, `devservices/` and twelve loose root modules (`app`, `auth`, `config`, `executor`, `capabilities`, `store`, `database_store`, `activity`, `layout`, `names`, `sitestore`, `jsonvalue`). The dependency picture (see `ENGINE_MODULE_INVENTORY.md`) is one tight cluster: crawl and the handlers depend on the browser, on the Mongo activity store, on the local evidence layout and on the site store. The activity store becomes a port the crawl package defines and the engine implements. Typing and hard-coding fixes beyond what already passes mypy strict are recorded as debt per package, not silently skipped.

## Acceptance checklist

- [x] The `browser` and `crawler` packages exist in the `orchestrator/`, `shared/`, `features/` shape, scraping, crawl and watch are one package, and the engine imports them only from the runtime assembly (changed on 16 November after owner review: no contracts, policy, devservices, watch or testing packages).
- [x] The engine root holds only `__init__.py`, `py.typed` and folders; stale code (`database_store`, the old registry shims) is deleted; PostgreSQL, MongoDB and a vector skeleton live under `persistence/`.
- [x] mypy strict, ruff and the moved tests pass in their new homes, and `bun run boundaries` shows zero engine-root modules and zero capability-library imports in the engine.

## Progress

Done 16 November 2026, including three corrections from the project owner during the work. Final shape: engine = `api/`, `cli/`, `jsonvalue/`, `persistence/{postgres,mongo,vector}`, `runtime/{assembly,executor,http,policy,contracts,tools}`; packages = `browser`, `cli`, `crawler`, `extraction`, `fetch`, `filesystem`, `manifest`, `search`. Removed on the way: the contracts, policy, devservices, watch, scraping and testing packages (their code moved into the engine or the crawler, or was deleted: personal-data hints, the Qdrant and Mongo developer commands, the vector implementation, the dev-service operations `mongo.*` and `vector.*`). The crawler's activity records go through an `Activity` port that the engine implements with MongoDB (retry, disk spool). `bun run boundaries` is 0 and part of `bun run check`; `bun run structure` is clean (the two oversize files were split, one header added). Moves that changed behavior or reduced coverage: the manifest CLI lost `validate-structure` (the operation `manifest.validate_structure` remains); the old search-with-environment binding is engine assembly; devservices tests (vector, Mongo sandbox) were deleted with the code.
