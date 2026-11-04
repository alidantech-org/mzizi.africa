---
{id: TSK-9D5EA49A55AD,name: Replace the mobile Money sample content with canonical finance and procurement data,type: task,status: planned,priority: high,created_at: 2026-11-02T21:15:42.088Z,updated_at: 2026-11-02T21:15:49.712Z,order: 4096,depends_on: [TSK-7C92F20B477C]}
---

# Replace the mobile Money sample content with canonical finance and procurement data

## Goal

Make the Money tab a useful public view of Mzizi's approved finance and procurement records. A user should be able to inspect funding, transfers, spending and procurement in a selected place and fiscal period, with correct amounts and a clear evidence path.

## Context

`MoneyScreen` currently renders local explanatory content and a fixed fiscal-year choice. The NestJS API defines finance and procurement reads; the database handoff lists NG-CDF units, allocations and dated disbursements, while the current promotion state and exact mapping to finance contracts need verification. This work must wait for the readiness task. Never sum unlike finance stages, infer currency, expose restricted supplier identifiers/contact fields, or calculate totals from an incomplete page of results.

## Acceptance checklist

- [ ] Confirm public-ready finance and procurement records, fiscal periods, currency, place links, evidence and endpoint query/pagination behavior.
- [ ] Map NG-CDF allocations/disbursements to canonical finance types and document any required API aggregation or filter contract.
- [ ] Replace fixed/local sample sections with paginated API-backed finance and procurement cards and honest empty/error states.
- [ ] Display amount, currency, fiscal period, unit/place, record kind and status together, with detail/evidence navigation.
- [ ] Ensure aggregate displays come from complete server results or explicit aggregate endpoints and exclude restricted fields.
