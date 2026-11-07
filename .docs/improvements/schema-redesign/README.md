---
id: DOC-71D2A8C49E63
name: Schema redesign and column-by-column review plan
type: documentation
tags: [improvements, planning, schemas, audit, foreign-keys]
extra: {status: planning_only, no_bulk_task_creation: true}
---

# Database schema redesign — review folder

**PLANNING ONLY — NOT READY TO IMPLEMENT.** The user subsequently **explicitly requested all eighteen named schema design documents**, which have now been written as substantive planning proposals, not empty placeholders. This folder contains the domain design files below; update them iteratively under user direction. The user's preference for only a few cross-cutting files still applies outside this folder.


## Final schema count: NOT DECIDED — all current schemas accounted for

**This folder has 19 Markdown files: 18 proposed target-schema plans plus this README. They are NOT 19 PostgreSQL schemas.** The repository currently defines 24 application/runtime PostgreSQL schemas; an 18-schema target is one provisional option, **not a user-approved physical design**. A domain planning file may account for several existing schemas. No merge, rename or removal is approved merely because its destination appears here.

### Eighteen proposed domains for one-by-one human review

| # | Planning document | Purpose |
|---:|---|---|
| 1 | [`reference.md`](reference.md) | Jurisdictions and controlled vocabulary |
| 2 | [`geography.md`](geography.md) | Territorial geography and physical places |
| 3 | [`legal.md`](legal.md) | Laws, legal procedures and authority |
| 4 | [`person.md`](person.md) | Real individuals and public profiles |
| 5 | [`organization.md`](organization.md) | Canonical organization identities |
| 6 | [`governance.md`](governance.md) | Institutions, offices, holders and public services |
| 7 | [`political.md`](political.md) | Political parties and affiliations |
| 8 | [`electoral.md`](electoral.md) | Elections, candidates, voters and results |
| 9 | [`finance.md`](finance.md) | Budgets, debt and public funds |
| 10 | [`procurement.md`](procurement.md) | Purchasing, bidders, contracts and suppliers |
| 11 | [`statistical.md`](statistical.md) | Indicators, datasets and observations |
| 12 | [`activity.md`](activity.md) | Events, public actions and news |
| 13 | [`filesystem.md`](filesystem.md) | Files, folders, tags and external S3 references |
| 14 | [`source.md`](source.md) | Evidence, publishers, websites and captures |
| 15 | [`auth.md`](auth.md) | Accounts, identities, roles and permissions |
| 16 | [`participation.md`](participation.md) | Public and official feedback (NEW) |
| 17 | [`audit.md`](audit.md) | Immutable decisions and action history |
| 18 | [`engine.md`](engine.md) | Pipeline runs, staging and generation |

### Complete old-to-possible-new mapping (all 24 current schemas)

| Current schema | Review document | Tentative direction; nothing silently discarded |
|---|---|---|
| `reference` | [`reference.md`](reference.md) | Keep, simplify types/jurisdictions |
| `geography` | [`geography.md`](geography.md) | Keep; possible place integration |
| `legal` | [`legal.md`](legal.md) | Keep; global-neutral redesign |
| `person` | [`person.md`](person.md) | Keep distinct from accounts |
| `identity` | [`auth.md`](auth.md) | Combine with access |
| `governance` | [`governance.md`](governance.md) | Keep |
| `electoral` | [`electoral.md`](electoral.md) | Keep distinct from political |
| `political` | [`political.md`](political.md) | Keep distinct from electoral |
| `calendar` | [`activity.md`](activity.md) | Rename |
| `organization` | [`organization.md`](organization.md) | Keep |
| `finance` | [`finance.md`](finance.md) | Keep; absorb debt |
| `debt` | [`finance.md`](finance.md) | Merge into finance |
| `procurement` | [`procurement.md`](procurement.md) | Keep; detailed participant model OPEN |
| `statistical` | [`statistical.md`](statistical.md) | Keep and clarify |
| `civic` | [`governance.md`](governance.md) | Proposed public-service move, not final |
| `filesystem` | [`filesystem.md`](filesystem.md) | Keep; external object storage |
| `source` | [`source.md`](source.md) | Keep and simplify |
| `website` | [`source.md`](source.md) | Possible consolidation; may stay separate |
| `place` | [`geography.md`](geography.md) | Possible consolidation; physical places remain distinct tables |
| `contact` | [`geography.md`](geography.md) | HOME UNDECIDED: may remain separate contact schema |
| `audit` | [`audit.md`](audit.md) | Keep separate from participation |
| `engine` | [`engine.md`](engine.md) | Keep processing domain |
| `staging` | [`engine.md`](engine.md) | Possible consolidation; may stay separate |
| `access` | [`auth.md`](auth.md) | Combine with identity |

