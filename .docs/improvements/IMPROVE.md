---
{id: TASK-WORKSPACE-IMPROVE,name: Improve,type: workspace-guide,tags: [task,agent-guidance]}
---
# MZIZI Africa — Proposed Architecture Redesign

> **Later clarification (2026-11-07):** The following schema catalogue and any references to merging `source` and `website` are **unapproved alternatives**, not user-approved decisions. A dedicated cross-domain `pattern` schema is also only under evaluation. See [source redesign and adaptive website intelligence](source-redesign/README.md) for the consolidated planning-only review of unknown-site discovery, link/URL deduplication, optional YAML structures, semantic retrieval/ML, incremental processing, the dedicated vector index alternatives and the shared pattern-schema option. **No source/website collapse, new pattern schema or target table set has been approved.**

Status: Planning only — no repository changes authorized.

Your 18 decisions establish a clear direction: MZIZI should become a simpler, strongly connected PostgreSQL system, with explainable tables, enforceable relationships, reusable data-generation patterns, and independently running acquisition pipelines.

The goal is not to minimize the number of schemas at any cost. It is to remove unnecessary complexity without losing historical accuracy, traceability, functionality or data.

## 1. First major decision: restore real foreign keys

Your instruction to remove the old prohibition on cross-schema foreign keys is accepted as a design requirement.

The current repository explicitly forbids them in `.docs/docs/DATABASE_DESIGN.md` and `.docs/rules/database-naming.md`. I recommend replacing that rule with:

> All persistent relationships between known PostgreSQL tables should use database-enforced foreign keys wherever structurally appropriate, including across schemas. Exceptions must be documented and justified.

PostgreSQL supports schema-qualified references such as:

```
CREATE TABLE governance.institutions (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    jurisdiction_id uuid NOT NULL
        REFERENCES reference.jurisdictions(id),
    scope_geo_unit_id uuid
        REFERENCES geography.units(id)
);
```

That gives us database-enforced referential integrity, rather than relying on an application integrity job to discover broken relationships after they occur. PostgreSQL supports foreign-key constraints, and referencing columns should also be indexed where appropriate.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.postgresql.org\&sz=32)

postgresql.org



We should apply the following rules:

- Use real foreign keys for people, institutions, offices, geography, laws, organizations, budgets, procurement and other known tables.
- Use explicit junction tables for many-to-many relationships.
- Default to `ON DELETE RESTRICT` or `NO ACTION` for important historical and canonical records. Do not cascade-delete public history accidentally.
- Use stable entity identities so historical versions can change without breaking references.
- Retain flexible references only where a relationship genuinely spans several unrelated target types; evaluate replacing existing `target_kind + target_id` references with typed junction tables.
- Preserve evidence and correction history when introducing the new constraints.

Tradeoff: stronger cross-schema references make eventual physical separation into multiple databases more involved. That's acceptable for MZIZI's current integrated PostgreSQL design. If a service moves into a different database later, its foreign keys will need a deliberate redesign rather than silently becoming unenforced.

This also means we should no longer optimize the database around the assumption that every schema must be independently extractable into another database.

## 2. Proposed target schema catalogue

Based on your decisions, I recommend working toward approximately 18–19 schemas, subject to the detailed table and column audit.

This is a provisional design, not a final approved count.

