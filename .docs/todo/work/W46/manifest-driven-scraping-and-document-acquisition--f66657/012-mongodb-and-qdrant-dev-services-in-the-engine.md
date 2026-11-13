---
{id: TSK-ADC6686A7090,name: MongoDB and Qdrant dev services in the engine,type: task,status: completed,priority: medium,created_at: 2026-11-13T18:38:24.756Z,updated_at: 2026-11-13T18:40:11.039Z,order: 12288,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T18:40:09.868Z},{from: in-progress,to: completed,at: 2026-11-13T18:40:11.039Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-ADC6686A7090/1794595209870-start,started_at: 2026-11-13T18:40:10.697Z,end_ref: refs/tracking/TSK-ADC6686A7090/1794595211041-end,ended_at: 2026-11-13T18:40:11.040Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# MongoDB and Qdrant dev services in the engine

## Goal

Connect the engine to the developer MongoDB and Qdrant services so crawl and PDF outputs can be loaded as documents, indexed as vectors, searched semantically and given proposed classes. The services are sandboxes for learning whether they earn a place; they never hold canonical data.

## Context

Plan documents `.docs/_plan/mzizi-engine/05-mongodb-and-vector-dev-services.md` and `06-phased-delivery.md`. Code lives in `mzizi_engine/devservices/` (settings, Mongo sandbox and loader, chunk indexing, embedders, Qdrant store, querying, handlers) with the pure chunker in `mzizi_extraction.document.chunks`. Typed contracts, one parsing boundary and absolute imports follow `.docs/rules/typed-code.md`.

## Acceptance checklist

- [x] `mongo test|stats|load|find|drop-dev` work against the local MongoDB; loads are idempotent and only the dev database can be dropped.
- [x] `vector test|status|index|search|classify|drop-dev` work against local Qdrant with deterministic point ids and one collection per embedding model.
- [x] Embeddings run locally (fastembed) with an offline hashing embedder for tests; classification output is labelled as a proposal.
- [x] Ports, CLI commands, doctor and status report availability; tests, mypy, ruff and documentation are updated.

## Notes

Live tests skip when a service is unreachable. The real embedding model downloads about 0.5 GB on first use.
