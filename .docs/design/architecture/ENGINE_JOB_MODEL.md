---
id: DOC-ENGINE-JOB-MODEL-20261113
name: ENGINE_JOB_MODEL
type: documentation
tags: [engine, packages, staging, agent, proposal]
---

# Engine job model, packages and staging store

**Status: proposal, 13 November 2026.** Nothing here is implemented unless stated. Decision record: [DEC-ENGINE-JOB-MODEL-20261113](../../decisions/DEC-ENGINE-JOB-MODEL-20261113.md). Work is tracked in the task group "Engine job model and package consolidation".

## Why

The engine already owns an `Executor`, jobs, runs, events and an outbox. `mzizi-filesystem`'s former database code (repository, service, authz, sync, uploads, lineage, transitions, reset, secure, its CLI) has moved into `source/backend/engine/src/mzizi_engine/filesystem/`, behind a `Connection` port in `mzizi_engine.ports.database`; the package itself is now pure (TSK-E55B1BC4011A). The remaining target is a clear split everywhere else too: **packages compute, the engine does all I/O and coordination.**

## Principles

1. **Packages are pure libraries.** No package knows a database exists. They take plain data and injected ports and return plain data or diagnostics.
2. **The engine is the runtime.** It has a CLI, an HTTP API and event stream, and a runtime that runs many jobs on threads and worker processes with memory and size limits.
3. **Same job code for every front door.** The web (through NestJS), the local CLI and Temporal all submit to the same `Executor`. A job kind never knows who asked.
4. **The engine never writes domain data.** It produces files, staged documents and candidates, and hands them to the database service (Rust, port 3303) or NestJS for review and acceptance.
5. **Small modules.** A module stays near 200–300 lines and is split above about 400. The root of a package's `src/<name>/` holds only `__init__.py`; everything else sits in subfolders by responsibility.

## Package set

| Package | Role | Notes |
|---|---|---|
| `scraping` | Selectors, fields, transforms, link discovery, challenge detection. Understands its own manifest section. | Pure. Kept. |
| `extraction` | PDF, GeoJSON, CSV, JSON to segments with diagnostics; OCR as `extraction/ocr/`. | Pure. `ocr` folded in. |
| `fetch` | Identified HTTP/API fetching, rate limits, API-manifest understanding. Takes an injected `Http` port. | Replaces `source`. |
| `manifest` | Loads and validates the manifest envelope and schemas; used by the engine CLI and other packages. Packages register their own section schemas. | Kept; loses its `scraping` dependency. |
| `filesystem` | Left as is for now. Later splits into pure hashing/object-store helpers and an engine `storage/` module. | Deferred. |
| `agent` | Removed. | Placeholder README under `source/backend/agent/`. |

The collection-gate rule (a pure function tested with `seed/fixtures/contracts/gate-vectors.json`) moves to an engine `policy/` module.

## Job model

A job kind is plain code with three parts:

- `plan(input, ports) -> Plan`: read-only. May read the object store and database (for example, list all Kenyan counties). A plan is data: ordered steps or child jobs with typed inputs, persisted and hashed. A dry run is planning without executing.
- `steps`: each takes `(input, ports)` and returns artifact references. A typical chain is `fetch -> extract -> save -> stage -> map`.
- `ports`: small protocols such as `ObjectStore`, `Reader` (read-only database queries through the database service), `Http`, `StagingStore`, `Clock`, `ArtifactSink`.

Adapters differ by environment (deployed: S3, Rust database service, Mongo; local: directory, in-memory). Job code is identical in both. The existing executor features (queue, per-capability limits, retries, cancel, SSE events, restart recovery, outbox) are kept.

### Safety

- Artifacts and staged documents move **by reference** (file id and hash, or staging key), never as large in-memory payloads.
- Bounded queues give backpressure; per-capability semaphores cap concurrency; size caps apply per artifact.
- Threads run I/O; CPU-bound work (PDF, OCR, geometry) runs in the process pool.
- Steps are idempotent and keyed by content hash so retries and restarts are safe.

### Engine versus Temporal

An engine job is a bounded, restartable unit with a small in-process DAG (for one target). Temporal owns long campaigns, multi-job sequencing and anything needing durable multi-day state or human waits. The CLI runs engine jobs directly, without Temporal. The engine must not grow a second durable workflow system.

## Staging store (MongoDB)

Instead of heavy JSON and CSV files, collected data lands in a flexible, temporary document store so it can be processed quickly and mapped later.

- **Shape:** one collection per domain, such as `geography_raw` or `legal_raw` (mock, non-exact mirrors of the domain schemas). Documents are schemaless but carry a provenance envelope: job id, source, artifact hash, observed time, optional slot hints for later mapping.
- **Lifetime:** a TTL index expires documents at a maximum age. The engine may also delete data it no longer needs. Staging data is never canonical and never the only copy of raw bytes; raw artifacts stay in the object store.
- **Access:** only through the `StagingStore` port (Mongo adapter; in-memory/local adapter for tests and the CLI). The engine and the database writer read and write it. The agent gets a namespaced scratch area, reached only through the engine API.
- **Not decided here:** exact collection list, TTL values, and the mapping from staged documents to database candidates. These belong to the staging-store task.

## Where the agent operates

The agent is a **client of the engine**, not part of it. It uses the same API as the web and CLI; it has no special database access. Its tools are "read engine and database digests, read artifacts and staged documents, submit jobs, use the scratch area." Its output is always a **Proposal** stored as an artifact and validated through `manifest` schemas before anything applies it; approval follows the existing AI-or-human rule.

| Hook | Input | Output |
|---|---|---|
| Prepare for work | Engine digest, database digest | A proposed or edited Plan (`agent.plan`) |
| During or after a run | Failed events, sampled scraped pages | Manifest fix proposals (`agent.manifest_repair`) |
| Map time | Staged documents, target domain schema | Mapping and normalisation proposals |
| Review | Candidate and evidence | Accept/reject assistance |

`source/backend/agent/` will become the assistive application (tooling and heavy work for AI and LLMs). For now it holds a README only.

## Open items

- Mongo operating model (hosting, backups are not needed for staging data, auth).
- Whether a WebSocket channel is needed beyond SSE (default: no).
- Final home of `filesystem` code and the legacy Bun database service retirement.
