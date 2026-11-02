---
{id: TSK-6E8B8BC93A82,name: "Political party money: Political Parties Fund allocations and parties' accounts",type: task,status: planned,priority: medium,created_at: 2026-11-02T20:02:41.857Z,updated_at: 2026-11-02T21:36:48.812Z,order: 3072,depends_on: [TSK-FDB011601399]}
---

# Political party money: Political Parties Fund allocations and parties' accounts

## Goal

Record money sent to political parties and money parties report receiving and spending, by year, from the ORPP's published allocations and audited accounts.

## Context

The Political Parties Fund is distributed to qualifying parties by the Registrar under the Political Parties Act, 2011 and its regulations, and parties publish or submit audited accounts. These appear as PDFs on the ORPP site and in the Auditor-General and Controller of Budget publications. The finance schema already has units, years, budgets, entries, expenditures, revenues and transfers; a party can be a finance unit with an organisation or party link, the Fund a source unit, and each allocation a transfer with its financial year and legal basis. Reported income and expenditure by category become revenue and expenditure rows. The extraction must use the arithmetic checks (parts add up to totals) and refuse tables that do not add up, as the budget summary import does, and every figure keeps its page and document. If the finance schema cannot represent party accounts cleanly, the design note proposes an additive change.

## Acceptance checklist

- [ ] Inventory the allocation and accounts publications, years covered and formats.
- [ ] Decide how a party is represented as a finance unit and whether any additive schema change is needed.
- [ ] Load Fund allocations per party and year as transfers with legal basis and source.
- [ ] Load reported income and expenditure with category breakdowns and arithmetic checks.
- [ ] Reconcile Fund totals against the Controller of Budget or national budget lines.
- [ ] Add loader tests including a table that does not add up.
