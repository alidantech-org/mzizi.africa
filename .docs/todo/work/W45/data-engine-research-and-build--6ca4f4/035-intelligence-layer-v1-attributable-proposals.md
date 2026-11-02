---
{id: TSK-9F5FE8D751C9,name: "Intelligence layer v1: attributable proposals",type: task,status: planned,priority: medium,created_at: 2026-11-02T09:55:59.656Z,updated_at: 2026-11-02T09:55:59.656Z,due_at: 2027-02-26,order: 35840}
---

# Intelligence layer v1: attributable proposals

## Goal
Build the AI layer for classification, entity matching and contradiction detection as reviewable proposals.

## Context
The IntelligenceEvaluation contract exists. Evaluations must record tool, model and input hash, never mutate records, and never send personal or restricted content to an external provider before the processor assessment in the dossier is done. Start with deterministic baselines (name normalisation, key matching) and add model-assisted proposals on top. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Evaluation writer and store with input hashes and model metadata.
- [ ] Entity-match proposals for places and institutions with evidence.
- [ ] Contradiction detection between documents for numeric values.
- [ ] Redaction before any external call; processor assessment completed first.
- [ ] Review UI integration.

## Notes
The first deliverable is a baseline that works without a model, so the value of model assistance can be measured later against it. Every proposal must be reproducible from its recorded inputs.
