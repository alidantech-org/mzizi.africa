---
{id: TSK-A9FDBDC9B96C,name: Design Dryv-generated table schemas and the CSV seed rules,type: task,status: archived,priority: medium,created_at: 2026-11-16T13:05:53.615Z,updated_at: 2026-11-24T19:24:14.521Z,order: 3072,depends_on: [TSK-9A8E9A0A16B1],extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:14.521Z}]},archived_at: 2026-11-24T19:25:21.724Z}
---

# Design Dryv-generated table schemas and the CSV seed rules

## Goal

Define how a seed CSV is validated against the Dryv-generated group schemas in `source/schema/database/`, with the table taken from the file's path.

## Context

Dryv now generates one `<group>.schema.json` per group (12 files, 94 tables, 288 foreign keys, each foreign key naming its target by `tableId`). A CSV at `seed/data/<scope>/<domain>/<table>.csv` is the rows of `<domain>.<table>`, so one file means one real table. The five CSVs under `seed/global/auth/` were written for an older model and target tables that no longer exist. Automatic columns such as `created_at`, `updated_at` and `version` are not marked as system-managed yet. This task belongs to the schema and manifest redesign group. The owner approved the sources layout on 16 November 2026: schemas live under `source/schema/` in `database/`, `seed/`, `sources/`, `mapping/`, `vocabulary/`, `engine/` and `extraction/`, and seed inputs live under `seed/` in `data/`, `sources/`, `mappings/`, `vocabularies/` and `_fixtures/`. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this task's design in a task comment. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Specify the CSV rules: path gives the table, no unknown columns, typed values, stable ids, enum values, foreign keys resolved within the file set or the database, and order by dependency.
- [ ] Design: Decide how automatic columns are handled and how the generated schema marks them.
- [ ] Design: Decide what happens to the five existing auth CSVs: migrate to current tables or archive.
- [ ] Design: Specify the validation report format produced before any database write.
- [x] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Keep the Dryv pack output current and add a verify step that fails when the generated schemas drift.
- [ ] Build, only after approval: Remove `targets.json` and update every reference to it.
- [ ] Build, only after approval: Add tests with valid and deliberately broken CSV files.
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

## Comments

### 2026-11-16T14:28:07.786Z · PETER IRUNGU

Design approved by the owner on 16 November 2026 (chat reply to the redesign status). Seed layout kept as designed; exchange schema retired; web vocabulary moves into the seed tree with a real schema; system-managed columns are marked by Dryv's .system() and published as x-managed.

Automatic columns resolved 16 November 2026: the contracts mark `version`, `created_at`, `updated_at` and `deleted_at` with Dryv's `.system()` (dryv/contracts/schemas/_base.ts), and the generated schemas publish them as `x-managed: true`. A seed author supplies only the columns listed in `required`; managed columns are optional and, if present, must still be valid. The generated `database/<group>.schema.json` files are now real JSON Schemas (`$id`, one row schema per table under `$defs`, extension keys `x-table`, `x-id`, `x-primaryKey`, `x-uniqueKeys`, `x-type`, `x-managed`, `x-references`) read through `mzizi_manifest.features.database.tables`.

Built 16 November 2026 with the owner's approval: seed rows are identified by `code`, link by code (`scheme_code`) and never carry ids or system fields. The generated schemas now record each column's `x-role`, each foreign key's seed alias (`x-link`), the natural key and the seed shape (`x-seed`). The CSV validator is `mzizi_manifest.features.data.check` (`uv run mzizi-manifest data [folder]`); ids come from `features.seeds.ids.stable_id`. The country table gained identity, phone, continent, subregion, currency, recognition and designation columns, all optional links so no load order or cycle problem arises (the reference group has no cycle; the only cycle in the database is `filesystem.files` and `file_versions`). Open: how a link is required to point at a value of one scheme (the Dryv template cannot read field tags), and how the database release stream gains `0002` (`db assemble` supports the first release only).


Seed codes redesigned 16 November 2026: a seed CSV's `code` and link cells hold the identity path alone (`ke`, `geo.continent.africa`); schemes are `<schema short>.<concept>...`, members extend their scheme by one name; the stored code is `<schema short>.<table short>.<path>`. The 205-country dataset (193 UN members, 2 observers, 6 partially recognized, 2 unrecognized, 2 free association) was added in the new form.
