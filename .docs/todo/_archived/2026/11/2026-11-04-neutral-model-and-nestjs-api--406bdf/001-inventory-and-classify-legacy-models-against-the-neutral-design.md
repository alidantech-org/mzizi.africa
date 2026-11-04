---
{id: TSK-4B83AC17019D,name: Inventory and classify legacy models against the neutral design,type: task,status: completed,priority: high,created_at: 2026-11-02T04:48:06.601Z,updated_at: 2026-11-02T04:58:11.447Z,tags: [api,migration],order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T04:51:37.436Z},{from: in-progress,to: completed,at: 2026-11-02T04:54:30.234Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-4B83AC17019D/1793595097438-start,started_at: 2026-11-02T04:51:37.496Z,end_ref: refs/tracking/TSK-4B83AC17019D/1793595270235-end,ended_at: 2026-11-02T04:54:30.234Z,summary: {files: 1,insertions: 148,deletions: 0}}]}},due_at: 2026-11-02,archived_at: 2026-11-04T15:53:08.158Z}
---

# Inventory and classify legacy models against the neutral design

## Goal

Produce a complete, evidence-based inventory of every model, field, enum and seed under `source/backend/api/app/routes/*/models` and `_archives`, and classify each as reuse, extend, split, country-config, replace or investigate. This is the first stage of building a jurisdiction-neutral model and it unblocks the Dryv contracts and the NestJS API.

## Context

`.docs/docs/audits/COUNTRY_NEUTRAL_GOVERNANCE_MODEL_RESEARCH.md` holds a preliminary disposition table and the neutral architecture. The legacy models mix a generic schema with Kenyan data and some Kenyan fields such as tax_pin and professional licence numbers. Only geographic and legal have endpoints. Scraper and files models belong to other services. Read `.docs/handoffs/neutral-model-and-nestjs-api-handoff.md` before starting. No schema or API change is authorised by this task.

## Acceptance checklist

- [x] Every table, enum and key field is listed per domain with its current owner and consumers.
- [x] Each item has a disposition and a one-line rationale tied to the audit.
- [x] Kenya-specific values and fields are listed with the neutral replacement (record, profile or extension).
- [x] Scraper, files and seed concerns are assigned to data-engine, files or db-engine.
- [x] The inventory is published under `.docs/docs/` and `task validate` passes.

## Progress

Inventory published at `.docs/docs/audits/LEGACY_MODEL_INVENTORY.md`. It was compiled from three read-only passes over the models, seeds and archives. Items marked verify there (statistics route registration, dangling services foreign keys, runtime primary key behaviour) were not confirmed against a running database.
