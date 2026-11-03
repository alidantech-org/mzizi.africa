---
{id: TSK-5E819E85C4FA,name: "Wave 4: debt, procurement and organisations",type: task,status: planned,priority: medium,created_at: 2026-11-02T09:55:59.169Z,updated_at: 2026-11-02T09:55:59.169Z,due_at: 2027-03-26,order: 32768}
---

# Wave 4: debt, procurement and organisations

## Goal
Import public debt, tenders and awards, and the organisations that appear in them.

## Context
Procurement notices name companies and sometimes individuals; ownership and directors are personal data and are out of scope until the privacy review. Use open procurement portals and official debt bulletins where licences allow, map tenders, bids and contracts with dates and currency, and identify organisations by registry numbers before names. The legacy samples (10 to 24 rows) are replaced, not imported. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Select sources (procurement portal, debt bulletins) and record licences and assessments.
- [x] Tender, bid and contract mappings with currency and date precision.
- [ ] Debt instrument and disbursement mappings.
- [x] Organisation identifiers and entity resolution by registry number.
- [x] Report coverage and excluded personal data.
