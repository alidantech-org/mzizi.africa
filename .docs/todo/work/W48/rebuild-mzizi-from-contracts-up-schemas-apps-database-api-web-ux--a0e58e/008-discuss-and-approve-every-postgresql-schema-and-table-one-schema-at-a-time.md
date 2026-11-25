---
{id: TSK-C61A06DEFCB9,name: "Discuss and approve every PostgreSQL schema and table, one schema at a time",type: task,status: planned,priority: high,created_at: 2026-11-25T00:20:58.186Z,updated_at: 2026-11-25T00:20:59.319Z,order: 0}
---

# Discuss and approve every PostgreSQL schema and table, one schema at a time

## Goal

This is the running discussion checklist for the database redesign. It lists every PostgreSQL schema in `dryv/contracts/schemas/postgres` and every table in each, as generated in `source/backend/database/sql/schema.sql` on 2026-11-25, plus the new schemas agreed in the foundation redesign. For each schema the owner and agent discuss what it holds, how each table connects, what moves, what is renamed or removed, and what the schema will look like after the redesign. A schema is ticked as approved only when the owner approves its target shape. The discussion continues schema by schema until every schema and table in the database is covered. It is the first task of the wave: the schema review and everything after it builds on what is approved here.

## Context

Discussions follow the same pattern as the reference review of 2026-11-24 and 2026-11-25. Agreed results are written into `.docs/design/data/FOUNDATION_REDESIGN.md` (foundation rules) or a per-schema design note under `.docs/design/data/`, with a Mermaid ERD. Anything not agreed stays under that document's Pending discussion section. The rules already agreed apply to every schema below: named things get identities in the `identity` schema; text lives in `identity.names`, `vocabulary.labels`, `product.messages` or `media.texts`; columns pointing at terms end in `_term` and use the meaning words (kind, status, role, method, basis, category); `country_id` only on large tables filtered by country; single-word table names where they are clear; partitioning planned per table; descriptions only where they add meaning. **No table has a column saying where its rows came from** (no `source_citation_id`, `citation_id` or similar, including in already-approved schemas): the `source` schema records it in a partitioned linking table that uses subject columns without a foreign key (FOUNDATION_REDESIGN section 23). Only PostgreSQL schemas are in scope; MongoDB schemas are not. Discuss in the order below, because later schemas depend on earlier ones.

For each table, the discussion decides: keep, move (and where), rename (and to what), merge or remove; its key and links; its term columns; whether it is an identity; and whether it needs `country_id` or partitioning.

## Discussion order and status

- [x] reference: approved 2026-11-25 (FOUNDATION_REDESIGN section 21)
- [x] identity (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 21)
- [x] vocabulary (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 22)
- [x] product (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 22)
- [x] media (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 22)
- [x] filesystem: approved 2026-11-25 (FOUNDATION_REDESIGN section 22)
- [x] geography: approved 2026-11-25 (FOUNDATION_REDESIGN section 22)
- [x] official: approved 2026-11-25 (FOUNDATION_REDESIGN section 25)
- [x] source: approved 2026-11-25 (FOUNDATION_REDESIGN section 34)
- [x] legal: approved 2026-11-25 (FOUNDATION_REDESIGN section 30)
- [x] governance: approved 2026-11-25 (FOUNDATION_REDESIGN section 30)
- [x] politics: approved 2026-11-25 (FOUNDATION_REDESIGN section 30)
- [x] civic: approved 2026-11-25 (FOUNDATION_REDESIGN section 30)
- [x] finance: approved 2026-11-25 (FOUNDATION_REDESIGN section 30)
- [x] statistics: approved 2026-11-25 (FOUNDATION_REDESIGN section 29)
- [x] event: approved 2026-11-25 (FOUNDATION_REDESIGN section 27)
- [x] community: approved 2026-11-25 (FOUNDATION_REDESIGN section 28)
- [x] auth: approved 2026-11-25 (FOUNDATION_REDESIGN section 27)
- [x] legislature (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 30)
- [x] election (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 30)
- [x] economy (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 33)
- [x] history (new): approved 2026-11-25 (FOUNDATION_REDESIGN section 27)
- [x] accountability: removed 2026-11-25 (FOUNDATION_REDESIGN section 26)

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

Changes below were approved by the owner on 2026-11-25.

