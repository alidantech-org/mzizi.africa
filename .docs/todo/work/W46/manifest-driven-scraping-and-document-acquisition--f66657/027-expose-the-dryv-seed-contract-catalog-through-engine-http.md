---
{id: TSK-97EEE8DE19C7,name: Expose the Dryv seed contract catalog through engine HTTP,type: task,status: archived,priority: medium,created_at: 2026-11-17T07:36:51.072Z,updated_at: 2026-11-17T07:44:51.576Z,order: 27648,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T07:37:02.971Z},{from: in-progress,to: completed,at: 2026-11-17T07:44:50.855Z},{from: completed,to: archived,at: 2026-11-17T07:44:51.576Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-97EEE8DE19C7/1794901022981-start,started_at: 2026-11-17T07:37:03.273Z,end_ref: refs/tracking/TSK-97EEE8DE19C7/1794901490865-end,ended_at: 2026-11-17T07:44:50.855Z,summary: {files: 317,insertions: 9273,deletions: 21}}]}}}
---

# Expose the Dryv seed contract catalog through engine HTTP

## Goal

Give engineering callers enough read-only contract information to select an actual seedable table and identify its required fields, links and natural key before preparing a draft CSV.

## Context

The developer portal design requires a shared API before building any frontend. The manifest package already reads the Dryv-generated database schemas with named models. Reuse that catalog instead of querying the live PostgreSQL database or copying all table definitions into the engine. Author the HTTP operation in the local Dryv engine application, and use the active FastAPI transport with the existing engine read permission. The CLI and job registry should be able to invoke the same read operation. This work covers the deployed contract catalog and its digest. It does not add new canonical tables, persist drafts, change app routes or inspect live records.

## Acceptance checklist

- [x] Author the typed Dryv contract and compile the engine app.
- [x] Expose deterministic catalog data through authenticated engine HTTP and the runtime registry.
- [x] Test required seed columns, link aliases, filtering and unauthorized access, and document the operation.

## Comments

### 2026-11-17T07:44:50.182Z · PETER IRUNGU

Dryv engine compile and doctor passed. Generated only the engine Python API and engine catalog packs. The active FastAPI app now mounts the generated seed catalog router with engine.read authorization and delegates to catalog.seed_tables. Tests cover required fields, natural keys, link targets, filtering, digest and authentication. Focused mypy and Ruff passed. Root checks still report unrelated failures, including frontend contract imports and missing seed fixtures.
