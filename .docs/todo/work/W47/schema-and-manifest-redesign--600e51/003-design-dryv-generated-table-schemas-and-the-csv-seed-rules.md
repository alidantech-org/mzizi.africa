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

## Progress

16 November 2026: the generation half was built early at the owner's request, so the owner can review real output. The Dryv pack `dryv/packs/table-schemas` (activated on the `pgsql` application as `table-schemas`) writes one `source/schema/database/<group>.schema.json` per PostgreSQL schema: 12 files, 94 tables, 288 foreign keys, all of which resolve to a generated table. Each column carries `name`, `type` (uuid, text, boolean, integer, decimal, number, date, time, interval, timestamp), `required`, `nullable`, `primaryKey`, and where present `maxLength`, `precision`, `scale`, `enum` and `references`. A table carries `id`, `table`, `primaryKey` and `uniqueKeys`. `bun run catalog` regenerates the files and `--check` fails when they drift.

Findings for the design review:

- Dryv templates cannot see tables outside their own group, so a foreign key names its target by contract id (`references.tableId`) and the validator resolves it across the loaded files.
- Building lists of contract objects inside a template (`namespace` appends) crashes the Jinja template server; loop with a first-item flag instead.
- The contracts declare no literal column defaults, so `default` never appears. System-managed columns (`created_at`, `updated_at`, `version`) are not yet marked, which is the open "automatic columns" decision above.
- The CSV rules and the fate of the five auth CSVs are still unapproved designs; the manifest package does not read these files yet.
