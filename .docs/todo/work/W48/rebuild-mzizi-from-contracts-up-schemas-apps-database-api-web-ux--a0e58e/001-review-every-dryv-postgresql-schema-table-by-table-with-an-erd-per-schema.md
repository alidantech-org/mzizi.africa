---
{id: TSK-D0EC3D8B6D47,name: Author the approved database design into the Dryv schema contracts,type: task,status: completed,priority: high,created_at: 2026-11-24T19:52:48.881Z,updated_at: 2026-11-25T05:26:22.445Z,order: 1024,depends_on: [TSK-C61A06DEFCB9],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T03:32:58.388Z},{from: in-progress,to: completed,at: 2026-11-25T05:26:22.445Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-D0EC3D8B6D47/1795577578398-start,started_at: 2026-11-25T03:33:00.193Z,end_ref: refs/tracking/TSK-D0EC3D8B6D47/1795584382455-end,ended_at: 2026-11-25T05:26:22.445Z,summary: {files: 7115,insertions: 282910,deletions: 216265}}]}}}
---

# Author the approved database design into the Dryv schema contracts

## Goal

Turn the approved design in `.docs/design/data/FOUNDATION_REDESIGN.md` into the authored Dryv schema contracts under `dryv/contracts/schemas`, schema by schema, so that generated SQL matches the design exactly: new schemas (identity, vocabulary, product, media, legislature, election, economy, history), moved and renamed tables, `_term` columns, identity-backed tables, partitioning, and descriptions that become SQL comments. This is the first implementation step of the rebuild wave; every later step generates from these contracts.

## Context

The design was discussed and approved with the owner on 24–25 November 2026 (discussion task TSK-C61A06DEFCB9, 303/303). FOUNDATION_REDESIGN is the single source of truth; where an older document disagrees, FOUNDATION_REDESIGN wins. Dryv now supports what this needs (see DRYV_GAPS, "Rebuild capabilities delivered"): schema-facet LIST/RANGE/HASH partitioning with composite keys, SQL comments, enum and conditional checks and composite references. Update the local Dryv checkout (`~/Projects/personal/alidantech-org/codepot/dryv`) and relink before authoring. Rules: camelCase in contracts, snake_case in SQL (section 24); no citation or observed-at columns (section 23); every table keeps `code`; years required, dates optional; single-word table names; `country_id` only on large tables; `.docs/rules/typed-code.md`, `code-columns.md`, `versioning.md` (never invent versions).

**Descriptions replace explanatory code comments.** Where a contract uses a code comment to explain a schema, table or column, move that explanation into a Dryv description so it is generated as a SQL `COMMENT ON`; keep code comments only for notes that matter to contract authors and not to database readers. Write descriptions only where they add meaning.

**Partitioning must be declared, not left as notes:** `identity.names` and `identity.identifiers` by identity kind; `statistics.observations`, `statistics.breakdowns`, `statistics.figures`, `election.results`, `election.tallies`, `legislature.votes`, `legislature.speeches`, `finance.flows`, `economy.prices`, `community.posts` by country; `source.captures`, `source.discoveries`, `community.views`, `community.notifications`, `community.dispatches` by month; `source.evidence` by subject table with a hash split for the largest.

## Preparation

- [x] Update and relink the local Dryv checkout; confirm the partitioning, comment and integrity capabilities are available
- [x] Re-read FOUNDATION_REDESIGN sections 2–34 and list every contract file to create, rewrite or delete
- [x] Update `_base.ts`, `_shared.ts`, `_periods.ts` and `_subjects.ts` for identity-backed tables, `_term` columns and the removed subject links

## Schema `reference`

- [x] Author `reference` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `reference` partitioning where the design requires it
- [x] Move `reference` explanations from code comments into descriptions
- [x] Generate SQL for `reference` and check it against the design

## Schema `identity`

- [x] Author `identity` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `identity` partitioning where the design requires it
- [x] Move `identity` explanations from code comments into descriptions
- [x] Generate SQL for `identity` and check it against the design

