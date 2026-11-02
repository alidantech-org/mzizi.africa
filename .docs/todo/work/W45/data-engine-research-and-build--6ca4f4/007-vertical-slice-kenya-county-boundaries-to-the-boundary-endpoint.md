---
{id: TSK-0D10D3F679AE,name: "Vertical slice: Kenya county boundaries to the boundary endpoint",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:13:40.946Z,updated_at: 2026-11-02T07:13:40.946Z,due_at: 2026-11-20,order: 7168}
---

# Vertical slice: Kenya county boundaries to the boundary endpoint

## Goal
Prove the whole path once: a real open county boundary file for Kenya is registered, preserved, extracted, staged, validated, reviewed, promoted and served by GET /v1/geography/entities/{id}/boundary with its source and licence.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. Choose the dataset in this task from geoBoundaries, HDX or OpenStreetMap derived sources and verify and record its licence in source.documents; do not use GADM. The Kenya country unit and level classifications come from the reference seed. Depends on the contracts, database v1, data v1 and staging tasks.

## Acceptance checklist
- [ ] Dataset chosen with licence verified and recorded in the task Progress section.
- [ ] 47 county units and boundaries promoted with attributions and a current verification.
- [ ] Integration test running the full chain on a small real file against PostGIS, then re-running with no duplicates.
- [ ] The endpoint returns the boundary with source and licence; update geography-api-contract if needed.
