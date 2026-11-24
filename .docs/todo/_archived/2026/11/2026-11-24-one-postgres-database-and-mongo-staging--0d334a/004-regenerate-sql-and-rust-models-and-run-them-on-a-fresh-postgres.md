---
{id: TSK-E4F66863838C,name: Regenerate the SQL and run it on a fresh PostgreSQL database,type: task,status: archived,priority: medium,created_at: 2026-11-15T16:32:04.288Z,updated_at: 2026-11-24T19:14:01.420Z,order: 4096,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T16:54:16.863Z},{from: in-progress,to: archived,at: 2026-11-24T19:14:01.420Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-E4F66863838C/1794761656865-start,started_at: 2026-11-15T16:54:17.464Z,end_ref: refs/tracking/TSK-E4F66863838C/1795547641432-end,ended_at: 2026-11-24T19:14:01.421Z,summary: {files: 11421,insertions: 450356,deletions: 362305}}]}},archived_at: 2026-11-24T19:25:24.571Z}
---

# Regenerate the SQL and run it on a fresh PostgreSQL database

## Goal

Generate the SQL snapshot from the single-store contracts, assemble the first release, and apply it to a fresh empty PostgreSQL database with the Bun CLI, proving the schema works. Existing development databases are not touched. (Rust models no longer exist; this task was renamed in substance.)

## Context

Generation runs through the Dryv engine API from the Dryv checkout (`bun run dryv:api`, then `bun run dryv:database:generate`). Done on 15 November 2026: the snapshot `source/backend/database/sql/schema.sql` was generated (12 schemas, 94 tables, 294 foreign keys, 70 unique constraints, 42 checks, 3 exclusion constraints, 282 indexes); `0001_init.sql` and `.snapshot` were assembled; on a scratch PostgreSQL 18 database `plan`, `migrate`, a second `migrate`, `status`, `verify` and `roles` all passed, and the engine and API roles were confirmed able to read and write but not run DDL or read the ledger tables. The scratch database and roles were dropped afterwards. The geometry column is still a placeholder and needs a decision.

## Acceptance checklist

- [x] Dryv generates one SQL snapshot for the single store with no operations output.
- [x] A release is assembled and applied to an empty scratch PostgreSQL database and the expected 94 tables exist.
- [x] The Bun CLI unit tests and typecheck pass and the end-to-end CLI run succeeded against the scratch database.
- [ ] The geometry storage decision (PostGIS type, SRID, who owns the generator change) is written down in this task and in the Dryv gaps register.

## Notes

On 15 November 2026 a format step was added: `bun run db format` (sql-formatter, PostgreSQL dialect) and a `format-sql` Dryv action that formats the snapshot before it is written. The formatted snapshot builds a schema identical to the unformatted one (pg_dump of both scratch databases differs only in pg_dump random restrict tokens). Because the snapshot changed, the unapplied `0001_init.sql` was re-assembled; no database had applied it.
