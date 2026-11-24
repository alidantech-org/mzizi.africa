---
{id: TSK-8FB61DCFD367,name: "Workers and runs, phase 3: S3-temp run store, sealing, expiry and promotion",type: task,status: archived,priority: medium,created_at: 2026-11-16T09:48:45.268Z,updated_at: 2026-11-24T19:25:05.594Z,order: 12288,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T11:57:48.658Z},{from: in-progress,to: completed,at: 2026-11-16T12:21:41.730Z},{from: completed,to: archived,at: 2026-11-24T19:25:05.594Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-8FB61DCFD367/1794830268669-start,started_at: 2026-11-16T11:57:49.093Z,end_ref: refs/tracking/TSK-8FB61DCFD367/1794831701733-end,ended_at: 2026-11-16T12:21:41.730Z,summary: {files: 30,insertions: 1512,deletions: 45}}]}},archived_at: 2026-11-24T19:25:23.410Z}
---

---
{id: TSK-8FB61DCFD367,name: "Workers and runs, phase 3: S3-temp run store, sealing, expiry and promotion",type: task,status: in-progress,priority: medium,created_at: 2026-11-16T09:48:45.268Z,updated_at: 2026-11-16T11:57:48.658Z,order: 12288,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-16T11:57:48.658Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-8FB61DCFD367/1794830268669-start,started_at: 2026-11-16T11:57:49.093Z}]}}}
---

# Workers and runs, phase 3: S3-temp run store, sealing, expiry and promotion

## Goal

Add the S3-temp run store, the sealed run bundle with its hashed manifest, scratch cleanup, expiry of temporary objects and logs, and the release step that checks a sealed bundle and, after approval, promotes files to permanent S3 keys and the PostgreSQL `filesystem` schema.

## Context

Depends on phases 1 and 2. Design: `WORKERS_AND_RUNS.md` sections "The run store", "Scratch and cleanup", "The sealed run manifest" and "Release worker". Per-file objects under `private/tmp/runs/<run_id>/`, logs under `logs/runs/<run_id>/*.jsonl.gz`; a zip is only a derived archive. Upload before recording a stage complete. The filesystem package already promotes a staged object by server-side copy (`StoredObject`) and records lineage. Real S3 is the owner's bucket `mzizi` on the SeaweedFS container `mziziafrica-object-store-1` (stopped by default; start it for tests and stop it after); test only under a unique `private/tmp/` tag and delete everything; use a scratch PostgreSQL database and drop it. Approval may be human or AI; record the approver and reason.

## Build

- [x] `S3RunStore` with multipart uploads, same relative layout as local, chosen only by config.
- [x] Sealing: manifest (files, logs, decisions, skips with scores, counts), single hash verification, manifest hash in the ledger, refusal to write into a sealed prefix; scratch deleted in `finally` plus a startup sweep.
- [x] Expiry: verify whether the object store honours lifecycle rules; otherwise an engine sweeper deletes expired prefixes; permanent `run_summaries` stay.
- [x] Release worker: verify hashes, build a release plan from manifests, record approval, promote idempotently with lineage raw to derived.

The optional derived archive is deferred.

## Acceptance checklist

- [x] An end-to-end test seals a run in the live object store, promotes it into a scratch Postgres schema, repeats the promotion with no change, and cleans up every object and database.
- [x] A worker killed after upload but before recording a stage resumes without duplicating files.
- [x] Strict typing, boundaries 0, structure clean, suite unchanged or better, `task validate` passes, docs, `.env.example` and the task note updated.

## Progress

- Added configured S3 staging, multipart upload, gzip audit logs, durable stage receipts, checksum-verified sealing and expiry. The engine retains a permanent summary. Phase 3 preserves capture decisions. Ranking and ranked skips are Phase 5.
- Added `seal-run`, `plan-release`, `release-run` and `sweep-runs`. Release uses caller-supplied placements and verifies the approved plan hash before promotion. It records raw-to-derived lineage in PostgreSQL.
- Used an isolated loopback SeaweedFS 4.39 container, disposable buckets and Mongo databases, and a migrated scratch PostgreSQL database. SeaweedFS accepted the lifecycle rule, but the probe remained readable during observation. Engine-managed expiry was verified. Removed the probe and all test objects, databases and the container.
- The three live integration cases passed. A multipart bundle sealed and promoted twice with unchanged PostgreSQL versions and preserved lineage. Killed crawl and watch workers resumed after upload and before checkpoint without fetching again or duplicating files.
- The final Python suite passed with 436 passed and six skipped. The skips were five PostgreSQL registry tests requiring a separate opt-in URL and one missing archive fixture. Ruff lint and format, strict mypy, `dryv:check`, zero boundary violations and repository structure checks passed. The root check exposed existing Dryv formatting and dashboard canonical-catalog mismatches. Its Python failure was fixed and the corrected full Python suite passed.
- The S3 worker path uses governed HTTP crawl and watch. Recovery of a partial stage with conflicting bytes requires the original scratch files. All participating processes share a local lock directory. Phase 4 remains planned.
