---
{id: TSK-B22267706A58,name: Inventory every engine module against its target package,type: task,status: archived,priority: medium,created_at: 2026-11-16T07:19:21.366Z,updated_at: 2026-11-24T19:24:06.236Z,order: 2048,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T07:19:39.561Z},{from: in-progress,to: completed,at: 2026-11-16T07:20:13.579Z},{from: completed,to: planned,at: 2026-11-16T07:21:18.264Z},{from: planned,to: completed,at: 2026-11-16T07:21:19.634Z},{from: completed,to: archived,at: 2026-11-24T19:24:06.236Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-B22267706A58/1794813579563-start,started_at: 2026-11-16T07:19:39.780Z,end_ref: refs/tracking/TSK-B22267706A58/1794813613581-end,ended_at: 2026-11-16T07:20:13.580Z,summary: {files: 2,insertions: 148,deletions: 0}}]}},archived_at: 2026-11-24T19:25:23.410Z}
---

# Inventory every engine module against its target package

## Goal

Produce a module-by-module map of `source/backend/engine/src/mzizi_engine` so that each later move task knows exactly which files go to which package and feature, what must be fixed on the way, and in what order. The map prevents guessing during moves and gives the project owner a single document to correct before any code is touched.

## Context

The design is in `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md` and the decision DEC-ENGINE-RUNTIME-AND-PACKAGES-20261116. The engine holds about 21,800 lines; roughly 4,350 are Dryv-generated routes and schemas under `api/` and stay as they are. The scan behind the inventory used a script over the hand-written files: line counts, third-party imports, and heuristics for `Any`, `dict[str, Any]`, regular expressions and module-level constant tables. The heuristics only point at places to review; they are not a verdict.

## Acceptance checklist

- [x] Every hand-written module in the engine appears in the inventory with its size, target package, target feature and known problems.
- [x] The inventory names stale or contradictory code it found, such as references to removed services.
- [x] It proposes a move order with the reason for each step and lists the open questions that block specific moves.
- [x] It is linked from the architecture README, `task validate` passes, and the doc says clearly that it is a proposal built from a heuristic scan.
