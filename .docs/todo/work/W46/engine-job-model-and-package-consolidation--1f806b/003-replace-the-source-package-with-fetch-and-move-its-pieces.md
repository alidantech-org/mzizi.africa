---
{id: TSK-58372E81D1B5,name: Replace the source package with fetch and move its pieces,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T09:53:30.385Z,updated_at: 2026-11-13T10:12:27.848Z,order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T09:56:28.208Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-58372E81D1B5/1794563788210-start,started_at: 2026-11-13T09:56:28.692Z}]}}}
---

# Replace the source package with fetch and move its pieces

## Goal

The user does not like the `source` package. Dissolve it: create a small `fetch` package for identified HTTP and API fetching and rate limiting over an injected `Http` port and for understanding the API section of manifests; move challenge detection into `scraping`; move the collection-gate decision rule to an engine policy module.

## Context

`mzizi-source` has about 690 lines and 37 tests. Its gate is a pure function tested against `seed/fixtures/contracts/gate-vectors.json`; loading assessments from a database is the caller's job, which now becomes the engine's job. Publisher-specific knowledge must stay in manifests and seed inputs, not package code. See `ENGINE_JOB_MODEL.md`.

## Acceptance checklist

- [ ] A new `fetch` package exists with the existing client and rate-limit behaviour behind an `Http` port, split into small modules, with the relevant existing tests ported.
- [x] Challenge detection lives in `scraping` with its tests; the gate rule lives in an engine `policy/` module and still passes the shared gate vectors.
- [x] The `mzizi-source` project, workspace entries and docs are removed and every importer is updated.
- [x] Tests for `fetch`, `scraping` and the engine policy pass and READMEs and the package map are updated.

## Comments

### 2026-11-13T10:31:51.552Z · PETER IRUNGU

fetch package created (typed policy/gate/events/cache/transport; 6 tests), challenge detection in scraping (3 tests), typed collection gate in engine policy/gate (32 gate vectors pass). Open: item 1 asks for an Http port; the fetcher still takes an injected httpx.Client rather than a protocol. uv.lock not regenerated (see TSK-E55B1BC4011A).
