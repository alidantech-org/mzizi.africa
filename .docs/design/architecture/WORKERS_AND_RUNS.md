---
id: DOC-WORKERS-AND-RUNS-20261116
name: WORKERS_AND_RUNS
type: documentation
tags: [engine, workers, runs, jobs, s3, mongo, proposal]
---

# Workers, runs and sealed run bundles

**Status: phase 1 implemented (16 November 2026). Phases 2–5 describe the approved design.** Decision record: [DEC-WORKERS-AND-RUNS-20261116](../../decisions/DEC-WORKERS-AND-RUNS-20261116.md). Handoff for the implementing agent: [HANDOFF-WORKERS-AND-RUNS-20261116](../../handoffs/HANDOFF-WORKERS-AND-RUNS-20261116.md). Builds on [ENGINE_RUNTIME_AND_PACKAGES](ENGINE_RUNTIME_AND_PACKAGES.md) and [ENGINE_PERSISTENCE](../data/ENGINE_PERSISTENCE.md).

## Phase 1

The engine parses a version-1 job spec, retains each registered request model in its stage, and hashes the resulting canonical JSON. Legacy operations without a request model are rejected during parsing. The in-process runner executes `scraping.crawl` and `site.watch`, using the union of declared requirements and a separate Mongo ledger requirement. A successful in-process run records `completed` after the stage returns. A handler error records `failed` with the exception type. Interrupted runs retain their last recorded state.

The local store streams new bytes to `.dev/runs/<run_id>/artifacts/` and records their hashes. Run audit events go to both MongoDB and `logs/` in the local store. The existing crawl evidence stays in its caller-selected output folder and site watch keeps its normal per-site evidence layout. Manifest writes are available on the local store. Automatic artifact staging, verified sealing, source-gate integration for spec authority references, scheduling, and retention enforcement for local files are later work. The existing HTTP job API continues to use its own in-memory executor store.

## The idea

The engine can spin a **worker** that carries everything one piece of work needs (sites to crawl, folders to use, site-structure manifests, configuration) and nothing more. Many workers run at once. A worker finds and prepares content: it crawls, downloads, converts to Markdown, extracts PDFs and tables, and produces ready CSVs and Markdown while the raw sources stay intact. It records every log and decision. It never publishes. When it finishes, it **seals** its output as an immutable run bundle in temporary S3. A different, later step, the **release** step, checks the bundle, decides where each file belongs, and only after approval promotes files into permanent S3 keys and the PostgreSQL `filesystem` schema. Finding content and publishing it are separate work at separate times.

## Vocabulary (use these words exactly)

| Term | Meaning |
|---|---|
| **Job spec** | A typed, versioned, immutable manifest of what to do: the stages, their parameters, the sources and their recorded authority, limits and optional ranking. It has a hash. |
| **Stage** | One step of a spec, backed by one registered operation (for example `scraping.crawl`, `web.download`, `extraction.markdown`). Its parameters are validated by that operation's request model. |
| **Run** | One execution of a spec: an id, a state, attempts, checkpoints, a log. Stored in the Mongo ledger. |
| **Worker** | A process that executes one run. It is generic: it holds no capability logic of its own. |
| **Worker context** | The services a worker is built with, containing only what the spec's stages require (Postgres, S3, Mongo, a browser, a user agent, search keys, the input root). |
| **Scratch** | The worker's local temporary folder. A cache, never the record. In development it is the `.dev/` folder. |
| **Run store** | The interface the worker writes artifacts and logs through. Two backends: local (`.dev`) and S3-temp. |
| **Run bundle** | The objects a run produced under `private/tmp/runs/<run_id>/` plus its manifest, sealed and immutable. |
| **Release worker** | The step that takes a sealed bundle, checks it, routes it and, after approval, promotes it. |
| **Promotion** | A server-side S3 copy to the permanent key plus the Postgres rows, with lineage. The filesystem package already supports it (`StoredObject`). |

Do not introduce other names for these. A worker is not a job, a run is not a spec.

## Why not "one worker that does everything"

A worker that contains every capability becomes a second monolith, cannot be tested per capability and needs every credential to do anything. Instead each operation declares what it **requires**, the engine takes the union over the spec's stages, builds the context from only those sections of the engine configuration, and fails at spin time naming anything missing. A pure extraction worker needs no network configuration at all.

## Run states

```text
queued -> leased -> working -> sealed -> checking -> approved | rejected | partial -> promoted -> expired
                       \-> failed (retryable) / cancelled
```

- `leased` carries a lease with an expiry and a heartbeat. A worker that stops heartbeating loses the lease; the run goes back to `queued` and resumes from its last checkpoint.
- `sealed` means: manifest written, every hash verified once, ledger records the manifest hash, no object under the run prefix is ever overwritten again.
- Approval may be given by a human or by an AI reviewer (existing project decision DEC-AUTO-APPROVAL); the approver and the reason are recorded.
- `expired` removes temporary objects after the retention period; the permanent run summary stays.

## The ledger (MongoDB, permanent staging)

| Collection | Holds |
|---|---|
| `runs` | id, spec hash, spec, state, attempts, lease, checkpoint (last completed stage and resume data), timings, requested_by, manifest hash |
| `run_events` | append-only structured log lines: time, level, stage, message, small data. Never page bodies or personal data. Has a TTL index. |
| `run_artifacts` | one row per file: path, sha256, size, media type, source URL, stage, derived_from, state (`staged`, `promoted`, `rejected`) |
| `run_summaries` | permanent small summary: spec hash, counts per stage, per-file hashes and sources, decisions, skips with scores, approver. Never expires. |

