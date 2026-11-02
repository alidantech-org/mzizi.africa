---
{id: TSK-0B076D7BAA66,name: "Legal assessment contracts, jurisdiction dossiers and the collection gate",type: task,status: planned,priority: medium,created_at: 2026-11-02T08:27:28.940Z,updated_at: 2026-11-02T08:27:28.940Z,due_at: 2026-11-14,order: 20480}
---

# Legal assessment contracts, jurisdiction dossiers and the collection gate

## Goal
Make legal and source approval a first-class, versioned record and an enforced gate: model per-site assessments and per-jurisdiction dossiers, link every capture to the assessment in force, and give the engines a single function that decides whether a request may be made and fails closed.

## Context
Read .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first, then the Legal and source approval gate section of .docs/docs/WEBSITE_DESIGN.md. Public visibility is not permission, technical validation is separate from legal approval, and agents may draft but never approve. This is an engineering baseline, not legal advice: qualified counsel must review before production collection. Work only on develop, record progress here and tick items with task check. Section 9 of the compliance document lists the required assessment fields and the status semantics (not_reviewed, in_review, approved, approved_with_conditions, restricted, rejected, expired). Dossiers hold regulator, legislation repository, applicable laws, treaty status, reviewer, dates and launch stage. Choose the dossier table placement (reference or website) and record it in a decision. Depends on the website contracts and database package v1.

## Acceptance checklist
- [ ] Dryv contracts for append-only assessments and jurisdiction dossiers, with a soft assessment id on source captures; regenerate the API and database migration.
- [ ] Gate function in the database package returning allowed or denied with reasons from status, expiry, scope (hosts, paths, frequency) and conditions, with tests for every status.
- [ ] Integrity checks for the new links and for captures made without a covering assessment.
- [ ] Read endpoints exclude restricted evidence and internal rationale from the public API.
- [ ] Update DATABASE_DESIGN.md and record the dossier placement decision.
