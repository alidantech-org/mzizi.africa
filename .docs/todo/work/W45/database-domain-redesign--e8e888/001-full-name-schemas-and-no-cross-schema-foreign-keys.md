---
{id: TSK-3C0D8F0A72DC,name: Full-name schemas and no cross-schema foreign keys,type: task,status: planned,priority: medium,created_at: 2026-11-02T06:41:22.239Z,updated_at: 2026-11-02T06:41:22.239Z,due_at: 2026-11-02,order: 1024}
---

# Full-name schemas and no cross-schema foreign keys

## Goal

Make every schema and table name a full word, and make each schema independent of the others by replacing every cross-schema foreign key with a plain id. Enforce both rules in the contract audit so they cannot regress.

## Context

Abbreviated schemas (geo, org, statistic) are renamed to geography, organization and statistical; the naming rule in .docs/rules/database-naming.md is updated with the new map. The generator creates real foreign keys for relation fields, which currently cross schemas (for example geography units pointing at reference jurisdictions). Cross-schema references become plain ids, validated by the database engine's integrity jobs, so a schema can move to its own database later. Read .docs/docs/DATABASE_DESIGN.md first. Intra-schema relations stay.

## Acceptance checklist

- [ ] Rename schemas to geography, organization and statistical and update the naming rule and map.
- [ ] Convert every relation that targets a different schema into a plain id.
- [ ] Add audit rules: schema names are full words from an approved list, and no relation crosses a schema.
- [ ] Verify the audit fails on a planted cross-schema relation and an abbreviated schema.
- [ ] Update docs that name the old schemas.
