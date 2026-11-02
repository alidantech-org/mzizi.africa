---
{id: TSK-2833C6C68172,name: Author the layer contracts in Dryv and export for Python,type: task,status: planned,priority: medium,created_at: 2026-11-02T07:13:40.416Z,updated_at: 2026-11-02T07:13:40.416Z,due_at: 2026-11-06,order: 3072}
---

# Author the layer contracts in Dryv and export for Python

## Goal
Define FileArtifactRef, ExtractionResult, CandidateRecord, IntelligenceEvaluation and PromotionDecision once, in Dryv, and make them usable from TypeScript and Python without hand-copying, so the engines meet only at documented contracts.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. AGENTS.md section 10 requires explicit contracts. The Dryv checkout and its fastapi-backend pack are described in dryv/README.md; the published packages are out of date, so use the local checkout. Reconcile overlap with source.publishers and statistical.datasets before authoring source and dataset definitions from the research note.

## Acceptance checklist
- [ ] Author the five contracts with examples and validation rules in dryv/contracts.
- [ ] Experiment: generate a Python model for ExtractionResult from the fastapi-backend pack or JSON Schema, and record the outcome in DEC-DATA-ENGINE-DESIGN.
- [ ] Run bun run check and generated:check in the Dryv workspace.
- [ ] Document each contract in .docs/docs/ARCHITECTURE.md and run task validate.