**Three possible retained extra schemas:** `contact`, `website` and `staging` may remain physically separate. If all three remain, the provisional 18-target design could instead have **21 schemas**, before any further justified additions or splits. The final count is whatever your approved table-by-table review determines. The new `participation` schema is proposed, not yet created.

**Other current objects:** `geography.boundary_shapes` (migration-managed PostGIS table, not a new schema), `access.account_permissions` (a view), historical retired `organization.locations` (not current) and internal `engine.migrations` all require accounting during their owning-domain audit. Current counts come from the repository definitions, not a checked live database.

### Human review and validation process — one schema at a time

1. **Understand and explain:** Read the domain purpose and current tables. Write, in your own words, what the schema owns, excludes and should mean.
2. **Inspect real tables and columns:** Compare the current TypeORM/Dryv models, migrations and eventually the actual database. Record exact types, nullability, FKs, indexes, constraints and existing data; historical migration columns alone are insufficient.
3. **Test relationships:** Review real cross-schema FKs, jurisdiction/country-root geography, historical and legal scope, query directions, four acquisition classes, pattern eligibility, evidence and corrections.
4. **Add your ideas:** Keep/rename/merge/split/remove/add proposals, columns you find confusing, missing capabilities and **free-text alternatives**. Challenge recommendations rather than accepting them by default.
5. **Resolve open decisions:** Record the choice, alternatives and reasons, existing-data migration dependencies, query examples and consistency with all other domains.
6. **Personally validate:** Mark `DESIGN VALIDATED BY USER` only after you have reviewed and accepted the concept. **This is not implementation approval.** You will separately specify Taskcode task creation and order.

**Approval vocabulary:** `NOT REVIEWED` → `UNDER HUMAN REVIEW` → `NEEDS CHANGES` or `DESIGN VALIDATED BY USER` → `APPROVED FOR TASK PLANNING` only by direct user instruction. **Every schema starts NOT REVIEWED** for final design, regardless of how detailed its AI-authored document is.

**Recommended free-text prompts in each schema document:** “How I understand it”; “What feels unnecessary or unclear”; “My table/column changes”; “My FK/geo/legal/pattern suggestions”; “What I disagree with”; “Example real queries I want”; “Remaining TBDs”; “My approval status and date.” Agents must not fill these in on your behalf.

---

## Domain design documents — all 18 explicitly requested

The filenames describe **proposed target domains**, not necessarily existing PostgreSQL schema names. Several cover multiple existing schemas or a new proposed schema. Each file identifies actual current tables, ownership questions, direct-FK requirements, data classes, recommended alternatives, risks and unresolved decisions. **The documents are planning references; none is final DDL approval.**

| Design document | Current schema(s) and major question |
|---|---|
| [reference.md](reference.md) | `reference` — jurisdiction identity, classification schemes, typed reference FKs |
| [geography.md](geography.md) | `geography` + `place`, assess `contact` — root units, physical sites, hierarchy, presence |
| [legal.md](legal.md) | `legal` — global-neutral constitutions, laws, provisions, procedures, patterns |
| [person.md](person.md) | `person` — individual identity, names, public profiles and holders |
| [organization.md](organization.md) | `organization` — canonical legal entities, suppliers, identifiers, affiliations |
| [governance.md](governance.md) | `governance` + `civic` — offices, officials, institutions, public services, generation |
| [political.md](political.md) | `political` — parties, memberships, party positions and history |
| [electoral.md](electoral.md) | `electoral` — candidates, electorates, referendums, votes and results |
| [finance.md](finance.md) | `finance` + `debt` — public budgets, funds, borrowing, payments |
| [procurement.md](procurement.md) | `procurement` — buyer/supplier roles, awards/contracts, spatial links (**unapproved**) |
| [statistical.md](statistical.md) | `statistical` — clear indicators, dimensions, vintages and derivations |
| [activity.md](activity.md) | `calendar` → `activity` — events, actions, news/official updates |
| [filesystem.md](filesystem.md) | `filesystem` — logical files/folders/tags linked to existing external S3 |
| [source.md](source.md) | `source` + possibly `website` — publishers, site structures, Markdown and provenance |
| [auth.md](auth.md) | `identity` + `access` → `auth` — accounts, roles, permissions |
| [participation.md](participation.md) | Proposed new `participation` — public/official consultation and feedback |
| [audit.md](audit.md) | `audit` — immutable decisions and actor history, separate from participation |
| [engine.md](engine.md) | `engine` + possibly `staging` — jobs, candidates, pattern runs and pipelines |