- [x] `official.entities` (existing): kept, identity-backed; `kind_term`; required years, optional dates
- [x] `official.individuals` (existing): kept, identity-backed; adds birth and death years
- [x] `official.names` (existing): removed → `identity.names`
- [x] `official.identifiers` (existing): removed → `identity.identifiers`
- [x] `official.contacts` (existing): kept; `identity_id`; public and official-business only
- [x] `official.relationships` (existing): kept; `from_id`, `to_id`; public figures only, shown when verified
- [x] `official.branding` (existing): kept; words and colours only, images move to media
- [x] `official.parts` (new): people's name parts
- [x] Source citation columns removed from every official table
- [x] `official` changes approved by the owner
- [x] `official` ERD written into the design doc

## Schema `source` (18 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `source.publishers` (existing): kept; shares the organisation's identity
- [x] `source.sources` (existing): kept; English label
- [x] `source.domains` (existing): kept
- [x] `source.addresses` (existing): renamed `paths`; website pages, listings, files, feeds and APIs
- [x] `source.discoveries` (existing): kept; partitioned by month
- [x] `source.products` (existing): kept, identity-backed
- [x] `source.editions` (existing): kept
- [x] `source.artifacts` (existing): kept; byte details left to filesystem
- [x] `source.captures` (existing): kept; typed response columns; partitioned by month
- [x] `source.relationships` (existing): renamed `derivations`
- [x] `source.citations` (existing): kept; locator only
- [x] `source.evidence` (new): provenance links, partitioned by subject table
- [x] `source.verifications` (existing): kept
- [x] `source.attributions` (existing): kept
- [x] `source.slugs`, `links` (existing): removed → `identity.addresses`
- [x] `source.coverage` (existing): kept
- [x] `source.disputes` (existing): kept; subject link
- [x] `source.contenders` (existing): kept; `evidence_id`
- [x] `media.subjects` (new): articles about several identities
- [x] `source` changes approved by the owner
- [x] `source` ERD written into the design doc

## Schema `legal` (9 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `legal.instruments` (existing): kept, identity-backed
- [x] `legal.names` (existing): removed → `identity.names`
- [x] `legal.editions` (existing): kept; `observed_at` removed
- [x] `legal.provisions` (existing): kept; title moves to wordings
- [x] `legal.wordings` (existing): kept; adds heading; citation removed
- [x] `legal.translations` (existing): kept; Mzizi's unofficial translations
- [x] `legal.references` (existing): kept
- [x] `legal.relationships` (existing): kept; note with language
- [x] `legal.effects` (existing): kept; `identity_id`
- [x] `legal` changes approved by the owner
- [x] `legal` ERD written into the design doc

## Schema `governance` (24 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `governance.institutions` (existing): kept; shares the organisation's identity; arm and class terms
- [x] `governance.positions` (existing): kept, identity-backed
- [x] `governance.offices` (existing): kept, identity-backed
- [x] `governance.holders` (existing): kept; adds `contest_id`, `reason_term`
- [x] `governance.terms` (existing): kept; absorbs mandates
- [x] `governance.mandates` (existing): removed → terms
- [x] `governance.relationships` (existing): kept; structural links
- [x] `governance.authority_scopes` (existing): renamed `jurisdictions`; adds `country_id`
- [x] `governance.functions` (existing): kept, identity-backed
- [x] `governance.assignments` (existing): kept; start columns become `initiator_id`
- [x] `governance.powers` (existing): kept; `from_id`, `to_id`
- [x] `governance.procedures` (existing): kept, identity-backed
- [x] `governance.obligations` (existing): kept
- [x] `governance.reports` (existing): kept
- [x] `governance.promises`, `fulfilments` (existing): moved → politics commitments
- [x] `governance` proceedings (sittings, agenda, bills, stages, motions, votes, hansards, speeches): moved → `legislature`
- [x] `governance` changes approved by the owner
- [x] `governance` ERD written into the design doc

## Schema `politics` (15 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `politics.parties` (existing): kept; shares the organisation's identity
- [x] `politics.memberships` (existing): kept
- [x] `politics.coalitions` (existing): kept, identity-backed
- [x] `politics.alignments` (existing): kept
- [x] `politics.manifestos` (existing): kept
- [x] `politics.manifesto_items` (existing) and `governance.promises`: merged → `commitments`
- [x] `politics.fulfilments` (moved from governance)
- [x] `politics.contributions` (existing): kept
- [x] Election tables (elections, contests, candidates, electorates, results, referendum options, option results, polls): moved → `election`
- [x] `politics` changes approved by the owner
- [x] `politics` ERD written into the design doc

