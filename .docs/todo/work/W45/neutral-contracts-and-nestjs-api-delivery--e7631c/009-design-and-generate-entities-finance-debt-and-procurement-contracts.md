---
{id: TSK-0035D0E11D76,name: "Design and generate entities, finance, debt and procurement contracts",type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:58.871Z,updated_at: 2026-11-02T04:58:12.100Z,order: 9216,due_at: 2026-11-02}
---

# Design and generate entities, finance, debt and procurement contracts

## Goal

Make legal identity, public finance, borrowing and procurement jurisdiction-neutral and fully traceable end to end.

## Context

Inventory findings: LegalEntities embeds tax_pin and a registry number and a Kenyan entity-type enum; several tables lack currency and default to KES; ledger entries use an unenforced polymorphic reference; expenditure workflow has missing foreign keys; fiscal stages and revenue categories are Kenyan configuration. Identifiers should be jurisdiction-scoped records with an issuing authority. Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Author entity identity and jurisdiction-scoped identifier contracts.
- [ ] Author fiscal year, budget, transfer, revenue, ledger and workflow contracts with currency and typed references.
- [ ] Author loan, disbursement, repayment, tender, bid and contract contracts with legal authority links.
- [ ] Move stages, categories and procurement methods into country-config records.
- [ ] Compile and update .docs/docs/DOMAINS.md.
