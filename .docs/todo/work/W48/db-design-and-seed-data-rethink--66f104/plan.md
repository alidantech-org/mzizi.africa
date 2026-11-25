---
{id: GRP-87642866F104,name: DB design and seed data rethink,type: documentation,extra: {created_at: 2026-11-25T15:56:53.475Z}}
---

# Plan

## Approach

Work in discussion order, one design document per topic under `.docs/design/data/`. Each document records what exists today in the Dryv contracts and the live `mzizix` database, what the owner decided, and what stays open. No contract, seed or migration is changed until the owner approves the document for that topic.

## Milestones

1. Topic one: geography, reference, countries and governance in a single document, covering how a country owns hierarchies, how hierarchies own levels, how levels find real places, how templates fan out over levels, and how legal basis reaches governance only through patterns, templates and legal effects.
2. Owner decisions recorded in `.docs/decisions/` for each choice that changes the schema.
3. Contract changes in `dryv/contracts`, regeneration, and a database reset using `bun run db reset --yes`.
4. Seed data rebuilt in the git-ignored `.dev/seed/` from patterns, then loaded and checked with database constraints and triggers.

## Risks

- Redesigning governance touches legal, geography, election and politics links, so every inbound foreign key must be listed before a table is changed.
- Fanning out over levels needs trustworthy place units; incomplete geography produces missing offices, so gaps must be visible, not silent.
- Dryv may not yet express triggers or cross-table rules; gaps are recorded in `DRYV_GAPS.md` rather than worked around in application code.
