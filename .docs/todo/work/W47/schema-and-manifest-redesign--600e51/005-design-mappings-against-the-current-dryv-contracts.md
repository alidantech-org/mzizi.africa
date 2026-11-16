---
{id: TSK-DA4793ED6FC2,name: Design mappings against the current Dryv contracts,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:54.342Z,updated_at: 2026-11-16T13:06:00.806Z,order: 5120,depends_on: [TSK-A9FDBDC9B96C,TSK-0C7E435CA201]}
---

# Design mappings against the current Dryv contracts

## Goal

Define one mapping schema that turns extracted source fields into candidate records for tables that actually exist, and decide what to do with the roughly 60 old mapping files.

## Context

The mapping schema allows free target names, so mappings still point at tables such as `reference.jurisdictions` and `person.individuals` and fields such as `url` where the table now uses `canonical_url`. Most old mappings live under `seed/countries/ke/mappings/` and belong to archived importers. This task is part of the schema and manifest redesign group. Nothing in it is built until the owner has approved the design in a task comment, and the group goal and plan describe how the pieces fit together. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Specify the mapping fields, typed references (by code, by id) and provenance rules.
- [ ] Design: Specify how a target and its fields are validated against the generated table schemas.
- [ ] Design: Classify every existing mapping as migrate, archive or delete, with a reason.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Update the mapping schema and migrate the mappings that are kept.
- [ ] Build, only after approval: Archive the rest with a note, outside the active seed tree.
- [ ] Build, only after approval: Add tests that fail when a mapping names a missing table or field.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
