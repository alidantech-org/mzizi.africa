---
{id: GRP-5C21D3E8E888,name: Database domain redesign,type: documentation,extra: {created_at: 2026-11-02T06:41:22.132Z}}
---

# Plan

## Approach

Write the design documents first (database overall, filesystem, sourcing, people). Then apply them in contract order: naming and the no-cross-schema-foreign-key rule with audit enforcement; the source schema and the removal of embedded provenance from all data entities; person and identity; filesystem with attachments. Regenerate once, then adapt hand-written SQL, fixtures, tests and the dev tooling, recreate the development database and run every suite on PostGIS.

## Milestones

1. Design documents and tasks.
2. Naming and relation rules enforced by the contract audit.
3. Source, person, identity and filesystem contracts authored.
4. Regenerated API with updated queries and tests passing.
5. Development database recreated; documents and handoffs updated.

## Risks

The geography reads join source tables for boundary provenance, the only intended cross-schema reads. Moving provenance changes fixtures, seeds and every test that builds evidence fields. The generator allows one relation per target and cross-schema relations must become plain ids with integrity checks done later by the database engine. TypeORM creates enum types before schemas, so schemas must be created first.
