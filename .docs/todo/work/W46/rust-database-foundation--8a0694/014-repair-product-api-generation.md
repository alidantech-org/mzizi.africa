---
{id: TSK-CC23621FBCDE,name: Generate from the current database contracts,type: task,status: completed,priority: medium,created_at: 2026-11-14T05:39:27.417Z,updated_at: 2026-11-14T05:47:15.507Z,order: 14336,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-14T05:39:47.769Z},{from: in-progress,to: completed,at: 2026-11-14T05:47:15.507Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-CC23621FBCDE/1794634787779-start,started_at: 2026-11-14T05:39:48.466Z,end_ref: refs/tracking/TSK-CC23621FBCDE/1794635235509-end,ended_at: 2026-11-14T05:47:15.507Z,summary: {files: 27,insertions: 26,deletions: 6033}}]}}}
---

# Generate from the current database contracts

## Goal

Run root Dryv generation against the database app composed from current schema groups.

## Context

The old product authoring entrypoint depended on removed modules. The active database app already registers typed database operations and owns the Rust model and SQL snapshot outputs. Route and repository packs require separate activation and runtime verification.

The root command selects the application that combines the canonical Main and Operations schemas and grants the service access to both stores. The application registers operations from reference, filesystem, and auth. The root command is expected to succeed without requiring the removed modules or running the old web catalog and access export chain. For this change, verify that the current contracts pass the database checks and that the generated output is stable. Executable operations need further work on pack activation and database integration.

## Acceptance checklist

- [x] Route root generation and verification through the current database app.
- [x] Validate the current database contracts and run root generation.
- [x] Document the active outputs and command behaviour.
