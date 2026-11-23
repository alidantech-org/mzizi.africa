---
id: PLAN-NEW-MZIZI-PERFORMANCE-INVESTIGATION
name: Evidence-first database and API performance investigation
type: planning-proposal
tags: [benchmark, sql, postgis, diagnostics, performance]
extra: {status: investigation_plan, approval: not_approved, execution: not_authorized, recorded_on: 2026-11-23}
---

# Performance investigation: measure before redesign

**Status:** Proposed diagnostic method, not an authorized live benchmark or database change. We have not inspected the running PostgreSQL server, retrieved `pg_stat_statements`, or executed `EXPLAIN` in this review. No baseline timings exist here.

## Why an observed slowdown is not automatically a database-design failure

A slow page can be caused by a PostgreSQL plan, connection pool or disk I/O, API-side repeated calls, process-local caches, GeoJSON payload size, SVG path generation, browser rendering or local environment contention. A query that looks complex may still run quickly on current data.

The goal is to attribute time to one layer and one specific operation.

## Proposed measurement matrix

| Workload | Inputs and comparison | Record |
| --- | --- | --- |
| Country setup and lookup | `KE` and another served country; cold/warm | Query count, latency, data size, media work |
| Place context | Country, county, constituency, ward; cold/warm | Recursive CTE time, name/label lookup, rows visited |
| Child list and search | First page, later page, exact and substring search | Result vs count work, index use, filtered rows |
| Coordinate resolver | Interior point, shared boundary, no-match point | Geometry plan, candidate order and correctness |
| Map boundary load | Simple vs complex outline; self vs children; different simplification | Geometry read, simplification time, GeoJSON bytes, browser/SVG time |
| Place dashboard | Geography plus population/statistics/government/finance | Number of API calls, cumulative SQL and overall page time |
| Source/evidence lookups | Exact citation for selected feature or published figure | Index paths and full evidence reconstruction time |

Use the same dataset and query parameters for each comparison. Preserve development vs production differences in version, settings and hardware.

## Safe first-pass diagnostics

On an **approved development or scratch database**, inspect table/index sizes, row estimates, extension availability and query plans. Useful read-only commands include:

```sql
-- Diagnostic only: do not install extensions or alter configuration.
SELECT extname FROM pg_extension
WHERE extname IN ('postgis', 'pg_trgm', 'pg_stat_statements');

SELECT schemaname, relname, n_live_tup, n_dead_tup
FROM pg_stat_user_tables
WHERE schemaname IN ('geography', 'source', 'reference', 'statistics')
ORDER BY n_live_tup DESC;

-- Replace this with one reviewed, bounded SELECT and its real parameters.
-- EXPLAIN ANALYZE EXECUTES the query; use a safe dev dataset.
EXPLAIN (ANALYZE, BUFFERS, SETTINGS)
SELECT id, code FROM geography.features WHERE deleted_at IS NULL LIMIT 20;
```

If `pg_stat_statements` is already available, read its most expensive SELECT statements without changing server settings. Enabling it, adding an index, running `ANALYZE`, increasing memory or altering PostgreSQL configuration are separate operator-approved actions. Do not run heavy diagnostics against production without an approved window and scope.

## Evidence to record per query

- Exact API route/use case, input parameters and intended response, including country/language and historical date.
- Dataset row counts and size; PostgreSQL/PostGIS versions, relevant configuration and environment.
- SQL with parameter types; plan nodes, execution time, buffer reads/hits, temporary spills, rows estimated vs actual.
- Cache status, number of SQL statements per request, connection-pool wait, app duration, response size and browser render duration.
- Whether speed or correctness changes after a proposal; whether provenance and historical semantics are preserved.

Use p50/p95 and repeatable samples only after capturing raw measurements; **do not invent performance numbers or targets**.

## Proposals to compare only after establishing a baseline

- Index changes versus query rewrite versus precomputed hierarchy/geometry.
- Reducing per-feature count/name/statistic queries via bulk joins.
- Targeted place lookup versus full country registry and better caching/invalidation.
- Display geometry precomputation and efficient tiles versus runtime polygon simplification.
- Time-aware derived read models versus single-source normalized reads.
- Actual partitioning only if access patterns/data volume warrant it; check global FK and uniqueness consequences.

## Acceptance conditions for a future approved implementation

The candidate improvement must be benchmarked before/after on the same dataset, preserve correct language/country/history and evidence, not introduce unsupported data ownership, and include migration/refresh/rollback plans. A change that only speeds the demo but changes the answer is not acceptable.

## Reference

- [Current SQL](../../../source/backend/database/sql/schema.sql)
- [Explorer queries](../../../source/backend/api/src/modules/explorer/features/explorer/reads/queries.ts)
- [Geometry reader](../../../source/backend/api/src/modules/explorer/features/explorer/reads/boundaries.ts)
- [Database migration guidance](../../../source/backend/database/migrations/README.md)
