---
{id: TSK-3D6EAF7A8E89,name: Author legal domain contracts,type: task,status: completed,priority: medium,created_at: 2026-11-02T04:56:58.604Z,updated_at: 2026-11-02T05:17:40.897Z,order: 6144,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:17:11.070Z},{from: in-progress,to: completed,at: 2026-11-02T05:17:40.897Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-3D6EAF7A8E89/1793596631072-start,started_at: 2026-11-02T05:17:11.145Z,end_ref: refs/tracking/TSK-3D6EAF7A8E89/1793596660899-end,ended_at: 2026-11-02T05:17:40.898Z,summary: {files: 3,insertions: 223,deletions: 1}}]}},archived_at: 2026-11-04T05:47:26.861Z}
---

# Author legal domain contracts

## Goal

Generalise constitutions and sections into a legal-instrument model with provisions and pinpoint citation, expressed as Dryv contracts.

## Context

The inventory shows Constitutions with a placeholder document_hash and no jurisdiction, and ConstitutionSections with good valid and record time. Archived domains hold legal instruments, amendments, applicability and dependencies that have no live equivalent and need review. The audit proposes legal instruments, provisions and authority sources that other domains cite as legal basis. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. This task only authors and typechecks contracts (bun run check in dryv/); code generation for all domains happens afterwards in the generate-and-validate task. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [x] Author legal instrument, version, provision, amendment and citation contracts.
- [x] Review archived legal, constitution and justice models and record what is reused or dropped.
- [x] Provide a legal-basis link contract other domains can reference.
- [x] Compile to Runtime IR and document the model.
- [x] Update .docs/docs/DOMAINS.md.

## Progress

Authored dryv/contracts/domains/legal: LegalInstrument (kind as a jurisdiction-scoped classification), LegalProvision with pinpoint citation and version chain, LegalAmendment and LegalAmendmentChange, and LegalAuthorityLink as the shared legal-basis link other domains reference by targetKind and targetId. Read surface (list and detail under /v1/legal) comes from the shared readSurface helper. Archived justice, land and constitution-amendment models were reviewed in the inventory and are not carried over; legal cases and land tenure stay out of scope until a domain task needs them. bun run check passes (46 schemas, 15 operations).
