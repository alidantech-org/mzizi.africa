---
{id: TSK-9F7D300B0A07,name: "Author write-path contracts for comments, evidence and review decisions",type: task,status: completed,priority: medium,created_at: 2026-11-02T04:56:59.056Z,updated_at: 2026-11-02T05:20:37.639Z,order: 11264,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:20:21.470Z},{from: in-progress,to: completed,at: 2026-11-02T05:20:37.639Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-9F7D300B0A07/1793596821472-start,started_at: 2026-11-02T05:20:21.545Z,end_ref: refs/tracking/TSK-9F7D300B0A07/1793596837641-end,ended_at: 2026-11-02T05:20:37.639Z,summary: {files: 3,insertions: 149,deletions: 1}}]}}}
---

# Author write-path contracts for comments, evidence and review decisions

## Goal

Add the only writes the API permits: comments, evidence records and RBAC-gated admin and review decisions, without letting the API mutate canonical records silently.

## Context

AGENTS.md says AI output is not canonical truth and the API is not an ingestion or migration service. Evidence uploads go through the files service by reference. Review decisions need attribution, reasons and versioning. Uses the restricted writer connection and the auth approach chosen in the decisions task. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. This task only authors and typechecks contracts (bun run check in dryv/); code generation for all domains happens afterwards in the generate-and-validate task. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [x] Author comment, evidence reference (file artifact descriptor by reference only) and review decision entities extending the shared evidence foundation.
- [x] Author create operations with request bodies, required roles (contributor, reviewer, admin) and standard failures; comments and review decisions are append-only.
- [x] Author the read operations needed to list comments, evidence and decisions for a target record.
- [x] Typecheck and compile the contracts with bun run check.
- [x] Document the write boundary in ARCHITECTURE.md (implementation follows in its own task).

## Progress

Authored dryv/contracts/domains/audit: append-only Comment, EvidenceReference (file artifact id, checksum, media type, size, by reference only) and ReviewDecision (decision, proposed verification state, rationale) entities; actor id is a system field set from the token. Create operations require ContributorAccess or ReviewerAccess policies defined in foundation/shared/access.ts and map 401 and 403 failures; list and detail reads come from readSurface. The contract audit exempts only these three entities from EvidencedEntity. The write boundary is documented in ARCHITECTURE.md section 7. bun run check passes (330 schemas, 130 operations). Implementation (guards, writer data source) is the separate write-paths implementation task.
