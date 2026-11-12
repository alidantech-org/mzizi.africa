---
{id: TSK-49DBBF7100D4,name: Review dashboard and API for staging candidates,type: task,status: archived,priority: medium,created_at: 2026-11-02T09:55:59.338Z,updated_at: 2026-11-12T05:47:47.242Z,due_at: 2027-01-15,order: 33792,extra: {status_history: [{from: planned,to: archived,at: 2026-11-12T05:47:47.242Z}]},archived_at: 2026-11-12T05:47:56.094Z}
---

# Review dashboard and API for staging candidates

## Goal
Give reviewers a way to see candidates, their issues and lineage, and record decisions through the API.

## Context
Reviews are audit.decisions rows with target staging.candidates, which the API already accepts, but there is no screen or read endpoint for candidates, issues, evidence and diff against the existing record. The read side must expose only what reviewers need, with candidate payloads restricted to reviewer roles. Promotion stays in the database engine. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Dryv contract and endpoints for listing candidates, issues, lineage and the diff to the current record, restricted to reviewers.
- [ ] Dashboard screen in the web app for queue, evidence preview and decision.
- [ ] Decision write path tested with real role checks.
- [ ] Bulk review with safeguards (no approve-all for quarantined or invalid).
- [ ] Accessibility and mobile checks.

## Note (2026-11-02)
The reviewer-only API (TSK-6EF29D43B416) and the admin site (TSK-22C8B63A4B43) supersede this task; close it when they land.
