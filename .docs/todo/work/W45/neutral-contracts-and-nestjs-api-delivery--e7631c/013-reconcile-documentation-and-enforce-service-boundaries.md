---
{id: TSK-768D87100265,name: Reconcile documentation and enforce service boundaries,type: task,status: planned,priority: medium,created_at: 2026-11-02T04:57:03.525Z,updated_at: 2026-11-02T04:57:03.525Z,order: 13312}
---

# Reconcile documentation and enforce service boundaries

## Goal

Update architecture, migration and domain documents to match the delivered contracts and verify that cleaning, ingestion and migrations did not leak into the API.

## Context

AGENTS.md section 9 requires docs to change with the work. MIGRATION.md must record which legacy responsibilities are now accounted for and which Python code can later be removed. ARCHITECTURE.md section 7 defines the API boundary. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.
This is the closing task of the group, so it also confirms that no earlier task left stale paths or undocumented decisions behind.

## Acceptance checklist

- [ ] Update ARCHITECTURE.md, MIGRATION.md, DOMAINS.md, DATA_LIFECYCLE.md and repository-map.md.
- [ ] Produce a legacy-to-new responsibility table showing what can be removed.
- [ ] Audit the NestJS app for ingestion, scraping, migration or seeding code and remove any.
- [ ] Update the roadmap and the task group plan.
- [ ] Run task validate.
