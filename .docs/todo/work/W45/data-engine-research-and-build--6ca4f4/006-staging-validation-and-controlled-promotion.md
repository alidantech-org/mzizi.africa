---
{id: TSK-C35452E6F014,name: "Staging, validation and controlled promotion",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:13:40.806Z,updated_at: 2026-11-02T07:13:40.806Z,due_at: 2026-11-16,order: 6144}
---

# Staging, validation and controlled promotion

## Goal
Implement staging runs, candidates and issues, the per-domain and cross-domain validation rules, and promotion that writes canonical versions with attributions and verifications in one transaction.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. Promotion rules are in DEC-DATA-ENGINE-DESIGN: no validation errors, an approving reviewer decision, licence and capture present, no current dispute. Only the database engine writes verification state; audit tables are append-only. Superseding closes the previous version rather than updating it.

## Acceptance checklist
- [ ] Staging tables and candidate lifecycle with natural-key hash idempotency.
- [ ] Rules for geometry validity, parent containment, level consistency, currency, date precision and reference resolution.
- [ ] Promotion transaction writing the record, attribution and verification, and superseding on change.
- [ ] Tests proving a re-import is a no-op and a corrected import supersedes.

## Notes
Review decisions arrive through the API audit write path, and this task consumes them without changing the API itself.
