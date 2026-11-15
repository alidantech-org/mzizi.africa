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
