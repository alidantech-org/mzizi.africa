---
{id: TSK-D6949284672E,name: Model remaining domain schemas and their dependencies,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:28.194Z,updated_at: 2026-11-08T06:46:28.194Z,depends_on: [TSK-7E5E18758D9C],order: 4096}
---

# 04 — Model remaining domain schemas and their dependencies

## Goal

Deliver a precise, understandable and reviewable design for this milestone in the improvements rewrite, preserving useful existing functionality and establishing reliable inputs for the next milestone.

## Context

Depends on reviewed foundation designs from tasks 01-03. Review the remaining domains one by one using their existing detailed documents, including internal workflow tables. Establish exact destination data before designing collectors. Keep person, organization and governance meanings distinct; preserve political/electoral separation. Evaluate debt/finance, civic/governance and calendar/activity changes from actual usage. Do not force a predetermined schema count. Define domain inputs/outputs for patterns, evidence, freshness and application queries, without inventing a pipeline topology. This is one coordinated milestone with per-domain checklists refined in this task as review proceeds.

Inspect current Dryv contracts, generated entities, migration history, runtime readers/writers and existing tests before proposing changes. Distinguish repository evidence from a verified live database audit. For every table specify purpose, columns, SQL types, nullability, defaults, primary keys, foreign keys including cross-schema relationships, unique/check constraints, indexes, deletion behavior and comments. Use KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD decisions with a fresh initialization/disposition mapping for `mzizi_new`; no legacy database ID/data compatibility is required, while existing S3 evidence is protected. Justify temporal/version fields individually. This task is planned design work: creation does not authorize migrations, application changes, deployment or execution of subsequent tasks. Record user design decisions before proposing a coordinated implementation. Work on develop only and do not modify .github. Tasks remain planned until explicitly started.

## Source documentation

- [schema-redesign/README.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/README.md)
- [schema-redesign/legal.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/legal.md)
- [schema-redesign/person.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/person.md)
- [schema-redesign/organization.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/organization.md)
- [schema-redesign/governance.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/governance.md)
- [schema-redesign/political.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/political.md)
- [schema-redesign/electoral.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/electoral.md)
- [schema-redesign/finance.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/finance.md)
- [schema-redesign/procurement.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/procurement.md)
- [schema-redesign/statistical.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/statistical.md)
- [schema-redesign/activity.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/activity.md)
- [schema-redesign/participation.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/participation.md)
- [schema-redesign/audit.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/audit.md)
- [schema-redesign/engine.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/engine.md)

## Acceptance checklist

- [ ] Inventory and account for every remaining table, including staging, audit and engine objects; record disposition and dependency order.
- [ ] Produce exact per-domain columns, keys, cross-schema relationships, comments and migration mapping.
- [ ] Define eligible acquisition classes, actual row lineage, pattern inputs/outputs and semantic temporal/freshness requirements.
- [ ] Validate a county-governance example and representative finance/election/statistical queries without treating generated structure as observed facts.
- [ ] Record per-domain user decisions, remaining conflicts and a compatible migration/consumer update sequence before source/pipeline design begins.

## Root seed registry requirement — 8 November 2026

All manually/AI-prepared bootstrap inputs now belong under root `seed/`, including baseline auth permissions/roles, global file types and jurisdictions, curated folders, system and jurisdiction patterns, site structures and seed-specific source artifacts. Read [seed registry convention](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md). Preserve global/system/jurisdiction separation; curated `seed/ke/...` inputs are distinct from ignored regeneratable `seed/generated/ke/...` outputs. Manifests map every adopted input to its immutable S3 artifact identity and recognized loader/domain target, natural keys, dependencies, hash and explicit access. Do not create another seed schema or filesystem registry without demonstrated need. Runtime loaders remain under source; Dryv schema contracts remain under dryv.

The clean database target is mzizi_new: schema/data disposal and fresh identities are approved, with no legacy compatibility or migration requirement. Existing S3 objects are not disposable. This task update documents requirements; actual content, manifest runtime support, bulk relocation and application remain gated by the owning implementation task. Folder/type seed production is still deferred until its model and reference/geography prerequisites are ready.

## Task 03 integration requirements — 11 November 2026

Consume [the connected foundation](../../../../improvements/connected-reference-geography-legal-foundation.md) and task-03 contracts. Do not reopen country as modern-governance context, geography as shared spatial foundation or explicit global vocabulary merely to reuse legacy jurisdiction IDs. Finalize actual legal instruments/provisions/versions and multi-basis associations, governance office definitions/mandates/holders, electoral contest/result/office links, political affiliation history and regional membership/leadership. Keep legal interpretation separate from extracted text and spatial containment.

- [ ] Finalize legal provision-version identities, territorial/subject/personal/temporal applicability and typed domain legal-basis FKs, including bootstrap order and non-statutory historical evidence.
- [ ] Finalize governance/electoral/political links and dates: vacant office, selection/declaration/term distinction, candidacy affiliation versus membership and sourced representative mandates.
- [ ] Finalize regional organization membership/organ/leadership contracts and derived member-territory coverage with historical inputs; no inferred sovereignty or universal legal applicability.
- [ ] Validate census, revised estimate, language survey and approximate historical population against typed domain definitions and shared measurement/release machinery; reject incompatible automatic rollups.
- [ ] Consume topic/capability contracts for population, representatives and budgets with actual availability, methods/evidence/gaps and explicit fallback; retain future history/land/goods/prices/inflation backlog without implementing all of it here.

These are task-04 acceptance requirements, not task-03 implementation expansion. Keep task 04 planned and dependent on `TSK-7E5E18758D9C` until its foundation contracts are ready.
