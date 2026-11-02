---
{id: DEC-ENGINE-LAYOUT,name: Decision - engine packages grouped under source/backend/engine,type: decision,tags: [data-engine,db-engine,layout]}
---

# Decision: engine packages grouped under source/backend/engine

Date: 2026-11-02. Confirmed by the user.

## Decision

`source/backend/data-engine` becomes `source/backend/engine/data` and `source/backend/db-engine` becomes `source/backend/engine/database`. This is a grouping, not a merge: two independently runnable packages, each with its own README, toolchain and tests, communicating only through documented contracts. `files` and `intelligence` stay siblings of `engine/` because file custody and AI evaluation have separate owners. `engine/` holds no shared code.

## Consequences

The move is its own task. References to update: AGENTS.md, the ARCHITECTURE, MIGRATION, DATA_LIFECYCLE, DOMAINS, ROADMAP, repository-map, project-overview and development-setup documents, `source/backend/README.md`, the legacy model inventory, older decision records, and `fixturesDir` in `source/backend/api/src/neutral/fixture-loader.ts`.
