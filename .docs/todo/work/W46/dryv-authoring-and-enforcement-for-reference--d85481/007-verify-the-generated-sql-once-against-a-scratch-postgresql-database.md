---
{id: TSK-31CF08F51D3D,name: Verify the generated SQL once against a scratch PostgreSQL database,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T08:20:20.037Z,updated_at: 2026-11-13T08:21:26.240Z,order: 7168,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T08:21:26.240Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-31CF08F51D3D/1794558086242-start,started_at: 2026-11-13T08:21:26.706Z}]}}}
---

# Verify the generated SQL once against a scratch PostgreSQL database

## Goal

Every enforcement feature added so far (CHECK rules, partial indexes, exclusion constraints, acyclic triggers, composite same-scheme keys) has only been checked at the authoring and compile level. Nothing has proved that the generated SQL is valid or that the constraints reject bad rows. This task generates the database SQL once and checks each constraint kind. The result is judged by the acceptance list below and by the matching comments disappearing from the contracts because the rule is declared in authoring code or documented where it belongs.

## Context

- Comments such as 'Author invariants are declarations, not proof of SQL enforcement' in filesystem.ts and 'the SQL pack does not enforce these yet' in source.ts rest on this gap.
- Generation needs the Dryv engine API and the rust-sql pack under dryv/packs. The project keeps exactly one scratch database named mzizi_test; drop any extra test databases afterwards and never touch existing S3 artifacts.
- camelCase authoring names are lowered to snake_case by the pack, including CHECK paths (path.snake); this has not been run end to end.
- Keep this light: one generation, one scratch database, one passing and one failing row per constraint kind.

## Acceptance checklist

- [x] Generate the database SQL from the database app and record any generation errors.
- [x] Apply the SQL to the scratch database and record any PostgreSQL errors.
- [x] For each kind (check rule, partial unique index, no-overlap, acyclic, same-as) insert one valid and one invalid row and record the result.
- [x] Fix any pack template bugs found, or list them as findings.
- [x] Drop the scratch database and report results with the exact commands used.

## Notes

Stop after this task and report to the owner before starting the next one. Keep verification light: formatting and typechecks only, unless the task says otherwise.

## Comments

### 2026-11-13T08:26:14.919Z · PETER IRUNGU

Generated main.sql from a scratch copy of the project (database app only; apps/main is broken) against the user's engine on 8750 and applied it to a throwaway postgis container (removed afterwards): applied cleanly with ON_ERROR_STOP. 18 checks passed: CHECK rules, partial unique code (soft-delete reuse), acyclic trigger, same-as composite FK, no-overlap exclusion (half-open, open-ended, per source), exactly-one owner, partial unique preferred name. Template bugs found and fixed in dryv/packs/rust-sql: disallowed Jinja filters (list/selectattr/map/startswith) and statements running together on one line. Not covered: nullable scope sentinels in no-overlap, operations.sql, Rust models, in-repo generated files (not regenerated).
