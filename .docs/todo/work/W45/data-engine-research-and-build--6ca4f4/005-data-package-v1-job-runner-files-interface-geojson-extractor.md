---
{id: TSK-B14B22E092D7,name: "Data package v1: job runner, files interface, GeoJSON extractor",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:13:40.684Z,updated_at: 2026-11-02T07:13:40.684Z,due_at: 2026-11-12,order: 5120}
---

# Data package v1: job runner, files interface, GeoJSON extractor

## Goal
Create the Python data engine skeleton: a Postgres job table with claim and retry, a minimal files-service interface backed by a local directory store, and one extractor (GeoJSON and shapefile) that produces versioned ExtractionResults.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. Reruns create new results, never overwrite. Extraction is not the API and not AI classification. Raw artifacts are preserved through the files interface before extraction, writing the source and filesystem rows listed in section 4 of the intake plan. Pin the Python version after checking geospatial library installs.

## Acceptance checklist
- [ ] Job table with idempotency on kind and input hash, SKIP LOCKED claiming, retries and error capture, with tests.
- [ ] Files interface put-by-hash and get-by-version, writing objects, files, versions and events, with a local store.
- [ ] GeoJSON extractor emitting diagnostics and an ExtractionResult that validates against the contract.
- [ ] A second run on the same bytes creates a new capture row but no new object.
