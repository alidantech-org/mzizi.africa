---
id: DOC-71D2A8C49E63
name: Schema redesign and column-by-column review plan
type: documentation
tags: [improvements, planning, schemas, audit, foreign-keys]
extra: {status: planning_only, no_bulk_task_creation: true}
---

# Database schema redesign — review folder

**PLANNING ONLY — NOT READY TO IMPLEMENT.** The user specifically prefers schema-specific design work in a separate folder, **but does not want dozens of placeholder documents created in advance**. Start with this guide. Create a detailed `<schema>.md` here **when that schema is actually selected for discussion**, then update it iteratively through user review; avoid a burst of artificial schema files.

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
