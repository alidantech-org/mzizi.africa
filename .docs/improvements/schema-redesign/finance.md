---
id: DOC-948E126B5CAD
name: Finance and debt domain schema redesign
type: documentation
tags: [improvements, schema-redesign, finance, debt, planning]
extra: {status: planning_only}
---

# Finance — budgets, fiscal units, funds, expenditure and debt

**PLANNING ONLY. User direction is to move `debt` into `finance`; no table move is authorized yet.**

## Domain ownership and user concern

Finance should explain who authorized, received, allocated, transferred, borrowed and spent public money, in which fiscal period, currency, geography and organization. The user wants public funds, procurement relationships, Kenya fiscal data and governance accountability to be easy to trace and query. Keep `procurement` separate: a tender or contract is not equivalent to an expenditure or ledger entry.

Debt is a form of financing, so the user's chosen grouping is `finance` absorbing `debt`. But a loan agreement, disbursement, repayment, budget, transfer, revenue and expenditure represent different financial facts with different legal effects, versions and parties.

## Current tables — explicit review of all ten

| Existing table | Real purpose and proposed action |
|---|---|
| `finance.years` | Fiscal-year and jurisdiction/calendar context; retain fiscal semantics and dated validity. |
| `finance.units` | Budgetary units/appropriation holders; relate to public institutions and canonical organization identities with FKs, not vague name matching. |
| `finance.budgets` | Approved and amended allocations or estimates by unit, period, fund/project/line and currency; compare versions. |
| `finance.transfers` | Public transfers between responsible units/funds; distinguish inflow/outflow, source and recipient. |
| `finance.revenues` | Collections by source, time, geo, reporting unit and classification; actual vs forecast. |
| `finance.expenditures` | Authorized, committed or paid amounts; define actual payment semantics rather than mixing them. |
| `finance.entries` | Ledger entries; assess whether they describe real accounting events or duplicate expenditures/transfers. |
| `debt.loans` | Move into `finance.loans` preserving loan identity, lender, borrower, terms, currency and evidence. |
| `debt.disbursements` | Move into `finance.disbursements`, retain FK to loan and dated actual receipt. |
| `debt.repayments` | Move into `finance.repayments`, principal vs interest/fees, dates, amounts and legal obligation. |

**Candidate additional concepts — not approved:** `finance.funds`, `programmes`, `projects`, `appropriations`, `obligations`. Before adding tables, inspect actual KNBS/budget, Treasury, county finance and NG-CDF workflows and determine what existing `finance.units/budgets/entries` can already express.

**Future column-by-column audit:** review all column names/types/defaults, primary/unique keys, numeric precision and units, currency codes, fiscal-year time span, instrument IDs, budget unit links, source IDs, versioning, geography and nullable meanings. Never infer that all amounts are KES or comparable without currency conversion.

## Legal, geographic and entity links

Require hard FKs to the correct `governance.institutions` or `organization.entities` for funding authority and to `finance.units` for budget owner. Fiscal records may link to `procurement.contracts` and project delivery location, but a contracted amount is not proof of actual payment. Differentiate the legally scoped jurisdiction, recipient location, implementation geo unit and statistical reporting geo unit. National transfer records might fund one county without being "located" there physically. Legal basis can attach to budget rules/appropriation laws; do not redundantly stamp a vague law ID onto every payment.

Debt should link to lender/borrower organizations, origin agreement/legal instrument, repayment schedule, disbursement/repayment events and historical amendments. Ensure strong FK links across `finance`, `organization`, `governance`, `geography`, `legal` and `reference` where relevant. Date validity must distinguish fiscal period, transaction/recorded date, due date and publishing date.

## Four acquisition classes and generation eligibility

- **1A static:** official fiscal-year calendars, public fund identity and budgetary units after verified registration.
- **1B pattern:** legally prescribed recurring fiscal reports, accounting/appropriation structures, annual reporting periods and expected unit coverage. No invented payments.
- **2A collected:** approved budgets, public funds, actual county transfers, loan agreements, debt schedules, revenue/expenditure statements and transaction reports.
- **2B derived:** budget execution ratios, debt-service ratios, committed vs disbursed/paid, per-capita spending, fund balances and county comparisons with formula, denominator and revision lineage.

Patterns should generate **expected reporting structures**, while source evidence establishes actual numbers. Link every output to source and data category; distinguish correction from revised official annual accounts.

## Test queries and accuracy criteria

Trace a fund's sources and recipients; compare initial budget, supplementary budget and actual spending for a county over its fiscal year without adding revised budget totals together. Identify which procurement contract and project were funded by a budget unit and what, if anything, was paid. Follow a sovereign loan from agreement through drawdowns, repayment and remaining balance without confusing principal/interest. Show reporting periods and currencies. Reconcile county-level sums to a credible national aggregate only when the data are compatible and nonoverlapping.

## Migration and preservation

Before consolidation, audit which downstream tables and API contracts reference `debt.loans`, `disbursements` and `repayments` and determine schema rename versus new DDL. Maintain IDs and exact financial amounts; fix broken references before adding cross-schema constraints. Investigate whether `finance.entries` is redundant or materially necessary; removal requires proof of no unique semantics. Avoid premature project/fund table additions. Use staged, reversible migrations after specific user approval.

## Explicit open decisions

1. Does MZIZI need fund/programme/project models in `finance`, `governance` or a later planning domain?
2. Ledger entries: double-entry accounting, simple transaction lines or redundant import artifacts?
3. Loan borrower/lender roles, guarantees, repayment schedules and multicurrency conversion?
4. Budget vs commitments vs obligations vs actual expenditures; required financial dates and versions?
5. Jurisdiction/fiscal period and geographic delivery vs physical institution location?
6. Which value corrections can be automated, and which require financial/official publication review?

**References:** [Master register](../mzizi-data-schema-storage-and-pipelines-redesign.md) · [Schema index](README.md) · [Procurement](procurement.md) · [Statistics](statistical.md).
