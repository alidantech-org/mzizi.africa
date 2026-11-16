---
{id: GRP-64379B07F995,name: Engine restructure into runtime and feature packages,type: documentation,extra: {created_at: 2026-11-16T07:16:52.638Z}}
---

# Approach

Work in small steps on `develop`. Each step is one task and one commit, reviewable and correctable on its own. Documentation and measurement come first, so the direction is fixed and the rules are enforced before any code moves. Code moves happen one capability at a time, with tests moving alongside the code, and each moved module is corrected for typing and hard-coding as part of the move.

# Milestones

1. Direction: write the design guide covering the runtime, the orchestrator pattern, the `features/<capability>/` package shape, the three persistence methods and the dependency direction. Correct the AGENTS.md statement about packages and the network.
2. Inventory: map every engine module to its target package and feature, recording type and hard-coding problems.
3. Measurement: add an import-boundary check in report-only mode, then make it enforcing once the violations are gone.
4. Skeleton: add `EngineRuntime` with typed configuration, snapshots, lifecycle and scheduler, proven by one stub capability.
5. Pilot move: move the smallest self-contained capability into a package using the new shape, and use it to confirm the pattern.
6. Moves in order: filesystem (with Dryv schemas), browser, crawl, watch, search, policy, pattern matching, then the CLI and developer services.
7. Cleanup: retire remaining hand-written SQL and empty engine folders, and update every README and design link.

# Risks

- Behavior drift during a move. Mitigation: no behavior change in a move task, tests pass before and after.
- Package dependency cycles, for example crawl and browser. Mitigation: dependencies point one way and shared contracts live in `shared/`.
- Dryv regeneration for tables moved from raw SQL. Mitigation: do the filesystem move as its own task with a migration review.
- Open decisions: where HTTP transport and auth live, and whether crawl stays a separate package. These are recorded as decisions before the affected move.
