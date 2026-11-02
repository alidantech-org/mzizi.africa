---
{id: TSK-D034AD29926E,name: "Jurisdiction-wide scope: national records point at the country geography unit",type: task,status: planned,priority: medium,created_at: 2026-11-02T22:42:27.129Z,updated_at: 2026-11-02T22:42:30.266Z,order: 8192,depends_on: [TSK-AA0A323E646D]}
---

# Jurisdiction-wide scope: national records point at the country geography unit

## Goal
Fix the bug where records scoped to a whole jurisdiction have no geography unit, by pointing them at the jurisdiction's root unit, reseeding the affected data, and adding rules so it cannot recur. Every record that belongs to a jurisdiction becomes geographically identifiable.

## Context
Decision DEC-JURISDICTION-WIDE-SCOPE. Verified on the real database on 3 November 2026: 101 of 195 institutions (the IEBC, the national executive, the Senate, the judiciary and national ministries), 202 of 2,172 finance units, and the one statistical dataset have a null geography link, while elections, results, seats, political units, calendar events and observations are already populated. Only records outside every modelled jurisdiction (supranational bodies) or with unresearched scope may stay empty. The lane H2 governance work adds `scope_geo_unit_id` on institutions and offices and renames the institution column, so this task starts after that task and uses the new names. Seeds such as `ke-governance-structure.json` and `ke-expected-sites.json` and the office and unit patterns must express scope explicitly, with `national` resolved by the loader to the root unit of the record's jurisdiction.

## Acceptance checklist
- [ ] Add a root-unit lookup per jurisdiction and use it in loaders; fail loudly when a jurisdiction has no root unit.
- [ ] Backfill institutions, offices, finance units and statistical datasets scoped to a whole jurisdiction, with before and after counts and a pg_dump snapshot.
- [ ] Update the seed schema and loader so scope is required, and re-run the governance structure and expected-site seeds idempotently.
- [ ] Add an integrity rule that reports scoped records with a jurisdiction but no geography unit, and tests for it.
- [ ] Add the scope-gap check to the reinforcement coverage report and document the rule in `.docs/docs/geography-model.md` and `DOMAINS.md`.
