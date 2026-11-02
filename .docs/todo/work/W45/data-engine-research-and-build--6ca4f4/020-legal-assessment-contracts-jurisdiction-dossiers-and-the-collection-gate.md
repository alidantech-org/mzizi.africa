---
{id: TSK-0B076D7BAA66,name: "Legal assessment contracts, jurisdiction dossiers and the collection gate",type: task,status: completed,priority: medium,created_at: 2026-11-02T08:27:28.940Z,updated_at: 2026-11-02T08:40:10.420Z,due_at: 2026-11-14,order: 20480,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T08:34:39.385Z},{from: in-progress,to: completed,at: 2026-11-02T08:40:10.420Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0B076D7BAA66/1793608479387-start,started_at: 2026-11-02T08:34:39.731Z,end_ref: refs/tracking/TSK-0B076D7BAA66/1793608810430-end,ended_at: 2026-11-02T08:40:10.421Z,summary: {files: 44,insertions: 2132,deletions: 7}}]}}}
---

# Legal assessment contracts, jurisdiction dossiers and the collection gate

## Goal
Make legal and source approval a first-class, versioned record and an enforced gate: model per-site assessments and per-jurisdiction dossiers, link every capture to the assessment in force, and give the engines a single function that decides whether a request may be made and fails closed.

## Context
Read .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first, then the Legal and source approval gate section of .docs/docs/WEBSITE_DESIGN.md. Public visibility is not permission, technical validation is separate from legal approval, and agents may draft but never approve. This is an engineering baseline, not legal advice: qualified counsel must review before production collection. Work only on develop, record progress here and tick items with task check. Section 9 of the compliance document lists the required assessment fields and the status semantics (not_reviewed, in_review, approved, approved_with_conditions, restricted, rejected, expired). Dossiers hold regulator, legislation repository, applicable laws, treaty status, reviewer, dates and launch stage. Choose the dossier table placement (reference or website) and record it in a decision. Depends on the website contracts and database package v1.

## Acceptance checklist
- [x] Dryv contracts for append-only assessments and jurisdiction dossiers, with a soft assessment id on source captures; regenerate the API and database migration.
- [x] Gate function in the database package returning allowed or denied with reasons from status, expiry, scope (hosts, paths, frequency) and conditions, with tests for every status.
- [x] Integrity checks for the new links and for captures made without a covering assessment.
- [x] Read endpoints exclude restricted evidence and internal rationale from the public API.
- [x] Update DATABASE_DESIGN.md and record the dossier placement decision.

## Progress
Assessments and dossiers added to the website contracts (not exposed by the public API; rationale and evidence stay internal), captures carry a soft assessment id, migration 4 generated, API regenerated (14144 unit tests pass). The gate (database/src/gate.ts) fails closed and is covered by 20 unit tests plus a database-backed test; integrity now also reports multiple current assessments or dossiers, site captures without a covering assessment and captures whose assessment belongs to another site. The public API intentionally has no assessment endpoints, so the "read endpoints exclude restricted evidence" item is met by not exposing them; a sanitised per-site summary can be added later. Dossier placement recorded in DEC-WEBSITE-SCHEMA-STRUCTURE.
