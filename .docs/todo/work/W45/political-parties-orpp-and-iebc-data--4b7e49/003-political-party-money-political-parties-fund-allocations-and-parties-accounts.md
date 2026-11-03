---
{id: TSK-6E8B8BC93A82,name: "Political party money: Political Parties Fund allocations and parties' accounts",type: task,status: blocked,priority: medium,created_at: 2026-11-02T20:02:41.857Z,updated_at: 2026-11-02T22:52:36.821Z,order: 3072,depends_on: [TSK-FDB011601399],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T22:47:09.579Z},{from: in-progress,to: blocked,at: 2026-11-02T22:52:36.821Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-6E8B8BC93A82/1793659629591-start,started_at: 2026-11-02T22:47:11.822Z,end_ref: refs/tracking/TSK-6E8B8BC93A82/1793659956824-end,ended_at: 2026-11-02T22:52:36.821Z,summary: {files: 23,insertions: 948,deletions: 37}}]}}}
---

# Political party money: Political Parties Fund allocations and parties' accounts

## Goal

Record money sent to political parties and money parties report receiving and spending, by year, from the ORPP's published allocations and audited accounts.

## Context

The Political Parties Fund is distributed to qualifying parties by the Registrar under the Political Parties Act, 2011 and its regulations, and parties publish or submit audited accounts. These appear as PDFs on the ORPP site and in the Auditor-General and Controller of Budget publications. The finance schema already has units, years, budgets, entries, expenditures, revenues and transfers; a party can be a finance unit with an organisation or party link, the Fund a source unit, and each allocation a transfer with its financial year and legal basis. Reported income and expenditure by category become revenue and expenditure rows. The extraction must use the arithmetic checks (parts add up to totals) and refuse tables that do not add up, as the budget summary import does, and every figure keeps its page and document. If the finance schema cannot represent party accounts cleanly, the design note proposes an additive change.

## Acceptance checklist

- [x] Inventory the allocation and accounts publications, years covered and formats.
- [x] Decide how a party is represented as a finance unit and whether any additive schema change is needed.
- [x] Load Fund allocations per party and year as transfers with legal basis and source.
- [ ] Load reported income and expenditure with category breakdowns and arithmetic checks.
- [ ] Reconcile Fund totals against the Controller of Budget or national budget lines.
- [x] Add loader tests including a table that does not add up.

## Outcome (Lane C, 3 November 2026)

- Model: the Fund is the finance unit `ke/fund/political-parties-fund` (institution: the Registrar); each party that received money is a unit at level `political-party` (`ke/party-finance/<party>`), linked by the new nullable `finance.units.party_id` (migration `1794700000200`; party is none of legal entity, institution or geography unit, so the link would otherwise have lived in the code alone). Each yearly amount is a `finance.transfers` row, `approved` and `earmarked`, in the financial year's own row, dated from the year start (precision year).
- Loaded into `mzizi`: 167 transfers over 12 financial years (2013/14 to 2023/24 and 2026/27) and 51 units (the Fund, 48 linked to a party, 2 unlinked historic parties TNA and URP, which merged away and are not guessed into another party). Yearly totals are round figures for 2013/14 to 2021/22 (for example 194,940,000 and 2,351,497,000), which cross-checks the extracted digits. FY2026/27 totals 1,336,175,001 over the 48 parties the notice names.
- Checks: row numbers contiguous, the notice's stated party count equal, no zero or negative amount; a failing table is refused whole (tests include one). The documents state no totals, so a sum check is not possible.
- Legal basis: the Political Parties Act is not loaded as an instrument with provisions, so `legal_basis_id` is empty; the basis (Act ss. 23, 25, 34(b), Funding Regulations 2019) is recorded in the transfer-type classification and on each source document.
- Not done: FY2024/25 and 2025/26 tables (not on the pages fetched), parties' reported income and expenditure and audited accounts (not published there; Forms PPF-3 and PPF-4 are only templates), and the reconciliation with Controller of Budget or budget lines (no national budget lines are loaded; only NG-CDF finance data exists). The Dryv contract and entity for `partyId` were edited; the generated DTOs, configs and OpenAPI follow at the next generation.
