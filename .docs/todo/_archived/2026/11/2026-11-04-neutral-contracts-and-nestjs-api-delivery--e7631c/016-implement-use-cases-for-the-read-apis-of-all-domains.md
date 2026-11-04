---
{id: TSK-CB080B155C94,name: Implement use cases for the read APIs of all domains,type: task,status: completed,priority: medium,created_at: 2026-11-02T05:14:40.483Z,updated_at: 2026-11-02T05:36:44.445Z,order: 16384,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:31:28.750Z},{from: in-progress,to: completed,at: 2026-11-02T05:36:44.445Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-CB080B155C94/1793597488752-start,started_at: 2026-11-02T05:31:28.971Z,end_ref: refs/tracking/TSK-CB080B155C94/1793597804446-end,ended_at: 2026-11-02T05:36:44.445Z,summary: {files: 313,insertions: 3491,deletions: 1228}}]}},archived_at: 2026-11-04T15:53:08.080Z}
---

# Implement use cases for the read APIs of all domains

## Goal

Make every generated read endpoint return real data from PostgreSQL through the read-only role, by completing the project-owned use cases that Dryv scaffolds once, and prove it with integration tests.

## Context

Dryv scaffolds a use case per HTTP operation and a service implementation per feature; those files belong to the project. For plain list and detail reads the scaffold already queries the generated entity through the data source. Custom reads such as search, hierarchy and boundaries need hand-written queries, as the geography read slice shows (src/modules/geography/geography-read). Tests run against a scratch PostGIS database through a SELECT-only role, as in geography-read.integration.spec.ts. Depends on the generate-and-validate task.

## Acceptance checklist

- [x] Review each scaffolded list and detail use case, fixing filters, sorting, pagination and not-found handling.
- [x] Write the custom geography reads still open: map context, hierarchy, boundaries by level and governance by geography id.
- [x] Add integration tests per domain that seed records and call the use cases through the read-only role.
- [x] Confirm no use case writes to a domain table.
- [x] Run typecheck and the full test suite.

## Progress

Read APIs implemented and tested. Contracts gained the open geography reads (boundaries by level, hierarchy, map context, history, governance by geography id; Institution gets an optional geoUnitId) and an includeHistory flag on every list query. A shared helper src/read/list-page.ts now backs all 61 Find use cases: bounded paging (page >= 1, limit 1..200), equality filters for every column named in the query, case-insensitive q over text columns, current records only unless includeHistory is set, and deterministic ordering. Detail use cases return superseded versions by id and 404 when missing. New hand-written use cases cover the geography hierarchy, map context, history, boundaries by level and governance by geography. src/read/read-apis.integration.spec.ts runs 14 tests across legal, geography, governance and finance on PostgreSQL through a SELECT-only role, including the refused write. grep confirms no non-audit use case writes. Full suite: 490 files, 13999 tests pass.
