---
{id: TSK-06CD7E137A30,name: "Generate the approved contracts, update the design documents and prepare the Kenya seed plan",type: task,status: planned,priority: medium,created_at: 2026-11-19T09:53:18.474Z,updated_at: 2026-11-19T09:53:18.474Z,order: 9216}
---

# Generate the approved contracts, update the design documents and prepare the Kenya seed plan

## Goal

When tasks 001 to 008 are approved, the contracts must be generated into the single PostgreSQL schema and engine models, the design documents must describe what now exists, and the Kenya data that will fill the structure must be planned and shown to the owner without adding any seed file ahead of approval. This is the closing task that keeps documents and code in agreement.

## Context

Generation runs through `bun run dryv:database:generate` (the `pgsql` app) and writes `source/backend/database/sql/schema.sql`, `migrations/0001_init.sql`, `.snapshot` and the engine row models. Dryv cannot yet produce a change-aware migration (`.docs/design/data/DRYV_GAPS.md`, gap 1: generation produces a full snapshot and `bun run db assemble` refuses a changed snapshot), so the pre-release recipe in the memory notes applies: regenerate, reset the disposable database, reseed. Working tree already has uncommitted changes in `statistics.ts`, `schema.sql`, `0001_init.sql` and the snapshot; inspect them first and keep them. Seed rules (`seed/README.md`, `AGENTS.md`): `seed/` is being rebuilt, no file added without owner approval, one file or a small set at a time, edit CSVs with scripts. Kenya already has geography (`seed/data/ke/geo`), the Constitution and source captures; it has no institutions, positions, offices, links, functions, elections or statistics. Design documents to update: `.docs/design/data/GOVERNANCE_AND_CONTENT.md`, `DATABASE_DESIGN.md`, `PUBLIC_BODIES_CLASSIFICATION.md`, `DATABASE_CHANGES_20261119.md`-style change note for this round, and `DRYV_GAPS.md` for any new gap.

## Kenya seed plan (proposal only)

In order: institution classes and arms; institutions with establishment basis and citation; positions with seat rules taken from the Constitution (counts come from the text, with provision and citation); links; functions from the schedule that divides them; electoral terms and the next general election rule; statistics indicators and census observations; wording copy. Offer the owner each small set for approval separately.

## Acceptance checklist

- [ ] Regenerate from the approved contracts; the generation check passes and the generated diff contains only the approved tables and columns.
- [ ] Reset the single scratch database, apply the generated schema and confirm every new constraint, index and rule exists; drop any extra scratch databases.
- [ ] Update the design documents above and every link that points to them; add new Dryv gaps found to DRYV_GAPS.
- [ ] Write the Kenya seed plan as a design note and present each proposed file to the owner; add no seed file without recorded approval.
- [ ] Run `uv run mzizi-manifest check` (and `lock` only if required), then `bun run check`, reporting any pre-existing failure accurately.
- [ ] Run `task validate`, write a handoff in `.docs/handoffs/`, and archive finished tasks with `task archive`.
