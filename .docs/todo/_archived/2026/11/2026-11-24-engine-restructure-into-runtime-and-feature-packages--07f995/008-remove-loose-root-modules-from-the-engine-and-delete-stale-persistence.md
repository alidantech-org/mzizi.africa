---
{id: TSK-314C989DB948,name: Remove loose root modules from the engine and delete stale persistence,type: task,status: archived,priority: medium,created_at: 2026-11-16T07:35:54.640Z,updated_at: 2026-11-24T19:24:45.847Z,order: 8192,extra: {status_history: [{from: planned,to: completed,at: 2026-11-16T08:18:43.527Z},{from: completed,to: planned,at: 2026-11-16T08:18:49.061Z},{from: planned,to: completed,at: 2026-11-16T08:44:29.333Z},{from: completed,to: archived,at: 2026-11-24T19:24:45.847Z}]},archived_at: 2026-11-24T19:25:23.410Z}
---

# Remove loose root modules from the engine and delete stale persistence

## Goal

Leave the engine root holding only `__init__.py`, `py.typed` and folders. Delete code that describes removed designs, and move each remaining root module to the folder where it belongs in the runtime design: runtime wiring into `runtime/`, package bindings into `bindings/`, and anything that has become package logic into its package. After this task the engine is the runtime, its bindings and generated code.

## Context

`bun run boundaries` reports 13 loose modules in the engine root: `app.py`, `auth.py`, `capabilities.py`, `cli.py`, `config.py`, `database_store.py`, `executor.py`, `jsonvalue.py`, `layout.py`, `names.py`, `sitestore.py`, `store.py` and `activity.py`. `database_store.py` and `store.py` describe the removed Bun database service and are stale. `sitestore.py` (487 lines) and `web/handlers/site.py` (438) break the 400-line limit. Auth placement and the `layout`/`names` owner are open questions in the inventory and must be decided before those moves. The work is delivered in milestones with a stop after each.

## Milestone 1: delete stale code

- [x] `database_store.py`, `store.py` and the tests that only describe them are deleted after checking nothing still imports them.
- [x] `config.py` entries for the removed service are removed.

## Milestone 2: runtime wiring

- [x] `executor.py`, `capabilities.py`, `app.py` and `cli.py` move into `runtime/` or `bindings/` and use the runtime where it already fits.
- [x] `jsonvalue.py` moves to its parsing-boundary home.

## Milestone 3: remaining modules

- [x] `auth.py`, `activity.py`, `layout.py`, `names.py` and `sitestore.py` are placed according to the decided owner and split under the size limit.
- [x] `bun run boundaries` reports zero engine-root modules and `bun run structure` passes.

## Acceptance checklist

- [x] The engine root holds only `__init__.py`, `py.typed` and folders.
- [x] No module describes the removed Bun database service, and no engine file exceeds 400 lines.
- [x] `bun run boundaries` reports zero engine-root modules and `bun run structure` passes.

## Comments

### 2026-11-16T08:44:28.639Z · PETER IRUNGU

Done as part of TSK-DC0B356ED404: the engine root holds only folders; database_store and store were removed or moved.
