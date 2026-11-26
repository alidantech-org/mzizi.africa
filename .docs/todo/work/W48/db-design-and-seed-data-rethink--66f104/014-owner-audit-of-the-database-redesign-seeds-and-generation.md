---
{id: TSK-E02F1C903C54,name: "Owner audit of the database redesign, seeds and generation",type: task,status: planned,priority: high,created_at: 2026-11-25T21:36:58.031Z,updated_at: 2026-11-25T21:37:06.413Z,order: 14336,depends_on: [TSK-1D3F71DC9742]}
---

# Owner audit: review the database redesign, seeds and generation

## Goal
Give the owner a complete, plain checklist to review everything built from the discussion, so approval or feedback can be given from the code and the running database. Success is the owner having read each item, run the listed commands and either accepted the work or recorded what to change.

## Context
The discussion produced `.docs/decisions/DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125.md`, the three design documents under `.docs/design/data/` and the audit. Implementation covered the database, the seeds and generation only; the API and frontends are deliberately broken and untouched. Everything uses the single database `mzizix`. This task contains only review items; fixes go back to the task that owns the code.

## Acceptance checklist
- [ ] Review the decision record against the contracts: every numbered decision has a matching contract change or an explained exception.
- [ ] Open `reference.areas`, `template` and the changed governance contracts and check names, nullability, codes and descriptions.
- [ ] Read the generated `source/backend/database/sql/schema.sql` sections for triggers, functions and views, and confirm none was edited by hand.
- [ ] Run the generator on the seeded database and compare counts with the examples (47 governor offices, 1,450 ward MCA offices, terms for 2013, 2017, 2022 and expected 2027).
- [ ] Review the coverage views and the pending-slot CSV queue and decide what the engine should research first.
- [ ] Run `bun run check` and the database and engine tests; list failures and decide which block acceptance.
- [ ] Record feedback as comments on this task.

## Progress

2026-11-26. Ready for the owner. Where to look and what to run (all on `mzizix`, nothing creates another database):

- Contracts: `dryv/contracts/schemas/postgres/template.ts`, `_templates.ts`, `geography.ts` (`Areas`), `governance.ts`, `official.ts` (`Premises`). Check: `bun run dryv:database:check`.
- The SQL objects: `dryv/packs/postgres-sql/templates/{snapshot}/$(name).sql.j2` (inside the raw block) and the rendered result in `source/backend/database/sql/schema.sql` (search `template.generate`, `areas__guard`).
- Seeds (git-ignored): `.dev/seed/rebuild/patterns.py`, backups in `data/_before_patterns/`.
- Generate: `uv run python -c` calling `template_operations.generate` (see `source/backend/engine/src/mzizi_engine/runtime/assembly/template_operations.py`).
- Tests: `uv run pytest source/backend/engine/tests/persistence/test_template_generation.py` (18 tests, rolled back).
- Queue: `select * from template.pending_queue limit 20;`
- Open items to decide: enum conversions (task 009), the remaining slot-readiness items (task 008), the other national bodies' offices, and whether position, area and premises generation by function is wanted next.