## Schema `vocabulary`

- [x] Author `vocabulary` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `vocabulary` partitioning where the design requires it
- [x] Move `vocabulary` explanations from code comments into descriptions
- [x] Generate SQL for `vocabulary` and check it against the design

## Schema `product`

- [x] Author `product` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `product` partitioning where the design requires it
- [x] Move `product` explanations from code comments into descriptions
- [x] Generate SQL for `product` and check it against the design

## Schema `media`

- [x] Author `media` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `media` partitioning where the design requires it
- [x] Move `media` explanations from code comments into descriptions
- [x] Generate SQL for `media` and check it against the design

## Schema `filesystem`

- [x] Author `filesystem` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `filesystem` partitioning where the design requires it
- [x] Move `filesystem` explanations from code comments into descriptions
- [x] Generate SQL for `filesystem` and check it against the design

## Schema `geography`

- [x] Author `geography` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `geography` partitioning where the design requires it
- [x] Move `geography` explanations from code comments into descriptions
- [x] Generate SQL for `geography` and check it against the design

## Schema `official`

- [x] Author `official` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `official` partitioning where the design requires it
- [x] Move `official` explanations from code comments into descriptions
- [x] Generate SQL for `official` and check it against the design

## Schema `source`

- [x] Author `source` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `source` partitioning where the design requires it
- [x] Move `source` explanations from code comments into descriptions
- [x] Generate SQL for `source` and check it against the design

## Schema `legal`

- [x] Author `legal` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `legal` partitioning where the design requires it
- [x] Move `legal` explanations from code comments into descriptions
- [x] Generate SQL for `legal` and check it against the design

## Schema `governance`

- [x] Author `governance` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `governance` partitioning where the design requires it
- [x] Move `governance` explanations from code comments into descriptions
- [x] Generate SQL for `governance` and check it against the design

## Schema `legislature`

- [x] Author `legislature` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `legislature` partitioning where the design requires it
- [x] Move `legislature` explanations from code comments into descriptions
- [x] Generate SQL for `legislature` and check it against the design

## Schema `politics`

- [x] Author `politics` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `politics` partitioning where the design requires it
- [x] Move `politics` explanations from code comments into descriptions
- [x] Generate SQL for `politics` and check it against the design

## Schema `election`

- [x] Author `election` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `election` partitioning where the design requires it
- [x] Move `election` explanations from code comments into descriptions
- [x] Generate SQL for `election` and check it against the design

## Schema `civic`

- [x] Author `civic` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `civic` partitioning where the design requires it
- [x] Move `civic` explanations from code comments into descriptions
- [x] Generate SQL for `civic` and check it against the design

## Schema `finance`

- [x] Author `finance` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `finance` partitioning where the design requires it
- [x] Move `finance` explanations from code comments into descriptions
- [x] Generate SQL for `finance` and check it against the design

## Schema `economy`

- [x] Author `economy` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `economy` partitioning where the design requires it
- [x] Move `economy` explanations from code comments into descriptions
- [x] Generate SQL for `economy` and check it against the design

## Schema `statistics`

- [x] Author `statistics` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `statistics` partitioning where the design requires it
- [x] Move `statistics` explanations from code comments into descriptions
- [x] Generate SQL for `statistics` and check it against the design

## Schema `event`

- [x] Author `event` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `event` partitioning where the design requires it
- [x] Move `event` explanations from code comments into descriptions
- [x] Generate SQL for `event` and check it against the design

## Schema `history`

- [x] Author `history` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `history` partitioning where the design requires it
- [x] Move `history` explanations from code comments into descriptions
- [x] Generate SQL for `history` and check it against the design

## Schema `community`

- [x] Author `community` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `community` partitioning where the design requires it
- [x] Move `community` explanations from code comments into descriptions
- [x] Generate SQL for `community` and check it against the design

## Schema `auth`

- [x] Author `auth` exactly as approved (tables, columns, keys, links, enums)
- [x] Declare `auth` partitioning where the design requires it
- [x] Move `auth` explanations from code comments into descriptions
- [x] Generate SQL for `auth` and check it against the design

