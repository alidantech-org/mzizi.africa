---
id: DOC-KNOWLEDGE-PLATFORM-INDEX-20261111
name: Knowledge platform architecture documents
type: documentation
tags: [improvements, knowledge-platform, architecture]
extra: {status: planning_only, approval_required: true, implementation_authorized: false}
---

# Knowledge platform planning documents

This folder describes the proposed Mzizi knowledge architecture. All database and implementation decisions remain subject to the user's review and approval.

## Current two-database review package

1. [Two-database ownership and publication rules](two-database-rules.md) defines Main, Operations, S3, Python vector indexes and the acceptance-to-publication lifecycle.
2. [Rust and Dryv database management](rust-dryv-management.md) defines the sole relational access boundary, contract generation, concurrency, replication, recovery and the current implementation gap.
3. [Capacity, partitioning and file storage](capacity-partitioning-storage.md) defines workload assumptions, table growth, partition candidates, S3 offload and recovery sizing.
4. [Schema review catalogue](../schema-redesign/README.md) links all 28 proposed Main schemas and 6 Operations schemas, plus cross-target management, for approval table by table.

## Existing domain architecture

- [Expanded architecture](01-expanded-architecture.md) describes the platform's research purpose and domain connections.
- [Scientific and human knowledge](02-scientific-and-human-knowledge.md) describes domain-level subject areas.
- [Storage products and engineering](03-storage-products-and-engineering.md) records infrastructure and product capabilities.

The three existing documents are background architecture. If their older database counts or ownership assumptions conflict with the two-database package, the current package controls and the older proposal is treated as superseded. Detailed table and column review is maintained only in `schema-redesign/`.
