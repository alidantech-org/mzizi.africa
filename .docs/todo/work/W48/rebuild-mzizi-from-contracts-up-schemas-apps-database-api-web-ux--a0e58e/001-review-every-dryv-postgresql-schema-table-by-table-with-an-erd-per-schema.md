---
{id: TSK-D0EC3D8B6D47,name: Author the approved database design into the Dryv schema contracts,type: task,status: planned,priority: high,created_at: 2026-11-24T19:52:48.881Z,updated_at: 2026-11-25T03:25:34.381Z,order: 1024,depends_on: [TSK-C61A06DEFCB9]}
---

# Author the approved database design into the Dryv schema contracts

## Goal

Turn the approved design in `.docs/design/data/FOUNDATION_REDESIGN.md` into the authored Dryv schema contracts under `dryv/contracts/schemas`, schema by schema, so that generated SQL matches the design exactly: new schemas (identity, vocabulary, product, media, legislature, election, economy, history), moved and renamed tables, `_term` columns, identity-backed tables, partitioning, and descriptions that become SQL comments. This is the first implementation step of the rebuild wave; every later step generates from these contracts.

## Context

The design was discussed and approved with the owner on 24–25 November 2026 (discussion task TSK-C61A06DEFCB9, 303/303). FOUNDATION_REDESIGN is the single source of truth; where an older document disagrees, FOUNDATION_REDESIGN wins. Dryv now supports what this needs (see DRYV_GAPS, "Rebuild capabilities delivered"): schema-facet LIST/RANGE/HASH partitioning with composite keys, SQL comments, enum and conditional checks and composite references. Update the local Dryv checkout (`~/Projects/personal/alidantech-org/codepot/dryv`) and relink before authoring. Rules: camelCase in contracts, snake_case in SQL (section 24); no citation or observed-at columns (section 23); every table keeps `code`; years required, dates optional; single-word table names; `country_id` only on large tables; `.docs/rules/typed-code.md`, `code-columns.md`, `versioning.md` (never invent versions).

**Descriptions replace explanatory code comments.** Where a contract uses a code comment to explain a schema, table or column, move that explanation into a Dryv description so it is generated as a SQL `COMMENT ON`; keep code comments only for notes that matter to contract authors and not to database readers. Write descriptions only where they add meaning.

**Partitioning must be declared, not left as notes:** `identity.names` and `identity.identifiers` by identity kind; `statistics.observations`, `statistics.breakdowns`, `statistics.figures`, `election.results`, `election.tallies`, `legislature.votes`, `legislature.speeches`, `finance.flows`, `economy.prices`, `community.posts` by country; `source.captures`, `source.discoveries`, `community.views`, `community.notifications`, `community.dispatches` by month; `source.evidence` by subject table with a hash split for the largest.

## Preparation

- [ ] Update and relink the local Dryv checkout; confirm the partitioning, comment and integrity capabilities are available
- [ ] Re-read FOUNDATION_REDESIGN sections 2–34 and list every contract file to create, rewrite or delete
- [ ] Update `_base.ts`, `_shared.ts`, `_periods.ts` and `_subjects.ts` for identity-backed tables, `_term` columns and the removed subject links

## Schema `reference`

- [ ] Author `reference` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `reference` partitioning where the design requires it
- [ ] Move `reference` explanations from code comments into descriptions
- [ ] Generate SQL for `reference` and check it against the design

## Schema `identity`

- [ ] Author `identity` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `identity` partitioning where the design requires it
- [ ] Move `identity` explanations from code comments into descriptions
- [ ] Generate SQL for `identity` and check it against the design

## Schema `vocabulary`

- [ ] Author `vocabulary` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `vocabulary` partitioning where the design requires it
- [ ] Move `vocabulary` explanations from code comments into descriptions
- [ ] Generate SQL for `vocabulary` and check it against the design

## Schema `product`

- [ ] Author `product` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `product` partitioning where the design requires it
- [ ] Move `product` explanations from code comments into descriptions
- [ ] Generate SQL for `product` and check it against the design

## Schema `media`

- [ ] Author `media` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `media` partitioning where the design requires it
- [ ] Move `media` explanations from code comments into descriptions
- [ ] Generate SQL for `media` and check it against the design

## Schema `filesystem`

