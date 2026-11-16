---
id: DEC-ENGINE-RUNTIME-AND-PACKAGES-20261116
name: Engine is one runtime class; capabilities live in feature packages
type: decision
tags: [engine, runtime, packages, features, dryv, owner-order]
extra: {status: accepted, ordered_by: project owner, ordered_on: 2026-11-16, supersedes: the "engine does all I/O" wording in ENGINE_JOB_MODEL, implementation: not_started}
---

# Engine is one runtime class; capabilities live in feature packages

## Decision

The project owner ordered the engine reduced to two responsibilities: one runtime class that assembles packages and schedules their work, and database reads and writes through Dryv-generated code. All capabilities currently in `mzizi_engine` (browser, crawl, search, site watching, policy, filesystem logic, the CLI and developer services) move into packages. Each package exposes one orchestrator class with typed contracts and keeps its code under `features/<capability>/`. The CLI is a package that calls the runtime in process, like the HTTP API does.

Packages may own network and browser adapters behind ports. They never know a database exists.

## Consequences

- `mzizi_engine` shrinks to the runtime, binding modules and generated code.
- Tables that are hand-written SQL today move into Dryv and are regenerated.
- Each moved module is corrected for typing and hard-coding as part of its move.
- The design is in [ENGINE_RUNTIME_AND_PACKAGES](../design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md). Implementation has not started.

## Open questions

Where HTTP transport and authentication live, whether crawl and browser stay separate packages, and where text helpers belong.