PostgreSQL holds approved data only. Mongo holds everything about work in progress and about the work that was done.

## The run store

```text
RunStore.put(run_id, relative_path, source, provenance) -> ArtifactRecord   (hash computed while writing)
RunStore.open(run_id, relative_path) -> stream
RunStore.list(run_id, prefix) -> records
RunStore.write_manifest(manifest) -> manifest hash
RunStore.delete(run_id)
```

- **Local backend** (development): `.dev/runs/<run_id>/artifacts/...`, `logs/`, `manifest.json`. This layout sits alongside the existing per-site and dated run folders.
- **S3-temp backend** (production): `private/tmp/runs/<run_id>/artifacts/...`, `logs/runs/<run_id>/*.jsonl.gz`, `manifest.json`. Per-file objects, not a zip.
- Same relative layout in both, so the same worker code runs in both. The backend is chosen by the engine configuration (`ENGINE_RUN_STORE=local|s3`), never by the worker.
- The S3 backend must be tested against the real local object store, not only against the in-memory fake, so development cannot diverge from production.

The later sealing step verifies the artifacts and records the manifest hash in the ledger.

## Scratch and cleanup

- A worker works in a local scratch folder because browsers, PDF conversion and OCR need real files; S3 round trips are too slow to work in directly.
- A stage **uploads its outputs first and only then records itself complete**. If a worker dies, scratch is lost and the next worker restarts from the last recorded stage, fetching what it needs from S3.
- The worker deletes scratch in a `finally` block; the engine sweeps orphaned scratch folders at startup. In containers use a size-limited scratch volume and a read-only root.
- Raw bytes are stored first and never modified. Derived files (Markdown, CSV) reference them (`derived_from`).

## The sealed run manifest

JSON with: run id, spec hash, start and finish times, `files` (path, sha256, size, media type, source URL, stage, derived_from), `logs` (path, sha256), `decisions` (what was fetched or skipped and why, with ranking scores), `counts`, `engine_version`. Its own sha256 is stored in the ledger. The release worker trusts the manifest and re-verifies hashes when it reads objects. A single archive (tar+zstd or zip64, streamed) may be produced from a sealed bundle for cold storage or for moving it between machines. It is derived, never the source. If archives are ever extracted, block path traversal and absolute paths, and limit total size and compression ratio.

## Release worker

1. Reads a sealed run id (never a zip path) and pulls only the objects it needs.
2. Verifies hashes; classifies content; later removes personal details when a public API is built (personal data is not filtered at collection).
3. Builds a **release plan**: for each file the placement (folders, access, retention, role) decided from manifests, in the same style as the seed sync.
4. After approval, promotes through `FilesystemOrchestrator.register(request, StoredObject(key))`, records lineage raw to derived, and updates artifact states. Promotion is idempotent per file.

## Workers, concurrency and politeness

- The engine spawns a worker as a **subprocess** (`mzizi-engine worker --run <id>`): it reads its spec from the ledger, so it can later run on another machine or container unchanged. Browsers and OCR never share the API process.
- Admission control uses the runtime's per-capability concurrency plans, a global worker ceiling and a free-disk check. Cancellation is cooperative with a hard kill after a grace period.
- **Per-host governor**: many workers may target one site, so rate limits and request budgets are shared per host, not per worker. Backends: in-memory for one process, Redis (container exists) or a Mongo lease collection across processes. A governor refusal is a wait, never a skipped request.
- Retries use backoff; repeated failure ends in `failed` with the reason recorded.

## Ranking and hunting

A `Ranker` port in the crawler scores candidate URLs and extracted content. Two modes: **criteria** (rank before fetching, fetch only above a threshold) and **hunt** (fetch everything matching the file rules, rank only after extraction). Every skip is recorded with score and reason, so recall can be measured and a skip is never silent. The first implementation is rule-based from the site manifest (`expect` and ranking rules, see `SITE_STRUCTURE_SPEC.md`). A vector-based ranker plugs in later through the vector port (`persistence/vector`, currently a skeleton).

## Logs and audit

Detailed logs: S3 `logs/runs/<run_id>/` as compressed JSON lines with a lifecycle expiry set in configuration, and the live copy in Mongo with a TTL. Verify that the object store honours lifecycle rules; if not, an engine sweeper deletes expired prefixes. The sealed manifest includes the hash of the final log file. The permanent run summary keeps the evidence trail after detailed logs expire. Logs hold URLs, hashes and decisions only.

## Configuration

All settings enter through `mzizi_engine/config/engine_config.py` only (one config file, no other environment readers). The `runs` section declares store, scratch root, local root, run and log retention days, and worker ceiling. Phase 1 uses `ENGINE_RUN_STORE=local` and `ENGINE_RUN_LOG_RETENTION_DAYS`. MongoDB uses a BSON timestamp on the generated event document's `expiresAt` field with a TTL index. The scratch root, run-object retention, worker ceiling and Redis governor are for later phases. Crawl and watch receive their settings from the `crawler` section.

## Build order

1. **Implemented:** Job spec, run store (local backend and Mongo ledger), worker context with lazy requirements; the existing crawl operation runs through it with no behaviour change.
2. Subprocess workers, leases, heartbeats, cancellation, shared per-host governor.
3. S3-temp run store, sealing, expiry, promotion step.
4. Spec-driven stage pipelines (crawl, download, convert, extract, publish) that resume from checkpoints.
5. The `Ranker` port with the rule-based implementation.
