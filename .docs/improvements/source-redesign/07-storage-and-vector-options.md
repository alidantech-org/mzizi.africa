---
id: DOC-9A8E56DB1C08
name: Source storage and independent vector index evaluation
type: documentation
tags: [improvements, source-redesign, vectors, qdrant, s3]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# 07 — Storage ownership and vector search alternatives

## User concern

Do not bloat the primary operational PostgreSQL database with large embeddings or repetitively stored HTML, Markdown and documents. Evaluate a **replaceable, dedicated vector search service**, without declaring a product selected in advance.

## Logical storage responsibilities

| Storage/owner | Data retained | Avoid |
|---|---|---|
| PostgreSQL ``ource` and other domain models | Stable site/publisher/domain/page/document identity, link graph, observed metadata, provenance, FK-constrained relationships, legal status | Raw HTML dumps, high-volume vector arrays, duplicate object bytes |
| `filesystem` + existing self-hosted S3-compatible service | Immutable raw HTML/PDF/API captures; rendered snapshots; readable Markdown; sidecar manifests; datasets/model assets; artifact versions | Rebuilding an S3 upload/object platform, hiding public material by default |
| Dedicated vector index (candidate) | Dense/sparse embeddings, search payload filters, source reference IDs, model versions | Canonical truth, sole copy of text/evidence, source permission controls |
| `engine` | Scheduling, fetch/embedding/refresh jobs, retries, outputs and staleness tracking | Duplicate canonical site identities or raw artifacts |
| `audit`/source evidence | Review decisions, extraction method and factual source lineage | Treating embedding rank as independent factual proof |

Cross-schema known relations should use hard FKs when structurally appropriate. Vector stores do not provide the authoritative PostgreSQL FK relationship; refer back to stable IDs and reconcile asynchronously.

## Vector candidates — evaluate, do not preapprove

- **Qdrant:** dedicated similarity service with filtering, dense/sparse hybrid options and self-hosted deployment. Provisional assistant preference for source/section retrieval and isolation from operational Postgres.
- **LanceDB:** embedded/object-storage-oriented alternative, interesting for existing S3-compatible artifacts and batch analytics; evaluate operational access/consistency and concurrency.
- **Milvus:** substantial distributed vector engine candidate if scale requires it; higher initial operations complexity.
- **pgvector:** excellent familiar SQL integration, but using it **inside primary operational Postgres** conflicts with the user's workload-isolation preference. A separate PostgreSQL database/instance with pgvector is also possible.

These are illustrative alternatives. Final decision needs benchmark of real multilingual text, indexed metadata filtering, hybrid recall, latency at expected concurrency, disk/memory/cost, backfills, backups, upgrades, auth, data retention, outages and S3 compatibility. Vector service count may be **zero** until retrieval volume warrants one.

## What to index

Do not embed every repeated header, navigation link or raw HTML tag. Prefer meaningful text chunks from cleaned Markdown and semantic content blocks; selected page titles/anchors and organizational descriptions; domain terminology and synonyms; previously validated field mapping examples. Keep useful shared navigation in the link graph separately.

Each indexed unit needs `source_id` or equivalent stable ID, content block identity/version, text hash, model/version, access scope, language/jurisdiction and index collection/version. Use deterministic IDs and upsert/delete reconciliation. Prevent accidental leakage of restricted content through a retrieval endpoint.

## Retrieval and cache contract

Hybrid retrieval of keyword/full text, metadata/geo/institution filters and dense similarity -> candidate fusion -> reranker -> exact source sections/DOM citations. The user expects this funnel to shrink LLM context rather than passing whole sites. Missing/stale vectors should fall back to lexical and structured search; they must not block legitimate evidence retrieval.

Dedup/reindex key: normalized meaningful text hash + embedding model/version + preprocessing version, with independent source attribution. If one content block is referenced by multiple pages, reuse vector where possible while retaining all source relationships.

If the vector service is lost or migrated, **rebuild it from the PostgreSQL-indexed S3-derived content**, not by re-crawling official sites. Plan backfill, consistency reconciliation, versioned rollout, index expiry and monitoring.

## Data lifecycle, correctness and safety

Capture is authoritative evidence; a Markdown transformation is replaceable; an embedding is an even more replaceable search derivative. Respect source licences, collection assessment and publication rights for indexing and downstream display. Prefer private search indexes for restricted research material. Corrected facts may require new mappings while preserving earlier source text.

## Decision gate

Measure relevant-page recall@K, hybrid search improvement over lexical baseline, cross-lingual precision, filter correctness, memory/storage growth, cost per indexed block, and end-to-end LLM token reduction. Select topology and service only after measuring real representative datasets.

**Status:** Dedicated vector storage is a direction to evaluate; neither Qdrant nor a new operational datastore is approved.
