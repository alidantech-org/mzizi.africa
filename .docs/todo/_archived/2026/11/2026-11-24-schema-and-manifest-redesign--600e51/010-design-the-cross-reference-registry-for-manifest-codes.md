---
{id: TSK-6033104AA031,name: Design the cross-reference registry for manifest codes,type: task,status: archived,priority: medium,created_at: 2026-11-16T13:49:37.355Z,updated_at: 2026-11-24T19:24:58.098Z,order: 10240,depends_on: [TSK-9A8E9A0A16B1],extra: {status_history: [{from: planned,to: completed,at: 2026-11-16T14:38:09.412Z},{from: completed,to: archived,at: 2026-11-24T19:24:58.098Z}]},archived_at: 2026-11-24T19:25:21.724Z}
---

# Design the cross-reference registry for manifest codes

## Goal

Define how one manifest refers to another by code, so a website or API source can use shared mappings, vocabularies and extraction expectations, and the validator can prove every reference points at something real.

## Context

The approved layout lets a source declare a `uses` block listing mapping, vocabulary and extraction codes instead of copying them. That needs one registry built by scanning the seed tree, because a reference is only useful if an unknown, duplicate or circular code is caught before a crawler or loader runs. The registry is new validator work and the riskiest part of the manifest rewrite, so it is designed and tested before the schemas that depend on it. The owner approved the sources layout on 16 November 2026. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this design in a task comment. Related: `source/schema/README.md`, `seed/README.md`, `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [x] Design: Define the code format (dotted, lowercase) and where a manifest declares its code, and state that a source's code equals `source.sources.code`.
- [x] Design: Define visibility: a manifest may use items in its own scope or in `global`, never in another country.
- [x] Design: Define the errors: unknown code, duplicate code, cycle and out-of-scope use, each naming the file, the field and the code.
- [x] Design: Define the registry's public surface (build, resolve, list users of a code) so the other validators can share it.
- [x] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [x] Build, only after approval: Implement the registry as one small typed module in the manifest package.
- [x] Build, only after approval: Add tests using deliberately broken seed trees for each error.
- [x] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.

## Comments

### 2026-11-16T14:28:11.436Z · PETER IRUNGU

Design approved by the owner on 16 November 2026 (chat reply to the redesign status). Seed layout kept as designed; exchange schema retired; web vocabulary moves into the seed tree with a real schema; system-managed columns are marked by Dryv's .system() and published as x-managed.

## Progress

Built 16 November 2026 in `source/packages/manifest/src/mzizi_manifest/features/registry/`: `registry.py` (kinds, scope rule, checks, cycle detection) and `scan.py` (classifies files by their keys: source, mapping, vocabulary, extraction; a module is checked in the scope of the one source in the nearest folder above it). `uv run mzizi-manifest refs [folder]` reports problems and exits non-zero. 16 tests in `test_registry.py` cover the valid tree, unknown code, duplicate, cycle, cross-country and global-to-country use, wrong kind, missing scope, module without an owning source, unreadable files, and the example tree, which resolves 7 codes with no problems. The extraction schema gained an optional `code`, and the example codes now start with their scope.

Code design agreed 16 November 2026 (`.docs/rules/codes.md`): `<scope>.<area>.<table-or-name>.<name>`, area is a database group (then a real table) or a system area, a mapping is named after the first table it writes, a source is `<scope>.source.<websites|apis>.<name>`, and a file's folder path mirrors its code. The registry now checks all of it against the generated database schemas; the web classification vocabulary has the code `global.web.classification` and lives at `seed/vocabularies/global/web/classification.yaml`.

Codes now exist on every schema for a coded manifest (source, mapping, terms vocabulary, web vocabulary, extraction table, job spec) and on the generated database schemas (`code` per group file, `x-code` per table). Job specs are a registry kind: `<scope>.engine.jobs.<name>` under `jobs/`.

Codes redesigned 16 November 2026 at the owner's direction (`.docs/rules/codes.md`): spaces `pg`, `sys` and `mg` (reserved), fixed schema and table short names in `source/schema/seed/codes.json`, dots for narrower-than, dashes inside one name, no underscores. Registry kinds: source (`pg.src.<wbs|api>.<scope>.<name>`), mapping (`sys.map.<schema>.<table>.<scope>.<name>`), term list (`sys.trm...`), job (`sys.eng.job.<scope>.<name>`), engine data (`sys.eng.<path>`); the path mirrors the code without its first two segments.
