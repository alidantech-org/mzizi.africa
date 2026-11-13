---
{id: TSK-18CEC4345F0E,name: Rebuild database operations by domain,type: task,status: completed,priority: medium,created_at: 2026-11-13T17:59:44.681Z,updated_at: 2026-11-13T18:04:04.955Z,order: 13312,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T17:59:52.610Z},{from: in-progress,to: completed,at: 2026-11-13T18:04:04.955Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-18CEC4345F0E/1794592792620-start,started_at: 2026-11-13T17:59:53.324Z,end_ref: refs/tracking/TSK-18CEC4345F0E/1794593044957-end,ended_at: 2026-11-13T18:04:04.955Z,summary: {files: 41,insertions: 320,deletions: 300}}]}}}
---

# Rebuild the database operation contracts by domain

## Goal

Replace the consolidated database operation and persistence files with domain modules matching the registered schema groups. Give the database app a clear composition entrypoint and keep its declared capabilities aligned with the service and its callers.

## Context

The existing database app mixes auth, reference and filesystem operations and describes some routes and responses that the Rust server does not expose. The checked-in initial migration and the regenerated model snapshot differ on audit columns and naming. Keep the deployed route contracts distinct from generated persistence plans where runtime behavior still requires authorization, missing capabilities or schema reconciliation. Use typed query selections where the existing domain schemas support them and shared failure profiles for the transport. Normalize contract imports to the contract-root alias so both TypeScript and the Dryv compiler can load the rebuilt app and independent product API.

## Acceptance checklist

- [x] Replace the consolidated files with the domain modules and update their documentation.
- [x] Convert parent-relative contract imports and verify the alias in both authoring roots.
- [x] Typecheck, validate canonical IR and inspect generated server and client artifacts with migration differences recorded.

## Comments

### 2026-11-13T18:04:04.636Z · PETER IRUNGU

Database authoring typechecks, alias import guard, both store audits, canonical IR validation and synthetic fixture checks passed. Generated 437 Axum and Python artifacts in scratch after qualifying Python model names by group to avoid stock pack collisions. Generated Python imports and paging model defaults smoke-tested. Strict Clippy reports the stock Axum pack empty-policy match. Initial SQL and regenerated model schema differ, and the generated runtime does not honor paging defaults or snake_case physical names. No Mzizi database was migrated or switched. Full product API compilation remains blocked by missing archive dependencies already referenced before this work.
