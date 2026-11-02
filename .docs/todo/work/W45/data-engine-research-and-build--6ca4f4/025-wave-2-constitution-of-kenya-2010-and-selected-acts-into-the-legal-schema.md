---
{id: TSK-3892A89CB619,name: "Wave 2: Constitution of Kenya 2010 and selected Acts into the legal schema",type: task,status: planned,priority: medium,created_at: 2026-11-02T09:55:58.056Z,updated_at: 2026-11-02T09:55:58.056Z,due_at: 2026-12-18,order: 25600}
---

# Wave 2: Constitution of Kenya 2010 and selected Acts into the legal schema

## Goal
Import the Constitution of Kenya 2010 and a first set of Acts with pinpoint provisions and amendments from the official source.

## Context
Kenya Law is the official legislation repository named in the dossier. Its site redirected the home request, so the real routes must be read first and an assessment recorded. Provisions need article and clause locators, instruments need dates with precision, and amendments must become new versions rather than edits. The legacy constitution seed (42 sections) is only a cross-check. Depends on the Tier B extractors task and on a human assessment for the source. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Read the real Kenya Law routes (including its API or bulk options) and record the assessment inputs: terms, licence, rights holder.
- [ ] Mapping from extracted text to legal.instruments and legal.provisions with locators.
- [ ] Import the Constitution and three Acts through staging, validation and review.
- [ ] Amendments represented as new versions with valid time and precision.
- [ ] Compare against the legacy constitution seed and report differences.
