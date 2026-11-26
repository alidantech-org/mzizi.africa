---
{id: TSK-6EF5ED4DC018,name: "Author the template schema for patterns, templates and effect lines",type: task,status: completed,priority: high,created_at: 2026-11-25T21:36:54.071Z,updated_at: 2026-11-25T23:13:11.967Z,order: 6144,depends_on: [TSK-49166C0AABCF],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T23:12:07.602Z},{from: in-progress,to: completed,at: 2026-11-25T23:13:11.967Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-6EF5ED4DC018/1795648327606-start,started_at: 2026-11-25T23:12:09.725Z,end_ref: refs/tracking/TSK-6EF5ED4DC018/1795648391971-end,ended_at: 2026-11-25T23:13:11.967Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Author the template schema: patterns, templates, effect lines, scopes and count kinds

## Goal
Create the schema that lets a pattern generate roots and their effects: a pattern is a named identity, a template is the recipe for one root kind, and each template lists the effects it produces. Count kinds (exact, minimum, maximum, range), scope kinds (fan out over a level, a fixed list, a single instance), name and value text templates per language and a closed list of transforms are all declared, so the generate function in the database can run them. Success is a compiled contract and generated SQL with the tables, checks and foreign keys, and `governance.patterns`, `templates` and `instances` removed.

## Context
Decisions 1 to 5, 11 to 14 in `.docs/decisions/DEC-DB-RETHINK-ROOTS-UNITS-SLOTS-20261125.md`; design and Kenyan examples in `.docs/design/data/TEMPLATES_AND_SLOTS.md` sections 3 to 9 and 13. Only roots keep the template reference, as a nullable `template_id` column on each root table; a template lists its effects in its own lines (the name "effect lines" avoids a clash with `legal.effects`). Patterns and templates are identity kinds so their names exist per language and legal effects can target them. Placeholders are structure only: never people, never invented names (DEC-PATTERNS-GENERATE-EXPECTED-DATA-20261119). No version fields (`.docs/rules/versioning.md`). Table names are one word and plural.

## Acceptance checklist
- [x] Add a `template` group (own namespace) with `Patterns`, `Templates`, `Lines` (effect lines), `Scopes`, `Texts` (name and value templates per language) and `Transforms` reference values; every table has a code and documented columns.
- [x] Model count kinds (exact, minimum, maximum, range) so the generate function creates slots only for exact and minimum counts.
- [x] Declare the closed transform list (slug, compact, upper, join, ancestor level) and the SQL functions that implement it, through Dryv.
- [x] Add a nullable `templateId` to each root table named in decision 4 and a rule that the template's product kind matches the table.
- [x] Remove `governance.patterns`, `templates` and `instances` and every reference to them; update the subject table list with `bun run tables:sync`.
- [x] Check the contract with `bun run dryv:check` and record the result under Progress.

## Progress

2026-11-26. Done. Schema `template`: patterns, templates (count kinds, scope, start year, repeat years, sequence, term hints, and `confidence` and `reason` stated once on the template), lines (effect lines), texts and items. Roots carry only the plain `template_id` (`_templates.ts`, with a `template-product` tag). `governance.patterns`, `templates` and `instances` are removed. Correction on 26 November: confidence and reason were first put on every root row; the owner corrected this and they now live on the template only.