## Schema `civic` (12 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `civic.services` (existing): kept, identity-backed
- [x] `civic.facilities` (existing): kept; shares the feature's identity
- [x] `civic.projects` (existing): kept, identity-backed
- [x] `civic.project_features` (existing): renamed `sites`
- [x] `civic.procurements` (existing): kept, identity-backed
- [x] `civic.bids` (existing): kept
- [x] `civic.contracts` (existing): kept; adds start and end dates
- [x] `civic.variations` (existing): kept
- [x] `civic.deliveries` (existing): kept; certified work, payments are flows
- [x] `civic.officials`, `partners`, `beneficiaries` (existing): merged → `roles`, through holders when acting in office
- [x] `civic` changes approved by the owner
- [x] `civic` ERD written into the design doc

## Schema `finance` (7 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `finance.fiscal_periods` (existing): renamed `periods`
- [x] `finance.budgets` (existing): kept
- [x] `finance.budget_versions` (existing): renamed `revisions`
- [x] `finance.appropriations` (existing): kept
- [x] `finance.funds` (existing): kept, identity-backed
- [x] `finance.flows` (existing): kept; `counterparty_id`; partitioned by country
- [x] `finance.debts` (existing): kept, identity-backed
- [x] `finance.findings` (new): audit findings
- [x] `finance` changes approved by the owner
- [x] `finance` ERD written into the design doc

## Schema `statistics` (4 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `statistics.indicators` (existing): kept, identity-backed; names and definitions move to identity and media; term columns; frequency and aggregation
- [x] `statistics.observations` (existing): kept; years plus dates, status, basis, uncertainty, collection, revision, cell, subject; dimension columns move to breakdowns; partitioned by country
- [x] `statistics.metrics` (existing): kept, identity-backed
- [x] `statistics.components` (existing): kept
- [x] `statistics.dimensions` (new): breakdowns an indicator allows
- [x] `statistics.collections` (new): census, survey and compilation programmes
- [x] `statistics.priorities` (new): per-country order of trust (KNBS, NBS, World Bank)
- [x] `statistics.breakdowns` (new): categories cutting an observation
- [x] `statistics.figures` (new): prepared table of values to show, partitioned by country
- [x] Query and frontend rules documented
- [x] Multilingual check done; enum display keys added in `product.keys`
- [x] `statistics` changes approved by the owner
- [x] `statistics` ERD written into the design doc

## Schema `event` (12 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `event.calendars` (existing): kept; `kind_term`; description and citation removed
- [x] `event.events` (existing): kept, identity-backed; `level_id`, `feature_id`, `organiser_id`
- [x] `event.names` (existing): removed → `identity.names`
- [x] `event.rules` (existing): kept; `kind_term`, `adjustment_term`
- [x] `event.occurrences` (existing): kept; `timezone_id`; venue columns removed
- [x] `event.changes` (existing): kept; `authority_id`; note with language
- [x] `event.subjects` (existing): kept; `identity_id`
- [x] `event.participants` (existing): kept; `identity_id`
- [x] `event.schedules` (existing): kept; `issuer_id`
- [x] `event.items` (existing): kept; note with language
- [x] `event.seasons` (existing): kept; `feature_id`; description removed
- [x] `event.venues` (existing): kept; `role_term`
- [x] `event` changes approved by the owner
- [x] `event` ERD written into the design doc

## Schema `community` (15 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `community.actors` (existing): kept; visitor or member; handle, display name, avatar
- [x] `community.devices` (existing): kept
- [x] `community.tokens` (existing): kept; encrypted
- [x] `community.consents` (existing): kept; consent wording from `product.keys`
- [x] `community.preferences` (existing): kept
- [x] `community.places` (existing): kept
- [x] `community.reactions` (existing): kept; sign-in required; typed targets
- [x] `community.views` (existing): kept; typed targets; partitioned by month
- [x] `community.proofs` (existing): kept; typed signals
- [x] `community.posts` (existing): kept and widened for all contributions; partitioned by country
- [x] `community.cases` (existing): kept; checks moved out
- [x] `community.subscriptions` (existing): kept; `identity_id`
- [x] `community.notifications` (existing): kept; typed links; partitioned by month
- [x] `community.deliveries` (existing): renamed `dispatches`
- [x] `community.replies` (existing): kept; `respondent_id`, body with language
- [x] `community.checks` (new): automated and human checks
- [x] `community.blocks` (new): blocked accounts
- [x] `community.attachments` (new): media on posts
- [x] Username rules and email or phone OTP sign-up in `auth` (`logins` extended, `codes` new)
- [x] `community` changes approved by the owner
- [x] `community` ERD written into the design doc

## Schema `auth` (11 tables today)

