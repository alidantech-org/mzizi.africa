---
{id: TSK-D0EC3D8B6D47,name: "Review every Dryv PostgreSQL schema table by table, with an ERD per schema",type: task,status: planned,priority: high,created_at: 2026-11-24T19:52:48.881Z,updated_at: 2026-11-24T19:52:48.881Z,order: 1024}
---

# Review every Dryv PostgreSQL schema table by table, with an ERD per schema

## Goal

Revisit the whole database design before anything is regenerated. For each schema in `dryv/contracts/schemas/postgres`, read every table, understand why it exists, how it connects to other tables inside and outside the schema, and whether it preserves Mzizi's evidence path (raw artifact, extraction, candidate, review, accepted version), historical time and place, and uncertainty. The outcome is an approved, documented design with one ERD per schema, ready for the app contracts and the database restart.

## Context

This is task 1 of 7 in the wave and must be finished before any other. The authored contracts are in `dryv/contracts/schemas/postgres/*.ts`, with shared building blocks in `_base.ts`, `_shared.ts`, `_periods.ts` and `_subjects.ts`. The generated SQL is `source/backend/database/sql/schema.sql`. Read `.docs/docs/DOMAINS.md`, `.docs/design/data/DATABASE_ARCHITECTURE.md`, `.docs/rules/code-columns.md`, `.docs/rules/versioning.md` and the PostgreSQL review in `.docs/_plan/the-new-mzizi/`. The `accountability` schema is analytical and has no persisted tables; confirm that stays true. Identity columns stay `code`, dotted and lowercase. Do not invent version fields. Record each schema's findings in a review note under `.docs/design/data/` and draw its ERD as Mermaid `erDiagram` in the same note.

For every table the review answers: what it stores, its key and `code` rule, every foreign key and the reason for it, time columns (observed vs valid), provenance and source links, soft delete, expected size, the reads that will hit it and the indexes those need, and whether it should be merged, split, renamed or removed.

## Method for each schema

- [ ] Read the contract file and the shared bases it uses
- [ ] Review each table (checklist below)
- [ ] Map connections to other schemas
- [ ] Draw the Mermaid ERD
- [ ] Write the review note with proposed changes
- [ ] Get owner approval for the proposed changes

## Schema `reference` (13 tables)

- [ ] `reference.copy`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.countries`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.instances`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.language_names`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.languages`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.patterns`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.schemes`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.templates`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.topics`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.units`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.value_labels`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.value_relations`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference.values`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `reference`: cross-schema connections mapped
- [ ] `reference`: ERD drawn
- [ ] `reference`: review note written and approved

## Schema `auth` (11 tables)

- [ ] `auth.accounts`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth.delegation_roles`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth.delegations`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth.invitations`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth.login_identities`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth.memberships`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth.permissions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth.role_assignments`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth.role_permissions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth.roles`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth.scopes`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `auth`: cross-schema connections mapped
- [ ] `auth`: ERD drawn
- [ ] `auth`: review note written and approved

## Schema `geography` (9 tables)

- [ ] `geography.assets`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `geography.changes`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `geography.classifications`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `geography.features`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `geography.geometries`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `geography.identifiers`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `geography.levels`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `geography.names`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `geography.relationships`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `geography`: cross-schema connections mapped
- [ ] `geography`: ERD drawn
- [ ] `geography`: review note written and approved

## Schema `source` (18 tables)

- [ ] `source.addresses`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.artifacts`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.attributions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.captures`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.citations`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.contenders`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.coverage`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.discoveries`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.disputes`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.domains`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.editions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.links`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.products`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.publishers`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.relationships`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.slugs`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.sources`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source.verifications`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `source`: cross-schema connections mapped
- [ ] `source`: ERD drawn
- [ ] `source`: review note written and approved

## Schema `filesystem` (9 tables)

- [ ] `filesystem.contents`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `filesystem.content_tags`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `filesystem.file_extensions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `filesystem.files`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `filesystem.file_versions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `filesystem.folders`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `filesystem.media`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `filesystem.taggings`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `filesystem.tags`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `filesystem`: cross-schema connections mapped
- [ ] `filesystem`: ERD drawn
- [ ] `filesystem`: review note written and approved

## Schema `official` (7 tables)

- [ ] `official.branding`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `official.contacts`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `official.entities`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `official.identifiers`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `official.individuals`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `official.names`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `official.relationships`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `official`: cross-schema connections mapped
- [ ] `official`: ERD drawn
- [ ] `official`: review note written and approved

## Schema `legal` (9 tables)

- [ ] `legal.editions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `legal.effects`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `legal.instruments`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `legal.names`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `legal.provisions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `legal.references`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `legal.relationships`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `legal.translations`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `legal.wordings`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `legal`: cross-schema connections mapped
- [ ] `legal`: ERD drawn
- [ ] `legal`: review note written and approved

## Schema `governance` (24 tables)

- [ ] `governance.agenda`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.assignments`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.authority_scopes`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.bills`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.fulfilments`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.functions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.hansards`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.holders`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.institutions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.mandates`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.motions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.obligations`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.offices`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.positions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.powers`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.procedures`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.promises`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.relationships`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.reports`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.sittings`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.speeches`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.stages`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.terms`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance.votes`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `governance`: cross-schema connections mapped
- [ ] `governance`: ERD drawn
- [ ] `governance`: review note written and approved

