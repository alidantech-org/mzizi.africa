---
{id: TSK-583968232F6B,name: Resolve authorized engine run artifacts by stable reference,type: task,status: archived,priority: medium,created_at: 2026-11-17T07:44:14.450Z,updated_at: 2026-11-17T08:25:56.561Z,order: 31744,links: [{type: blocks,task: TSK-7C408B6B4D4B}],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T08:11:27.304Z},{from: in-progress,to: completed,at: 2026-11-17T08:25:55.572Z},{from: completed,to: archived,at: 2026-11-17T08:25:56.561Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-583968232F6B/1794903087309-start,started_at: 2026-11-17T08:11:27.970Z,end_ref: refs/tracking/TSK-583968232F6B/1794903955575-end,ended_at: 2026-11-17T08:25:55.572Z,summary: {files: 617,insertions: 13107,deletions: 1473}}]}},archived_at: 2026-11-24T19:25:25.495Z}
---

# Resolve authorized engine run artifacts by stable reference

## Goal

Give HTTP research operations a durable input and output reference backed by the existing run ledger and stores. Make it possible to identify the exact source revision and use it in replay or draft validation without accessing a host path.

## Context

The workspace implementation supports offline development using an operator-controlled input directory. The run subsystem already tracks artifact paths, hashes and derivations for local and staged S3 stores, but a stable HTTP reference must enforce caller access and verify the expected artifact. Reuse the existing store port and typed ledger records. Prefer a typed Dryv engine contract for metadata and job inputs and keep bytes in the owning store. Define explicit outcomes for expired staging, missing artifacts, changed hashes and access refusal. This prepares the engine for the IEBC draft and script work without introducing a portal or canonical database writes.

## Acceptance checklist

- [x] Author and compile engine contracts for artifact references, inspectable metadata and outcomes.
- [x] Prove an authorized HTTP caller can replay a saved run artifact with intact lineage.
- [x] Cover authorization, missing or stale references, and matching behavior for local and staged storage.

## Comments

### 2026-11-17T08:25:54.878Z · PETER IRUNGU

Implemented authenticated /v1/research/inspect and /v1/research/replay with run ID/path/SHA-256 references, using the existing ledger and run stores. The Dryv metadata contract compiles and generates Python DTOs and a route contract. Tests verify authorization, traversal refusal, lineage, wrong hashes, altered and missing bytes and expiry on the local store and S3 adapter with in-memory objects. The standalone engine verified metadata from the actual local Mongo-backed IEBC pilot. No live S3 deployment was exercised.
