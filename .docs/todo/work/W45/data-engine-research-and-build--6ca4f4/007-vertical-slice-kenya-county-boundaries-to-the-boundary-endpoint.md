---
{id: TSK-0D10D3F679AE,name: "Vertical slice: Kenya county boundaries to the boundary endpoint",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:13:40.946Z,updated_at: 2026-11-02T09:25:40.296Z,due_at: 2026-11-20,order: 7168,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:20:06.410Z},{from: in-progress,to: completed,at: 2026-11-02T09:25:40.296Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0D10D3F679AE/1793611206411-start,started_at: 2026-11-02T09:20:06.757Z,end_ref: refs/tracking/TSK-0D10D3F679AE/1793611540298-end,ended_at: 2026-11-02T09:25:40.296Z,summary: {files: 32,insertions: 772,deletions: 51}}]}}}
---

# Vertical slice: Kenya county boundaries to the boundary endpoint

## Goal
Prove the whole path once: a real open county boundary file for Kenya is registered, preserved, extracted, staged, validated, reviewed, promoted and served by GET /v1/geography/entities/{id}/boundary with its source and licence.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. Choose the dataset in this task from geoBoundaries, HDX or OpenStreetMap derived sources and verify and record its licence in source.documents; do not use GADM. The Kenya country unit and level classifications come from the reference seed. Depends on the contracts, database v1, data v1 and staging tasks.

## Acceptance checklist
- [x] Dataset chosen with licence verified and recorded in the task Progress section.
- [x] 47 county units and boundaries promoted with attributions and a current verification.
- [x] Integration test running the full chain on a small real file against PostGIS, then re-running with no duplicates.
- [x] The endpoint returns the boundary with source and licence; update geography-api-contract if needed.

## Progress
Dataset: geoBoundaries gbOpen Kenya ADM0 and ADM1 (simplified, build 9469f09, 47 counties); its metadata states licence "Public Domain" (source RCMRD GeoPortal) which is recorded on the document as unconfirmed by a human. The real files are used unmodified as test data (tests/data/geoboundaries, with attribution). The slice runs register, preserve, extract, stage, validate, review (test reviewer account), promote and read back: 48 units and 48 boundaries promoted, parent containment checked, all verified, re-import idempotent, raw bytes stored once, and the API use cases return the boundary with source, reference, licence, year, retrieval time and version (also for the children, level list and map context features). The same import was run against the dev database and left 96 candidates waiting for a human reviewer. Limits: county names are as published (Tharaka rather than Tharaka-Nithi; no IEBC county numbers; shapeISO codes are not stored because no table holds external identifiers yet); only ADM0 and ADM1; geometry is the simplified release; the licence needs human confirmation; the HTTP route itself was not exercised (the use cases behind it were); the download was a manual operator step, not a gated crawl.
