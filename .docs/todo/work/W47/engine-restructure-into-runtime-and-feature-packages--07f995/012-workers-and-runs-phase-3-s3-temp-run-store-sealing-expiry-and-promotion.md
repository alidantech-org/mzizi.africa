---
{id: TSK-8FB61DCFD367,name: "Workers and runs, phase 3: S3-temp run store, sealing, expiry and promotion",type: task,status: planned,priority: medium,created_at: 2026-11-16T09:48:45.268Z,updated_at: 2026-11-16T09:48:45.268Z,order: 12288}
---

# Workers and runs, phase 3: S3-temp run store, sealing, expiry and promotion

## Goal

Add the S3-temp run store, the sealed run bundle with its hashed manifest, scratch cleanup, expiry of temporary objects and logs, and the release step that checks a sealed bundle and, after approval, promotes files to permanent S3 keys and the PostgreSQL `filesystem` schema.

## Context

Depends on phases 1 and 2. Design: `WORKERS_AND_RUNS.md` sections "The run store", "Scratch and cleanup", "The sealed run manifest" and "Release worker". Per-file objects under `private/tmp/runs/<run_id>/`, logs under `logs/runs/<run_id>/*.jsonl.gz`; a zip is only a derived archive. Upload before recording a stage complete. The filesystem package already promotes a staged object by server-side copy (`StoredObject`) and records lineage. Real S3 is the owner's bucket `mzizi` on the SeaweedFS container `mziziafrica-object-store-1` (stopped by default; start it for tests and stop it after); test only under a unique `private/tmp/` tag and delete everything; use a scratch PostgreSQL database and drop it. Approval may be human or AI; record the approver and reason.

## Build

- [ ] `S3RunStore` with multipart uploads, same relative layout as local, chosen only by config.
- [ ] Sealing: manifest (files, logs, decisions, skips with scores, counts), single hash verification, manifest hash in the ledger, refusal to write into a sealed prefix; scratch deleted in `finally` plus a startup sweep.
- [ ] Expiry: verify whether the object store honours lifecycle rules; otherwise an engine sweeper deletes expired prefixes; permanent `run_summaries` stay.
- [ ] Release worker: verify hashes, build a release plan from manifests, record approval, promote idempotently with lineage raw to derived.
- [ ] Optional derived archive of a sealed bundle (streamed; block path traversal and limit size and ratio if ever extracted).

## Acceptance checklist

- [ ] An end-to-end test seals a run in the live object store, promotes it into a scratch Postgres schema, repeats the promotion with no change, and cleans up every object and database.
- [ ] A worker killed after upload but before recording a stage resumes without duplicating files.
- [ ] Strict typing, boundaries 0, structure clean, suite unchanged or better, `task validate` passes, docs, `.env.example` and the task note updated.
