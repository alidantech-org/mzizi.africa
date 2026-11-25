---
{id: TSK-C61A06DEFCB9,name: "Discuss and approve every PostgreSQL schema and table, one schema at a time",type: task,status: planned,priority: high,created_at: 2026-11-25T00:20:58.186Z,updated_at: 2026-11-25T00:20:59.319Z,order: 0}
---

# Discuss and approve every PostgreSQL schema and table, one schema at a time

## Goal

This is the running discussion checklist for the database redesign. It lists every PostgreSQL schema in `dryv/contracts/schemas/postgres` and every table in each, as generated in `source/backend/database/sql/schema.sql` on 2026-11-25, plus the new schemas agreed in the foundation redesign. For each schema the owner and agent discuss what it holds, how each table connects, what moves, what is renamed or removed, and what the schema will look like after the redesign. A schema is ticked as approved only when the owner approves its target shape. The discussion continues schema by schema until every schema and table in the database is covered. It is the first task of the wave: the schema review and everything after it builds on what is approved here.

## Context

Discussions follow the same pattern as the reference review of 2026-11-24 and 2026-11-25. Agreed results are written into `.docs/design/data/FOUNDATION_REDESIGN.md` (foundation rules) or a per-schema design note under `.docs/design/data/`, with a Mermaid ERD. Anything not agreed stays under that document's Pending discussion section. The rules already agreed apply to every schema below: named things get identities in the `identity` schema; text lives in `identity.names`, `vocabulary.labels`, `product.messages` or `media.texts`; columns pointing at terms end in `_term` and use the meaning words (kind, status, role, method, basis, category); `country_id` only on large tables filtered by country; single-word table names where they are clear; partitioning planned per table; descriptions only where they add meaning. Only PostgreSQL schemas are in scope; MongoDB schemas are not. Discuss in the order below, because later schemas depend on earlier ones.

For each table, the discussion decides: keep, move (and where), rename (and to what), merge or remove; its key and links; its term columns; whether it is an identity; and whether it needs `country_id` or partitioning.

## Discussion order and status

- [x] reference: approved 2026-11-25 (FOUNDATION_REDESIGN section 21)
- [x] identity (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 21)
- [x] vocabulary (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 22)
- [x] product (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 22)
- [x] media (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 22)
- [x] filesystem: approved 2026-11-25 (FOUNDATION_REDESIGN section 22)
- [x] geography: approved 2026-11-25 (FOUNDATION_REDESIGN section 22)
- [ ] official
- [ ] source
- [ ] legal
- [ ] governance
- [ ] politics
- [ ] civic
- [ ] finance
- [ ] statistics
- [ ] event
- [ ] community
- [ ] auth
- [ ] history (new, proposed): historical events and activities; to be designed
- [ ] accountability (analytical, no tables)

## Schema `reference` (13 tables today)

Discussed 2026-11-24/25; changes below await owner approval. Target: true reference data only. Each line shows the table as it is today and what changes.

- [x] `reference.countries` (existing): kept. Becomes identity-backed (id = `identity.identities.id`); `continentId`, `subregionId` move to `identity.classifications`; `defaultLanguageId` moves to `reference.locales`; `subdomain`, `isServed` move to `product`; `currencyId` points at `reference.currencies`; ISO uniques skip deleted rows
- [x] `reference.languages` (existing): kept. Becomes identity-backed; classification columns become `_term` columns; ISO uniques skip deleted rows
- [x] `reference.language_names` (existing): removed; rows move to `identity.names`
- [x] `reference.schemes` (existing): moved to `vocabulary.schemes`, gains shape, answers, dated and open rules
- [x] `reference.values` (existing): moved and renamed to `vocabulary.terms`; `label` column removed; gains range columns
- [x] `reference.value_labels` (existing): moved and renamed to `vocabulary.labels`
- [x] `reference.value_relations` (existing): moved and renamed to `vocabulary.mappings`
- [x] `reference.topics` (existing): removed; becomes a topic scheme in vocabulary
- [x] `reference.units` (existing): kept as a real reference table; `quantity` free text becomes a `_term` column
- [x] `reference.patterns` (existing): moved to `governance`
- [x] `reference.templates` (existing): moved to `governance`; `institutionKindId` limited to its scheme; fans out over `reference.levels`
- [x] `reference.instances` (existing): moved to `governance`; null-unit duplicate bug fixed
- [x] `reference.copy` (existing): removed; becomes `product.keys` and `product.messages`
- [x] `reference.locales` (new): country, language, status, order
- [x] `reference.currencies` (new): replaces the currency scheme
- [x] `reference.timezones` (new): IANA zones
- [x] `reference.hierarchies` (new): replaces part of `geography.levels`
- [x] `reference.levels` (new): replaces the rest of `geography.levels`
- [x] Reference changes approved by the owner
- [x] Reference ERD written into the design doc

