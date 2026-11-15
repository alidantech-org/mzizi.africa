---
{id: TSK-7363069AF5C1,name: "Remove the Operations store, the Rust service and all Rust code",type: task,status: completed,priority: medium,created_at: 2026-11-15T16:32:03.434Z,updated_at: 2026-11-15T16:54:16.067Z,order: 2048,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T16:54:15.284Z},{from: in-progress,to: completed,at: 2026-11-15T16:54:16.067Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-7363069AF5C1/1794761655286-start,started_at: 2026-11-15T16:54:15.834Z,end_ref: refs/tracking/TSK-7363069AF5C1/1794761656069-end,ended_at: 2026-11-15T16:54:16.067Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Remove the Operations store, the Rust service and all Rust code

## Goal

Make Dryv, the runner scripts and the repository know a single PostgreSQL store and no Rust. The owner ordered every Rust pack and all Rust code removed, with the database folder becoming a plain Bun project. Existing databases and committed history are untouched.

## Context

Owner decision: DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115 (second order, same day). Done in this task: the `operations` store, its packs and `mzizi_operations` configuration were removed from `dryv.yaml` and the database app; the five operational schema files that move to Mongo (engine, staging, acquisition, analytics, management) were deleted; auth and audit were kept and pointed at `main`; the Rust model and catalogue packs were copied to the Dryv repository examples and deleted here; the SQL pack was renamed `postgres-sql`; the Cargo workspace, crates and generated Rust models were deleted along with the local build directory; the runner scripts lost the Rust project kind, the Rust service entries and the Rust quality step. The hand-written Rust SQL was not read before deletion because the owner ordered removal; its operations are re-specified in the engine and API tasks. Callers that now have no server: engine `ENGINE_STORE=database_service`, `source/backend/api/src/database/write-database.ts`, and the engine filesystem legacy connection.

## Acceptance checklist

- [x] `dryv.yaml` and the database app declare one store and one SQL pack, with no Operations store or Rust packs.
- [x] The Cargo workspace, Rust crates, generated Rust models and Rust Dryv packs are removed from the repository, and the Rust packs are copied to the Dryv repository examples.
- [x] The runner scripts have no Rust kind, service or quality step and `bun test scripts` passes.
- [x] `bun run database:check` passes with one store, and the callers left without a server are listed here.

## Notes

On 15 November 2026 the owner also ordered the whole `source/backend/pipelines` folder removed. It was a Bun Temporal worker and workflow API that nothing called and that stored run state through the removed database service. Deleted: 12 tracked files (history preserved). Removed from the runner, package scripts and docs. Left in place and unused: the Temporal container in `compose.local.yaml`, the engine endpoint `/internal/v1/capabilities/execute`, and `seed/system/pipelines/pdf-extraction.v1.json`; review them with the engine job work.
