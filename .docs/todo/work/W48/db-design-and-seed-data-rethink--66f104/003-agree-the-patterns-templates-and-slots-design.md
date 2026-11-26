---
{id: TSK-DA4EBA4D6B1D,name: "Agree the patterns, templates and slots design",type: task,status: planned,priority: medium,created_at: 2026-11-25T16:29:28.196Z,updated_at: 2026-11-25T16:29:28.196Z,order: 3072}
---

# Agree the patterns, templates and slots design

## Goal

Reach an owner-approved design for patterns, templates and slots as a platform capability with its own schema, written up in `.docs/design/data/TEMPLATES_AND_SLOTS.md`. Slots are the actual records with nullable fillable columns, each linked to the template that established it, with status, confidence and reason. Generation is secondary to that link. Rows do not record how they were filled; the source schema does.

## Context

The owner wants templating for governance, official, source, legal and geography, so that expected institutions, offices, holders, contacts and websites exist before real data is found, and the unfilled slots become the work queue for the engine. A first draft with Kenyan worked examples (county government, ward members, constituencies, Article 250 commissions, `.go.ke` domains) and ten open decisions D1 to D10 is in the design file. The evidence is in the research report `Kenya public body patterns` under `.dev/research/reports/`, which also lists contradictions that must not be resolved by guessing.

## Acceptance checklist

- [x] The owner has commented on the draft and answered decisions D1 to D10, each recorded in `.docs/decisions/`.
- [x] The slot-eligibility audit covers every schema, with a reason per table, including the schemas only judged by table name in the first draft.
- [x] The conflicting Kenyan figures (marginalised seats, NG-CDF committee size, chief counts, domain tallies) are settled from primary sources or kept as low-confidence parameters.
- [ ] The Dryv gaps for triggers and cross-table checks are listed in `DRYV_GAPS.md`, and `task validate` passes.

## Comments

### 2026-11-25T19:41:28.278Z · PETER IRUNGU

Owner answered on 2026-11-25; see DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125 (roots carry the template, official units with non-null feature, explicit generate function, contests only, enum rule, product labels). Audit findings in SCHEMA_AUDIT_SLOTS_AND_ENUMS. Open: unit table name, name for template effect lines, enum label key naming, which audit fixes to apply, appointed terms.
