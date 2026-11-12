---
{id: TSK-F8DA0A6BA39B,name: "Wave 5: AI-assisted source discovery, structure drafts and drift monitoring",type: task,status: archived,priority: medium,created_at: 2026-11-02T07:13:41.374Z,updated_at: 2026-11-12T05:47:38.825Z,due_at: 2027-01-29,order: 10240,extra: {status_history: [{from: planned,to: archived,at: 2026-11-12T05:47:38.825Z}]},archived_at: 2026-11-12T05:47:56.094Z}
---

# Wave 5: AI-assisted source discovery, structure drafts and drift monitoring

## Goal
Scale the research workflow: agents produce an evidence-backed institution and dataset inventory per country and batches of site structures (no human approval, per DEC-WEBSITE-SCHEMA-STRUCTURE), and monitoring reports structural drift without silently continuing.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. The note's task references and paths are stale. The Mzizi-owned website schema and structure format replace DevAuto structures. Never bypass authentication, CAPTCHAs or access controls.

## Acceptance checklist
- [ ] Define site operational states and the inventory counting rules on the website schema.
- [ ] Kenya inventory prototype with counting rules, evidence and human approval.
- [ ] Drift detection for one approved source with a researcher-facing report.
- [ ] Update DATA_INTAKE_PLAN.md and ARCHITECTURE.md.

## Notes
This wave depends on the website schema, the structure runner and the agent batch tooling tasks. Inventory counts must state their scope, date and counting rules, and must separate institutions, sites, domains, datasets and downloadable resources instead of reporting one number.

## Compliance (added after LEGALITY_SAFETY_AND_COMPLIANCE.md)
Source discovery output is a proposal: agents may inventory institutions and draft assessments but must not mark a source legally approved. Legal-condition drift (terms, licence, robots, ownership, new access walls, complaints) is monitored alongside technical drift and can restrict a site independently of its structure health.

## Progress (2026-11-02)
Delivered toward this wave: the website schema with families, patterns, assessments and dossiers; the structure format, validator, deterministic runner and drift checks; agent batch tooling and three pilot structures; offline pattern expansion, gated probes and fingerprint similarity; the Kenya site catalogue. Still open: the research workflow itself (an evidence-backed institution and dataset inventory per country with counting rules), live probing and drift monitoring against real sites (blocked on the monitored contact in the operations readiness task), and agent-assisted proposals through the intelligence layer. The DevAuto integration was dropped by decision DEC-WEBSITE-SCHEMA-STRUCTURE.
