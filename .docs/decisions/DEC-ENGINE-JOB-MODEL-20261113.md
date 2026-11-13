---
id: DEC-ENGINE-JOB-MODEL-20261113
name: Engine owns all I/O; packages are pure; Mongo staging store
type: decision
tags: [engine, packages, staging, agent]
---

# Decision: the engine owns all I/O; packages are pure; staged data lives in a temporary document store

**Date:** 2026-11-13 · **Status:** proposed (confirmed by the user in conversation; implementation not started)

## Decision

1. Python packages under `source/packages/` are pure libraries. No package imports or knows about a database. Side effects go through ports injected by the engine.
2. The engine (`source/backend/engine`) is the single runtime with a CLI, HTTP API and event stream, and coordinates threads and worker processes. The web, CLI and Temporal submit to the same executor.
3. `agent` is removed from the packages. `source/backend/agent/` is created as a README-only placeholder for a future assistive application. The agent is a client of the engine API and produces Proposals only.
4. `ocr` is folded into `extraction`. `source` is dissolved: fetching becomes a `fetch` package; challenge detection moves to `scraping`; the collection gate becomes an engine policy module. `manifest` stays as the envelope and schema validator, with packages registering their own section schemas and no dependency on `scraping`.
5. `filesystem` is left unchanged for now and is revisited after the engine job model exists.
6. The engine targets the Rust database service (port 3303) through a read-only `Reader` port and a writer port; the legacy Bun service (3301) is transitional.
7. Collected data is staged in per-domain MongoDB collections with a provenance envelope and a TTL, behind a `StagingStore` port. The engine and database writer use it; the agent gets a namespaced scratch area through the engine API.

## Why

Mixing database access into packages broke the workspace and blurred ownership. A single engine with ports gives one place for concurrency, memory limits, retries and audit, and makes job code identical for every caller. A temporary schemaless store avoids handling heavy JSON/CSV files and lets mapping to structured tables happen later without canonicalising anything early.

## Consequences

- Task group "Engine job model and package consolidation" tracks the work. See [ENGINE_JOB_MODEL](../design/architecture/ENGINE_JOB_MODEL.md).
- AGENTS.md and the package and backend READMEs must be updated as each change lands.
- Temporal remains the owner of durable multi-job workflows; the engine must not duplicate it.
