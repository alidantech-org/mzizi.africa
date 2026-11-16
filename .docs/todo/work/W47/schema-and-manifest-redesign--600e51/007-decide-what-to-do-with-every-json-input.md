---
{id: TSK-9631BBC16202,name: Decide what to do with every JSON input and define vocabularies,type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:55.096Z,updated_at: 2026-11-16T13:49:39.505Z,order: 7168,depends_on: [TSK-A9FDBDC9B96C,TSK-0C7E435CA201]}
---

# Decide what to do with every JSON input and define vocabularies

## Goal

Give each authored JSON file under `seed/` and `source/schema/` a decision (schema, convert to YAML or CSV, move to the database, or archive), and define `source/schema/vocabulary/` and `seed/vocabularies/`.

## Context

JSON appears as catalogues, governance and office-holder data, patterns, policy lists, the web vocabulary, fixtures and schemas. Only some have a schema, and the manifest registers them with free-text loaders. The web vocabulary (URL kinds, challenge markers, file signatures) and the name and office patterns are word lists that sources can use by code through the `uses` block. Vector settings are left out because the vector store is only a skeleton. This task belongs to the schema and manifest redesign group. The owner approved the sources layout on 16 November 2026: schemas live under `source/schema/` in `database/`, `seed/`, `sources/`, `mapping/`, `vocabulary/`, `engine/` and `extraction/`, and seed inputs live under `seed/` in `data/`, `sources/`, `mappings/`, `vocabularies/` and `_fixtures/`. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this task's design in a task comment. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: List every JSON file with its owner, its consumer and whether it has a schema.
- [ ] Design: Choose a decision for each file and give the reason.
- [ ] Design: Define the vocabulary schema and how a source references a vocabulary by code.
- [ ] Design: Define which fixtures stay under the test-only folder.
- [x] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Apply the approved decisions: add schemas, convert or move files.
- [ ] Build, only after approval: Update the manifest entries to match.
- [ ] Build, only after approval: Add a check that no registered JSON file lacks a schema or a consumer.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
## Progress

Partly built 16 November 2026: `source/schema/vocabulary/` holds `web.schema.json` and `web.yaml` (moved from `web/`, read by `mzizi-fetch`) and `terms.schema.json`. Decisions for the archived JSON inputs are still open.

## Comments

### 2026-11-16T14:28:09.861Z · PETER IRUNGU

Design approved by the owner on 16 November 2026 (chat reply to the redesign status). Seed layout kept as designed; exchange schema retired; web vocabulary moves into the seed tree with a real schema; system-managed columns are marked by Dryv's .system() and published as x-managed.

Web vocabulary moved 16 November 2026 to `seed/vocabularies/global/web/classification.yaml`, linked to its published schema `source/schema/vocabulary/web.schema.json` (now with an `$id`, generated from the typed model by `mzizi_fetch.web.vocabulary.schema_text`, with a drift test).
