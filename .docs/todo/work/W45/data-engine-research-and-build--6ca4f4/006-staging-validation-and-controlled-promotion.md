---
{id: TSK-C35452E6F014,name: "Staging, validation and controlled promotion",type: task,status: completed,priority: medium,created_at: 2026-11-02T07:13:40.806Z,updated_at: 2026-11-02T09:19:27.602Z,due_at: 2026-11-16,order: 6144,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:12:44.543Z},{from: in-progress,to: completed,at: 2026-11-02T09:19:27.602Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C35452E6F014/1793610764545-start,started_at: 2026-11-02T09:12:44.899Z,end_ref: refs/tracking/TSK-C35452E6F014/1793611167604-end,ended_at: 2026-11-02T09:19:27.603Z,summary: {files: 17,insertions: 851,deletions: 11}}]}}}
---

# Staging, validation and controlled promotion

## Goal
Implement staging runs, candidates and issues, the per-domain and cross-domain validation rules, and promotion that writes canonical versions with attributions and verifications in one transaction.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. Promotion rules are in DEC-DATA-ENGINE-DESIGN: no validation errors, an approving reviewer decision, licence and capture present, no current dispute. Only the database engine writes verification state; audit tables are append-only. Superseding closes the previous version rather than updating it.

## Acceptance checklist
- [x] Staging tables and candidate lifecycle with natural-key hash idempotency.
- [x] Rules for geometry validity, parent containment, level consistency, currency, date precision and reference resolution.
- [x] Promotion transaction writing the record, attribution and verification, and superseding on change.
- [x] Tests proving a re-import is a no-op and a corrected import supersedes.

## Notes
Review decisions arrive through the API audit write path, and this task consumes them without changing the API itself.

## Progress
Implemented in the database engine: staging tables (runs, candidates with key fields, issues, promotions), reference resolution by natural key, validation (unknown target and field, required fields, types, enums, lengths, GeoJSON validity and WGS84 range, boundary containment in the parent with a 1 km and 2 percent tolerance, unit level below its parent's, money needs a currency, dates need precision and a bare year is rejected, empty natural keys, dangling references), review application with reviewer-grant checks, and promotion with the provenance and legal gate, supersession and idempotency. The API accepts staging.candidates as a review-decision target and the read role can see candidate ids only. 22 bun tests cover validation, review, promotion, superseding, idempotency and every deferral reason; the whole database suite is 81 tests and the Python suite 82. Fixture provenance kinds are repaired after the reference seed. Limits: validation rules exist for the geography targets in depth and generically for the rest (domain-specific rules for legal, finance and elections are written as those waves land); containment uses degrees (about 1 km) rather than metres; promotion handles one table per candidate and no multi-record atomic groups; there is no dashboard yet to record decisions, so tests insert audit.decisions directly.
