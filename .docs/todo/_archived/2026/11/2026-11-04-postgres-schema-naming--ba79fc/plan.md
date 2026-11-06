---
{id: GRP-8BAFC9BA79FC,name: Postgres schema naming,type: documentation,extra: {created_at: 2026-11-02T06:15:28.411Z}}
---

# Plan

## Approach

Write the naming rule and the full old-to-new map first. Then set a storage namespace on each Dryv group and shorten every storage name, add contract audit checks so the rule cannot regress, regenerate the API, and update the hand-written SQL, the target-kind validation, the test grants and the dev tooling. Drop the old development database, create a new one, load the fixtures and run every suite against PostGIS.

## Milestones

1. Naming rule and mapping published under .docs.
2. Contracts renamed and audited.
3. Generated code and hand-written queries updated.
4. New database created; all suites pass.
5. Documentation and handoff references updated.

## Risks

Hand-written raw SQL and test grants still pointing at public tables. Audit target kinds must become schema-qualified and stay safe to use as identifiers. TypeORM dropSchema only touches the public schema, so resets must drop each domain schema explicitly.