Changes below were approved by the owner on 2026-11-25.

- [x] `auth.accounts` (existing): kept; `actor_kind` enum; `individual_id`
- [x] `auth.login_identities` (existing): renamed `logins`
- [x] `auth.roles` (existing): kept; English title and description allowed; `institution_id`
- [x] `auth.permissions` (existing): kept; generated enums
- [x] `auth.role_permissions` (existing): renamed `privileges`
- [x] `auth.role_assignments` (existing): renamed `grants`
- [x] `auth.memberships` (existing): kept; `institution_id`
- [x] `auth.invitations` (existing): kept; `institution_id`
- [x] `auth.scopes` (existing): kept; real foreign keys; `dataset_ref_id` removed
- [x] `auth.delegations` (existing): kept
- [x] `auth.delegation_roles` (existing): renamed `allowances`
- [x] Contribution direction recorded for the community review: signed-in only, reviewed or filtered before publishing, bad actors blocked
- [x] `auth` changes approved by the owner
- [x] `auth` ERD written into the design doc

## Schema `legislature` (new)

Changes below were approved by the owner on 2026-11-25.

- [x] `legislature.sittings` (from governance)
- [x] `legislature.agenda` (from governance)
- [x] `legislature.bills` (from governance): identity-backed
- [x] `legislature.stages` (from governance)
- [x] `legislature.motions` (from governance)
- [x] `legislature.votes` (from governance): partitioned by country
- [x] `legislature.hansards` (from governance)
- [x] `legislature.speeches` (from governance): partitioned by country
- [x] `legislature.summaries` (new)
- [x] `legislature` changes approved by the owner
- [x] `legislature` ERD written into the design doc

## Schema `election` (new)

Changes below were approved by the owner on 2026-11-25.

- [x] `election.elections` (from politics): identity-backed
- [x] `election.contests` (from politics)
- [x] `election.candidates` (from politics)
- [x] `election.choices` (from `politics.referendum_options`)
- [x] `election.stations` (from `politics.polls`)
- [x] `election.turnouts` (from `politics.electorates`)
- [x] `election.results` (from `politics.results` and `option_results`): statistics patterns, partitioned by country
- [x] `election.tallies` (new, prepared)
- [x] `election` changes approved by the owner
- [x] `election` ERD written into the design doc

## UI additions (section 32)

Approved by the owner on 2026-11-25.

- [x] `governance.appointments` (new): appointment steps by people, Parliament, boards and commissions; holder appointer columns removed
- [x] `legislature.votes.party_id`; seats dropped
- [x] Per-schema `attachments` tables for media on non-identity rows
- [x] External media columns on `media.assets` (links, embeds, providers, availability)
- [x] `election.forms` for original results documents (34A–34C)
- [x] `election.elections.event_id` → `event.events`
- [x] `civic.items` and `civic.scores`; `civic.prices` dropped

## Schema `economy` (new)

Approved by the owner on 2026-11-25 (FOUNDATION_REDESIGN section 33).

- [x] `economy.goods` (new): goods, services and works, with standard and size
- [x] `economy.names` (new): names of goods in any language
- [x] `economy.codes` (new): CPC, COICOP, UNSPSC and HS codes
- [x] `economy.crosswalks` (new): official correspondence tables
- [x] `economy.compositions` (new): bills of quantities for works
- [x] `economy.prices` (new): prices, partitioned by country
- [x] `economy.baskets` and `economy.weights` (new): CPI and cost-of-living baskets
- [x] Known limits addressed: CPC pivot, cost schedules and compositions, like-for-like comparison with ranges and confidence
- [x] `economy` changes approved by the owner
- [x] `economy` ERD written into the design doc

## Schema `history` (new)

Changes below were approved by the owner on 2026-11-25.

- [x] `history.occurrences` (new): identity-backed historical happenings with precision
- [x] `history.eras` (new): named periods
- [x] `history.roles` (new): identities involved
- [x] `history.links` (new): causes, effects and parts
- [x] History kept separate from `event`, with the rule for choosing documented
- [x] `history` changes approved by the owner
- [x] `history` ERD written into the design doc

## Schema `accountability` (removed)

- [x] `accountability` removed: contract file, pgsql import and audit checks deleted on 2026-11-25

## Acceptance checklist

- [x] Every schema above is discussed and its target shape approved
- [x] Every current table has a recorded decision
- [x] Every agreed result is written into FOUNDATION_REDESIGN or a per-schema design note with an ERD
- [x] Nothing still open is left unmarked: open items are listed under Pending discussion
- [ ] `task validate` passes
