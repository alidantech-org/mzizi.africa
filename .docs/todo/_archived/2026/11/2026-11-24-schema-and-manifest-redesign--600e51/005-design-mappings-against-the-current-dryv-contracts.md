---
{id: TSK-DA4793ED6FC2,name: Design mappings against the generated database schemas,type: task,status: archived,priority: medium,created_at: 2026-11-16T13:05:54.342Z,updated_at: 2026-11-24T19:24:26.771Z,order: 5120,depends_on: [TSK-A9FDBDC9B96C,TSK-0C7E435CA201],extra: {status_history: [{from: planned,to: archived,at: 2026-11-24T19:24:26.771Z}]},archived_at: 2026-11-24T19:25:21.724Z}
---

# Design mappings against the generated database schemas

## Goal

Define one mapping schema, with files under `seed/mappings/<scope>/<domain>/<name>.yml`, that turns extracted source fields into records for real tables and is verified against the generated table schemas.

## Context

The current mapping schema allows free target names, so mappings still point at tables such as `reference.jurisdictions` and `person.individuals`, and fields such as `url` where the table now uses `canonical_url`. About 60 old mappings live under `seed/countries/ke/mappings/` and belong to archived importers. A mapping may yield several records (for example an individual, a name and a holder), link them with `ref`, look up existing rows with `lookup`, and carry a natural-language `describe` that an AI can use to propose a mapping. A proposal is never accepted without the validator. This task belongs to the schema and manifest redesign group. The owner approved the sources layout on 16 November 2026: schemas live under `source/schema/` in `database/`, `seed/`, `sources/`, `mapping/`, `vocabulary/`, `engine/` and `extraction/`, and seed inputs live under `seed/` in `data/`, `sources/`, `mappings/`, `vocabularies/` and `_fixtures/`. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this task's design in a task comment. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Specify the mapping fields: module, describe, yields (table, fields), `ref` between yields, `lookup` by a unique column, and provenance.
- [ ] Design: Specify the checks against `database/<group>.schema.json`: table and columns exist, types are compatible, required columns are covered, references and lookups resolve.
- [ ] Design: Classify every existing mapping as migrate, archive or delete, with a reason.
- [ ] Design: Decide how AI-proposed mappings are marked and reviewed.
- [x] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Add the mapping schema and migrate the mappings that are kept.
- [ ] Build, only after approval: Archive the rest with a note, outside the active seed tree.
- [ ] Build, only after approval: Add tests that fail when a mapping names a missing table, column, reference or lookup.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
## Progress

Built 16 November 2026: `source/schema/mapping/mapping.schema.json` with `inputs`, `yields` (table, key, fields), `ref`, `lookup`, `describe`, provenance and expectations. Table and column checks against `database/` belong to the validator in task 009. The old mappings are in the archived seed.

## Comments

### 2026-11-16T14:28:08.830Z · PETER IRUNGU

Design approved by the owner on 16 November 2026 (chat reply to the redesign status). Seed layout kept as designed; exchange schema retired; web vocabulary moves into the seed tree with a real schema; system-managed columns are marked by Dryv's .system() and published as x-managed.

Extraction expectations merged into mappings on 16 November 2026 at the owner's request: a mapping's `inputs` may be objects with `name`, `aliases`, `type`, `required` and `units`, and `table.header_rows` describes table sources (example `source/schema/engine/_example/mapping-county-allocations.yml`). The extraction kind, the `extraction` system area, `uses.extraction`, the `seed/extraction/` folder and `engine/extraction.schema.json` are retired; the extraction package keeps its typed `TableSchema` for ad-hoc `--table-schema` runs.
