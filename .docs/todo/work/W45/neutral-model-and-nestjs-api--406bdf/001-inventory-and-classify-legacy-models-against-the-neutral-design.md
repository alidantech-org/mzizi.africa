---
{id: TSK-4B83AC17019D,name: Inventory and classify legacy models against the neutral design,type: task,status: planned,priority: high,created_at: 2026-11-02T04:48:06.601Z,updated_at: 2026-11-02T04:48:06.601Z,tags: [api,migration],order: 1024}
---

# Inventory and classify legacy models against the neutral design

## Goal

Produce a complete, evidence-based inventory of every model, field, enum and seed under `source/backend/api/app/routes/*/models` and `_archives`, and classify each as reuse, extend, split, country-config, replace or investigate. This is the first stage of building a jurisdiction-neutral model and it unblocks the Dryv contracts and the NestJS API.

## Context

`.docs/docs/audits/COUNTRY_NEUTRAL_GOVERNANCE_MODEL_RESEARCH.md` holds a preliminary disposition table and the neutral architecture. The legacy models mix a generic schema with Kenyan data and some Kenyan fields such as tax_pin and professional licence numbers. Only geographic and legal have endpoints. Scraper and files models belong to other services. Read `.docs/handoffs/neutral-model-and-nestjs-api-handoff.md` before starting. No schema or API change is authorised by this task.

## Acceptance checklist

- [ ] Every table, enum and key field is listed per domain with its current owner and consumers.
- [ ] Each item has a disposition and a one-line rationale tied to the audit.
- [ ] Kenya-specific values and fields are listed with the neutral replacement (record, profile or extension).
- [ ] Scraper, files and seed concerns are assigned to data-engine, files or db-engine.
- [ ] The inventory is published under `.docs/docs/` and `task validate` passes.