| Target schema   | Existing schemas affected        | Proposed responsibility                                                                  |
| --------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| `reference`     | `reference`                      | Well-organized classifications, classification groups and controlled vocabularies        |
| `geography`     | `geography` + `place`            | Geographic units, hierarchies, boundaries, physical places and presence                  |
| `legal`         | `legal`                          | Laws, constitutions, instruments, legislative processes, provisions and legal authority  |
| `person`        | `person`                         | Real individuals, their names, profiles and public identities                            |
| `organization`  | `organization`                   | Organizations, legal entities, registrations, identifiers and ownership                  |
| `governance`    | `governance` + `civic`           | Institutions, offices, office holders, public services and service responsibilities      |
| `political`     | `political`                      | Parties, political membership, party organization and leadership                         |
| `electoral`     | `electoral`                      | Elections, electorates, candidates, seats, results and referendums                       |
| `finance`       | `finance` + `debt`               | Budgets, revenue, expenditure, transfers, funds and borrowing                            |
| `procurement`   | `procurement`                    | Procurement processes, procuring entities, bids, awards and contracts                    |
| `statistical`   | `statistical`                    | Indicators, datasets, observations, dimensions, methodology and derived statistics       |
| `activity`      | `calendar`                       | Events, actions, public updates and timelines                                            |
| `filesystem`    | `filesystem`                     | Logical files, folders, tags, object references, versions and attachments                |
| `source`        | `source` + potentially `website` | Sources, websites, publishers, documents, captures, provenance and verification          |
| `auth`          | `identity` + `access`            | Accounts, authentication, roles, permissions and grants                                  |
| `audit`         | `audit`                          | Immutable system audit trail and accountable decisions                                   |
| `participation` | New                              | Public participation, official participation, submissions, feedback and consultations    |
| `engine`        | `engine` + `staging`             | Pipeline execution, data processing, pattern execution, candidates and review workflows  |
| `contact`       | `contact`                        | Temporary retention pending a decision on the proper home for shared contact information |

The most consequential consolidations would be:

- `identity` + `access` → `auth`
- `geography` + `place` → `geography`
- `finance` + `debt` → `finance`
- `governance` + relevant `civic` functionality → `governance`
- `calendar` → `activity`
- `source` + relevant `website` functionality → simplified `source`
- `engine` + `staging` → `engine`

`audit` stays distinct from the new `participation` domain.

Importantly, merging schemas does not mean blindly merging their tables. For example, an office, an office holder, and an institution must remain distinguishable even if they all belong to `governance`.

## 3. Detailed design of the most important domains

### A. Geography — merge geography and physical places

My recommendation is a single `geography` schema with two clearly separated groups of tables.

| Group               | Candidate tables                   | Purpose                                                                  |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| Geographic units    | `units`, `levels`, `relationships` | Countries, counties, constituencies, wards and other territorial systems |
| Geographic history  | `boundaries`, `names`, `changes`   | Boundary versions, historical names and territorial changes              |
| Geographic querying | `unit_paths`                       | Efficient ancestor/descendant relationships                              |
| Physical locations  | `places`, `occupancies`            | Buildings, offices, sites, facilities and their users                    |
| Expected presence   | `expectations`                     | Where an institution or service is expected to have a presence           |

`levels` and `unit_paths` are proposed. The others mostly exist today, although some would move from `place`.

I would not force a county and an office building into the same table. A county is a territorial/administrative unit. A building is a physical location within a geographic unit.

#### Resolving the high-level vs low-level geographic query problem

You specifically raised an important issue: if a record belongs to Kenya, how should it be found when someone queries Nairobi County? And how should records linked to wards be included when someone queries Kenya?

I recommend comparing three approaches:

| Approach                                                      | Advantages                                    | Disadvantages                                           |
| ------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| Direct `geo_unit_id` only                                     | Simple FKs and fast exact lookup              | Cannot answer hierarchical queries alone                |
| Parent/child relationships with recursive SQL                 | Simple storage, flexible hierarchy            | Recursion required for many queries                     |
| Parent/child relationships plus a maintained hierarchy lookup | Fast upward/downward queries and explicit FKs | Requires maintenance when boundaries/hierarchies change |

Recommendation: use the third approach if query testing confirms the benefit.

Keep authoritative hierarchy relations, and introduce a derived lookup such as:

```
geography.unit_paths
--------------------
ancestor_id       FK -> geography.units
descendant_id     FK -> geography.units
relationship_kind
depth
valid_from
valid_to
```

