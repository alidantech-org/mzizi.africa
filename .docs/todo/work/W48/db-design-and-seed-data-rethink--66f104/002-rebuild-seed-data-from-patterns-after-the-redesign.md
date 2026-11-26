---
{id: TSK-055910A10F29,name: Rebuild seed data from patterns after the redesign,type: task,status: planned,priority: medium,created_at: 2026-11-25T15:56:59.276Z,updated_at: 2026-11-25T21:37:25.241Z,order: 2048,depends_on: [TSK-1D3F71DC9742]}
---

# Rebuild seed data from patterns after the redesign

## Goal

After the owner has approved the geography, reference and governance design, rebuild the governance seed data so every institution, position and office is produced by a pattern and template, and verify the result in the database. This task stays planned until the design document task is complete.

## Context

The current seed lives only in the git-ignored `.dev/seed/` and was loaded into the single `mzizix` database. It created positions and offices directly, which hid the inconsistency between national and county posts. The database is reset with `bun run db reset --yes`, seed is loaded, then `bun run db refresh` runs, as described in `.docs/rules/database.md`. Seed files never enter Git, and existing S3 artifacts are not deleted during local database work.

## Acceptance checklist

- [ ] Patterns and templates for the approved design are written as seed inputs in `.dev/seed/`, with one pattern per country and fan-out over the correct level.
- [ ] The Dryv contracts are changed and regenerated for the approved design, then the database is reset and the seed loaded.
- [ ] Counts of generated positions, offices and instances are checked against the design, and rows that violate pattern rules are rejected by the database.
- [ ] Gaps, such as places missing for a level, are listed by a query rather than hidden, and `bun run check` and `task validate` are run and reported.

## Comments

### 2026-11-25T19:41:28.599Z · PETER IRUNGU

Rebuild order decided 2026-11-25: units first, then institutions/premises/offices, then election cycles/terms/contests. Placeholders are structure only; evidence rows are never generated. See DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125.

## Progress

2026-11-26: the owner approved the whole design for implementation. This task is now the umbrella for the work, which is split into tasks 005 to 014 in this wave: contracts (005 to 009), database objects through Dryv (010), regenerate and reset (011), seeds and engine generation (012), tests (013) and the owner audit (014). The checklist above is satisfied when tasks 012 and 013 are complete.
