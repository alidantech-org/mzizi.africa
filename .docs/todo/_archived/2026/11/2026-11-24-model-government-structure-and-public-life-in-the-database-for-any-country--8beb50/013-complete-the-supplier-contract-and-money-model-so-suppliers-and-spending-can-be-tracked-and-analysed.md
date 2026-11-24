---
{id: TSK-A3E54B181A32,name: "Complete the supplier, contract and money model so suppliers and spending can be tracked and analysed",type: task,status: archived,priority: medium,created_at: 2026-11-19T10:29:46.604Z,updated_at: 2026-11-24T19:25:09.890Z,order: 13312,extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:25:09.890Z}]},archived_at: 2026-11-24T19:25:18.937Z}
---

# Complete the supplier, contract and money model so suppliers and spending can be tracked and analysed

## Goal

Track every supplier and every contract it gets, who bought, how much was estimated, bid, awarded, changed and paid, and for which project and place, so analytics can show concentration, repeat winners, single bids, cost and time overruns and spending per place. The data must stay at transaction grain with a citation on each fact, and be exportable to open standards.

## Context

Existing (`dryv/contracts/schemas/postgres/civic.ts`): `Projects` (55), `Procurements` (106; buyer entity, category, nature, procedure, status, publish, close and award dates; no estimated amount), `Bids` (138; one bidder, amount, outcome), `Contracts` (154; one contractor, amount, currency, status, signed date; no buyer, no amendments), `Deliveries` (175). Finance (`finance.ts`): `Appropriations` (77; nested, recipient, project, unit), `Funds` (104), `Flows` (123; contract, project, institution, place; counterparty is an entity only), `Debts` (165). Supplier identity: `official.entities` with `official.identifiers` (registration and tax numbers; unique per scheme, issuer, namespace, value; `official.ts:91-117`). Read-only indicators exist in `accountability.ts` (`ProcurementPerformance`, `ProjectPerformance`, `OversightSignals`). Design: `.docs/design/data/POWER_MONEY_PATTERNS_AND_SITES.md` section 4.

## Missing and proposed

1. `civic.partners` (contract, party entity, role scheme `civ.contract.role`: lead, member, subcontractor, guarantor, supervisor, share percentage) and the same idea for consortium bids.
2. On procurements: estimated amount, currency, stated bidder count (as published, may exist without bid rows), evaluation basis.
3. On contracts: `buyerEntityId`; new `civic.variations` (variation, extension, termination, amount delta, new end date, reason, citation).
4. `civic.officials` (procurement, individual, role: accounting officer, committee chair, evaluator, approver, signatory, optional office held then).
5. Payments to individuals: add `counterpartyIndividualId` to `finance.flows` with an exactly-one rule, or route all payments to entities; decide.
6. Field names chosen so they map to OCDS, with a mapping table in the design document.

## Analytics inputs and outputs

Read models only: concentration per buyer, repeat winners, single-bidder rate, award versus estimate, near-threshold splitting, close-to-award time, overruns through changes, spend per head by place against statistics, share with an officeholder link (task 014). Each row carries evidence count; zero evidence means no data.

## Acceptance checklist

- [ ] Owner reviews each proposed table and column; author the approved ones in `civic.ts` and `finance.ts` with descriptions, indexes and the exactly-one or at-least-one rules.
- [ ] Add the `civ.contract.role` and related schemes after approval; check `.docs/rules/codes.md`.
- [ ] Write the OCDS mapping table in the design document and confirm every OCDS field the owner cares about has a column or is declared out of scope.
- [ ] Define the supplier profile read (all contracts, buyers, places, values, co-parties) as a query from existing tables.
- [ ] Define each analytic with inputs, formula, evidence count and wording; none stored as fact.
- [ ] Paper-test a joint-venture contract with an amendment, a direct award without procurement, and payments in two currencies.
- [ ] Run `task validate`.
