---
{id: TSK-E9794785C9AF,name: Generate working read use cases from Dryv queries,type: task,status: archived,priority: medium,created_at: 2026-11-15T19:21:01.000Z,updated_at: 2026-11-24T19:25:10.742Z,order: 14336,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T19:21:03.883Z},{from: in-progress,to: completed,at: 2026-11-15T19:21:04.344Z},{from: completed,to: archived,at: 2026-11-24T19:25:10.742Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-E9794785C9AF/1794770463885-start,started_at: 2026-11-15T19:21:04.118Z,end_ref: refs/tracking/TSK-E9794785C9AF/1794770464346-end,ended_at: 2026-11-15T19:21:04.345Z,summary: {files: 0,insertions: 0,deletions: 0}}]}},archived_at: 2026-11-24T19:25:27.703Z}
---

# Generate working read use cases from Dryv queries

## Goal
Make Dryv generate working use cases for the Mzizi API instead of NotImplemented stubs, so every query-backed operation in `dryv/contracts/apps/api` answers from PostgreSQL through generated code that follows its declared semantic query: stable ordering, paging bounded by the query's maximum limit, forward relations as joins, nested related selections, and the contract's `missing` failure.

## Context
The Dryv engine already exposes each operation's persistence plan as `operation.persistence.document`. The project pack `dryv/packs/use-cases` now parses it with a new `fromjson` Jinja filter, generates one repository per feature and a shared plan-driven runtime `database/read-plan.ts`, and generates use cases that call the repository. Gaps are recorded in `.docs/design/data/DRYV_GAPS.md` (rows 34 to 39). Writes, workflows and events are not in any contract yet.

## Acceptance checklist
- [x] Query plan reachable from pack templates (fromjson filter) and date temporals planned
- [x] Repository per feature and shared read runtime generated from the plans
- [x] Query-backed use cases call the repository and map rows to the response DTO
- [x] Transaction hook (`inTransaction`, `ReadContext.manager`) and write, workflow and event gaps documented
- [x] Regenerate; tsc and prettier pass; tests pass except the two known `effectiveFrom` DTO examples
