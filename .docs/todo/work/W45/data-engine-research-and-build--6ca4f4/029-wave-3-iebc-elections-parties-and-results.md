---
{id: TSK-DC3F78675701,name: "Wave 3: IEBC elections, parties and results",type: task,status: planned,priority: medium,created_at: 2026-11-02T09:55:58.688Z,updated_at: 2026-11-02T09:55:58.688Z,due_at: 2027-02-05,order: 29696}
---

# Wave 3: IEBC elections, parties and results

## Goal
Import parties, elections and results from the Independent Electoral and Boundaries Commission and the Registrar of Political Parties.

## Context
The pilot structure reads the IEBC party list resources page (41 PDFs by party). Results arrive as PDFs and sheets by election; they need the Tier B extractors, mapping to electoral.elections, seats, candidates and results with geography links, and strict handling of candidate names as personal data (public-interest basis to be recorded in the dossier). Parties are institutions and may use public registration data. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Assessment and licence for the IEBC resources and results pages.
- [ ] Extract the party list documents and register parties with identifiers.
- [ ] Results extraction for one election with ward or constituency geography.
- [ ] Validate totals, geography links and dates with precision.
- [ ] Review queue for candidate and party name resolution.
