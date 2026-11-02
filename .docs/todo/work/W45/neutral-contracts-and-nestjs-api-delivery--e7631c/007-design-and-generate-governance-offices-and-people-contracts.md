---
{id: TSK-C1D45F1811D1,name: "Design and generate governance, offices and people contracts",type: task,status: planned,priority: medium,created_at: 2026-11-02T04:56:58.682Z,updated_at: 2026-11-02T04:58:11.956Z,order: 7168,due_at: 2026-11-02}
---

# Design and generate governance, offices and people contracts

## Goal

Model institutions, relationships, offices, rules, holders and people neutrally, with Kenyan terms, selection methods and limits held as records.

## Context

Inventory findings: institutions use free-string ke/* types and have no time or legal basis; relationships are only structural; offices embed max_terms, term_duration_years and retirement_age; holders lack a person foreign key; selection rules are single-step; people use a 36 character key and mix PII in profiles. Separate the office as a role from its holder (AGENTS.md section 8). Read .docs/handoffs/neutral-model-and-nestjs-api-handoff.md, .docs/decisions/nestjs-api-and-dryv-placement.md and .docs/docs/audits/LEGACY_MODEL_INVENTORY.md before starting. Keep work on develop, track it through the Task CLI and update the matching .docs files in the same change.

## Acceptance checklist

- [ ] Author institution, typed relationship, office, dated office-rule, appointment and holder contracts.
- [ ] Model multi-stage selection procedures as ordered stages.
- [ ] Author person identity with per-claim evidence and handle profile PII explicitly.
- [ ] Compile and document the model including Kenya as records.
- [ ] Update .docs/docs/DOMAINS.md.
