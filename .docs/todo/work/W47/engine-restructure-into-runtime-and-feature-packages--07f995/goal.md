---
{id: GOAL-GRP-64379B07F995,name: Engine restructure into runtime and feature packages goal,type: documentation,extra: {created_at: 2026-11-16T07:16:52.638Z,group: GRP-64379B07F995}}
---

# Goal

Restructure the Mzizi engine so that it does only two things: it assembles and runs capabilities through one runtime class, and it reads and writes the database through Dryv-generated code. Every capability that is currently written inside `source/backend/engine/src/mzizi_engine` (browser automation, crawling, search, site watching, policy, filesystem logic, the developer CLI and developer services) moves into a package under `source/packages/` that follows the typed-code rules.

# Why this matters

The engine has grown to roughly 21,800 lines, larger than all packages combined. Features were added to the engine because it was the nearest place to put them. As a result handlers hold use cases, raw SQL bypasses Dryv, regular expressions and untyped values sit outside their allowed modules, and no single object assembles the system. The engine is about to be improved, so the structure must be corrected first, otherwise every improvement lands in the wrong place and has to be moved twice.

# Target state

- The engine contains one runtime class (`EngineRuntime`) that builds one orchestrator per package, injects typed configuration and ports, allows configuration to change while work runs, and schedules capabilities in parallel or in series according to a declared execution plan.
- Each package exposes one orchestrator class with typed inputs and outputs, and keeps its code under `features/<capability>/` so adding a capability never enlarges the package root.
- Packages never know a database exists. They persist through one of three methods: returning a typed result, emitting records to a sink port, or checkpoint and resume state.
- The engine persists only through Dryv-generated repositories. Tables that are not yet in Dryv are moved there and regenerated.
- The CLI is a package that calls the engine runtime in process, the same way the HTTP API does.

# Success measures

- `mzizi_engine` contains no capability logic and no hand-written SQL.
- An import-boundary check passes: packages import nothing from the engine or a database driver.
- Every moved module passes mypy strict with no free `Any` or `dict`, contains no hard-coded source knowledge, and uses regular expressions only through the pattern-matching package.
- All tests that existed before each move still pass after it, and `bun run check` is green.