Both geographic unit columns are real foreign keys.

This supports queries such as:

- All counties and wards under Kenya.
- Every institution whose legal service area includes Nairobi.
- All tenders specifically associated with a constituency.
- All county records aggregated upward to a country.
- Which administrative or electoral hierarchy was applicable during a historical period.

PostgreSQL supports recursive hierarchical queries through `WITH RECURSIVE`; the maintained path table is an optimization for frequent queries, not a replacement for the authoritative hierarchy.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.postgresql.org\&sz=32)

postgresql.org



Geographic query directions

Kenya

Country root unit

County

Constituency

Ward

Roll up

Ward → country

Expand scope

Country → counties and wards

We must distinguish scope inheritance from statistical aggregation. A nationwide ministry may be relevant to every county, but a nationwide population observation cannot simply be copied into every county.

I also recommend keeping `jurisdiction_id` and `scope_geo_unit_id` as distinct concepts:

- `jurisdiction_id`: which legal or administrative jurisdiction governs the record.
- `scope_geo_unit_id`: which geographic unit the record covers.

For jurisdiction-wide records, the scope should point to the jurisdiction's root geographic unit, not remain null. But if a supplier's geographical operating area is unknown, we must not claim it serves the whole country just because it was registered there.

Historical relationships and overlapping geographic hierarchies must remain supported. The Kenya county/constituency/ward hierarchy is one application of the model, not a hard-coded worldwide hierarchy.

### B. Legal — neutral and globally applicable

I agree with your direction not to design the entire system around Kenya's Constitution or parliamentary procedures.

I propose this conceptual structure:

| Table               | Purpose                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `legal.instruments` | Constitutions, Acts, regulations, decrees, ordinances, treaties and other legal instruments |
| `legal.provisions`  | Articles, sections, clauses, schedules and other provisions                                 |
| `legal.proposals`   | Bills and other proposed legal instruments or changes                                       |
| `legal.processes`   | Legislative, amendment, approval or other legally defined processes                         |
| `legal.proceedings` | Readings, hearings, committee consideration, voting, assent and other steps                 |
| `legal.amendments`  | Amendments to existing instruments                                                          |
| `legal.changes`     | Specific changes to provisions and their effects                                            |
| `legal.links`       | Relationships between legal instruments and other records                                   |
| `legal.rules`       | Structured, legally established rules usable by other domains                               |

These are candidate tables, not a complete final legal model.

The crucial design principle is that process steps must be jurisdiction-configurable.

For example, the UK parliamentary process includes readings, committee and report stages, agreement between Houses and Royal Assent. Other countries have different legislative procedures or types of executive and customary legal authority.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://guidetoprocedure.parliament.uk\&sz=32)

UK Parliament



We should not have one worldwide hard-coded enum containing Kenyan legislative steps.

Instead:

`jurisdiction` → `applicable legal process definition` → `actual proposal/process` → `recorded proceedings` → `resulting instrument or change`.

Legal rules that generate offices should connect at the rule-definition level, such as:

`legal.provisions` → `governance.rules` → `governance.office_patterns` → generated offices.

Individual offices would retain their generation lineage, so we could trace the legal basis without copying the same legal reference to every generated row.

Legal applicability is also different from evidence. A law defines or authorizes something; a source document proves that a particular event or appointment occurred.

### C. Reference — simplify without weakening traceability

`reference.classifications` currently carries many different classification schemes. It is flexible, but the meaning of a referenced ID is often not obvious from the column alone.

I propose considering:

- `reference.schemes`: defines a classification system, its purpose and jurisdiction.
- `reference.values`: contains its controlled values, optional hierarchy and validity.
- Domain-specific lookup tables for important concepts whose behavior goes beyond a generic label.

For example, legal instrument types may remain classifications, while legislative process definitions should have their own structured tables.

