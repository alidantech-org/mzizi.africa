---
{id: TSK-583968232F6B,name: Resolve authorized engine run artifacts by stable reference,type: task,status: planned,priority: medium,created_at: 2026-11-17T07:44:14.450Z,updated_at: 2026-11-17T07:44:34.656Z,order: 31744,links: [{type: blocks,task: TSK-7C408B6B4D4B}]}
---

# Resolve authorized engine run artifacts by stable reference

## Goal

Give HTTP research operations a durable input and output reference backed by the existing run ledger and stores. Make it possible to identify the exact source revision and use it in replay or draft validation without accessing a host path.

## Context

The workspace implementation supports offline development using an operator-controlled input directory. The run subsystem already tracks artifact paths, hashes and derivations for local and staged S3 stores, but a stable HTTP reference must enforce caller access and verify the expected artifact. Reuse the existing store port and typed ledger records. Prefer a typed Dryv engine contract for metadata and job inputs and keep bytes in the owning store. Define explicit outcomes for expired staging, missing artifacts, changed hashes and access refusal. This prepares the engine for the IEBC draft and script work without introducing a portal or canonical database writes.

## Acceptance checklist

- [ ] Author and compile engine contracts for artifact references, inspectable metadata and outcomes.
- [ ] Prove an authorized HTTP caller can replay a saved run artifact with intact lineage.
- [ ] Cover authorization, missing or stale references, and matching behavior for local and staged storage.
