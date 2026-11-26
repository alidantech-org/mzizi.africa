---
{id: TSK-21AAF777460E,name: Convert statuses to enums and put enum labels in product keys,type: task,status: completed,priority: medium,created_at: 2026-11-25T21:36:55.581Z,updated_at: 2026-11-26T00:16:41.908Z,order: 9216,depends_on: [TSK-E5022487A4A3],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-26T00:16:39.120Z},{from: in-progress,to: completed,at: 2026-11-26T00:16:41.908Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-21AAF777460E/1795652199125-start,started_at: 2026-11-26T00:16:40.418Z,end_ref: refs/tracking/TSK-21AAF777460E/1795652201910-end,ended_at: 2026-11-26T00:16:41.908Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Convert statuses to enums with a five-test rule, and put enum labels in product keys

## Goal
Apply the owner's enum rule across the contracts so stable statuses and structural kinds become enums for fast, safe queries, while country-specific and growing sets stay vocabulary terms. Enum values show in the interface through labels held in the product schema. Success is every converted column documented, the overlapping enums merged, and a check that fails the build when an enum value has no product key.

## Context
The rule (decision 18): an enum only if every country uses the same values, code branches on the value, the set has about a dozen values or fewer and changes less than yearly, it is a status or structural kind, and editors never add values. Everything else is a `term`. Findings and the list of 25 core terms plus those in other schemas are in section 3 of `.docs/design/data/SCHEMA_AUDIT_SLOTS_AND_ENUMS.md`. Status enums gain `expected` or `candidate` where slots need them. Postgres enums can gain but not lose values, so closed sets only. Labels live in `product.keys` and `product.messages` (decision 19). Naming: `enum.<enum name>.<value>` keys unless a better convention already exists in `product.ts`.

## Acceptance checklist
- [x] Convert each enum candidate listed in the audit, and convert `ProvisionKind` and `PriceKind` to terms.
- [x] Merge the overlapping enums (`FormStatus` and `HansardStatus`, `FigureStatus` and `FigureBasis`, `NameKind` and `LabelKind`) and extend `Frequency`.
- [x] Add `expected` or `candidate` status values where slots need them.
- [x] Add a unique key on `product.lang` and a script or test that lists enum values without a product key.
- [x] Remove the `gov.pattern.kind` term and any scheme that no longer has a column.
- [x] Run `bun run dryv:check` and record the result under Progress.

## Progress

2026-11-26. Not started. Only the enums of the new schemas (template product, scope, count kind, text purpose, geometry status) exist. The conversion of the 25 core terms and the other schemas, the merges of overlapping enums, `expected` status values and the product label keys are still to do. They touch many seeded columns and the engine, so they were left for the owner to confirm the order.

### 2026-11-26, done

59 term columns converted to enums in `dryv/contracts/schemas/_enums.ts` (53 enums), by a script that renames the column without the `Term` suffix and rewrites its indexes and rules. Seeds convert term ids to the enum value (`patterns.py`, `convert_enums`). The pack SQL and the engine's translation SQL use the new columns. 237 interface labels are in `product.keys` and `product.messages`; a test checks every value has one. Left as terms: premises kind (owner), `fil.folder.role` (reverted: the filesystem registry uses the role as an id), position exposure and relationship status (no value list known). Overlapping enums: `FormStatus` and `HansardStatus` merged; `FigureStatus` and `FigureBasis` and `NameKind` and `LabelKind` kept apart.