A foreign key to `reference.values(id)` proves that the value exists; it does not prove that it belongs to the required scheme. We should enforce scheme compatibility through composite constraints or explicit domain tables where appropriate.

The location of `reference.jurisdictions` also requires review. It might stay as a stable reference identity or move into a more appropriate geographical/legal structure. This is not decided yet.

### D. Auth, participation, audit and engine

These responsibilities should be unambiguous.

| Schema          | Owns                                                                                                 | Does not own                       |
| --------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `auth`          | Accounts, roles, permissions, grants, authentication-related data                                    | Public feedback, research findings |
| `participation` | Public submissions, consultation responses, discussion, official responses                           | Pipeline review approvals          |
| `audit`         | Immutable records of actions, decisions and who performed them                                       | Current job scheduling state       |
| `engine`        | Pipeline definitions/runs, candidates, quality findings, pattern execution and review workflow state | Public participation content       |

For `auth`, the initial mapping is straightforward:

`identity.accounts`, `identity.grants`, `access.roles`, `access.permissions` and `access.role_permissions` move into the unified schema, with appropriate relationship tables and constraints.

For `participation`, I suggest researching:

`consultations`, `submissions`, `feedback`, `responses`, `comments`, and relevant participant-role relationships.

It should support both public and official participation, including attachments and links to legislation, institutions, projects, geographic units or activities.

A public comment is not automatically an audit event. An engine review decision is not a public participation response. All three may be related, but they should not be stored as though they are identical.

### E. Procurement — proposed design, not yet approved

You explicitly said this requires more discussion.

I recommend a hybrid model that makes the most important parties easy to query while still supporting procurement processes involving multiple suppliers.

| Candidate table          | Important columns or relationships                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `procurement.processes`  | `id`, `ocid`, `buyer_id`, `jurisdiction_id`, `status`, important dates                            |
| `procurement.tenders`    | `process_id`, `procuring_entity_id`, `method_id`, publication/closing dates, estimated value      |
| `procurement.bids`       | `tender_id`, `bidder_id` or bidder-party relationship, price, currency, submission date, status   |
| `procurement.awards`     | `tender_id`, award date, value, status, decision references                                       |
| `procurement.contracts`  | `process_id`, `award_id`, contract type, signed/effective/end dates, amounts, currency and status |
| `procurement.parties`    | Organization FK, process/award/contract relationship and participant role                         |
| `procurement.items`      | Procured goods, works or services, quantities and classifications                                 |
| `procurement.locations`  | Delivery/project geography, separate from supplier registration and headquarters                  |
| `procurement.milestones` | Performance targets, deadlines and completion evidence                                            |
| `procurement.variations` | Amendments to price, scope, dates or other contract terms                                         |

Why not simply add `supplier_id` to every table?

Because a procurement process can have bidders that never become suppliers, awards can involve more than one supplier, and the paying buyer may differ from the procuring entity. OCDS explicitly models these distinctions and supports multiple suppliers on an award.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://standard.open-contracting.org\&sz=32)

standard.open-contracting.org+1



Direct FKs remain appropriate where the role is clearly singular, but role-based junction tables are preferable for variable-cardinality participation.

The exact procurement column design remains open for your approval.

## 4. A universal data classification and pattern-generation system

This is one of your strongest requirements, so I recommend treating it as a database-wide design contract rather than an isolated feature of the current data engine.

### The four acquisition categories

| Code             | Class     | Meaning                                     |
| ---------------- | --------- | ------------------------------------------- |
| `seed_static`    | Seeded    | Individually curated records                |
| `seed_pattern`   | Seeded    | Records generated from established patterns |
| `auto_collected` | Automated | Externally collected or extracted records   |
| `auto_derived`   | Automated | Calculated from existing data               |

Each domain must document which classes are supported by its tables.

However, the class of a table and the class of an individual record are different things. A governance office table might contain both manually curated offices and pattern-generated offices.

I therefore recommend three layers of classification.