## Schema `identity` (new)

New schema; nothing exists today. Each line names the table and what it replaces.

- [x] `identity.identities` (new): one row per named thing (id, kind enum, code)
- [x] `identity.names` (new): replaces `geography.names`, `official.names`, `legal.names`, `event.names`, `reference.language_names`
- [x] `identity.identifiers` (new): replaces `geography.identifiers`, `official.identifiers`
- [x] `identity.addresses` (new): replaces `source.slugs`, `source.links`
- [x] `identity.classifications` (new): replaces `geography.classifications` and `countries.continentId`, `subregionId`
- [x] `identity.tags` (new): replaces `filesystem.tags`, `taggings`, `content_tags` for identities
- [x] Identity changes approved by the owner
- [x] Identity ERD written into the design doc

## Schema `vocabulary` (new)

Approved by the owner on 2026-11-25.

- [x] `vocabulary.schemes` (new, from `reference.schemes`): shape, answers, dated, open, country, steward
- [x] `vocabulary.scopes` (new): scheme to identity kind
- [x] `vocabulary.terms` (new, from `reference.values`): no label column; ranges, status enum
- [x] `vocabulary.labels` (new, from `reference.value_labels`): for terms and schemes, kind enum
- [x] `vocabulary.mappings` (new, from `reference.value_relations`): kind enum, no loops
- [x] `vocabulary` changes approved by the owner
- [x] `vocabulary` ERD written into the design doc

## Schema `product` (new)

Approved by the owner on 2026-11-25.

- [x] `product.apps` (new)
- [x] `product.sites` (new, from `countries.subdomain`)
- [x] `product.releases` (new, from `countries.isServed`)
- [x] `product.lang` (new): languages a release offers
- [x] `product.keys` (new)
- [x] `product.messages` (new, from `reference.copy`)
- [x] `product` changes approved by the owner
- [x] `product` ERD written into the design doc

## Schema `media` (new)

Approved by the owner on 2026-11-25.

- [x] `media.articles` (new, from `filesystem.contents`): not an identity; belongs to an identity
- [x] `media.texts` (new, from `filesystem.contents`)
- [x] `media.assets` (new, from `filesystem.media`): not an identity
- [x] `media.captions` (new, from `filesystem.media`)
- [x] `media.uses` (new, from `filesystem.media` subject link)
- [x] `media` changes approved by the owner
- [x] `media` ERD written into the design doc

## Schema `filesystem` (9 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `filesystem.folders` (existing): kept; `roleId` → `role_term`
- [x] `filesystem.files` (existing): kept; adds `tags text[]`
- [x] `filesystem.file_versions` (existing): renamed `versions`; `fileExtensionId` → `format_id`
- [x] `filesystem.file_extensions` (existing): renamed `formats`
- [x] `filesystem.tags`, `taggings`, `content_tags` (existing): removed → `identity.tags` and the file tags array
- [x] `filesystem.media` (existing): removed → `media.assets`, `captions`, `uses`
- [x] `filesystem.contents` (existing): removed → `media.articles`, `media.texts`
- [x] `filesystem` changes approved by the owner
- [x] `filesystem` ERD written into the design doc

## Schema `geography` (9 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `geography.features` (existing): kept, identity-backed; `featureTypeId` → `kind_term`; shares the country's identity for a country
- [x] `geography.names` (existing): removed → `identity.names`
- [x] `geography.identifiers` (existing): removed → `identity.identifiers`
- [x] `geography.classifications` (existing): removed → `identity.classifications`
- [x] `geography.levels` (existing): removed → `reference.hierarchies`, `reference.levels`
- [x] `geography.geometries` (existing): kept; `role_term`, `basis_term`; zoom columns move to outlines; always EPSG:4326; adds citation and spatial index
- [x] `geography.relationships` (existing): kept; `kind_term`; `systemId` → `hierarchy_id`; adds `level_id`, `citation_id`
- [x] `geography.changes` (existing): kept; `kind_term`; `transformationId` → link to the future history schema; note with language, citation
- [x] `geography.assets` (existing): kept and widened for prepared outputs (tile sets, TopoJSON) with hierarchy, level, built and stale times
- [x] `geography.outlines` (new): simplified outlines per zoom band
- [x] `geography.pieces` (new): subdivided polygons for location lookup
- [x] Years required, exact dates optional and kept in agreement
- [x] `geography` changes approved by the owner
- [x] `geography` ERD written into the design doc

