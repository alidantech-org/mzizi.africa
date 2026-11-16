---
{id: TSK-0F3E947CAD73,name: Design the job specification and placements schema,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:54.723Z,updated_at: 2026-11-16T13:06:01.075Z,order: 6144,depends_on: [TSK-0C7E435CA201]}
---

# Design the job specification and placements schema

## Goal

Replace the old pipeline manifest with a schema generated from the engine's typed job spec, including the placements the release step uses.

## Context

`source/schema/pipeline/v1/manifest.schema.json` describes an earlier pipeline. The engine now parses a typed version-1 job spec with stages, sources and an authority reference. The workers design says the worker never publishes and that the release step promotes files, so the spec must declare placements. This task is part of the schema and manifest redesign group. Nothing in it is built until the owner has approved the design in a task comment, and the group goal and plan describe how the pieces fit together. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Specify the job spec fields, including the source authority reference and the placements block.
- [ ] Design: Decide how the JSON schema is generated from the engine models so the two cannot drift.
- [ ] Design: Say how `seed/system/pipelines/pdf-extraction.v1.json` is migrated or retired.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Generate the job spec schema from the typed models and add a drift check.
- [ ] Build, only after approval: Remove the old pipeline schema and update its references.
- [ ] Build, only after approval: Add tests that valid specs pass and malformed placements fail.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
