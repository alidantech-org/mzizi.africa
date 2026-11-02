---
{id: TSK-812FCFF7EB9A,name: "Settle Dryv integration, PostGIS and auth decisions",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T04:56:58.208Z,updated_at: 2026-11-02T04:57:07.654Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T04:57:07.654Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-812FCFF7EB9A/1793595427655-start,started_at: 2026-11-02T04:57:07.711Z}]}}}
---

# Settle Dryv integration, PostGIS and auth decisions

## Goal

Resolve the open technical decisions that block contract authoring and the NestJS scaffold, and record each as a decision document so later tasks do not re-litigate them.

## Context

The handoff lists four unsettled items: whether Dryv packs are consumed from the local checkout at /home/alidante/Projects/personal/alidantech-org/codepot/dryv or a pinned git ref; whether the Dryv typeorm pack can express PostGIS geometry and JSONB; which auth and RBAC provider the API uses (own JWT or external); and whether evidence uploads pass through the files service by reference only. Placement is already decided in DEC-NESTJS-DRYV-PLACEMENT: NestJS in source/backend/api and dryv/ at the repository root. Read .docs/docs/ARCHITECTURE.md section 7 for the API boundary. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Probe the Dryv typeorm pack with a small contract that uses a geometry and a JSONB field and record what it generates.
- [ ] Choose local checkout versus pinned git ref for packs and record the reproducibility reasoning.
- [ ] Choose the auth and RBAC approach with roles for reader, contributor, reviewer and admin.
- [ ] Confirm evidence uploads go through the files service by artifact reference only.
- [ ] Write one decision file per choice in .docs/decisions/ and run task validate.