## Removals

- [x] Delete contracts and tables that the design removes (for example `accountability`, `reference.copy`, `geography.levels`, the name and identifier tables now in `identity`, `source.slugs`, `source.links`)
- [x] Update `dryv/contracts/apps/pgsql/index.ts` to list every new and remaining group
- [x] Update the contract audit tools (`dryv/tools/*`) for the new inventory; fix the four stale inventory mismatches

## Acceptance checklist

- [x] `bun run check` in `dryv/` passes
- [x] Generated SQL contains every approved schema, table, partition and comment, and nothing removed
- [x] Every deviation from the design is recorded in the run's owner-questions file instead of being guessed
- [x] `task validate` passes

## Comments

### 2026-11-25T03:57:18.385Z · PETER IRUNGU

Authored all 22 schemas from FOUNDATION_REDESIGN into dryv/contracts/schemas/postgres (new: identity, vocabulary, product, media, legislature, election, economy, history; accountability removed; governance-office-integrity.ts folded into governance partial indexes). Helpers: postgres/_links.ts (term(), identity(), identity-backed kind + composite FK, byCountry HASH16 and byMonth RANGE layouts), postgres/_measures.ts, base PartitionedEntity/PartitionedRecord. Extended local pack dryv/packs/postgres-sql: text[] arrays, PARTITION BY + partitions, COMMENT ON TABLE/COLUMN from descriptions, deduplicated composite-key targets, scheme checks now on vocabulary.terms/schemes. Proof: .dev/run/gen.sh --app pgsql -> 'Canonical Runtime IR accepted (623 records)', 'Applied 272 generated changes', mypy mzizi_engine.api 'no issues in 560 files'; schema.sql applied to mzizi_test with ON_ERROR_STOP: 203 tables in 22 schemas, 18 partitioned tables, 1205 column comments + 203 table comments, 310 scheme triggers; feature with identity_kind=individual rejected by chk_features_feature_kind, missing identity rejected by fk_features__feature_is_identity; EXPLAIN on statistics.figures by country scans one hash partition.

### 2026-11-25T04:00:35.304Z · PETER IRUNGU

Removals done: accountability, reference.copy/schemes/values/value_labels/value_relations/topics/language_names/patterns, geography.levels/names/identifiers/classifications, official.names/identifiers, legal.names, event.names, filesystem.tags/taggings/content_tags/media/contents, source.slugs/links, governance proceedings/promises/fulfilments/mandates are gone; pgsql app lists all 22 groups. dryv/tools/audit-main-domain-contracts.ts rewritten for the approved 22-schema/202-table inventory plus provenance-column and subject-link rules (proof: 'Main domain contracts OK (22 schemas, 202 tables)'; planted observedAt in history.ts was rejected). sync-tables now skips partitions: 'codes.json and SubjectTable cover 202 tables'; DB table list equals codes.json. Deviations Q1-Q8 recorded in .docs/handoffs/REBUILD-OWNER-QUESTIONS.md; gaps in DRYV_GAPS 'Adopted in the rebuild run'. task validate: valid. Open: acceptance item 'bun run check in dryv/ passes' depends on the app contracts rewrite (TSK-70669AC571AA); the database:check typecheck currently fails only in contracts/apps/api/*.

### 2026-11-25T05:26:22.019Z · PETER IRUNGU

Acceptance: 'cd dryv && bun run check' exit 0 (typecheck, doctor+compile api and engine, tables:check 'codes.json and SubjectTable cover 202 tables'); 'bun run database:check' passes (audit 'Main domain contracts OK (22 schemas, 202 tables)', compile). Late changes: IdentityEntity base (id is a relation to identity.identities, 35 tables), code uniqueness unconditional (codes never reused), governance schema OfficeTerms keeps table governance.terms, filesystem JSON columns stored as text, unit factors double (DRYV_GAPS). subject-integrity tool retired: subject links now exist only in source (evidence, verifications, disputes) with integrity by write code (section 34.4).