## Schema `official` (7 tables today)

Organisations and people; names and identifiers move to identity.

- [ ] `official.branding`: keep, move, rename, merge or remove decided
- [ ] `official.contacts`: keep, move, rename, merge or remove decided
- [ ] `official.entities`: keep, move, rename, merge or remove decided
- [ ] `official.identifiers`: keep, move, rename, merge or remove decided
- [ ] `official.individuals`: keep, move, rename, merge or remove decided
- [ ] `official.names`: keep, move, rename, merge or remove decided
- [ ] `official.relationships`: keep, move, rename, merge or remove decided
- [ ] `official`: term columns, identities, country_id and partitioning decided
- [ ] `official` target shape approved by the owner
- [ ] `official` ERD drawn

## Schema `source` (18 tables today)

Publishers, sources, artifacts, captures, citations; slugs and links move to identity.addresses.

- [ ] `source.addresses`: keep, move, rename, merge or remove decided
- [ ] `source.artifacts`: keep, move, rename, merge or remove decided
- [ ] `source.attributions`: keep, move, rename, merge or remove decided
- [ ] `source.captures`: keep, move, rename, merge or remove decided
- [ ] `source.citations`: keep, move, rename, merge or remove decided
- [ ] `source.contenders`: keep, move, rename, merge or remove decided
- [ ] `source.coverage`: keep, move, rename, merge or remove decided
- [ ] `source.discoveries`: keep, move, rename, merge or remove decided
- [ ] `source.disputes`: keep, move, rename, merge or remove decided
- [ ] `source.domains`: keep, move, rename, merge or remove decided
- [ ] `source.editions`: keep, move, rename, merge or remove decided
- [ ] `source.links`: keep, move, rename, merge or remove decided
- [ ] `source.products`: keep, move, rename, merge or remove decided
- [ ] `source.publishers`: keep, move, rename, merge or remove decided
- [ ] `source.relationships`: keep, move, rename, merge or remove decided
- [ ] `source.slugs`: keep, move, rename, merge or remove decided
- [ ] `source.sources`: keep, move, rename, merge or remove decided
- [ ] `source.verifications`: keep, move, rename, merge or remove decided
- [ ] `source`: term columns, identities, country_id and partitioning decided
- [ ] `source` target shape approved by the owner
- [ ] `source` ERD drawn

## Schema `legal` (9 tables today)

Laws and their provisions, wordings and translations; names move to identity.

- [ ] `legal.editions`: keep, move, rename, merge or remove decided
- [ ] `legal.effects`: keep, move, rename, merge or remove decided
- [ ] `legal.instruments`: keep, move, rename, merge or remove decided
- [ ] `legal.names`: keep, move, rename, merge or remove decided
- [ ] `legal.provisions`: keep, move, rename, merge or remove decided
- [ ] `legal.references`: keep, move, rename, merge or remove decided
- [ ] `legal.relationships`: keep, move, rename, merge or remove decided
- [ ] `legal.translations`: keep, move, rename, merge or remove decided
- [ ] `legal.wordings`: keep, move, rename, merge or remove decided
- [ ] `legal`: term columns, identities, country_id and partitioning decided
- [ ] `legal` target shape approved by the owner
- [ ] `legal` ERD drawn

## Schema `governance` (24 tables today)

Institutions, offices, parliament; receives patterns, templates and instances.

- [ ] `governance.agenda`: keep, move, rename, merge or remove decided
- [ ] `governance.assignments`: keep, move, rename, merge or remove decided
- [ ] `governance.authority_scopes`: keep, move, rename, merge or remove decided
- [ ] `governance.bills`: keep, move, rename, merge or remove decided
- [ ] `governance.fulfilments`: keep, move, rename, merge or remove decided
- [ ] `governance.functions`: keep, move, rename, merge or remove decided
- [ ] `governance.hansards`: keep, move, rename, merge or remove decided
- [ ] `governance.holders`: keep, move, rename, merge or remove decided
- [ ] `governance.institutions`: keep, move, rename, merge or remove decided
- [ ] `governance.mandates`: keep, move, rename, merge or remove decided
- [ ] `governance.motions`: keep, move, rename, merge or remove decided
- [ ] `governance.obligations`: keep, move, rename, merge or remove decided
- [ ] `governance.offices`: keep, move, rename, merge or remove decided
- [ ] `governance.positions`: keep, move, rename, merge or remove decided
- [ ] `governance.powers`: keep, move, rename, merge or remove decided
- [ ] `governance.procedures`: keep, move, rename, merge or remove decided
- [ ] `governance.promises`: keep, move, rename, merge or remove decided
- [ ] `governance.relationships`: keep, move, rename, merge or remove decided
- [ ] `governance.reports`: keep, move, rename, merge or remove decided
- [ ] `governance.sittings`: keep, move, rename, merge or remove decided
- [ ] `governance.speeches`: keep, move, rename, merge or remove decided
- [ ] `governance.stages`: keep, move, rename, merge or remove decided
- [ ] `governance.terms`: keep, move, rename, merge or remove decided
- [ ] `governance.votes`: keep, move, rename, merge or remove decided
- [ ] `governance`: term columns, identities, country_id and partitioning decided
- [ ] `governance` target shape approved by the owner
- [ ] `governance` ERD drawn

