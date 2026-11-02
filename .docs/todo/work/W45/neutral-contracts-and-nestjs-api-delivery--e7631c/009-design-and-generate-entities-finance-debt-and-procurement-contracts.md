---
{id: TSK-0035D0E11D76,name: "Author entities, finance, debt and procurement contracts",type: task,status: completed,priority: medium,created_at: 2026-11-02T04:56:58.871Z,updated_at: 2026-11-02T05:19:58.202Z,order: 9216,due_at: 2026-11-02,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T05:18:48.343Z},{from: in-progress,to: completed,at: 2026-11-02T05:19:58.202Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0035D0E11D76/1793596728345-start,started_at: 2026-11-02T05:18:48.417Z,end_ref: refs/tracking/TSK-0035D0E11D76/1793596798203-end,ended_at: 2026-11-02T05:19:58.202Z,summary: {files: 2,insertions: 402,deletions: 1}}]}}}
---

# Author entities, finance, debt and procurement contracts

## Goal

Make legal identity, public finance, borrowing and procurement jurisdiction-neutral and fully traceable end to end.

## Context

Inventory findings: LegalEntities embeds tax_pin and a registry number and a Kenyan entity-type enum; several tables lack currency and default to KES; ledger entries use an unenforced polymorphic reference; expenditure workflow has missing foreign keys; fiscal stages and revenue categories are Kenyan configuration. Identifiers should be jurisdiction-scoped records with an issuing authority. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. This task only authors and typechecks contracts (bun run check in dryv/); code generation for all domains happens afterwards in the generate-and-validate task. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [x] Author entity identity and jurisdiction-scoped identifier contracts.
- [x] Author fiscal year, budget, transfer, revenue, ledger and workflow contracts with currency and typed references.
- [x] Author loan, disbursement, repayment, tender, bid and contract contracts with legal authority links.
- [x] Move stages, categories and procurement methods into country-config records.
- [x] Compile and update .docs/docs/DOMAINS.md.

## Progress

Authored dryv/contracts/domains/finance as four groups. Entities: LegalEntity with status, EntityIdentifier (scheme and issuing authority as records, replacing tax_pin and registration_number), EntityOwnership (Numeric percentage, person or entity owner), EntityLocation. Finance: FiscalYear, BudgetaryUnit (separate from institutions and geography), Budget with kind and currency, Transfer, RevenueRecord, Expenditure linked to budget and contract, LedgerEntry with a reference kind and id. Debt: Loan, LoanDisbursement, LoanRepayment with a ledger entry id. Procurement: Tender, Bid, Contract, ContractMilestone and ContractVariation. Every amount has a currency column with no default; stages, categories, transfer types and procurement methods are classification ids. bun run check passes (261 schemas, 101 operations).
