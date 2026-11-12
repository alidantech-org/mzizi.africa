---
{id: TSK-0FDD5A808362,name: "Catalogue seeds: institutions, units, offices, facilities and expectations",type: task,status: completed,priority: medium,created_at: 2026-11-02T20:59:35.990Z,updated_at: 2026-11-03T01:43:32.474Z,order: 3072,depends_on: [TSK-D034AD29926E],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-03T01:43:30.646Z},{from: in-progress,to: completed,at: 2026-11-03T01:43:32.474Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0FDD5A808362/1793670210650-start,started_at: 2026-11-03T01:43:32.088Z,end_ref: refs/tracking/TSK-0FDD5A808362/1793670212476-end,ended_at: 2026-11-03T01:43:32.474Z,summary: {files: 0,insertions: 0,deletions: 0}}]}},archived_at: 2026-11-12T05:47:53.793Z}
---

# Catalogue seeds: institutions, units, offices, facilities and expectations

## Goal
Know every public body and every expected post, unit, facility and placement from reviewed JSON seeds, by extending the existing governance structure seed instead of creating a parallel catalogue.

## Context
`fixtures/seed/ke-governance-structure.json` holds 100 institutions (30 state corporations, 22 ministries, 14 commissions, 11 regulators, 8 judiciary, 5 executive, 4 independent offices, 3 legislature, 3 security). The seed contract is extended with stable codes, official names and aliases, classification, parent and relationship, legal basis, geography scope, effective periods, confidence, known unknowns and exceptions, offices (title, cardinality, appointing authority, term), units (regional offices) and expected placements (headquarters, regional offices). Seed and pattern files are registered as source documents under the publisher "Mzizi curated research" and loaded rows are attributed to them with method curated, so no new source fields appear on records. Bodies include TSC, DCI, NTSA, KeNHA, KURA, KeRRA, KRA, EACC, ODPP, the Judiciary, IEBC, NLC, CRA, SRC, CAJ, KNCHR, ORPP, the Controller of Budget and the Auditor-General. Generated expectations are never evidence of a real building.

## Acceptance checklist
- [x] Extend the seed schema and loader, with validation tests and idempotent loading.
- [x] Add ministries and state departments with offices, units and expected placements.
- [x] Add state corporations, SAGAs, commissions and independent bodies.
- [x] Register seed files as source documents and attribute loaded rows.
- [x] Load into the real database and report counts and known unknowns.