### Layer 1 — Schema and table documentation

Every schema and table receives PostgreSQL comments and corresponding Markdown documentation.

For example, the future migration could include:

```
COMMENT ON SCHEMA governance IS
'Government institutions, offices, holders and public services.';

COMMENT ON TABLE governance.offices IS
'Government offices. Acquisition: seed_static, seed_pattern,
auto_collected. Generated offices retain pattern lineage.';

COMMENT ON COLUMN governance.offices.scope_geo_unit_id IS
'Geographic territory represented or served by this office.';
```

PostgreSQL supports comments on schemas, tables and columns, which can be read by database tools.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.postgresql.org\&sz=32)

postgresql.org



I recommend a machine-readable schema inventory in Markdown or JSON alongside these comments so our tooling can validate that documentation is complete.

### Layer 2 — Pattern definitions and versions

Patterns should be first-class, editable, versioned database records.

My preferred hybrid approach:

- A central pattern registry identifies every pattern and version.
- Eligible domains define their own domain-specific pattern rules.
- Large CSV, JSON or structure bundles can be associated with versioned `filesystem` files.
- Every generation run records its pattern version, inputs, scope, results and changes.
- Existing patterns can be viewed, compared, edited and executed through the admin dashboard.

Examples of possible domain pattern tables:

| Schema        | Example pattern                                                          |
| ------------- | ------------------------------------------------------------------------ |
| `governance`  | Governor, county assembly and constituency office structures             |
| `geography`   | Administrative-unit classifications and expected geographical structures |
| `legal`       | Jurisdiction-specific legislative procedures                             |
| `source`      | Government website discovery and structure patterns                      |
| `finance`     | Fiscal reporting-period and required reporting structures                |
| `statistical` | Expected indicator series and coverage dimensions                        |

We should only add these tables when the domain genuinely needs configurable pattern behavior.

### Layer 3 — Generated record lineage

A generated record needs to answer:

- Which pattern produced me?
- Which version was used?
- Which input records were involved?
- Which generation run created me?
- Am I still justified by the current pattern?
- Has someone independently verified or corrected me?

I propose a shared execution model:

```
Pattern definition
    ↓
Pattern version
    ↓
Generation run
    ↓
Generated output
    ↓
Canonical domain record
```

The links should use explicit FKs wherever the target tables are known.

A new pattern version should calculate a difference between expected outputs and current outputs, instead of blindly recreating or overwriting all rows.

For example, if a legal amendment changes the number of required offices, generation should report what must be created, retired or reviewed. It must not automatically alter historical office-holder records.

### Should generation run through PostgreSQL procedures?

Use a hybrid approach, but keep it deliberately small.

PostgreSQL functions/procedures are appropriate for deterministic, set-based transformations that only depend on database data, such as generating simple expected records from verified geographic units.

Application workers are more appropriate for complex pattern evaluation, large file inputs, external APIs, AI-assisted work, historical reconciliation and multi-stage review.

For either approach, use the same generation-run metadata and validation policy. A database function must not bypass provenance, versioning or audit requirements.

## 5. Hard foreign keys for generic evidence and links

There is one particularly important unresolved design problem.

Some existing tables use:

`target_kind` + `target_id`

This allows one attribution or attachment to point to many different domain tables. But PostgreSQL cannot enforce that pair as a conventional FK to an arbitrary table selected by a string.

We have two serious choices.

| Option                            | Benefit                                                              | Cost                                                               |
| --------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Explicit typed association tables | Strong FKs to actual domain rows; clear meanings                     | More tables and relationships                                      |
| Shared canonical record registry  | One consistent FK target for generic evidence, files and audit links | Requires a registry and strict synchronization with domain records |

I lean toward typed FKs for important business relationships, and considering a small canonical record registry for truly generic references such as evidence and attachments.

A registry would need database-enforced integrity or transactional registration so a record-reference entry could never be mistaken for proof that its corresponding domain row exists.