- [ ] Author `filesystem` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `filesystem` partitioning where the design requires it
- [ ] Move `filesystem` explanations from code comments into descriptions
- [ ] Generate SQL for `filesystem` and check it against the design

## Schema `geography`

- [ ] Author `geography` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `geography` partitioning where the design requires it
- [ ] Move `geography` explanations from code comments into descriptions
- [ ] Generate SQL for `geography` and check it against the design

## Schema `official`

- [ ] Author `official` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `official` partitioning where the design requires it
- [ ] Move `official` explanations from code comments into descriptions
- [ ] Generate SQL for `official` and check it against the design

## Schema `source`

- [ ] Author `source` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `source` partitioning where the design requires it
- [ ] Move `source` explanations from code comments into descriptions
- [ ] Generate SQL for `source` and check it against the design

## Schema `legal`

- [ ] Author `legal` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `legal` partitioning where the design requires it
- [ ] Move `legal` explanations from code comments into descriptions
- [ ] Generate SQL for `legal` and check it against the design

## Schema `governance`

- [ ] Author `governance` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `governance` partitioning where the design requires it
- [ ] Move `governance` explanations from code comments into descriptions
- [ ] Generate SQL for `governance` and check it against the design

## Schema `legislature`

- [ ] Author `legislature` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `legislature` partitioning where the design requires it
- [ ] Move `legislature` explanations from code comments into descriptions
- [ ] Generate SQL for `legislature` and check it against the design

## Schema `politics`

- [ ] Author `politics` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `politics` partitioning where the design requires it
- [ ] Move `politics` explanations from code comments into descriptions
- [ ] Generate SQL for `politics` and check it against the design

## Schema `election`

- [ ] Author `election` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `election` partitioning where the design requires it
- [ ] Move `election` explanations from code comments into descriptions
- [ ] Generate SQL for `election` and check it against the design

## Schema `civic`

- [ ] Author `civic` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `civic` partitioning where the design requires it
- [ ] Move `civic` explanations from code comments into descriptions
- [ ] Generate SQL for `civic` and check it against the design

## Schema `finance`

- [ ] Author `finance` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `finance` partitioning where the design requires it
- [ ] Move `finance` explanations from code comments into descriptions
- [ ] Generate SQL for `finance` and check it against the design

## Schema `economy`

- [ ] Author `economy` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `economy` partitioning where the design requires it
- [ ] Move `economy` explanations from code comments into descriptions
- [ ] Generate SQL for `economy` and check it against the design

## Schema `statistics`

- [ ] Author `statistics` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `statistics` partitioning where the design requires it
- [ ] Move `statistics` explanations from code comments into descriptions
- [ ] Generate SQL for `statistics` and check it against the design

## Schema `event`

- [ ] Author `event` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `event` partitioning where the design requires it
- [ ] Move `event` explanations from code comments into descriptions
- [ ] Generate SQL for `event` and check it against the design

## Schema `history`

- [ ] Author `history` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `history` partitioning where the design requires it
- [ ] Move `history` explanations from code comments into descriptions
- [ ] Generate SQL for `history` and check it against the design

## Schema `community`

- [ ] Author `community` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `community` partitioning where the design requires it
- [ ] Move `community` explanations from code comments into descriptions
- [ ] Generate SQL for `community` and check it against the design

## Schema `auth`

- [ ] Author `auth` exactly as approved (tables, columns, keys, links, enums)
- [ ] Declare `auth` partitioning where the design requires it
- [ ] Move `auth` explanations from code comments into descriptions
- [ ] Generate SQL for `auth` and check it against the design

## Removals

- [ ] Delete contracts and tables that the design removes (for example `accountability`, `reference.copy`, `geography.levels`, the name and identifier tables now in `identity`, `source.slugs`, `source.links`)
- [ ] Update `dryv/contracts/apps/pgsql/index.ts` to list every new and remaining group
- [ ] Update the contract audit tools (`dryv/tools/*`) for the new inventory; fix the four stale inventory mismatches

## Acceptance checklist

- [ ] `bun run check` in `dryv/` passes
- [ ] Generated SQL contains every approved schema, table, partition and comment, and nothing removed
- [ ] Every deviation from the design is recorded in the run's owner-questions file instead of being guessed
- [ ] `task validate` passes
