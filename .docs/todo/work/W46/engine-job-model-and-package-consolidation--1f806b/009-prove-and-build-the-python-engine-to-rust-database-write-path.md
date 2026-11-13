---
{id: TSK-0AF0CC3BE783,name: Prove and build the Python-engine-to-Rust database write path,type: task,status: completed,priority: medium,created_at: 2026-11-13T13:05:26.350Z,updated_at: 2026-11-13T13:05:30.642Z,order: 9216,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T13:05:29.536Z},{from: in-progress,to: completed,at: 2026-11-13T13:05:30.642Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0AF0CC3BE783/1794575129546-start,started_at: 2026-11-13T13:05:30.308Z,end_ref: refs/tracking/TSK-0AF0CC3BE783/1794575130644-end,ended_at: 2026-11-13T13:05:30.642Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Prove and build the Python-engine-to-Rust database write path

## Goal

Resolve the "Python struggles to write to Postgres" problem concretely: verify whether Dryv can generate the Rust server and Python client for the database service's named operations, and build and prove a real write end to end if generation cannot be used yet. This also had to settle how NestJS will eventually connect, how MongoDB and the vector index fit in, and the full request-to-saved-record data path.

## Context

See `.docs/decisions/DEC-DATABASE-ACCESS-LIFECYCLE.md` and `.docs/design/architecture/DATABASE_ACCESS_AND_LIFECYCLE.md`. Dryv's `python-client-sdk` and `axum-backend` packs exist and target exactly this shape but both fail to load against the running Dryv engine (verified by adding them to `dryv.yaml`, running `dryv:database:plan`, and reverting). The operation (`FilesystemWrite.CreateFolder`) is still authored in Dryv first; the Rust handler and Python client are hand-written to match it. The write was run and verified against the live remote `mzizix`/`mzizix_operational` databases with disposable fixtures, fully cleaned up afterward.

## Acceptance checklist

- [x] Determine whether Dryv can generate the Rust server and Python client for named database operations, with concrete evidence either way.
- [x] Author at least one real write operation in Dryv (`dryv/contracts/apps/database/operations.ts`) with an `http` facet.
- [x] Implement the operation in Rust (`mzizi-db-core`, `mzizi-db-service`) and verify it builds, passes `clippy -D warnings`, and runs against a real database.
- [x] Build a typed Python HTTP client package (`mzizi-database-client`) and verify it performs the write, parses the response, and handles denial and conflict as typed errors, against the real service.
- [x] Document the full request -> scrape -> verify -> save data lifecycle and where NestJS, MongoDB and the vector index fit, even where those remain proposals.

## Notes

Found and tracked separately, not fixed here: `mzizi-db-core::auth::authorize::check_permission` does not consider `auth.role_assignments.scope_id`, which is `NOT NULL` in the live schema; and the new Dryv-authored `filesystem.folders` shape is materially simpler than the legacy Python `mzizi_engine.filesystem` schema, so migrating the legacy write path onto the new service needs a real schema/data migration, not a client swap (see `TSK-E55B1BC4011A`).
