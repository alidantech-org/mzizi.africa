---
{id: TSK-9F7D300B0A07,name: "Implement the API write paths for comments, evidence and review decisions",type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:59.056Z,updated_at: 2026-11-02T04:58:12.242Z,order: 11264,due_at: 2026-11-02}
---

# Implement the API write paths for comments, evidence and review decisions

## Goal

Add the only writes the API permits: comments, evidence records and RBAC-gated admin and review decisions, without letting the API mutate canonical records silently.

## Context

AGENTS.md says AI output is not canonical truth and the API is not an ingestion or migration service. Evidence uploads go through the files service by reference. Review decisions need attribution, reasons and versioning. Uses the restricted writer connection and the auth approach chosen in the decisions task. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Author comment, evidence reference and review decision contracts and generate their endpoints.
- [ ] Implement role checks for reader, contributor, reviewer and admin.
- [ ] Record actor, time and rationale on every write and keep an audit trail.
- [ ] Test that domain tables remain unwritable by the API.
- [ ] Document the write boundary in ARCHITECTURE.md.