**Also audit rather than silently lose:** `website` website/DNS tables, `contact.points`, `geography.boundary_shapes`, `access.account_permissions`, internal `engine.migrations`, current staging tables, and retired legacy `organization.locations` references. Their disposition belongs in these design documents rather than a new superficial target file.

**Important:** Existing migration-derived column lists and selected current-field examples in the domain files are only **review baselines**, not a verified live PostgreSQL column-by-column audit. Do not treat proposed tables/columns as existing or approved; complete the exact entity/constraint/index/data audit during user-directed review.

## Confirmed user requirements

1. Decide schema compression **after inspecting every current schema, table, and column**; do not insist on a predetermined count (a past assistant estimate of 18–19 is **not approved**).
2. Use short understandable schema/table names, descriptive column names, and comments on **schemas, tables, and columns**, with maintained Markdown documentation.
3. **Restore hard, database-enforced foreign keys across PostgreSQL schemas**, not the inherited `target_kind + target_id` soft-reference-only default. Known-table relations should use true FKs; study justified exceptions. The current `.docs/rules/database-naming.md` and `.docs/docs/DATABASE_DESIGN.md` forbid cross-schema FKs; the user explicitly rejected this old rule. **Do not edit the old rules until a coordinated implementation is separately approved.**
4. Keep `person`, `organization` and `governance` distinct; combine account `identity` and RBAC `access` into clearer `auth`; separate `participation` from operational `audit`; evaluate combining `engine`/`staging`.
5. Lean toward unifying `geography` and `place` while keeping geographic units distinct from physical places. Decide `contact` placement through an actual usage audit.
6. Move `debt` into `finance`; retain `procurement` separate. Keep `political` and `electoral` separate; bring `civic` public services closer to `governance`. Rename `calendar` to `activity` for events, actions, updates/news and links.
7. Legal design must be neutral and explainable globally; robust references to constitutions, laws, provisions, bills, lawmaking, rules and patterns. Don't hard-code Kenya.
8. Clear up `reference` and `statistical` without weakening statistics; clarify `source`/`website`/`filesystem`/`staging` ownership without aggressive merging.
9. Each table's documentation must state its **eligible acquisition categories** (static seed, pattern seed, automated collection, derived) and whether patterns are relevant. Individual row lineage remains independently traceable.
10. Geographic and legal links require careful query/scoping evaluation. The user does **not** want legal basis copied redundantly into every generated row if the rule/pattern already owns it.
11. Do not assume proposed procurement structures or direct `supplier_id` fields are approved. The user explicitly reserved procurement modeling for later consideration.
12. Maintain temporal validity, source evidence, corrections, data identity, historical changes and applicable privacy/publication permissions.

## Current repository inventory

On inspected `develop`, the TypeORM entity catalogue has **21 domain schemas and 124 entity tables**. Migrations add `engine`, `staging` and `access` with **16 tables**, plus `geography.boundary_shapes`, for **24 repository-defined schemas / 141 tables**; `access.account_permissions` is a view. The [master register](../mzizi-data-schema-storage-and-pipelines-redesign.md) contains the **full per-schema current table names**. That is code evidence, **not** a verified live database inventory. Older `.docs/docs/DATABASE_DESIGN.md` and naming rules lag some current entities (electoral referendum/electorate, statistical dimensions/vintages, website DNS/sightings, source classifications). `organization.locations` is retired.

