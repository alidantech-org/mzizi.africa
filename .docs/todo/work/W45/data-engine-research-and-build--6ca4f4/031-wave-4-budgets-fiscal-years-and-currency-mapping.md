---
{id: TSK-A46F494C29C0,name: "Wave 4: budgets, fiscal years and currency mapping",type: task,status: planned,priority: medium,created_at: 2026-11-02T09:55:59.015Z,updated_at: 2026-11-02T09:55:59.015Z,due_at: 2027-03-05,order: 31744}
---

# Wave 4: budgets, fiscal years and currency mapping

## Goal
Import budget documents from the National Treasury, Parliament and the Controller of Budget into the finance schema.

## Context
The Parliament budget documents pilot structure lists the PDFs; tables inside them need the PDF table extractor. Fiscal years run July to June in Kenya; the fiscal_year and fy_start transforms exist. Money always carries an explicit currency, amounts keep their stated unit and scale, and conflicting figures between documents are recorded as disagreement, not resolved silently. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Select documents and record licences and assessments.
- [ ] Table extraction with page and cell locators for approved estimates.
- [ ] Mapping to finance years, units, budgets and entries with currency and scale.
- [ ] Validation: totals, fiscal-year consistency, currency present.
- [ ] Report contradictions between documents.
