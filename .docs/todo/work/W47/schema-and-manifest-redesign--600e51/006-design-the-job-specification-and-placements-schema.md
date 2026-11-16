---
{id: TSK-0F3E947CAD73,name: "Design the engine schemas: job spec and placements",type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:54.723Z,updated_at: 2026-11-16T13:49:39.225Z,order: 6144,depends_on: [TSK-0C7E435CA201]}
---

# Design the engine schemas: job spec and placements

## Goal

Define the `engine` schemas in `source/schema/engine/`: the job spec with its source authority reference and placements, generated from the engine's typed models, replacing the old pipeline manifest.

## Context

`source/schema/pipeline/v1/manifest.schema.json` describes an earlier pipeline and no code reads it. The engine now parses a typed job spec with stages, sources and an authority reference, and keeps its `version` field because specs are stored and hashed in the run ledger. The workers design says the worker never publishes and that the release step promotes files, so the spec must declare placements. The authority reference names a source code. This task belongs to the schema and manifest redesign group. The owner approved the sources layout on 16 November 2026: schemas live under `source/schema/` in `database/`, `seed/`, `sources/`, `mapping/`, `vocabulary/`, `engine/` and `extraction/`, and seed inputs live under `seed/` in `data/`, `sources/`, `mappings/`, `vocabularies/` and `_fixtures/`. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this task's design in a task comment. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Specify the job spec fields, including the authority reference (a source code) and the placements block.
- [ ] Design: Decide how the JSON schema is generated from the engine models so the two cannot drift.
- [ ] Design: Say how `seed/system/pipelines/pdf-extraction.v1.json` is migrated or retired, and whether a run-bundle schema is needed now.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Generate `source/schema/engine/job.schema.json` from the typed models and add a drift check.
- [ ] Build, only after approval: Remove the old pipeline schema and update its references.
- [ ] Build, only after approval: Add tests that valid specs pass and malformed placements fail.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
## Progress

Built 16 November 2026: `source/schema/engine/job.schema.json` generated from the typed job model by `runtime/runs/schema.py`, with a drift test. The old pipeline schema is removed. A run-bundle schema is not needed yet.