### Domains to review (not a target schema count)

| Review cluster | Current schemas | Decisions to evaluate |
|---|---|---|
| Foundations | `reference`, `geography`, `place`, `contact` | Jurisdiction/root geo, hierarchy lookup, types/values, physical presence, contact placement |
| People and institutions | `person`, `organization`, `governance`, `civic` | Identity, institution vs organization, offices and holders, government/public services, patterns |
| Legal, electoral, political | `legal`, `electoral`, `political` | Legal authority and procedures, seats/geography, elections, party structures and time |
| Public money | `finance`, `debt`, `procurement` | Budgets, funds, debt, finance units, procurement parties, awards, delivery locations and laws |
| Information and activity | `statistical`, `calendar` | Powerful clear statistics, indicators/dimensions/vintages, events/news/activity |
| Evidence and files | `website`, `source`, `filesystem` | Source vs website discovery vs evidence vs stored bytes, file ownership and public access |
| Security and operations | `identity`, `access`, `audit`, `engine`, `staging` | Proposed auth/participation, audit vs reviews, jobs/runs/patterns/quality |
| Cross-cutting | All | FKs, generated lineage, acquisition classes, comments, identity resolution, temporal querying |

### Per-table and per-column review format (mandatory for future review files)

For **each current table**, capture:
1. **Reality:** exact schema.table and each column's name, type, nullable/default, FK, unique/check/index, computed/enum status, historical/version columns; live count/constraints when DB can be read.
2. **Meaning:** entity identity, ownership, relationship to similar tables, whether an existing field conflates concepts.
3. **Acquisition:** eligible four data classes, actual record origin, pattern input/expected output, traceable seeds and source/provenance.
4. **Geography:** jurisdiction vs legal scope vs physical location vs representation vs delivery area vs observed geographic unit; hierarchical and historical query behavior.
5. **Law:** legal establishment, rule, authority, validity, and whether FK belongs here or to a parent rule/pattern.
6. **Integrity:** which relationships must become **real cross-schema FK constraints**; whether a junction/closure/version table is justified; what to do with `target_kind + target_id` patterns.
7. **Correction:** stable identity, version history, source conflicts, correction vs time-based updates, dedup and permitted edits.
8. **Proposed design alternatives:** keep/rename/merge/split/add/remove each table/column, rationale, examples of actual queries, impacts/tradeoffs.
9. **Migration impact:** old→new mapping and backfills; constraint orphans; index/read plans; Dryv/TypeORM generation; API and pipeline compatibility; no data loss.
10. **Decision register:** mark USER CONFIRMED / USER LEAN / ASSISTANT PROPOSAL / OPEN; record what requires user approval.

**Example query coverage to demand before choosing a structure:**

- Kenya nation-wide institutions and their availability in a Nairobi County view, without falsely stating their HQ is in every county.
- A county or ward row rolling up to current/historical national totals; a national statistic **must not** be falsely copied down to counties.
- Office → pattern/rule → dated legal provision → legislative instrument, and actual dated office-holder evidence.
- Supplier registered in Nairobi but contracted for a project in another county; distinct party role, project area and legal scope.
- Same official name across separate institutions/time periods without incorrect person merge.
- A source publication linked to one immutable file, several captures, several extracted Markdown sections and one or more candidates.

## Implementation safeguards (later, only after approval)

Run a read-only live schema and data inventory, reconcile drift, confirm orphan/duplicate counts, and benchmark representative SQL before proposing final DDL. Validate true FK support in Dryv/TypeORM generator. Use non-destructive migrations, staged constraint validation, stable IDs, versioning and compatibility/rollback plans. Database actions, code, tests and tasks are **not authorized by this planning guide**.

**Status: no schema design has been approved for implementation.**

## Related source redesign planning

See [source redesign and adaptive website intelligence](../source-redesign/README.md) for the consolidated planning-only review of unknown-site discovery, link/URL deduplication, optional YAML structures, semantic retrieval/ML, incremental processing, the dedicated vector index alternatives and the shared pattern-schema option. **No source/website collapse, new pattern schema or target table set has been approved.**
