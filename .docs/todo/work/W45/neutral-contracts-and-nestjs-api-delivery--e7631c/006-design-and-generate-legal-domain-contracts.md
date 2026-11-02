---
{id: TSK-3D6EAF7A8E89,name: Design and generate legal domain contracts,type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:58.604Z,updated_at: 2026-11-02T04:58:11.886Z,order: 6144,due_at: 2026-11-02}
---

# Design and generate legal domain contracts

## Goal

Generalise constitutions and sections into a legal-instrument model with provisions and pinpoint citation, expressed as Dryv contracts.

## Context

The inventory shows Constitutions with a placeholder document_hash and no jurisdiction, and ConstitutionSections with good valid and record time. Archived domains hold legal instruments, amendments, applicability and dependencies that have no live equivalent and need review. The audit proposes legal instruments, provisions and authority sources that other domains cite as legal basis. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Author legal instrument, version, provision, amendment and citation contracts.
- [ ] Review archived legal, constitution and justice models and record what is reused or dropped.
- [ ] Provide a legal-basis link contract other domains can reference.
- [ ] Compile to Runtime IR and document the model.
- [ ] Update .docs/docs/DOMAINS.md.
