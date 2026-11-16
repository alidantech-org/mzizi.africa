---
{id: TSK-9A8E9A0A16B1,name: Design the root seed manifest and registry,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:52.924Z,updated_at: 2026-11-16T13:05:52.924Z,order: 1024}
---

# Design the root seed manifest and registry

## Goal

Decide what `seed/manifest.yaml` and its generated lock are for, field by field, so that registering a file can never be mistaken for loading data into PostgreSQL, and so that a seed file's identity comes from where it lives.

## Context

The manifest has about 59 entries. Only 9 target the current database; 45 are marked legacy, 3 evidence only and 2 test only. The `loader` and `target` fields are free text, and the validator checks paths, hashes, dependencies and duplicate key values but not columns. A CSV under `seed/data/<scope>/<domain>/<table>.csv` already names its table by its path, so the manifest does not need a `table:` field. A source's `code` should equal `source.sources.code` in the database. This task belongs to the schema and manifest redesign group. The owner approved the sources layout on 16 November 2026: schemas live under `source/schema/` in `database/`, `seed/`, `sources/`, `mapping/`, `vocabulary/`, `engine/` and `extraction/`, and seed inputs live under `seed/` in `data/`, `sources/`, `mappings/`, `vocabularies/` and `_fixtures/`. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this task's design in a task comment. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Write a field table for the manifest: keep, remove or add, with the reason, including dropping `schema_version` under the versioning rule.
- [ ] Design: Define how entries cover the roots `data/`, `sources/`, `mappings/` and `vocabularies/`, and which fields they keep (id, path or glob, dependencies, access, retention).
- [ ] Design: Define the states a file passes through: registered, validated, imported, and who runs each step.
- [ ] Design: List every current entry and say whether it stays, moves, is archived or is deleted, with the archive location.
- [ ] Design: Decide how a source's `code` is checked against `source.sources.code`, as a read-only report.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Update `source/schema/seed/manifest.schema.json` and `seed/manifest.yaml` to the approved design.
- [ ] Build, only after approval: Keep the lock generated and add a check that it matches the manifest.
- [ ] Build, only after approval: Add tests for the new fields and for rejecting registered files that were never validated.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.

## Progress

16 November 2026: the owner decided that versions may live inside a file as an approved field, but never in folder or file names for now, and that agents must never invent a version without being asked. The rule is `.docs/rules/versioning.md`. Consequence for this design: the root manifest drops `schema_version` unless the owner approves a version field for it, and all later designs flatten their version folders.

Built 16 November 2026 at the owner's request: `source/schema/seed/manifest.schema.json` drops `schema_version`, `loader`, `target`, `database_target_state`, `key_columns`, `consumers` and `loader_status`; entries now only register files (id, path or glob, depends_on, versioning, pin, origin, notes). The table of a CSV comes from its path. The seed is empty, so there are no entries to migrate. The old validator code still expects the removed fields and is replaced in task 009.
