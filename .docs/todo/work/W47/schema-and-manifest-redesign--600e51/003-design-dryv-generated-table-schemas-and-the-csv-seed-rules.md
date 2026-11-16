---
{id: TSK-A9FDBDC9B96C,name: Design Dryv-generated table schemas and the CSV seed rules,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:53.615Z,updated_at: 2026-11-16T13:06:00.255Z,order: 3072,depends_on: [TSK-9A8E9A0A16B1]}
---

# Design Dryv-generated table schemas and the CSV seed rules

## Goal

Generate one table schema file per PostgreSQL schema from Dryv, and define exactly how a seed CSV is validated against it.

## Context

Today `targets.json` is a hand-kept catalogue of about 120 tables from an older model, while the SQL has 94. The five CSVs under `seed/global/auth/` were written for that model. The Dryv catalog pack added for the API and engine shows how a project pack can emit JSON from the contracts. This task is part of the schema and manifest redesign group. Nothing in it is built until the owner has approved the design in a task comment, and the group goal and plan describe how the pieces fit together. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Specify the generated file: one per schema, listing columns, types, nullability, primary key, foreign keys and system-managed columns.
- [ ] Design: Specify the CSV rules: one table per file, no unknown columns, typed values, stable ids, foreign keys resolved within the file set or the database.
- [ ] Design: Decide how automatic columns such as created_at, updated_at and version are handled.
- [ ] Design: Decide what happens to the five existing auth CSVs: migrate to current tables or archive.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Add a Dryv pack that generates the table schemas and wire it into `bun run catalog`.
- [ ] Build, only after approval: Remove `targets.json` and update every reference to it.
- [ ] Build, only after approval: Add a verify step that fails when the generated table schemas are out of date.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
