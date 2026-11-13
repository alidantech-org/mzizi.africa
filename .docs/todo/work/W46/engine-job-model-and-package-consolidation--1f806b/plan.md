---
{id: GRP-CB1B861F806B,name: Engine job model and package consolidation,type: documentation,extra: {created_at: 2026-11-13T09:53:00.964Z}}
---

# Plan

## Approach

Work from the edges inward so the workspace becomes healthy early and the engine is changed only once its collaborators are clean. First remove and consolidate packages (small, low-risk, each independently verifiable), then restructure the remaining packages into small modules, then introduce the engine job model and its ports, and finally add the staging store. The `filesystem` package is deliberately left alone until the job model exists; it is tracked as a deferred task.

## Milestones

1. Package removals and the agent placeholder (agent, ocr folded into extraction).
2. Replace `source` with `fetch`, move challenge detection and the gate rule, and decouple `manifest` from `scraping` with a section-schema registry.
3. Engine job model: ports, plan and step contracts, adapters for the Rust database service, local mode, folder layout for the engine.
4. Staging store: `StagingStore` port, Mongo adapter, per-domain collections, expiry, agent scratch namespace.
5. Deferred: bring `filesystem` into the engine as a storage module and retire the broken `mzizi-database` references.

## Risks

- The engine could grow into a second durable workflow system. Keep engine jobs bounded and leave long campaigns to Temporal.
- The legacy Bun database service and the Rust service coexist; ports isolate this but adapters must be maintained until the legacy service is retired.
- Mongo is a new runtime dependency. Keep an in-memory adapter so tests and the CLI work without it, and never treat staged data as canonical or as the only copy of raw bytes.
- Each change must update the READMEs, AGENTS.md and root runner configuration (`scripts/lib/projects.ts`) in the same work, and `task validate` and `bun run check` must be run and reported accurately.
