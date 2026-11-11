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

## Human review — editable user notes and design sign-off

**Review status:** `NOT REVIEWED` — AI-authored proposals in this document are not final approval.

**In my own words, what this schema should represent and exclude:**

> _My understanding and questions:_

**Tables/columns I want to keep, rename, move, merge, split, remove or add (and why):**

> _My proposed changes and alternative names:_

**Hard foreign keys, geographical and legal scope, pattern generation, classification and evidence I want changed or explained:**

> _My technical feedback, disagreements and alternatives:_

**Real data and queries I want to use to validate this design:**

> _My examples and expected results:_

**Unresolved decisions I want to discuss further:**

> _My remaining questions:_

**Final user decision:** `NOT DECIDED` / `NEEDS CHANGES` / `DESIGN VALIDATED BY USER` / `APPROVED FOR TASK PLANNING`.

**Approval reference and date:** _None. Only record explicit later user authorization. Even design validation does not authorize code, migration or Taskcode task creation._

## Mandatory per-table temporal, rigid-column and deletion review (2026-11-07)

**USER REQUIREMENT; planning only.** Examine every existing/proposed field and expressly record **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** for `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision`, `is_current`, `status`, `version`, `created_at`, `updated_at` and other copied/rigid flags. These fields are **opt-in by justified meaning**, not blanket schema conventions. Assess `deleted_at` only for recoverable soft deletion where appropriate. The full policy and migration/approval checklist is in [schema redesign README](README.md).

**Domain-specific guidance:** Fiscal periods already have explicit dates; budget revisions need edition/approval dates, transactions need paid/booked times, loans need agreement/maturity dates, disbursements and repayments need occurrence dates. These are different semantics, not one blanket valid_from/to pair. Keep finance history and correct via versioning/reconciliation, not soft-delete or generic current flags.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.


## 2026-11-07 public budget schedules, announcement events and verification

**Planning only:** Under `reference`, evaluate generic legally based budget/fiscal schedule definitions and watcher rules (submission deadlines, debates, approval, supplementary budgets, Treasury/public reports). `activity` records expected/announced/completed stages and amendments with evidence; `finance` retains budgets, fiscal units, money amounts, source editions, expenditures/transfers and true financial events. The existence of a budget deadline or debate **does not prove approval, appropriation or payment**.

**Meaningful fields:** `finance.years.starts_on/ends_on` already defines fiscal periods. A budget `submitted_on`, `approved_on` and `revised_on` are different facts; expenses have `paid_at` or `booked_at` only if they mean actual transactions. Do not replace generic `valid_from/to` with unrelated renamed dates by template. An active fiscal process can have frequent monitoring but its prior approved edition and historical payment ledger remain cold unless an official correction or new source appears.

**Agent/admin flow:** An official-source announcement or admin-submitted budget event becomes a sourced `activity` candidate, may trigger budget publication checks by finance unit/jurisdiction and period, then create staged comparisons against approved `finance.budgets` and `statistical` derived measures. Advance verification history for unchanged facts, not their value timestamps. Preserve published versions and legal authority. Source selection and schedules must be jurisdiction-manifest driven, never embedded Kenya-specific constants. Final tables, columns and review thresholds remain **OPEN**.

## 2026-11-11 — System-expansion alignment

Finance remains owner of budgets, debt and transactions. Economy's production, prices and trade do not absorb financial accounting; links to projects/contracts require real target FKs. See the [system-expansion proposal](../advancement-and-system-expansion.md). This alignment note does not approve proposed schemas, tables or implementation.
