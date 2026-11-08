---
{id: TSK-D6949284672E,name: Model remaining domain schemas and their dependencies,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:28.194Z,updated_at: 2026-11-08T06:46:28.194Z,depends_on: [TSK-7E5E18758D9C],order: 4096}
---

# 04 — Model remaining domain schemas and their dependencies

## Goal

Deliver a precise, understandable and reviewable design for this milestone in the improvements rewrite, preserving useful existing functionality and establishing reliable inputs for the next milestone.

## Context

Depends on reviewed foundation designs from tasks 01-03. Review the remaining domains one by one using their existing detailed documents, including internal workflow tables. Establish exact destination data before designing collectors. Keep person, organization and governance meanings distinct; preserve political/electoral separation. Evaluate debt/finance, civic/governance and calendar/activity changes from actual usage. Do not force a predetermined schema count. Define domain inputs/outputs for patterns, evidence, freshness and application queries, without inventing a pipeline topology. This is one coordinated milestone with per-domain checklists refined in this task as review proceeds.

Inspect current Dryv contracts, generated entities, migration history, runtime readers/writers and existing tests before proposing changes. Distinguish repository evidence from a verified live database audit. For every table specify purpose, columns, SQL types, nullability, defaults, primary keys, foreign keys including cross-schema relationships, unique/check constraints, indexes, deletion behavior and comments. Use KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD decisions with migration mapping; preserve stable IDs, evidence and existing data. Justify temporal/version fields individually. This task is planned design work: creation does not authorize migrations, application changes, deployment or execution of subsequent tasks. Record user design decisions before proposing a coordinated implementation. Work on develop only and do not modify .github. Tasks remain planned until explicitly started.

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