## Schema `politics` (15 tables today)

Parties, elections, candidates and results.

- [ ] `politics.alignments`: keep, move, rename, merge or remove decided
- [ ] `politics.candidates`: keep, move, rename, merge or remove decided
- [ ] `politics.coalitions`: keep, move, rename, merge or remove decided
- [ ] `politics.contests`: keep, move, rename, merge or remove decided
- [ ] `politics.contributions`: keep, move, rename, merge or remove decided
- [ ] `politics.elections`: keep, move, rename, merge or remove decided
- [ ] `politics.electorates`: keep, move, rename, merge or remove decided
- [ ] `politics.manifesto_items`: keep, move, rename, merge or remove decided
- [ ] `politics.manifestos`: keep, move, rename, merge or remove decided
- [ ] `politics.memberships`: keep, move, rename, merge or remove decided
- [ ] `politics.option_results`: keep, move, rename, merge or remove decided
- [ ] `politics.parties`: keep, move, rename, merge or remove decided
- [ ] `politics.polls`: keep, move, rename, merge or remove decided
- [ ] `politics.referendum_options`: keep, move, rename, merge or remove decided
- [ ] `politics.results`: keep, move, rename, merge or remove decided
- [ ] `politics`: term columns, identities, country_id and partitioning decided
- [ ] `politics` target shape approved by the owner
- [ ] `politics` ERD drawn

## Schema `civic` (12 tables today)

Services, projects, procurement and contracts.

- [ ] `civic.beneficiaries`: keep, move, rename, merge or remove decided
- [ ] `civic.bids`: keep, move, rename, merge or remove decided
- [ ] `civic.contracts`: keep, move, rename, merge or remove decided
- [ ] `civic.deliveries`: keep, move, rename, merge or remove decided
- [ ] `civic.facilities`: keep, move, rename, merge or remove decided
- [ ] `civic.officials`: keep, move, rename, merge or remove decided
- [ ] `civic.partners`: keep, move, rename, merge or remove decided
- [ ] `civic.procurements`: keep, move, rename, merge or remove decided
- [ ] `civic.project_features`: keep, move, rename, merge or remove decided
- [ ] `civic.projects`: keep, move, rename, merge or remove decided
- [ ] `civic.services`: keep, move, rename, merge or remove decided
- [ ] `civic.variations`: keep, move, rename, merge or remove decided
- [ ] `civic`: term columns, identities, country_id and partitioning decided
- [ ] `civic` target shape approved by the owner
- [ ] `civic` ERD drawn

## Schema `finance` (7 tables today)

Budgets, appropriations, funds, flows and debts.

- [ ] `finance.appropriations`: keep, move, rename, merge or remove decided
- [ ] `finance.budgets`: keep, move, rename, merge or remove decided
- [ ] `finance.budget_versions`: keep, move, rename, merge or remove decided
- [ ] `finance.debts`: keep, move, rename, merge or remove decided
- [ ] `finance.fiscal_periods`: keep, move, rename, merge or remove decided
- [ ] `finance.flows`: keep, move, rename, merge or remove decided
- [ ] `finance.funds`: keep, move, rename, merge or remove decided
- [ ] `finance`: term columns, identities, country_id and partitioning decided
- [ ] `finance` target shape approved by the owner
- [ ] `finance` ERD drawn

## Schema `statistics` (4 tables today)

Indicators and observations; fixed dimension columns become breakdowns.

- [ ] `statistics.components`: keep, move, rename, merge or remove decided
- [ ] `statistics.indicators`: keep, move, rename, merge or remove decided
- [ ] `statistics.metrics`: keep, move, rename, merge or remove decided
- [ ] `statistics.observations`: keep, move, rename, merge or remove decided
- [ ] `statistics`: term columns, identities, country_id and partitioning decided
- [ ] `statistics` target shape approved by the owner
- [ ] `statistics` ERD drawn

