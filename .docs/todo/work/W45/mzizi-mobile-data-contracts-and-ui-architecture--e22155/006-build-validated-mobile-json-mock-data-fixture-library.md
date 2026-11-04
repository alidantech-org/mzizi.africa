---
{id: TSK-ECB31DE5EAE9,name: Build validated mobile JSON mock-data fixture library,type: task,status: planned,priority: medium,created_at: 2026-11-04T15:55:46.546Z,updated_at: 2026-11-04T15:55:46.546Z,order: 6144}
---

# Goal

Prepare a coherent library of realistic JSON fixtures that allows the MZIZI mobile frontend to be developed before the production NestJS API and all data pipelines are complete. Fixtures should match the approved data contracts exactly, support representative user journeys, and explicitly distinguish source-verified real values from fabricated demonstration-only values. They must be safe to use in design previews, demos, and tests without implying that examples are canonical records.

## Context

The UI will need predictable detail records, nested relationships, collections, statistical series, geographic data, search results, error responses, and incomplete-data states. The mock library should illustrate real MZIZI domains, including country and administrative areas, public officials, institutions, elections, and evidence. Relationships should be consistent across files, IDs stable, date scopes internally coherent, and measures supplied with units. Use lightweight fixtures to keep local mobile development fast; avoid checking in giant shapes or confidential records.

## Acceptance checklist

- [ ] Select representative journeys and compile fixtures for list, detail, search, time series, categorical metrics, and GeoJSON views.
- [ ] Validate JSON syntax and contract conformity; ensure references, identifiers, counts, time ranges, and relationships agree across records.
- [ ] Add explicit synthetic/demo labels where facts are invented, and include sources only for independently verified factual samples.
- [ ] Provide edge-case responses for empty, null, error, uncertain, disputed, and historical or changed-boundary records.
- [ ] Establish predictable fixture naming, folders, schema version references, and a lightweight local loading method.
- [ ] Document fixture validation commands, maintenance rules, and the migration path from fixtures to real API responses.

## Deliverables

A reviewed JSON fixture catalog with schema validation and usage notes for mobile developers. Do not wire fixtures into production or replace canonical data with mock records.
