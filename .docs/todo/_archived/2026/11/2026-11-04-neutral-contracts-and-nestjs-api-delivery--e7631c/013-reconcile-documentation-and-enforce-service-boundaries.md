---
{id: TSK-768D87100265,name: Reconcile documentation and enforce service boundaries,type: task,status: completed,priority: medium,created_at: 2026-11-02T04:57:03.525Z,updated_at: 2026-11-02T05:47:16.458Z,order: 13312,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:46:10.479Z},{from: in-progress,to: completed,at: 2026-11-02T05:47:16.458Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-768D87100265/1793598370481-start,started_at: 2026-11-02T05:46:10.724Z,end_ref: refs/tracking/TSK-768D87100265/1793598436460-end,ended_at: 2026-11-02T05:47:16.458Z,summary: {files: 11,insertions: 115,deletions: 12}}]}},archived_at: 2026-11-04T15:53:08.080Z}
---

# Reconcile documentation and enforce service boundaries

## Goal

Update architecture, migration and domain documents to match the delivered contracts and verify that cleaning, ingestion and migrations did not leak into the API.

## Context

AGENTS.md section 9 requires docs to change with the work. MIGRATION.md must record which legacy responsibilities are now accounted for and which Python code can later be removed. ARCHITECTURE.md section 7 defines the API boundary. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.
This is the closing task of the group, so it also confirms that no earlier task left stale paths or undocumented decisions behind.

## Acceptance checklist

- [x] Update ARCHITECTURE.md, MIGRATION.md, DOMAINS.md, DATA_LIFECYCLE.md and repository-map.md.
- [x] Produce a legacy-to-new responsibility table showing what can be removed.
- [x] Audit the NestJS app for ingestion, scraping, migration or seeding code and remove any.
- [x] Update the roadmap and the task group plan.
- [x] Run task validate.

## Progress

Updated ARCHITECTURE.md (section 7 now describes the generated NestJS API, the contract tooling and the mechanical boundary check), MIGRATION.md (Phase 8 status and a responsibility accounting table: nothing in api-legacy can be removed yet, with the conditions), DOMAINS.md (contract catalog and the domains still without contracts), DATA_LIFECYCLE.md (where the API sits: downstream of promotion, current-only lists, append-only audit writes), repository-map.md (dryv/, dryv.yaml, db-engine fixtures), ROADMAP.md (Phase 7 progress) and the delivery group plan (reordered to contracts first, with the outcome). Audit of the API found no ingestion, scraping, migration or seeding code. It did find that pg, needed at runtime by the TypeORM driver, was only a devDependency; moved to dependencies. New dryv/tools/check-api-boundary.ts enforces the boundary (forbidden packages, schema synchronisation or migrations outside tests, writes outside the audit group) and is part of bun run check; it was verified to fail on a planted violation. task validate passes.
