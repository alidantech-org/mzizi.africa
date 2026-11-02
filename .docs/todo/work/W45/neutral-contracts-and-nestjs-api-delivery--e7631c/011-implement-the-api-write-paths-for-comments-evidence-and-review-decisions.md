---
{id: TSK-9F7D300B0A07,name: "Author write-path contracts for comments, evidence and review decisions",type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:59.056Z,updated_at: 2026-11-02T05:14:40.165Z,order: 11264,due_at: 2026-11-02}
---

# Author write-path contracts for comments, evidence and review decisions

## Goal

Add the only writes the API permits: comments, evidence records and RBAC-gated admin and review decisions, without letting the API mutate canonical records silently.

## Context

AGENTS.md says AI output is not canonical truth and the API is not an ingestion or migration service. Evidence uploads go through the files service by reference. Review decisions need attribution, reasons and versioning. Uses the restricted writer connection and the auth approach chosen in the decisions task. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. This task only authors and typechecks contracts (bun run check in dryv/); code generation for all domains happens afterwards in the generate-and-validate task. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Author comment, evidence reference (file artifact descriptor by reference only) and review decision entities extending the shared evidence foundation.
- [ ] Author create operations with request bodies, required roles (contributor, reviewer, admin) and standard failures; comments and review decisions are append-only.
- [ ] Author the read operations needed to list comments, evidence and decisions for a target record.
- [ ] Typecheck and compile the contracts with bun run check.
- [ ] Document the write boundary in ARCHITECTURE.md (implementation follows in its own task).
