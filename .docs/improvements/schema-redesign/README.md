---
id: DOC-71D2A8C49E63
name: Schema redesign and column-by-column review plan
type: documentation
tags: [improvements, planning, schemas, audit, foreign-keys]
extra: {status: planning_only, no_bulk_task_creation: true}
---

# Database schema redesign — review folder

**PLANNING ONLY — NOT READY TO IMPLEMENT.** The user subsequently **explicitly requested all eighteen named schema design documents**, which have now been written as substantive planning proposals, not empty placeholders. This folder contains the domain design files below; update them iteratively under user direction. The user's preference for only a few cross-cutting files still applies outside this folder.


> **2026-11-08 update:** the user approved a clean rewrite in the disposable database `mzizi_new` (`.docs/decisions/clean-rewrite-mzizi-new.md`). The `auth` design is implemented (see [auth.md](auth.md)); other schema documents remain planning records. Statements elsewhere in this folder about preserving IDs, data migration or compatibility are the former policy and are superseded for the rewrite.

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


## Database-wide column necessity, temporal validity and deletion policy — 2026-11-07

**USER REQUIREMENT — for the upcoming schema-by-schema redesign, not an instruction to run DDL now.**

> **No column is universal by convention.** A column must describe a fact, constraint, operational behavior, or query requirement **belonging to the table**. If it duplicates a parent pattern, law, immutable version, source artifact, related row or reliably derived state, **propose removing it** unless the domain has a demonstrated need for an independent value. No automatic blanket \`valid_from\`/\`valid_to\`, \`valid_from_precision\`/\`valid_to_precision\`, \`is_current\`, \`status\`, \`version\`, \`updated_at\`, \`deleted_at\` or convenience Boolean convention.

### Verified reason for revisiting the current template

Read-only examination of \`.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database/migrations/1793607856459-initial.ts\` found **103 original CREATE TABLE statements**, of which **73** contain \`valid_from\` and \`valid_to\`, **70** contain the pair of date-precision columns, **70** contain \`is_current\`, **103** contain \`version\`, \`created_at\` and \`updated_at\`, and **none** contain \`deleted_at\`. This is **only the original migration baseline**: later migrations introduce/move/remove tables and fields, so these counts must **not** be presented as current/live production coverage. They establish evidence for an overly broad historical column template, not a mandate to drop all occurrences.

### Opt-in temporal modeling: which fact does a date describe?

| Category | When a date/interval belongs on the record | Example and recommended design |
|---|---|---|
| **Stable identity / structurally established row** | No independent time interval just because the table has an ID | \`governance.offices\`: an office definition can derive applicable existence from its legally backed \`pattern\`/rule and geo scope. Avoid a redundant copy of the rule's effective period. **Exception:** an office can actually open/close, be abolished, renamed or transition independently of the rule; model that evidence explicitly, via a real status event/instance validity if needed. |
| **Actual relationship / tenure** | The relationship independently begins/ends in the world | \`governance.holders\`: appointment/term \`started_on\`, \`ended_on\` (names subject to review); \`political.memberships\`, \`organization.ownerships\`, \`geography.occupancies\`: relevant intervals. |
| **Legal authority / temporal rule** | Effective period is intrinsic to the law/rule and is a query input | \`legal.instruments\` enacted/commenced/repealed dates, \`legal.provisions\` amendments, approved \`reference.pattern_versions\` applicability windows and exceptions. Do **not** assume enactment = commencement or legal basis dates = real office usage dates. |
| **Geographical boundary or dated association** | Boundary, name, hierarchy or usage actually changed over time | \`geography.boundaries\`, \`geography.relationships\`, \`geography.names\`, occupancy/physical presence, historical jurisdictions. |
| **One-time event/publication** | One timestamp has the correct domain meaning | \`source.captures.fetched_at\`, \`filesystem.versions.created_at\`, \`activity.events.occurred_at\`, \`procurement.bids.submitted_at\`; generic \`valid_from/to\` adds no meaning. |
| **Financial/contract obligation** | Explicit legal/financial dates have different meanings | Contract signed/effective/expiry dates, loans maturity, expenditure paid date; avoid one \`valid_from/to\` pair standing for several different events. |
| **Statistical measurement** | Reference period, reporting period and vintage are distinct identities | \`statistical.observations\` → \`statistical.periods\` / \`vintages\`; do not add another arbitrary row-validity interval without a unique purpose. |
| **Application/engine operational work** | Work created, started, completed, retried or reviewed | Jobs, claims, runs, gap attempts, drafts; timestamps describe those actions, not real-world validity. |

**Pattern inheritance nuance:** The user prefers an office's establishment/applicability to be traceable to the establishing law/pattern. A **real office record may still have independent historical lifecycle** not identical to the law's effective interval (exception, delayed establishment, administrative abolition). Resolve this per table: (A) derive as-of applicability from pattern/version, (B) explicit domain lifecycle events/typed relations, or (C) keep an independently justified interval. Do not infer that an existing office disappeared simply because a pattern definition changed.

### Date precision is NOT an automatic pair of fields

The user's preference is to **remove \`valid_from_precision\` and \`valid_to_precision\` by default**, including many tables where ordinary exact appointment or contract dates suffice. Preserve precision/uncertainty only where the *domain has a real use case* (e.g., approximate/partially known historical events, ancient historical names/territories, a source dating an event only to a month/year). Possible narrowly scoped techniques include date-specific precision, source-claim metadata, a historical date representation, or a specialized date-value table; **select based on query behavior**, not a global template. If a value is known only to year/month, never invent January 1 or a false exact date just to fit a conventional \`date\` column. Exact modern dates need no companion precision enum.

### \`is_current\` and other rigid booleans: prove nonredundancy

- Default proposal: **remove \`is_current\` when reliably derivable** from applicable effective interval, entity/relationship lifecycle or the current accepted version. A materialized view/index may be evaluated for performance, but one authoritative state must be maintained.
- Current at **which date**? Use an explicit as-of time and temporal/authority context. An undated \`is_current\` is not enough to answer historical queries; \`valid_to IS NULL\` alone is not proof that a future-dated or unapproved row is current.
- Review conflicts such as \`is_current=true\` + ended period, or a \`status=closed\` + \`is_current=true\`. If lifecycle state cannot be safely derived, model it **once**, with an explicit meaning and transition rules.
- Review \`status\`, \`is_singleton\`, \`active\`, \`version\`, \`created_at\`, \`updated_at\`, type flags, copied counts, duplicated jurisdiction/geo/legal fields and every other default copied column. **Do not drop valid \`created_at\`/versions blindly**: provenance, optimistic concurrency and immutable artifact identity may require them, but justify their presence and ownership explicitly.
- Separate factual/real-world states (appointed/vacant/retired), data-quality/research states (incomplete/disputed/verified), workflow states (queued/approved), and visibility states (published/archived/deleted). They must not be represented as one ambiguous \`status\` or redundant Booleans.

### Soft deletion: optional, targeted, and distinct from historical validity

**USER QUESTION / OPEN DECISION:** Should some tables use \`deleted_at\` for recoverable soft deletion? **ASSISTANT RECOMMENDATION:** Yes for suitable mutable, user-managed **operational objects**, not a blanket column everywhere.

| Kind of record | Proposed deletion/retirement policy |
|---|---|
| Draft pattern or watcher (not approved and unreferenced) | Allow recoverable \`deleted_at\` if useful, subject to permissions and audit; approved historical definitions should be versioned/retired, not silently erased. |
| Logical folder, file alias or editable user-managed UI record | Evaluate \`deleted_at\`/trash/restore, but preserved source-backed file versions and object retention may constrain deletion. |
| Canonical public office, geographical unit, legal text, official holder, supplier/organization | **Do not use \`deleted_at\` as a substitute for historical retirement, abolition, correction, merger or validity.** Keep canonical identity, source and history; use domain lifecycle and supersession. |
| Procurement transaction, financial record, electoral result, official statistical observation | Preserve history, version/supersession and evidence; corrections are not user-trash actions. |
| Source capture, file version, immutable evidence, audit event | Generally append-only and retained per retention/legal policy; use explicit lawful purge/redaction workflow when required, not casual soft deletion. |
| Sensitive/auth account or participation submission | Determine privacy, retention, consent and legal obligations; soft delete alone is **not** erasure. Anonymization or actual deletion may be required. |
| Engine run/job/gap | Use terminal status, outcome and retention; rarely needs \`deleted_at\`. |

Where adopted: define who may delete/restore, whether parent/child items are hidden or restorable, what happens to referencing FK rows, whether \`deleted_at\` uses UTC \`timestamptz\`, and if partial unique indexes such as \`WHERE deleted_at IS NULL\` are appropriate. Remember soft-deleted rows still exist, still satisfy FKs, and may still be seen in joins unless query/API policies filter them. Unique constraints, reusing natural keys, restore conflicts, audit reasons, retention and hard purges require explicit design. **Do not add both \`is_deleted\` and \`deleted_at\`** when the latter already describes the state.

Technical options to benchmark: PostgreSQL \`daterange\`/\`tstzrange\` and non-overlap constraints for genuinely temporal relationships (https://www.postgresql.org/docs/current/rangetypes.html), and filtered/partial unique indexes for recoverably deleted rows (https://www.postgresql.org/docs/current/indexes-partial.html). Neither is required on all tables, and PostgreSQL deployment version must be confirmed before relying on advanced temporal constraints.

### Mandatory per-table/column review and evidence before approved DDL

For **every** existing and proposed table, reviewers must record:

1. **Temporal question:** Does the entity or relationship itself have an independent real-world interval? Or is applicability inherited from a law, versioned pattern, source, parent or linked occurrence? Specify which.
2. **Every field disposition:** \`valid_from\`, \`valid_to\`, \`valid_from_precision\`, \`valid_to_precision\`, \`is_current\`, \`status\`, \`version\`, \`created_at\`, \`updated_at\`, \`deleted_at\`, lifecycle flags and duplicated helper columns: **KEEP, REMOVE, RENAME, DERIVE, MOVE TO RELATED TABLE, ADD (only if justified)**, with reasons.
3. **Meaningful named dates:** If specific dates belong to the record, prefer domain names (e.g. \`appointed_on\`, \`left_office_on\`, \`signed_on\`, \`commenced_on\`) and document uncertain or open-ended dates explicitly.
4. **As-of and history test:** Show current and historical queries before removing a field. Verify time boundaries, exceptions, amendments, overlapping roles and future scheduled starts.
5. **Deletion decision:** \`none / domain retirement / supersession / soft delete / restricted purge\`, with rationale, user visibility, authorizations and FK/unique effects.
6. **Lineage/integrity:** Identify the actual FK path to legal/pattern/geographic authority, and authoritative lifecycle event. Never replace hard FKs with a generic \`target_kind,target_id\`.
7. **Before/after SQL + preservation:** Measure non-null values and contradictory columns; reconcile imported data and version history; plan reversible migrations and API/Dryv updates. **No physical removals until expressly approved**.
8. **Human signoff:** Keep this decision as **OPEN** until the user reviews the specific table/columns and confirms intended meaning. An AI-created table matrix is not approval.

**This rule applies to all 18 schema redesign files** and to every additional retained physical schema (\`website\`, \`contact\`, \`staging\` etc.). The current accepted legacy schema and earlier database documentation are **not edited** until a separately approved coordinated code/DDL migration. See the original [master planning register](../mzizi-data-schema-storage-and-pipelines-redesign.md).

## Implementation safeguards (later, only after approval)

Run a read-only live schema and data inventory, reconcile drift, confirm orphan/duplicate counts, and benchmark representative SQL before proposing final DDL. Validate true FK support in Dryv/TypeORM generator. Use non-destructive migrations, staged constraint validation, stable IDs, versioning and compatibility/rollback plans. Database actions, code, tests and tasks are **not authorized by this planning guide**.

**Status: no schema design has been approved for implementation.**

## Related source redesign planning

See [source redesign and adaptive website intelligence](../source-redesign/README.md) for the consolidated planning-only review of unknown-site discovery, link/URL deduplication, optional YAML structures, semantic retrieval/ML, incremental processing, the dedicated vector index alternatives and the shared pattern-schema option. **No source/website collapse, new pattern schema or target table set has been approved.**


## 2026-11-07 addition: meaningful column names and centrally monitored data freshness

**USER REQUIREMENT FOR HUMAN REVIEW, NOT APPROVED DDL:** Prefer names that tell the reader what the column represents **in its own table**. Do not rename all `valid_from`/`valid_to` columns mechanically to an equally vague pair, and do not create a second per-table blanket of `last_checked_at`, `last_verified_at`, `hot` or `next_refresh_at` fields. Extend the prior temporal/minimal-field review with these two tests.

### Semantic naming convention: meaning first, consistent syntax second

**Exception (user direction, 2026-11-08):** identity codes are always a column named exactly `code`, with the single hierarchical shape defined in `.docs/rules/code-columns.md`. Do not prefix it (`registry_code`, `seed_code`); the "meaning first" guidance below applies to every other column.

| Existing generic pattern | Better **domain example**, subject to source semantics | Distinction to validate |
|---|---|---|
| `political.memberships.valid_from/to` | `joined_on` / `left_on` | Joining date may differ from registration/approval/announcement |
| `governance.holders.valid_from/to` | `appointed_on`, `assumed_office_on`, `left_office_on` | Legal appointment, assumption and departure are distinct events |
| `legal.instruments.valid_from/to` | `enacted_on` / `commenced_on` / `repealed_on` | Publication, assent and force of law may differ |
| `procurement.tenders.valid_from/to` | `published_at` / `closes_at` | Tender issuance is not contract effective period |
| `procurement.contracts.valid_from/to` | `signed_on` / `effective_from` / `expires_on` | Signature, effective date and termination differ |
| `geography.boundaries.valid_from/to` | `effective_from` / `effective_until` | Dated boundary relation is not necessarily legal jurisdiction's existence |
| `participation.submissions.valid_from/to` | `submitted_at` / `withdrawn_at` | Submission/withdrawal is an action, not generic truth-validity |
| `source.captures` | `fetched_at` / `captured_at` | Retrieval is not successful verification |

**Suffix guidance:** `_on` ordinarily means calendar date, `_at` precise timezone-aware timestamp, and `_from` / `_until` an interval with documented inclusive/exclusive boundaries. Apply only where actual facts match. Exact modern dates normally need no companion `from_precision` / `to_precision`. Historical/partial dates should preserve uncertainty without manufacturing a precise day. A generic validity interval remains legitimate **if the relation itself genuinely has interval validity** and this terminology is clearest.

**Mandatory column decision per table:** (1) the exact fact and source meaning; (2) whether a parent pattern/legal provision already owns applicability; (3) KEEP / RENAME / REMOVE / DERIVE / MOVE / ADD; (4) user-facing example row; (5) real as-of/current query; (6) hard-FK and migration consequences; (7) user validation. Names are **examples**, not approved column mappings.

### Data freshness is cross-cutting monitoring metadata, not real-world status

**USER PROPOSAL:** Classify the changing nature of data and continuously track last check, last successful verification, source observation, due time and refresh history. **ASSISTANT RECOMMENDATION:** Use versioned rules under proposed `reference` ownership and operational verification/check records in `engine`, supported by `source` evidence. A table-level freshness default must be overridable for **field groups, relationships, specific canonical records and sources**; some office identities are cold even while holder relations are hot.

Policy labels `hot` / `warm` / `cold` / `event-driven` describe *monitoring priority*, not fact truth, source authority or the existing seeded/collected/derived origin class. Exact labels and intervals are OPEN. Schedule/freshness priority may adapt to upcoming legal deadlines, elections, procurement closing dates, source change rates, source trust, cost and risk.

| Monitoring concept | Meaning; recommended owner |
|---|---|
| `last_checked_at` | Last attempted check, successful or failed; engine run/check ledger |
| `last_verified_at` | Last evidence-backed confirmation **of this particular fact or relationship**, even if its value is unchanged; verification history |
| `last_source_seen_at` | Last source availability/response/observed publication; source/crawl history |
| `last_changed_at` | Last **clearly defined** source/claim/canonical change—not one ambiguous timestamp for all three |
| `next_check_at` | Scheduler policy result or queued check, recalculable when rule/priority changes |
| `verification_status` | Verified/overdue/unknown/conflicted/unavailable states; distinguish current fact accuracy from workflow status |

A website downloaded today may be stale as an authority for a public appointment. A legal text written decades ago may still be authoritative. **Stale means the evidence has exceeded a verification policy, not that the canonical fact is false.** An unchanged confirmed result advances successful verification, not the canonical row's factual modification time. An inaccessible page advances the attempt timestamp but must not masquerade as verification.

### Schedules/events/manual triggers must work through one control plane

The proposed sequence is: `reference` schedule and watch policy → planned/announced/verified `activity` occurrence or verified source change → `engine` scheduler/admission and dedup → bounded research pipeline → `source` proof → controlled candidate/review/promotion → freshness record or corrected canonical fact. An admin/agent can additionally request a scoped recheck **without asserting an event**. Scheduled time passing is never proof a real-world event happened. Admin event submissions require permissions and evidence; approval state must be distinguishable.

Reuse existing `engine.jobs`, `gaps`, `staging` and `source.verifications` before adding new records. Reuse a **single scheduler/lease/host admission boundary** across third-party tool adapters; never spawn multiple competing independent polling loops. All event-to-domain links and target fact/field-group associations must eventually satisfy the user's **hard cross-schema FK** integrity policy.

**Example validation:** a scheduled election triggers candidate monitoring but not fictitious results; an officially published census report refreshes relevant `statistical` vintages; parliamentary schedule changes trigger legal agenda research; a budget submission deadline triggers verification rather than auto-approval; an admin adding an appointment announcement creates a sourced proposal and holder recheck, not an unverified appointment.

**Approval status:** naming policy and freshness/event-driven requirements are newly recorded planning directions. Specific table sets, physical column names, monitoring cadence, source verification threshold, role permissions and approval/promotion rules remain for the user's schema-by-schema sign-off. See [activity](activity.md), [reference](reference.md), [engine](engine.md), [source](source.md), [independent pipelines](../independent-data-pipelines.md).
