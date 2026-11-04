---
{id: TSK-3C0D8F0A72DC,name: Full-name schemas and no cross-schema foreign keys,type: task,status: completed,priority: medium,created_at: 2026-11-02T06:41:22.239Z,updated_at: 2026-11-02T06:58:59.262Z,due_at: 2026-11-02,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T06:41:30.912Z},{from: in-progress,to: completed,at: 2026-11-02T06:58:59.262Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-3C0D8F0A72DC/1793601690914-start,started_at: 2026-11-02T06:41:31.161Z,end_ref: refs/tracking/TSK-3C0D8F0A72DC/1793602739264-end,ended_at: 2026-11-02T06:58:59.262Z,summary: {files: 1329,insertions: 30648,deletions: 28685}}]}},archived_at: 2026-11-04T15:53:07.952Z}
---

# Full-name schemas and no cross-schema foreign keys

## Goal

Make every schema and table name a full word, and make each schema independent of the others by replacing every cross-schema foreign key with a plain id. Enforce both rules in the contract audit so they cannot regress.

## Context

Abbreviated schemas (geo, org, statistic) are renamed to geography, organization and statistical; the naming rule in .docs/rules/database-naming.md is updated with the new map. The generator creates real foreign keys for relation fields, which currently cross schemas (for example geography units pointing at reference jurisdictions). Cross-schema references become plain ids, validated by the database engine's integrity jobs, so a schema can move to its own database later. Read .docs/docs/DATABASE_DESIGN.md first. Intra-schema relations stay.

## Acceptance checklist

- [x] Rename schemas to geography, organization and statistical and update the naming rule and map.
- [x] Convert every relation that targets a different schema into a plain id.
- [x] Add audit rules: schema names are full words from an approved list, and no relation crosses a schema.
- [x] Verify the audit fails on a planted cross-schema relation and an abbreviated schema.
- [x] Update docs that name the old schemas.

## Progress

Schemas renamed to full words (geography, organization, statistical), the approved schema list and the no-cross-schema-relation rule added to the contract audit, and 16 cross-schema relations converted to plain ids. Verified the audit fails on the abbreviated schema geo and on a planted cross-schema relation. The naming rule and map (.docs/rules/database-naming.md) now cover all 18 schemas. A database test also asserts no foreign key crosses a schema.