I would not approve the old polymorphic soft-link pattern as a blanket design.

This decision needs a dedicated technical assessment before changing `source.attributions`, `filesystem.attachments`, `audit` or participation links.

## 6. Filesystem and existing self-hosted object storage

Your decision is clear: MZIZI must integrate with your already deployed object-storage service. We must not create another Docker-based storage service inside this repository.

The responsibilities should be:

| Existing object-storage service            | MZIZI `filesystem`                                     |
| ------------------------------------------ | ------------------------------------------------------ |
| Store binary objects                       | Store logical file identity                            |
| Provide S3-compatible operations           | Manage folders and tags                                |
| Issue or support access URLs               | Track metadata and file history                        |
| Enforce configured storage access policies | Manage attachments to domain entities                  |
| Handle storage-level capabilities          | Compute/track logical deduplication and provenance     |
| Serve public/private objects               | Determine file visibility and request appropriate URLs |

I recommend retaining the important existing tables:

`stores`, `objects`, `files`, `versions`, `folders`, `attachments`, and `variants`.

Review the necessity and placement of `formats`, `uploads`, and `events`, and consider adding `tags` and `file_tags`.

The file manager should provide full logical file management while the object store remains responsible for the actual bytes.

Public files should normally have usable public URLs, where publication is lawful and the content is intended to be public. Private or restricted files should use the object service's appropriate access mechanism. We should not automatically make every downloaded public document private, nor assume that everything accessible on the internet is legally republishable.

For signed URLs, the service can grant time-limited access without exposing backend credentials.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://docs.aws.amazon.com\&sz=32)

Amazon Simple Storage Service



The exact integration still requires confirming your deployed service's endpoint contracts, credentials, public URL configuration, bucket structure and supported API capabilities. No deployment changes are proposed.

## 7. Replace the data engine with independently runnable pipelines

You asked what this would actually mean in code.

I recommend modular pipeline packages running through a shared orchestration system, rather than starting with dozens of independently deployed microservices.

A pipeline is a complete workflow with a specific outcome. A package is reusable functionality called by multiple pipelines.

For example:

Pipeline orchestration

Schedules runs, tracks dependencies and coordinates workers

County leadership pipeline

Procurement pipeline

Statistics pipeline

Legal publications pipeline

Reusable packages

Fetch • File client • Extract • AI agent • Normalize • Match • Validate • Generate

Candidates, review and canonical database

Shared integrity, versioning and promotion rules

An illustrative target code layout:

```
source/backend/
├── pipelines/
│   ├── county-leadership/
│   ├── procurement/
│   ├── statistics/
│   ├── legislation/
│   └── website-discovery/
│
├── packages/
│   ├── pipeline-sdk/
│   ├── source-client/
│   ├── file-client/
│   ├── scraper/
│   ├── extractor/
│   ├── agent/
│   ├── matcher/
│   ├── validator/
│   └── pattern-generator/
│
├── workers/
│   ├── scheduler/
│   └── runner/
│
├── engine/
│   └── database/
│
└── api/
```

These directories illustrate ownership; the final Python/TypeScript packaging and naming remain open.

An individual pipeline could look conceptually like this:

```
# Proposed interface — not current repository codeclass CountyLeadershipPipeline(Pipeline):    name = "county-leadership"    version = "1"    def inputs(self, context):        return context.geography.counties("ke")    def build(self, county):        return workflow(            discover=DiscoverOfficialSources(county),            capture=FetchAndStore(                depends_on="discover"            ),            extract=ExtractLeadership(                depends_on="capture"            ),            match=MatchPeopleAndOffices(                depends_on="extract"            ),            validate=ValidateCandidates(                depends_on="match"            ),            review=SubmitForReview(                depends_on="validate"            ),        )
```

For each county, the scheduler creates an independent execution. Multiple counties can run concurrently with bounded concurrency, while the procurement and statistical pipelines run independently at the same time.

