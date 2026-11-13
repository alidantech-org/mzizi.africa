---
{id: TSK-5E7AE1C69541,name: Advance Reference and Geography classification architecture,type: task,status: in-progress,priority: medium,created_at: 2026-11-12T12:35:35.029Z,updated_at: 2026-11-12T12:35:41.808Z,order: 7168,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T12:35:41.808Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-5E7AE1C69541/1794486941817-start,started_at: 2026-11-12T12:35:42.505Z}]}}}
---

# Advance Reference and Geography classification architecture

## Goal

Develop the approved Main Reference and Geography foundation into a reusable African geographic classification architecture. Preserve the nine approved tables in each schema, the single `geography.features` identity model, modern country identities in Reference, historical and cross-border geographic reality, and the existing `vocabulary` compatibility export. Produce a precise audit and gap matrix, reconcile the owning design documents with the current contracts and database packs, author only changes covered by existing approval, and keep proposed extra structures out of active generation until separately approved.

## Context

The user supplied the Advanced Reference & Geography Schema Development handoff on 12 November 2026. It authorizes coordinated design and contract development, but explicitly distinguishes already-approved inventories from proposed detailed Reference extensions and additional tables. Existing `reference.schemes` and `reference.values` must be assessed before adding classification structures. Feature type/class relationships may be multi-valued, country-specific structures cannot assume Kenya's hierarchy, scheme membership must be enforced by the database rather than an API-only check, and typed real Geography-to-Reference and Reference-to-Geography relations must be validated through the actual Dryv/SQL pipeline. `reference.pattern_bindings.unit_id` should target the canonical `geography.units.feature_id` only after scope compatibility is enforceable. Do not modify unrelated schemas, generate/apply migrations, alter live data, deploy or create workflows. Read `.docs/rules/schema-contract-authoring.md`, `.docs/rules/code-columns.md`, `.docs/rules/branching-and-task-usage.md`, `.docs/rules/task-writing.md`, `.docs/design/data/DATABASE_DESIGN.md`, the current phase-01 Reference and Geography documents, both schema contracts, database composition/persistence assignments and Rust SQL/model packs before implementation.

## Acceptance checklist

- [x] Audit current contracts, docs, groups/app composition, persistence mapping and Dryv pack capability; record approved vs authored vs proposed vs generation-ready status.
- [x] Produce a documented Reference classification catalogue for feature classes/types and justified relationship, geometry-role, change, name, identifier, dataset-subject and dataset-representation schemes; make clear which seed values are examples versus loaded data.
- [x] Decide whether `reference.value_relations` or an alternative is necessary for multi-parent, cross-scheme taxonomy; justify the minimum model and keep unapproved additions outside active generation.
- [x] Reconcile `schemes` and `values` fields, lifecycle, labels, scope/applicability, supersession, ordering and steward semantics; record field dispositions and unresolved choices.
- [ ] Define a scheme-aware integrity strategy and verify composite keys/FKs, relation direction, uniqueness, referential actions and invalid cross-scheme rejection in the actual Dryv/Postgres pack path; do not claim unsupported enforcement.
- [x] Complete Geography classification fields and real Reference FKs without duplicating broad classifications; preserve one canonical identity, multi-system typed relationships, history, dataset metadata and Source/Filesystem ownership.
- [x] Connect `pattern_bindings.unit_id` to `geography.units.feature_id` and define country/unit compatibility only if the invariant is enforceable; otherwise record the exact blocker and leave the relation inactive.
- [x] Resolve feature origin and country-specific scheme/applicability questions with alternatives and minimal justified changes; do not add `feature_origin`, Geography tables or Reference tables without evidence and explicit proposed status.
- [x] Reconcile `.docs/design/data/DATABASE_DESIGN.md` cross-schema claims with current repository rules and the one-`mzizi` database boundary; update current Reference/Geography design docs and mark stale examples clearly.
- [x] Run typecheck, formatter, contract doctor/compile, generated IR/SQL capability checks, `task validate`, naming/integrity audit and targeted valid/invalid classification examples where supported; report exact failures and blockers.
- [x] Keep unapproved proposals excluded from the active application; do not generate/apply migrations, modify live data, deploy, change unrelated schemas or workflows.

## Comments

### 2026-11-12T12:39:58.237Z · PETER IRUNGU

Audit findings: current SQL pack template is an explicit non-production skeleton. It hardcodes id/created_at/updated_at/version, drops related fields, maps most number fields to bigint, and emits no foreign keys, unique/index/check constraints or PostGIS types. Authoring supports single-field relations, composite primary keys, and ordinary/unique indexes, but no composite FK declaration or check/exclusion constraint. The database app currently composes Reference but not Geography; activating Geography before pack support would be unsafe. The old DATABASE_DESIGN.md prohibition on cross-schema FKs conflicts with current same-database `mzizi` assignments and repository schema-contract rules.

### 2026-11-12T12:58:07.534Z · PETER IRUNGU

Progress: documented the accepted Reference inventory and Geography table inventory separately from unapproved detailed fields and the proposed value_relations extension. Added the classification catalogue, scheme/value field dispositions, country-specific scope and feature-origin rationale, Geography field alignment, historical/cross-border rules, Reference-to-Legal open question, and the Rust SQL-pack capability matrix. Updated stale design/status claims in DATABASE_DESIGN, DATABASE_FOUNDATION, the schema catalogue/checkbook/authoring plan, the connected foundation guide, and old Geography model/API docs. Validation: root Bun dryv typecheck passed; contracts audit passed (588 schemas, 230 operations); active database doctor/compile passed; combined Reference + proposed Reference + Geography review doctor/compile passed; task validate passed; Biome format/check passed with the forward-reference suppression. Invalid cross-scheme DB writes remain untestable because current authoring and SQL pack lack composite FK/scheme constraints and SQL generation is a skeleton. Geography-to-pattern-binding FK remains inactive because Geography is not composed and country/unit compatibility is unenforceable. No migration or live DB actions were run.

### 2026-11-13T05:53:55.847Z · PETER IRUNGU

Follow-up (13 Nov 2026): the owner narrowed this pass to dryv/contracts/schemas/mzizi/reference.ts and requested standalone dryv.schema declarations with registration blocks at the file bottom. The schema meanings and compatibility ref exports are preserved; other Mzizi schema files were not changed. Active database app compile passed. The broader contracts typecheck still reports missing archived imports in contracts/apps/main/index.ts.
