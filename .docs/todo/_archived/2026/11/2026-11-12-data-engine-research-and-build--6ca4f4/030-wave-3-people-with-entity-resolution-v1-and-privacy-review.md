---
{id: TSK-3E3CCB7B291D,name: "Wave 3: people with entity resolution v1 and privacy review",type: task,status: archived,priority: medium,created_at: 2026-11-02T09:55:58.848Z,updated_at: 2026-11-12T05:47:44.335Z,due_at: 2027-02-12,order: 30720,extra: {status_history: [{from: planned,to: archived,at: 2026-11-12T05:47:44.335Z}]},archived_at: 2026-11-12T05:47:56.094Z}
---

# Wave 3: people with entity resolution v1 and privacy review

## Goal
Define how office holders and candidates enter, with one human represented by one row, after a documented privacy review.

## Context
People data is personal data. The dossier lists the open questions (lawful basis, retention, correction process). Only public-office information about public figures is in scope; identifiers, contacts and family details stay excluded. Entity resolution must never merge people automatically: deterministic keys (official identifiers) first, then reviewed proposals from the intelligence layer with evidence. Needs a named privacy owner and counsel input before any import. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Privacy review recorded by the named owner, with counsel input, and the dossier updated.
- [ ] Entity resolution v1: keys, aliases with validity, proposal records with evidence, reviewer merge and split.
- [ ] Import holders for one office type as a pilot.
- [ ] Correction and takedown path tested end to end.
- [ ] Report what was excluded and why.
