---
id: DEC-WORKERS-AND-RUNS-20261116
name: Typed job specs, subprocess workers and sealed run bundles
type: decision
tags: [engine, workers, runs, s3, mongo, owner-approved]
extra: {status: accepted, approved_by: project owner, approved_on: 2026-11-16, implementation: not_started}
---

# Typed job specs, subprocess workers and sealed run bundles

## Decision

The project owner approved, after review of alternatives, this model: a typed **job spec** describes the work; a **run** executes it; a generic **worker** subprocess carries only the services its stages require; workers work in local scratch (the `.dev` folder in development) and write through a **run store** with a local and an S3-temp backend; the run ledger, events, artifact rows and permanent summaries live in MongoDB; a finished run is **sealed** as an immutable bundle of per-file objects plus a hashed manifest under `private/tmp/runs/<run_id>/` (a zip only for archive or transfer); a **release worker** checks a sealed bundle, plans placements, and after approval promotes files into permanent S3 keys and the PostgreSQL `filesystem` schema. Detailed logs live in S3 with expiry; a small run summary is permanent.

Rejected, with reasons: one worker class that contains every capability (a second monolith, needs every credential); S3 as the working filesystem (latency, browsers and OCR need local files); a zip as the primary handoff (no partial reads, no cheap promotion copy, extraction risk); workers writing to PostgreSQL during crawling (only approved data belongs there); building a durable scheduler from scratch now (keep the engine executor, shape the spec so Temporal can drive the same runs later).

Details: [WORKERS_AND_RUNS](../design/architecture/WORKERS_AND_RUNS.md). Handoff: [HANDOFF-WORKERS-AND-RUNS-20261116](../handoffs/HANDOFF-WORKERS-AND-RUNS-20261116.md).

## Open for the owner

Retention periods (temporary objects, detailed logs), whether the first release is single-node only, and who approves promotion by default.