## Schema `event` (12 tables today)

Calendars, events, occurrences and schedules; names move to identity.

- [ ] `event.calendars`: keep, move, rename, merge or remove decided
- [ ] `event.changes`: keep, move, rename, merge or remove decided
- [ ] `event.events`: keep, move, rename, merge or remove decided
- [ ] `event.items`: keep, move, rename, merge or remove decided
- [ ] `event.names`: keep, move, rename, merge or remove decided
- [ ] `event.occurrences`: keep, move, rename, merge or remove decided
- [ ] `event.participants`: keep, move, rename, merge or remove decided
- [ ] `event.rules`: keep, move, rename, merge or remove decided
- [ ] `event.schedules`: keep, move, rename, merge or remove decided
- [ ] `event.seasons`: keep, move, rename, merge or remove decided
- [ ] `event.subjects`: keep, move, rename, merge or remove decided
- [ ] `event.venues`: keep, move, rename, merge or remove decided
- [ ] `event`: term columns, identities, country_id and partitioning decided
- [ ] `event` target shape approved by the owner
- [ ] `event` ERD drawn

## Schema `community` (15 tables today)

App users' activity: actors, posts, reactions, notifications.

- [ ] `community.actors`: keep, move, rename, merge or remove decided
- [ ] `community.cases`: keep, move, rename, merge or remove decided
- [ ] `community.consents`: keep, move, rename, merge or remove decided
- [ ] `community.deliveries`: keep, move, rename, merge or remove decided
- [ ] `community.devices`: keep, move, rename, merge or remove decided
- [ ] `community.notifications`: keep, move, rename, merge or remove decided
- [ ] `community.places`: keep, move, rename, merge or remove decided
- [ ] `community.posts`: keep, move, rename, merge or remove decided
- [ ] `community.preferences`: keep, move, rename, merge or remove decided
- [ ] `community.proofs`: keep, move, rename, merge or remove decided
- [ ] `community.reactions`: keep, move, rename, merge or remove decided
- [ ] `community.replies`: keep, move, rename, merge or remove decided
- [ ] `community.subscriptions`: keep, move, rename, merge or remove decided
- [ ] `community.tokens`: keep, move, rename, merge or remove decided
- [ ] `community.views`: keep, move, rename, merge or remove decided
- [ ] `community`: term columns, identities, country_id and partitioning decided
- [ ] `community` target shape approved by the owner
- [ ] `community` ERD drawn

## Schema `auth` (11 tables today)

Accounts, roles, permissions and delegations.

- [ ] `auth.accounts`: keep, move, rename, merge or remove decided
- [ ] `auth.delegation_roles`: keep, move, rename, merge or remove decided
- [ ] `auth.delegations`: keep, move, rename, merge or remove decided
- [ ] `auth.invitations`: keep, move, rename, merge or remove decided
- [ ] `auth.login_identities`: keep, move, rename, merge or remove decided
- [ ] `auth.memberships`: keep, move, rename, merge or remove decided
- [ ] `auth.permissions`: keep, move, rename, merge or remove decided
- [ ] `auth.role_assignments`: keep, move, rename, merge or remove decided
- [ ] `auth.role_permissions`: keep, move, rename, merge or remove decided
- [ ] `auth.roles`: keep, move, rename, merge or remove decided
- [ ] `auth.scopes`: keep, move, rename, merge or remove decided
- [ ] `auth`: term columns, identities, country_id and partitioning decided
- [ ] `auth` target shape approved by the owner
- [ ] `auth` ERD drawn

## Schema `history` (new, proposed)

A schema for historical events and activities (reforms such as Kenya's 2013 devolution, independence, boundary changes, treaties), which `geography.changes` and other schemas point at. Not designed yet.

- [ ] Decide what it holds and how it relates to today's `event` schema
- [ ] Design its tables
- [ ] `history` changes approved by the owner
- [ ] `history` ERD written into the design doc

## Schema `accountability` (no tables)

Read-only analytical surface; derived indicators are computed by queries, not stored.

- [ ] Confirm it stays without tables
- [ ] List the reads it needs from other schemas
- [ ] Accountability shape approved by the owner

## Acceptance checklist

- [ ] Every schema above is discussed and its target shape approved
- [ ] Every current table has a recorded decision
- [ ] Every agreed result is written into FOUNDATION_REDESIGN or a per-schema design note with an ERD
- [ ] Nothing still open is left unmarked: open items are listed under Pending discussion
- [ ] `task validate` passes
