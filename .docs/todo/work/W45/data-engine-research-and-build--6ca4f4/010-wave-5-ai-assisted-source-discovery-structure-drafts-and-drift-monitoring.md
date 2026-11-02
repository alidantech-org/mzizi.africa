---
{id: TSK-F8DA0A6BA39B,name: "Wave 5: AI-assisted source discovery, structure drafts and drift monitoring",type: task,status: planned,priority: medium,created_at: 2026-11-02T07:13:41.374Z,updated_at: 2026-11-02T07:13:41.374Z,due_at: 2027-01-29,order: 10240}
---

# Wave 5: AI-assisted source discovery, structure drafts and drift monitoring

## Goal
Add the research workflow from the attached note: an evidence-backed institution and dataset inventory for a country, draft site structures that humans approve, and monitoring that reports structural drift without silently continuing.

## Context
Read .docs/docs/DATA_INTAKE_PLAN.md and .docs/decisions/data-engine-design.md first; they define the pipeline, staging model and promotion rules. Work only on develop, record progress in this file and tick items with task check. The note's task references and paths are stale. site.structure.yml stays DevAuto's contract and is referenced by hash; a stable integration contract with DevAuto does not exist and must be designed first. The source registry belongs to Mzizi. Never bypass authentication, CAPTCHAs or access controls.

## Acceptance checklist
- [ ] Design the DevAuto integration contract and the source registry with operational states.
- [ ] Kenya inventory prototype with counting rules, evidence and human approval.
- [ ] Drift detection for one approved source with a researcher-facing report.
- [ ] Update DATA_INTAKE_PLAN.md and ARCHITECTURE.md.
