---
{id: TSK-226F47E8EF76,name: Review the current PostgreSQL model,type: task,status: archived,priority: medium,created_at: 2026-11-20T12:03:15.321Z,updated_at: 2026-11-20T12:27:14.033Z,order: 16384,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-20T12:03:22.151Z},{from: in-progress,to: completed,at: 2026-11-20T12:03:51.873Z},{from: completed,to: archived,at: 2026-11-20T12:03:59.707Z},{from: archived,to: completed,at: 2026-11-20T12:23:37.225Z},{from: completed,to: in-progress,at: 2026-11-20T12:23:46.561Z},{from: in-progress,to: completed,at: 2026-11-20T12:27:09.031Z},{from: completed,to: archived,at: 2026-11-20T12:27:14.033Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-226F47E8EF76/1795176202160-start,started_at: 2026-11-20T12:03:27.993Z,end_ref: refs/tracking/TSK-226F47E8EF76/1795176231885-end,ended_at: 2026-11-20T12:03:51.874Z,summary: {files: 2,insertions: 41,deletions: 2}},{base_ref: refs/tracking/TSK-226F47E8EF76/1795177426569-start,started_at: 2026-11-20T12:23:52.321Z,end_ref: refs/tracking/TSK-226F47E8EF76/1795177629040-end,ended_at: 2026-11-20T12:27:09.032Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Review the current PostgreSQL model

## Goal

Assess the authored PostgreSQL schema contracts and explain which structural choices should change to support Mzizi as an evidence-backed historical and present-day knowledge system. Deliver concrete recommendations in the conversation, grounded in current fields and constraints, without implementing a redesign or treating recommendations as approved decisions.

## Context

The owner requested an independent assessment of dryv/contracts/schemas/postgres because the current schemas are unsatisfactory. Recent contracts already distinguish geographic identities and geometries, organizations and people, institutions and offices, source artifacts and captures, and several governance and procurement roles. The assessment must acknowledge these strengths while examining identity ownership, temporal semantics, evidence granularity, revision history, vocabulary integrity and database constraints. Existing uncommitted changes belong to other work and must remain intact. Prior owner decisions about periods and subject references are constraints to identify explicitly when recommending alternatives, rather than silently overruling them. No seed inputs, generated artifacts, migrations or application behavior are authorized by this review.

## Acceptance checklist

- [x] Inspect current contracts and relevant product and design documents, distinguishing observations from proposed alternatives.
- [x] Explain the highest-impact changes with specific current examples and a coherent target model.
- [x] Record review findings, validate Task metadata and complete and archive this advisory task without changing implementation.

## Comments

### 2026-11-20T12:03:46.601Z · PETER IRUNGU

Advisory review findings: preserve feature/geometry and identity/institution/office/tenure distinctions. Prioritize temporal facts for names, reporting relationships, authority and facility operators; separate historical effective time from recording/correction time. A concurrency version is not retained history. Clarify many-to-many evidence support and attach review to immutable fact revisions; verifications currently inherit a mutable soft-deletable entity despite append-only description. Simplify official identity associations through a person/organization identity supertype if the owner approves. Source combines evidence, source discovery and public routing responsibilities. Statistics needs explicit release/method, extensible dimensions and reproducible derived inputs. Confirmed generated nullable unique indexes on official.names and identifiers do not provide intended duplicate prevention. Existing scheme and subject enforcement mechanisms must be retained rather than incorrectly described as absent. Proposed temporal and subject alternatives revisit explicit prior owner decisions; no redesign is approved or implemented. Deliver recommendations in chat; implementation files and existing user edits are untouched.

### 2026-11-20T12:25:11.743Z · PETER IRUNGU

Follow-up scope from owner: verify Dryv support for physical PostgreSQL partitioning and recommend a table-specific country, language, geography and time strategy. Reopened this same advisory task; inspect linked Dryv source and current PostgreSQL documentation, identify identity/FK implications, propose authoring/compiler/IR/pack/migration changes, and provide a phased benchmark plan. No implementation or external Dryv edits requested.


## Partitioning follow-up acceptance

- [x] Verify physical partitioning support across the linked Dryv authoring API, compiler, engine storage model, project SQL pack and documented configuration extension points.
- [x] Explain PostgreSQL key constraints and map country, language, owner and time strategies to current Mzizi tables, including shared identities and changing geographic parentage.
- [x] Record a phased implementation and measurement proposal, explicitly separating supported features from suggested additions, and validate the task workspace.

## Partitioning review findings

The linked Dryv checkout has no physical table partitioning contract. StorageFacet exposes primary keys, normal and partial indexes, index methods, composite references, same-owner rules, acyclicity and no-overlap rules, but no partition API. SchemaStorageFacetState, the TypeScript compiler mapping, the Python SchemaStorage contract and generation storage projection likewise have no partition definition. Mzizi's postgres-sql template emits ordinary CREATE TABLE statements and no PARTITION BY or PARTITION OF. A Bun runtime inspection of the linked StorageFacet confirmed the available methods. Search hits for generation partitions refer to template invocation grouping, not SQL tables.

Dryv's source/apps/site/content/authoring/vocabulary/schemas.md explicitly assigns database partitioning to pack/usage concerns. Its pack inputs currently support scalars and scalar arrays, not a typed nested partition tree. The preferred extension is a validated PostgreSQL physical-layout configuration feeding the pack and database administration lifecycle. A small pack-only prototype can use existing flat inputs, but a complete structured policy requires an approved configuration extension. A new generic schema partitionBy method is not an existing API and would change Dryv's stated architectural boundary.

PostgreSQL 18 documentation confirms that unique and primary keys must include partition columns. Mzizi inherits id-only keys, globally scoped code uniqueness and many single-id foreign keys. Dryv also rejects overriding an inherited primary key. Implementing country/language/owner/time partitioning requires explicit key ownership: field-only bases and per-table keys or dedicated bases, audited composite foreign keys, and retained global identities where required. Adding partition columns silently to unique indexes changes semantics and must not be done. The shared subject resolver currently looks up id alone and its SQL carrier parser expects an ordinary table statement ending in );. Both subject identity resolution and logical-table discovery need review when partition DDL is introduced; child partitions must not become public SubjectTable identities.

