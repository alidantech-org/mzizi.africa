---
id: DOC-MZIZI-CAPACITY-PARTITIONING-20261111
name: Two database capacity partitioning and file storage
type: architecture-proposal
tags: [capacity, partitioning, s3, postgresql, analytics]
extra: {status: proposed, approval: not_approved, implementation: not_authorized, recorded_on: 2026-11-11}
---

# Capacity, partitioning and offloaded files

> Capacity figures below are formulas and workload examples, not forecasts. Measure representative Kenyan pilot and scientific datasets before sizing hardware or approving partitions.

## Storage placement

| Data | Main PostgreSQL | Operations PostgreSQL | S3/object files | RAM/cache |
|---|---|---|---|---|
| Accepted people, institutions, geography, science and economics | Canonical identities and query-critical facts with FKs | — | Large linked datasets/geometry | Frequently requested response cache |
| Accepted sources/evidence | Publisher, citations, verification, file/version metadata and searchable content where useful | Crawl attempts and candidates | Original official PDFs, snapshots and extracted large files | Extraction buffers |
| Scientific grids | Metadata, coverage, selected observations and published summaries | Job/projection state | Chunked NetCDF/Zarr/COG/GeoParquet releases | Selected chunks |
| Analytics | Approved indicators/results | Requests, projections, experiments and unpublished outputs | Large inputs and result artifacts | Temporary working cache |
| Pipelines and auth | Only minimal durable publication attribution/receipt metadata | Durable jobs, retries, auth, checkpoints, audit | Selected retained artifacts/log bundles | Replaceable logs, buffers, ephemeral cache |
| NLP/vector | No disposable embeddings as truth | Optional index manifest only if durable workflow needs it | Rebuildable source chunks/artifact inputs | Model cache |

RAM is for replaceable cache and in-flight work, never the only location for accepted records, auth decisions, retry checkpoints, review decisions or publication receipts.

## Table-by-table growth worksheet

Each schema review table includes an **illustrative low/expected/high planning envelope** for initial rows, annual growth, peak-day intake and a coarse row-plus-index budget. These are explicit workload scenarios for user review, not measured volumes or forecasts. Replace them with sampled source counts, expected onboarding coverage, ingestion rates and PostgreSQL relation-size measurements before implementation approval. Unknown file bytes are separately sized from object counts and measured compressed file distributions.

For each table estimate:

`retained_rows = initial_rows + (accepted_ingress_per_day × 365 × years_retained)`

`base_bytes ≈ retained_rows × measured_average_row_bytes`

Then separately measure/index: indexes, TOAST, WAL, replica copies, temporary loads, backups and growth headroom. For object files: objects per release × mean compressed bytes, plus immutable version retention and replication. Do not count object bytes again as relational row size.

## Initial partition candidates

No table is automatically partitioned. Candidate families, pending data and query benchmarks:

- Main: `environment.observations`, `environment.flows`, `economy.prices`, `economy.trade_flows`, `finance.entries`, `statistical.observations`, `biology.occurrences`, `agriculture.harvests`, `health.incidents`, `research.results`, `source.captures`, and `audit`-like accepted append-only evidence histories where volume supports it.
- Operations: `engine.events`, `engine.outbox`, `engine.jobs`, `acquisition.frontier/observations`, `staging.findings`, `audit.events`, and analytical evaluation history.
- Stable identities, small vocabularies, offices, releases and lookup tables remain ordinary tables initially.

Time-range partitions are candidates when common queries constrain time and retention/archival aligns. Use monthly/yearly bounds chosen from measured rates; avoid tiny or thousands of partitions. Hash partitioning is considered only for measured key-skew/parallel-maintenance needs. Spatial geometry generally starts with PostGIS GiST/SP-GiST indexes and dataset/layer filtering; country partitioning is not a default because natural/cultural systems cross borders.

Partitioned unique/primary constraints must include the partition key. The design must explicitly decide whether an ID is globally unique through a separate identity table or uniqueness is represented by the composite key. Late-arriving observations, corrections, default partitions, future partition creation and attach/detach recovery are acceptance cases. Partitioning organizes a table; it does not shard writes across machines.

## Query and ingest scaling

- Keep product reads bounded, paginated and typed; add indexes for actual joins, filters and sort order.
- Use PostGIS spatial indexes and measured simplification/generalization for map display.
- Use Rust bounded pools, prepared typed operations, query deadlines and separate resource/queue budgets for interactive reads, ingestion and analytics.
- Batch ingest with COPY/staging, validate constraints, then publish in controlled transactions.
- Use materialized/published summaries for high-frequency dashboards and analytical projections for large cross-domain comparisons. Record source releases and freshness.
- Add read replicas when measured read pressure justifies them. They are eventually consistent; Main primary serves write and freshness-sensitive reads.
- Monitor query plans/latency, rows examined, cache hit, lock wait/deadlocks, WAL rate/replication lag, autovacuum, index and table growth, partition count, object size and restore time.

## High-volume examples for workload planning

These illustrate why representation matters and are not Mzizi forecasts:

| Scenario | Annual volume before indexes/replication/backups |
|---|---:|
| 10,000 sensors × 24 observations/day × 365 × 300 encoded bytes | 87.6M rows; ~26.3 GB |
| 100,000 sensors × 1,440 observations/day × 365 × 300 encoded bytes | 52.56B rows; ~15.8 TB |
| 1M grid cells × 100 variables × 365 days × 200 bytes/value | 36.5B values; ~7.3 TB as row-shaped records |
| 1M published documents × 2 MB each | ~2 TB object content, plus small DB metadata |
| 10M vectors × 1,536 float32 values | ~61.4 GB raw vectors before index/metadata |

For grids and vectors, chunked/object/native index representations may be better than one SQL row per value. Retain searchable coverage, release identity, methods, hashes and relevant summaries in Main. For sensor data that users need to filter/join per observation, partitioned relational storage may be justified after benchmark.

## Recovery and retention

Main has stricter preservation and point-in-time recovery needs than disposable Operations logs. Operations keeps durable control state needed to resume and reconcile, but can expire verbose event detail and temporary files under explicit retention. S3 lifecycle policies distinguish immutable source evidence and published artifacts from temporary intermediates. Replication is not a backup. Exercise restore of both DBs and S3 references; ensure the restored Main can resolve every published file version and the restored Operations can reconcile pending publication receipts.