## Schema `politics` (15 tables)

- [ ] `politics.alignments`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.candidates`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.coalitions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.contests`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.contributions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.elections`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.electorates`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.manifesto_items`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.manifestos`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.memberships`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.option_results`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.parties`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.polls`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.referendum_options`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics.results`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `politics`: cross-schema connections mapped
- [ ] `politics`: ERD drawn
- [ ] `politics`: review note written and approved

## Schema `civic` (12 tables)

- [ ] `civic.beneficiaries`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.bids`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.contracts`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.deliveries`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.facilities`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.officials`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.partners`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.procurements`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.project_features`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.projects`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.services`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic.variations`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `civic`: cross-schema connections mapped
- [ ] `civic`: ERD drawn
- [ ] `civic`: review note written and approved

## Schema `finance` (7 tables)

- [ ] `finance.appropriations`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `finance.budgets`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `finance.budget_versions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `finance.debts`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `finance.fiscal_periods`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `finance.flows`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `finance.funds`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `finance`: cross-schema connections mapped
- [ ] `finance`: ERD drawn
- [ ] `finance`: review note written and approved

## Schema `statistics` (4 tables)

- [ ] `statistics.components`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `statistics.indicators`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `statistics.metrics`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `statistics.observations`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `statistics`: cross-schema connections mapped
- [ ] `statistics`: ERD drawn
- [ ] `statistics`: review note written and approved

## Schema `event` (12 tables)

- [ ] `event.calendars`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.changes`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.events`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.items`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.names`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.occurrences`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.participants`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.rules`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.schedules`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.seasons`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.subjects`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event.venues`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `event`: cross-schema connections mapped
- [ ] `event`: ERD drawn
- [ ] `event`: review note written and approved

## Schema `community` (15 tables)

- [ ] `community.actors`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.cases`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.consents`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.deliveries`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.devices`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.notifications`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.places`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.posts`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.preferences`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.proofs`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.reactions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.replies`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.subscriptions`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.tokens`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community.views`: purpose, keys, foreign keys, time, provenance, indexes, keep/merge/split
- [ ] `community`: cross-schema connections mapped
- [ ] `community`: ERD drawn
- [ ] `community`: review note written and approved

## Schema `accountability` (analytical, no tables)

- [ ] Confirm it stays analytical and list the reads it needs from other schemas
- [ ] Document which views or queries replace persisted tables

## Whole-database review

- [ ] Draw one overview ERD of how schemas connect
- [ ] List every proposed change in one table with its reason and risk
- [ ] Check every change against the evidence path and historical modelling rules
- [ ] Record the approved design as a decision in `.docs/decisions/`

## Partitioning plan

Decide, with reasons, which tables need PostgreSQL partitioning, which do not, and how. Partitioning is planned here and built in the database task; it is only adopted where data volume or access patterns justify it, because it constrains global unique keys and foreign keys.

- [ ] Estimate current and expected row counts and growth for every large or append-heavy table (for example `statistics.observations`, `source.captures`, `source.artifacts`, `geography.geometries`, `governance.votes`, `governance.speeches`, `governance.hansards`, `politics.results`, `finance.flows`, `community.views`, `community.notifications`, `community.reactions`, `event.occurrences`)
- [ ] For each candidate, record the dominant access pattern (by country, by time period, by feature, by source)
- [ ] Choose the strategy per table: none, range by time, list by country, or hash, and the partition key
- [ ] Check the impact on primary keys, `code` uniqueness, foreign keys pointing into the table, and soft delete
- [ ] Plan partition creation, retention and maintenance (new periods, new countries, detach and archive)
- [ ] Plan how queries must filter on the partition key so pruning works, and list the API reads affected
- [ ] Record which tables are deliberately not partitioned and why
- [ ] Write the partitioning plan into the database architecture doc and get owner approval

## Acceptance checklist

- [ ] The partitioning plan is written, reasoned table by table, and approved
- [ ] Every table above is checked off
- [ ] Every schema has a review note and ERD
- [ ] The owner approved the design changes
- [ ] `task validate` passes

## Comments

### 2026-11-24T22:56:25.869Z · PETER IRUNGU

Reference schema reviewed with the owner on 2026-11-24/25. Approved foundation direction is in .docs/design/data/FOUNDATION_REDESIGN.md (identity, vocabulary, classification, administrative systems, multilingual rules, product and media schemas). Open items are listed there under Pending discussion.
