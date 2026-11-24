---
id: DOC-MZIZI-RUST-DRYV-MANAGEMENT-20261111
name: Rust database management and Dryv contract target
type: architecture-proposal
tags: [rust, dryv, database-management, migrations, concurrency]
extra: {status: proposed, approval: not_approved, implementation: not_authorized, recorded_on: 2026-11-11}
---

# Rust database manager and Dryv

> **Planning proposal.** This specifies the target needed before implementation; it does not assert that the current TypeScript manager has completed cutover or that Dryv already supports every required feature.

## Exclusive access boundary

Rust is the sole application component with relational database drivers and credentials for both Main and Operations. It owns reads, writes, bulk ingestion, migrations, seeds, integrity checks, publication and safe administration. NestJS serves product APIs through generated typed clients. Python extraction, scraping, NLP and ML capabilities use typed Rust operations for durable records; they have no Main/Operations connection strings.

Python-native disposable vector databases are the explicit exception: capability code may access its own vector/index service directly. It receives no relational credentials, cannot publish canonical facts and can always rebuild that index from retained source artifacts and contract releases.

External infrastructure may keep private internal persistence, such as Temporal service state. This is not a Mzizi application-data bypass.

## Dryv contract work required

The current checkout has 30 migration entries in the active manifest, 49 distinct SQL-declared tables across eight schemas, and 124 persistent Dryv entities. The generated catalog digest is `e0087da9cf5b00e91f283a5501c368c7696bdd841ea30629231dc9c590f7c1ee`; the current read-only reconciliation plan reports 11 same-name matches, with extensive SQL-only and Dryv-only sets. This is a material contract gap, not evidence of live database state. Do not emit or apply replacement DDL from this comparison alone. Do not emit or apply replacement DDL from this comparison alone.

Dryv authoring, IR, validation and generation need a reviewed target model that supports:

- Target database ownership (Main or Operations) separately from domain schema ownership.
- Entities, field types, defaults, nullability, keys, checks, exclusions, indexes and comments.
- Same-database cross-schema foreign keys; explicit cross-database typed references with no fake FK.
- PostGIS geometry/geography, spatial indexes and approved extension requirements.
- Partition method/key/bounds policy, key restrictions and maintenance contracts.
- PostgreSQL-specific functions, triggers, views, permissions and constraints where necessary.
- Typed Rust read operations, commands, bounded query plans, bulk import/export and streaming contracts.
- Generated Rust manager models/adapters and NestJS/Python client types without sharing ORM internals.
- Immutable migration snapshots/checksums, dependency ordering, drift checks and destructive-change review.
- Root seed manifest targets and dependency ordering, while seed payloads remain under repository-root `seed/`.

Generation must fail closed on unsupported definitions. Database SQL remains generated or explicitly approved as a Dryv-owned migration artifact; there must not be competing hand-maintained schema authorities. A generator gap is documented as a blocker rather than filled with silent runtime logic.

## Rust manager responsibilities

- Own distinct bounded connection pools and credentials for Main primary, Main replicas and Operations primary/replicas.
- Route all writes and freshness-sensitive reads to the appropriate primary. Expose stale-tolerant reads explicitly.
- Enforce named operations and role/scope authorization before query execution; prohibit public arbitrary SQL and caller-selected table names.
- Execute multi-schema Main transactions for publication, corrections and domain writes.
- Provide typed batch/COPY ingestion with validation and controlled conflict reporting.
- Apply immutable Dryv migrations under a per-target advisory lock with checksums and drift verification. Migration process is administrative, serialized, observable and separate from runtime roles.
- Run seeds idempotently with explicit target/release provenance.
- Report health, pool saturation, query deadlines, lock waits, replication lag, migration state, table/index/partition growth and backup/restore status.

Rust service instances may scale horizontally; a single logical manager contract does not imply one process. Database failover and replication coordination belongs to established PostgreSQL tooling (for example Patroni), which Rust consumes through managed endpoints.

## Concurrency and safe writes

Use short transactions and database-enforced constraints as the foundation. Each mutation contract states its concurrency policy:

- Row locks for contested state transitions and read-modify-write workflows.
- Optimistic expected-version checks for edits and publication.
- Unique/exclusion/check constraints for invariants that locks alone cannot protect.
- Stable lock acquisition order, bounded lock/statement timeouts and whole-transaction retry for recognized serialization/deadlock failures.
- `SKIP LOCKED` only for independent queue claims.
- Leases plus monotonically increasing fencing tokens to reject stale workers.
- Idempotency keys bound to canonical request hashes.
- One transaction commits domain rows, provenance links and Main publication receipt.
- No lock spans S3, network, OCR, vector or ML work.

Retries rerun the complete transaction logic. They do not replay only the final SQL after a conflict. API errors distinguish a conflicting reused idempotency key from a retryable serialization/deadlock condition.

## Replication, backup and future cutover

Use one writable primary per target cluster with read-only replicas. Main and Operations receive separate resource budgets and independent recovery objectives. Primary handles writes and read-after-write; replicas handle eligible reads with explicit lag bounds. Rust exposes freshness metadata and can route a caller to primary when a just-published row is required.

Synchronous replication improves acknowledged-commit durability while reducing write availability if synchronous replicas are unavailable; asynchronous replication improves availability but can lose recent commits at failover. The deployment design must choose and test this tradeoff. Use fencing to prevent split-brain writers. Backups include base backups and WAL/PITR, plus object-store inventory/checksum/retention. Restores verify Main file references against S3 and reconcile publication receipts with Operations.

Implementation order after user approval: complete Dryv target contract; generate and review Main/Operations migration artifacts; build Rust manager and generated clients; make fresh targets; seed; migrate selected verified inputs; cut over every caller; verify no direct relational access remains; then approve deployment separately. Existing TypeScript changes and task history remain documented as current migration work, not erased.
