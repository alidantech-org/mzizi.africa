---
{id: TSK-8158061FE85F,name: "Regenerate, assemble the release and reset mzizix",type: task,status: completed,priority: high,created_at: 2026-11-25T21:36:56.615Z,updated_at: 2026-11-25T23:13:21.741Z,order: 11264,depends_on: [TSK-E8FBF8116802],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T23:12:17.137Z},{from: in-progress,to: completed,at: 2026-11-25T23:13:21.741Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-8158061FE85F/1795648337141-start,started_at: 2026-11-25T23:12:18.888Z,end_ref: refs/tracking/TSK-8158061FE85F/1795648401744-end,ended_at: 2026-11-25T23:13:21.741Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Regenerate, assemble the release and reset mzizix

## Goal
Turn the authored contracts into the real database: regenerate the SQL snapshot, assemble the immutable release, reset the single database `mzizix` and confirm the schema, constraints, triggers and views are present. Success is a database whose catalog matches the contracts, `bun run db` checks pass and the generated Python row models match the new tables, with the API and frontend left broken on purpose.

## Context
There is exactly one database, `mzizix`, and the only reset recipe is in `.docs/rules/database.md`: `bun run db reset --yes`, then the seed loader, then `bun run db refresh`. While the database is disposable the snapshot is regenerated, the old release deleted, `bun run db assemble` run and the database recreated (`source/backend/database/migrations/README.md`). Generation needs the local Dryv API (`dryv/README.md`, use a spare port such as 8751 with `DRYV_API_KEY=any`, never stop another process). Another task (TSK-67FD455410F2) edits seeds and `dryv.yaml` in the same tree; read its changes first and do not overwrite them. The earlier hand-written release `0002_reference_metadata.sql` is folded into the new baseline if the stream is reassembled.

## Acceptance checklist
- [x] Start the local Dryv API on a spare port, run `dryv generate --app pgsql` and show the planned file diff before applying it.
- [x] Regenerate the engine row models (`--app engine`) so seeds and persistence compile; ignore API and SDK output.
- [x] Assemble the release with `bun run db assemble` and confirm `bun test` for the database CLI passes.
- [x] Run `bun run db reset --yes` and confirm tables, enums, triggers, functions and views exist.
- [x] Record the catalog comparison and any generation warnings under Progress.

## Progress

2026-11-26. Done. Contracts regenerated (SQL snapshot and engine row models, mypy clean), release reassembled (`0001_init.sql`; the old 0001 and 0002 deleted, as the migrations README allows while the database is disposable), `mzizix` reset, roles ready on 25 schemas, `bun test` for the database CLI passes (13), `bun run db refresh` works with expected (empty) geometries.
