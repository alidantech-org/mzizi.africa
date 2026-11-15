---
{id: TSK-CEAD0A06ABC2,name: Close the Dryv gaps that block the database design,type: task,status: planned,priority: medium,created_at: 2026-11-15T16:54:07.000Z,updated_at: 2026-11-15T16:54:07.000Z,order: 10240}
---

# Close the Dryv gaps that block the database design

## Goal

Work through the register in `.docs/design/data/DRYV_GAPS.md` and either fix each gap in Dryv or record a Mzizi-side workaround, so Dryv generates what the project needs: typed Python, TypeORM entities, geometry columns, schema evolution releases and a reproducible generation setup. Each gap ends as fixed, worked around or explicitly accepted.

## Context

The register lists fourteen gaps with evidence: no change-aware SQL, no Mongo driver, no Python models, TypeORM not bound to the database app, relation name collisions, no geometry type, dependence on a local Dryv checkout and API, a pinned engine missing a local change, unenforceable scheme-scoped references, no cycle check through edge tables, whole-repository uploads, a planner warning, import resolution differences and Python pack file collisions. Fixes in the Dryv repository need that repository's own tracking. The first moves are a `.dryvignore`, a geometry decision, and the generator choice shared with the Python models task.

## Acceptance checklist

- [ ] Each of the fourteen gaps has a recorded outcome (fixed, worked around or accepted) with a link to the change or task.
- [ ] Geometry storage works end to end, or the decision to defer it is recorded with its consequences.
- [ ] A reproducible generation procedure for a new machine is documented and tried once from a clean checkout.
- [ ] `bun run dryv:database:verify` passes after the changes.

## Notes

On 15 November 2026 the API and engine contracts were authored (apps/api: auth, reference, geography, governance; apps/engine: jobs) as flat files, one per group, with Dryv queries, schema.fromQuery rows and policy stubs. The database app was replaced by a dedicated pgsql app for SQL generation. Stale tools were removed from dryv/tools. Gaps 15 to 24 were added to DRYV_GAPS; gaps 18 to 21 block five of the nine API queries from passing engine validation (the author compiler accepts them).

On 15 November 2026 the api app (auth, reference, geography, governance) was generated through the NestJS packs: 788 files, `generate --check` clean, package typecheck clean, 3,296 generated tests pass and 15 fail. Dryv fixes landed in the Dryv repository (TSK-596E5D13DB78) and two local commits in the packs repository (TypeORM store support, null-safe invariants). Gaps 15 to 29 are updated in DRYV_GAPS; gap 27 (same-named schemas across groups) is the remaining generation blocker for a fully green generated test run.
