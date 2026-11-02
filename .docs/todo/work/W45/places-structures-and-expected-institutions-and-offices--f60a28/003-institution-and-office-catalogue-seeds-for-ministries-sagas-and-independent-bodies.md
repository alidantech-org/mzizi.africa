---
{id: TSK-0FDD5A808362,name: "Catalogue seeds: institutions, units, offices, facilities and expectations",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:59:35.990Z,updated_at: 2026-11-02T22:42:30.548Z,order: 3072,depends_on: [TSK-D034AD29926E]}
---

# Catalogue seeds: institutions, units, offices, facilities and expectations

## Goal
Know every public body and every expected post, unit, facility and placement from reviewed JSON seeds, by extending the existing governance structure seed instead of creating a parallel catalogue.

## Context
`fixtures/seed/ke-governance-structure.json` holds 100 institutions (30 state corporations, 22 ministries, 14 commissions, 11 regulators, 8 judiciary, 5 executive, 4 independent offices, 3 legislature, 3 security). The seed contract is extended with stable codes, official names and aliases, classification, parent and relationship, legal basis, geography scope, effective periods, confidence, known unknowns and exceptions, offices (title, cardinality, appointing authority, term), units (regional offices) and expected placements (headquarters, regional offices). Seed and pattern files are registered as source documents under the publisher "Mzizi curated research" and loaded rows are attributed to them with method curated, so no new source fields appear on records. Bodies include TSC, DCI, NTSA, KeNHA, KURA, KeRRA, KRA, EACC, ODPP, the Judiciary, IEBC, NLC, CRA, SRC, CAJ, KNCHR, ORPP, the Controller of Budget and the Auditor-General. Generated expectations are never evidence of a real building.

## Acceptance checklist
- [ ] Extend the seed schema and loader, with validation tests and idempotent loading.
- [ ] Add ministries and state departments with offices, units and expected placements.
- [ ] Add state corporations, SAGAs, commissions and independent bodies.
- [ ] Register seed files as source documents and attribute loaded rows.
- [ ] Load into the real database and report counts and known unknowns.