Shared steps may reuse existing immutable artifacts and extraction results through content hashes.

A pipeline should be able to run from a CLI, through a scheduler, or via an admin-dashboard action.

### Recommended operational tables

The consolidated `engine` schema could own:

| Table                | Responsibility                              |
| -------------------- | ------------------------------------------- |
| `pipelines`          | Registered pipeline identities              |
| `pipeline_versions`  | Versioned execution definitions             |
| `runs`               | Each pipeline or generation execution       |
| `jobs`               | Individual runnable tasks                   |
| `dependencies`       | Task/run dependencies                       |
| `candidates`         | Proposed canonical records                  |
| `issues`             | Validation or extraction issues             |
| `reviews`            | Review workflow state                       |
| `promotions`         | Canonical promotion outcomes                |
| `patterns`           | Shared pattern registry                     |
| `pattern_versions`   | Immutable versions of pattern definitions   |
| `generations`        | Pattern execution records                   |
| `generation_outputs` | Generated-record lineage                    |
| `gaps`               | Missing information identified for research |
| `quality_findings`   | Conflicts, anomalies and failed checks      |

These are conceptual targets. Several already exist under `engine` or `staging`, and should be reused instead of duplicated.

### Why I recommend this over microservices initially

The current PostgreSQL job queue already uses `SKIP LOCKED`, input hashes, retries and generation numbers. Those are useful foundations for multiple workers. PostgreSQL explicitly supports `SKIP LOCKED` for queue-like concurrent consumption.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.postgresql.org\&sz=32)

postgresql.org



Start with independent packages and worker processes. Split them into separately deployed services only when operational requirements justify it.

This gives you independent concurrent execution without prematurely adding service discovery, distributed transactions, multiple databases and a separate message broker.

## 8. Data correction, deduplication and change detection

Your selected policy is appropriate: correction automation should vary by data class, evidence quality, sensitivity and type of change.

I propose this initial policy matrix:

| Data type               | Automatic action                                            | Review required                                          |
| ----------------------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| Static seeds            | Revalidate and report differences                           | Changing established canonical facts                     |
| Pattern outputs         | Regenerate expected records using approved pattern versions | Conflicts with independently verified records            |
| Collected data          | Detect duplicates and unchanged content                     | Disputed identities or consequential contradictory facts |
| Derived data            | Recalculate when dependencies change                        | Changes to formulas or disputed inputs                   |
| Sensitive relationships | Flag possible matches                                       | Merging identities or publishing sensitive claims        |

Hashing should operate independently at source-artifact, extraction-output, candidate-payload and derived-result levels.

A changed source should only invalidate dependent work, not every pipeline in the system.

Corrections should distinguish two times:

- Valid time: when a fact was true in the real world.
- Recorded time: when MZIZI knew or accepted it.

That is how we can preserve a statement that was once believed to be correct, record a later correction, and avoid rewriting history.

## 9. Migration strategy for the full 141-table pass

We should not begin by renaming schemas.

The safe implementation sequence is:

0

Phase 0 — Inventory

Audit every table and column, foreign key, index, source link, generated record, pattern, API contract and actual database constraint.

1

Phase 1 — Approve logical design

Finalize target schemas, table ownership, naming, column standards, pattern contracts, record identity and geographic/legal relationships.

2

Phase 2 — Prepare and reconcile data

Identify duplicate entities, broken references, historical keys, orphaned rows and migration conflicts before adding constraints.

3

Phase 3 — Establish hard constraints

Add required FKs and indexes, backfill references, validate constraints and measure remaining integrity gaps.

4

Phase 4 — Non-destructive consolidation

Move/rename tables, preserve IDs and data, regenerate contracts, update API queries and provide compatibility where required.

5

Phase 5 — Storage integration

Connect the existing S3 service and improve file metadata, tags, public URLs, versioning and deduplication.

6

