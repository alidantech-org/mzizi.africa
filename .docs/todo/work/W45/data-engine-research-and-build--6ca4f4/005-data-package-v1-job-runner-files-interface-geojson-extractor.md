---
{id: TSK-B14B22E092D7,name: "Data package v1: job runner, files interface, GeoJSON extractor",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:13:40.684Z,updated_at: 2026-11-02T09:05:43.275Z,due_at: 2026-11-12,order: 5120,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:02:48.995Z},{from: in-progress,to: completed,at: 2026-11-02T09:05:43.275Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-B14B22E092D7/1793610168996-start,started_at: 2026-11-02T09:02:49.335Z,end_ref: refs/tracking/TSK-B14B22E092D7/1793610343277-end,ended_at: 2026-11-02T09:05:43.275Z,summary: {files: 17,insertions: 1253,deletions: 2}}]}}}
---

# Data package v1: job runner, files interface, GeoJSON extractor

## Goal
Create the Python data engine skeleton: a Postgres job table with claim and retry, a minimal files-service interface backed by a local directory store, and one extractor (GeoJSON and shapefile) that produces versioned ExtractionResults.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. Reruns create new results, never overwrite. Extraction is not the API and not AI classification. Raw artifacts are preserved through the files interface before extraction, writing the source and filesystem rows listed in section 4 of the intake plan. Pin the Python version after checking geospatial library installs.

## Acceptance checklist
- [x] Job table with idempotency on kind and input hash, SKIP LOCKED claiming, retries and error capture, with tests.
- [x] Files interface put-by-hash and get-by-version, writing objects, files, versions and events, with a local store.
- [x] GeoJSON extractor emitting diagnostics and an ExtractionResult that validates against the contract.
- [x] A second run on the same bytes creates a new capture row but no new object.

## Progress
Job table (engine.jobs migration), files interface (LocalDirectoryStore) writing stores, folders, objects, files, versions and events, source registration (publisher, document, method, capture), GeoJSON extractor and the ingest and extraction pipeline, with 26 passing pytest cases (14 DB-backed). Limits: only a local store (no presigned URLs or object store), the object scan status stays pending, no network fetcher yet (the structure runner task adds it), the extractor does not reproject coordinates (it reports a declared non-WGS84 CRS), shapefile and archive inputs are not supported, and extraction results are stored as files without a filesystem variant row.