Candidate strategy: community.views is the clearest range-by-day pilot; its natural deduplication key already includes day, though its surrogate id key still needs redesign. Country LIST partitions are conditional candidates for large procurement and finance detail, election results and statistics with an explicit stable jurisdiction route and validated same-scope links. Many detail tables lack countryId today, so this is a proposed schema change. Unknown, cross-border and global scope must be represented explicitly; physical routing must never be interpreted as historical sovereignty. Keep canonical people, organizations, places, offices and small reference catalogues global initially. Country partitioning is not the default for international identities or provenance.

For geography.names and geometries, benchmark a bounded HASH(featureId) layout if size warrants; preserve natural uniqueness and owner consistency, and audit incoming/self references. A single immutable feature routes all its details predictably without forcing a current parent into history. For official.names an equivalent owner route requires resolving its person-or-organization ownership first. Language LIST partitioning fits reference.copy access patterns but should be deferred unless its actual size and read patterns warrant it; caching locale bundles may be more useful. Start with a few large language groups and a monitored default rather than one child per language. Legal wording partitioning should follow measured instrument-local versus language-wide reads. Source captures may use time ranges for time-scoped acquisition workloads, but evidence must not be expired automatically. A publisher's home country is not every artifact's jurisdiction.

Implementation proposal: first settle table grains, key/FK/code/subject invariants and workload targets; then add typed layout policies and validation for RANGE/LIST/HASH, deterministic child DDL and local indexes; then add admin-only partition creation, attach/detach, missing/default alerts and explicit evolution releases; finally benchmark one append-heavy and one owner-detail pilot against well-indexed unpartitioned tables. Use EXPLAIN (ANALYZE, BUFFERS), representative skew, global and scoped reads, insert/upsert throughput, planning latency, size and integrity failures. Compare bounded hash counts such as 16 and 32 as experiments, not promised production sizing. No country-by-language-by-year cross product and no automatic partition per parent.

References: https://www.postgresql.org/docs/18/ddl-partitioning.html ; https://www.postgresql.org/docs/18/sql-createtable.html ; https://postgis.net/workshops/postgis-intro/indexing.html . This is an advisory plan only. No contract, generator, migration, seed or live database was changed.