Phase 6 — Pipeline architecture

Extract standalone packages and pipelines incrementally, retaining working ingestion and promotion workflows.

7

Phase 7 — Quality and generation UI

Build pattern editing/synchronization, pipeline operations, missing-data dashboards, review tools and correction workflows.

For introducing FKs on existing populated tables, PostgreSQL provides `NOT VALID` followed by `VALIDATE CONSTRAINT`, which can help separate constraint installation from historical-data validation. We would use that carefully after resolving incompatible records.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://www.postgresql.org\&sz=32)

postgresql.org



For every migration, I would require record-count reconciliation, preserved primary identities, verified relationships, lineage continuity, applicable API compatibility and a rollback or recovery plan.

## 10. Decisions still unresolved

These need your explicit review before the relevant architecture is considered approved.

| Area                   | Open decision                                                                            | My current preference                                                   |
| ---------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `contact`              | Keep its own schema or redistribute its tables?                                          | Assess real usage first                                                 |
| Jurisdictions          | Where should jurisdiction identity live, and how should it relate to country/root units? | Stable jurisdiction identity plus explicit geo relationship             |
| Hierarchical queries   | Parent references only, or maintained ancestor/descendant paths?                         | Both, with the path table maintained from authoritative hierarchy       |
| Generic evidence links | Typed association tables or a canonical record registry?                                 | Direct typed FKs, plus registry only where essential                    |
| `source` + `website`   | Which website tables are domain data versus crawler configuration or monitoring state?   | Consolidate, but retain source permission assessments                   |
| Pattern storage        | How much is stored directly in PostgreSQL versus versioned files?                        | Database metadata and small rules; versioned files for large artifacts  |
| Pattern execution      | What may run in SQL versus workers?                                                      | Deterministic database operations in SQL, complex operations in workers |
| Procurement            | Singular party columns, party-role junctions, or hybrid?                                 | Hybrid; not yet approved                                                |
| Pipeline deployment    | Separate worker packages or separately deployed services?                                | Independent worker packages first                                       |
| Storage integration    | Exact S3 endpoint, public URL behavior and credential capabilities                       | Follow the existing deployed service                                    |
| Corrections            | Precise automatic correction rules by domain and field                                   | Policy matrix with increasingly strict review for consequential facts   |
| Participation          | Scope of public comments, consultations, official responses and moderation               | Separate participation schema, with audited actions                     |
| Canonical versioning   | Stable entity identity versus per-version row identity                                   | Explicit stable identity and separate historical versions where needed  |

### One additional issue worth resolving early

The current repository's Dryv-generated entities and migration tooling assume the existing schema design. Moving to cross-schema hard FKs and consolidating schemas requires checking that the Dryv contract generator can express and reliably generate these relationships. Otherwise, we must plan a corresponding tooling change rather than relying on hand-written database constraints that the contract layer does not understand.

## 11. What is approved, proposed and deferred?

Confirmed design requirements

Strong foreign keys, comprehensive comments and documentation, separate person/organization/governance identities, finance absorbing debt, `activity` replacing `calendar`, `auth` consolidation, distinct participation, reusable pattern support, existing external object storage, and policy-based correction.

My recommendations, awaiting design approval

The provisional 18–19-schema catalogue, geography hierarchy lookup, legal process tables, source/website consolidation, detailed engine tables, pattern registry, and modular worker architecture.

Explicitly unresolved

Procurement modeling, generic FK strategy, contact ownership, jurisdiction placement, exact pipeline deployment boundaries, and the detailed column-by-column design.

The next appropriate deliverable is a complete database redesign matrix, starting with `reference` and `geography`, where every existing table and column receives a proposed target, relationship rules, allowed data classes, pattern eligibility and a keep/change/remove decision.

We should use that process to finalize the overall schema catalogue before writing migrations.

Repository status: unchanged. This remains a planning proposal only; no commits, migrations, task files or automation have been created.