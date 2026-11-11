---
id: DOC-MZIZI-SCHEMA-POLITICAL-20261111
name: political schema review proposal
type: schema-review
tags: [database, schema-redesign, main, user-review]
extra: {status: proposed, approval: not_approved, implementation: not_authorized, database: Main, recorded_on: 2026-11-11}
---

# political schema — review and approval proposal

> **PROPOSED — USER REVIEW REQUIRED.** This is the review authority for whether the schema should exist and which tables/columns it owns. No SQL or migration is authorized.

## Purpose and ownership

**Target:** Main. **Purpose:** Political parties and political affiliations. This separate schema is a proposal based on distinct lifecycle, vocabulary and queries; merging or rejection remains open. Related owners: person,organization,governance,electoral.

## Current implementation and gaps

The active manifest has 30 manifest migrations and 49 distinct CREATE TABLE declarations (49 distinct current table names) in schemas `audit`, `auth`, `engine`, `filesystem`, `geography`, `legal`, `objects`, `reference`. Generated Dryv has 124 entities (digest `e0087da9cf5b00e91f283a5501c368c7696bdd841ea30629231dc9c590f7c1ee`). Counts describe current artifacts, not target design; SQL and Dryv diverge.

- SQL declarations: None found.
- Dryv entities: `political.ideologies` (political.Ideology), `political.parties` (political.Party), `political.alignments` (political.PartyIdeology), `political.memberships` (political.PartyMembership), `political.positions` (political.PartyPosition), `political.holders` (political.PartyPositionHolder), `political.units` (political.PartyUnit)

The inventory does not establish live database state and may miss ALTER-only changes. Before implementation, reconcile migrations, Dryv, generated output and callers.

## Proposed relationship map

> All nodes and edges are proposals. Main schemas may use local cross-schema foreign keys; no edge crosses the Main/Operations database boundary.

```mermaid
flowchart LR
  geography_jurisdictions["geography.jurisdictions"]
  organization_entities["organization.entities"]
  person_individuals["person.individuals"]
  political_alignments["political.alignments"]
  political_coalitions["political.coalitions"]
  political_memberships["political.memberships"]
  political_parties["political.parties"]
  political_positions["political.positions"]
  reference_topics["reference.topics"]
  reference_values["reference.values"]
  political_parties -->|organization_id| organization_entities
  political_parties -->|jurisdiction_id| geography_jurisdictions
  political_memberships -->|party_id| political_parties
  political_memberships -->|person_id| person_individuals
  political_memberships -->|role_id| reference_values
  political_coalitions -->|jurisdiction_id| geography_jurisdictions
  political_alignments -->|coalition_id| political_coalitions
  political_alignments -->|party_id| political_parties
  political_positions -->|party_id| political_parties
  political_positions -->|topic_id| reference_topics
```

## Proposed table and column review

All tables and fields are hypothetical. Every proposed business column is listed; UUIDv7 `id` is a candidate default and remains open. Record every existing field disposition: KEEP / REMOVE / RENAME / MOVE / MERGE / SPLIT / DERIVE / ADD.

### `political.parties` — Political role of a shared organization

- **Example:** Registered party
- **Profile:** entity; planning envelope below.

| Column | Proposed type | Meaning | Nullable | Default | Relationship | Units / validation | Proposed disposition |
|---|---|---|---|---|---|---|---|
| `id` | `uuid` | Proposed stable identity | No | Rust UUIDv7 candidate | Primary key | UUIDv7 candidate; unique and immutable after publication | KEEP (candidate match to current SQL/Dryv field; confirm meaning) |
| `organization_id` | `uuid` | Organization | No | — | FK → `organization.entities` | UUID syntax; FK target must exist when the relationship is required | ADD (proposed target field; pending user approval) |
| `jurisdiction_id` | `uuid` | Registration area | No | — | FK → `geography.jurisdictions` | UUID syntax; FK target must exist when the relationship is required | KEEP (candidate match to current SQL/Dryv field; confirm meaning) |
| `registered_on` | `date` | Registration | Yes | — | — | Type checked; domain constraints and units must be approved for this field | ADD (proposed target field; pending user approval) |

- **Current SQL/Dryv fields without a proposed same-name column:** `abbreviation`, `code`, `created_at`, `is_current`, `logo_marker`, `name`, `registry_authority_id`, `registry_identifier`, `status`, `symbol_url`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version`, `wikidata_id`. **Disposition:** unresolved per field; propose KEEP, REMOVE, RENAME, MOVE, MERGE, SPLIT or DERIVE in review. Do not drop these fields until the user resolves each one.
- **FK action/cardinality:** Each non-null FK is many-to-one to its named target; nullable FKs are optional. Candidate delete/update behavior is RESTRICT/NO ACTION for accepted records; cascading canonical deletion is not proposed. Confirm uniqueness and exact behavior during review.
- **Constraints:** UNIQUE(organization_id,jurisdiction_id). Exact keys and cross-field checks remain for review.
- **Indexes:** primary key on `id`; candidate B-tree indexes on FK columns `organization_id`, `jurisdiction_id` for joins and referenced-entity filters; add temporal/spatial indexes only where the stated query needs them and benchmarks support them.
- **Relationships:** resolve each FK target. Main allows cross-schema FKs. Main and Operations have no cross-database FK.
- **Evidence/time:** preserve exact source/version, observation/retrieval time, historical context and uncertainty where applicable. Approve the exact evidence path for this table.
- **Growth/storage estimate (illustrative planning envelope, not measured):** Low: initial 1,000, +200/year, peak 20/day; five-year 2,000 rows ≈ 2.0 MiB live row+index budget; Expected: initial 10,000, +2,000/year, peak 200/day; five-year 20,000 rows ≈ 19.5 MiB live row+index budget; High: initial 100,000, +20,000/year, peak 2,000/day; five-year 200,000 rows ≈ 195.3 MiB live row+index budget. Model: initial rows + annual accepted rows × 5; multiply by a per-row budget of 1 KiB including a coarse index allowance. Replace assumptions with actual samples, ingest rates and `pg_total_relation_size` before approval. Large object bytes are excluded; WAL, replicas, backups and S3 are budgeted separately.
- **Workload:** Interactive lookup by identity and approved foreign keys; batch scans for import/reconciliation. Peak-day figure above is a scenario assumption, not a service-level commitment.
- **Partitioning:** None proposed initially; decide from measured scale/query plans. Check late data and partition count.
- **Files:** originals, full-resolution geometry, arrays, media and large exports may be immutable S3 objects. Keep searchable identity, required facts, hashes, coverage, access and provenance in PostgreSQL; use manifests and selective reads.
- **Retention/risks/benchmark:** preserve accepted evidence and corrections. Review late arrivals, contention, index/partition growth and recovery. Benchmark joins, filters, spatial access, ingestion bursts, concurrent access and interrupted publication.
### `political.memberships` — Sourced political affiliation

- **Example:** Documented party membership
- **Profile:** relation; planning envelope below.

| Column | Proposed type | Meaning | Nullable | Default | Relationship | Units / validation | Proposed disposition |
|---|---|---|---|---|---|---|---|
| `id` | `uuid` | Proposed stable identity | No | Rust UUIDv7 candidate | Primary key | UUIDv7 candidate; unique and immutable after publication | KEEP (candidate match to current SQL/Dryv field; confirm meaning) |
| `party_id` | `uuid` | Party | No | — | FK → `political.parties` | UUID syntax; FK target must exist when the relationship is required | KEEP (candidate match to current SQL/Dryv field; confirm meaning) |
| `person_id` | `uuid` | Member | No | — | FK → `person.individuals` | UUID syntax; FK target must exist when the relationship is required | KEEP (candidate match to current SQL/Dryv field; confirm meaning) |
| `joined_on` | `date` | Joining | Yes | — | — | Type checked; domain constraints and units must be approved for this field | ADD (proposed target field; pending user approval) |
| `left_on` | `date` | Leaving | Yes | — | — | Type checked; domain constraints and units must be approved for this field | ADD (proposed target field; pending user approval) |
| `role_id` | `uuid` | Membership role | No | — | FK → `reference.values` | UUID syntax; FK target must exist when the relationship is required | ADD (proposed target field; pending user approval) |

- **Current SQL/Dryv fields without a proposed same-name column:** `created_at`, `is_current`, `role_title`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version`. **Disposition:** unresolved per field; propose KEEP, REMOVE, RENAME, MOVE, MERGE, SPLIT or DERIVE in review. Do not drop these fields until the user resolves each one.
- **FK action/cardinality:** Each non-null FK is many-to-one to its named target; nullable FKs are optional. Candidate delete/update behavior is RESTRICT/NO ACTION for accepted records; cascading canonical deletion is not proposed. Confirm uniqueness and exact behavior during review.
- **Constraints:** left_on >= joined_on; contested evidence retained. Exact keys and cross-field checks remain for review.
- **Indexes:** primary key on `id`; candidate B-tree indexes on FK columns `party_id`, `person_id`, `role_id` for joins and referenced-entity filters; add temporal/spatial indexes only where the stated query needs them and benchmarks support them.
- **Relationships:** resolve each FK target. Main allows cross-schema FKs. Main and Operations have no cross-database FK.
- **Evidence/time:** preserve exact source/version, observation/retrieval time, historical context and uncertainty where applicable. Approve the exact evidence path for this table.
- **Growth/storage estimate (illustrative planning envelope, not measured):** Low: initial 1,000, +2,000/year, peak 100/day; five-year 11,000 rows ≈ 10.7 MiB live row+index budget; Expected: initial 10,000, +20,000/year, peak 1,000/day; five-year 110,000 rows ≈ 107.4 MiB live row+index budget; High: initial 100,000, +200,000/year, peak 10,000/day; five-year 1,100,000 rows ≈ 1,074.2 MiB live row+index budget. Model: initial rows + annual accepted rows × 5; multiply by a per-row budget of 1 KiB including a coarse index allowance. Replace assumptions with actual samples, ingest rates and `pg_total_relation_size` before approval. Large object bytes are excluded; WAL, replicas, backups and S3 are budgeted separately.
- **Workload:** Interactive lookup by identity and approved foreign keys; batch scans for import/reconciliation. Peak-day figure above is a scenario assumption, not a service-level commitment.
- **Partitioning:** None proposed initially; decide from measured scale/query plans. Check late data and partition count.
- **Files:** originals, full-resolution geometry, arrays, media and large exports may be immutable S3 objects. Keep searchable identity, required facts, hashes, coverage, access and provenance in PostgreSQL; use manifests and selective reads.
- **Retention/risks/benchmark:** preserve accepted evidence and corrections. Review late arrivals, contention, index/partition growth and recovery. Benchmark joins, filters, spatial access, ingestion bursts, concurrent access and interrupted publication.
### `political.coalitions` — Coalition identity

- **Example:** Election coalition
- **Profile:** entity; planning envelope below.

| Column | Proposed type | Meaning | Nullable | Default | Relationship | Units / validation | Proposed disposition |
|---|---|---|---|---|---|---|---|
| `id` | `uuid` | Proposed stable identity | No | Rust UUIDv7 candidate | Primary key | UUIDv7 candidate; unique and immutable after publication | ADD (proposed target field; pending user approval) |
| `name` | `text` | Coalition name | No | — | — | Nonblank when required; enforce domain-specific length, normalization and controlled vocabulary | ADD (proposed target field; pending user approval) |
| `jurisdiction_id` | `uuid` | Context | No | — | FK → `geography.jurisdictions` | UUID syntax; FK target must exist when the relationship is required | ADD (proposed target field; pending user approval) |
| `formed_on` | `date` | Formation | Yes | — | — | Type checked; domain constraints and units must be approved for this field | ADD (proposed target field; pending user approval) |
| `ended_on` | `date` | Dissolution | Yes | — | — | Type checked; domain constraints and units must be approved for this field | ADD (proposed target field; pending user approval) |

- **FK action/cardinality:** Each non-null FK is many-to-one to its named target; nullable FKs are optional. Candidate delete/update behavior is RESTRICT/NO ACTION for accepted records; cascading canonical deletion is not proposed. Confirm uniqueness and exact behavior during review.
- **Constraints:** ended_on >= formed_on. Exact keys and cross-field checks remain for review.
- **Indexes:** primary key on `id`; candidate B-tree indexes on FK columns `jurisdiction_id` for joins and referenced-entity filters; add temporal/spatial indexes only where the stated query needs them and benchmarks support them.
- **Relationships:** resolve each FK target. Main allows cross-schema FKs. Main and Operations have no cross-database FK.
- **Evidence/time:** preserve exact source/version, observation/retrieval time, historical context and uncertainty where applicable. Approve the exact evidence path for this table.
- **Growth/storage estimate (illustrative planning envelope, not measured):** Low: initial 1,000, +200/year, peak 20/day; five-year 2,000 rows ≈ 2.0 MiB live row+index budget; Expected: initial 10,000, +2,000/year, peak 200/day; five-year 20,000 rows ≈ 19.5 MiB live row+index budget; High: initial 100,000, +20,000/year, peak 2,000/day; five-year 200,000 rows ≈ 195.3 MiB live row+index budget. Model: initial rows + annual accepted rows × 5; multiply by a per-row budget of 1 KiB including a coarse index allowance. Replace assumptions with actual samples, ingest rates and `pg_total_relation_size` before approval. Large object bytes are excluded; WAL, replicas, backups and S3 are budgeted separately.
- **Workload:** Interactive lookup by identity and approved foreign keys; batch scans for import/reconciliation. Peak-day figure above is a scenario assumption, not a service-level commitment.
- **Partitioning:** None proposed initially; decide from measured scale/query plans. Check late data and partition count.
- **Files:** originals, full-resolution geometry, arrays, media and large exports may be immutable S3 objects. Keep searchable identity, required facts, hashes, coverage, access and provenance in PostgreSQL; use manifests and selective reads.
- **Retention/risks/benchmark:** preserve accepted evidence and corrections. Review late arrivals, contention, index/partition growth and recovery. Benchmark joins, filters, spatial access, ingestion bursts, concurrent access and interrupted publication.
### `political.alignments` — Party membership in coalition

- **Example:** Party coalition agreement
- **Profile:** relation; planning envelope below.

| Column | Proposed type | Meaning | Nullable | Default | Relationship | Units / validation | Proposed disposition |
|---|---|---|---|---|---|---|---|
| `id` | `uuid` | Proposed stable identity | No | Rust UUIDv7 candidate | Primary key | UUIDv7 candidate; unique and immutable after publication | KEEP (candidate match to current SQL/Dryv field; confirm meaning) |
| `coalition_id` | `uuid` | Coalition | No | — | FK → `political.coalitions` | UUID syntax; FK target must exist when the relationship is required | ADD (proposed target field; pending user approval) |
| `party_id` | `uuid` | Party | No | — | FK → `political.parties` | UUID syntax; FK target must exist when the relationship is required | KEEP (candidate match to current SQL/Dryv field; confirm meaning) |
| `joined_on` | `date` | Joining | Yes | — | — | Type checked; domain constraints and units must be approved for this field | ADD (proposed target field; pending user approval) |
| `left_on` | `date` | Departure | Yes | — | — | Type checked; domain constraints and units must be approved for this field | ADD (proposed target field; pending user approval) |

- **Current SQL/Dryv fields without a proposed same-name column:** `created_at`, `ideology_id`, `is_current`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version`. **Disposition:** unresolved per field; propose KEEP, REMOVE, RENAME, MOVE, MERGE, SPLIT or DERIVE in review. Do not drop these fields until the user resolves each one.
- **FK action/cardinality:** Each non-null FK is many-to-one to its named target; nullable FKs are optional. Candidate delete/update behavior is RESTRICT/NO ACTION for accepted records; cascading canonical deletion is not proposed. Confirm uniqueness and exact behavior during review.
- **Constraints:** UNIQUE(coalition_id,party_id,publication_id). Exact keys and cross-field checks remain for review.
- **Indexes:** primary key on `id`; candidate B-tree indexes on FK columns `coalition_id`, `party_id` for joins and referenced-entity filters; add temporal/spatial indexes only where the stated query needs them and benchmarks support them.
- **Relationships:** resolve each FK target. Main allows cross-schema FKs. Main and Operations have no cross-database FK.
- **Evidence/time:** preserve exact source/version, observation/retrieval time, historical context and uncertainty where applicable. Approve the exact evidence path for this table.
- **Growth/storage estimate (illustrative planning envelope, not measured):** Low: initial 1,000, +2,000/year, peak 100/day; five-year 11,000 rows ≈ 10.7 MiB live row+index budget; Expected: initial 10,000, +20,000/year, peak 1,000/day; five-year 110,000 rows ≈ 107.4 MiB live row+index budget; High: initial 100,000, +200,000/year, peak 10,000/day; five-year 1,100,000 rows ≈ 1,074.2 MiB live row+index budget. Model: initial rows + annual accepted rows × 5; multiply by a per-row budget of 1 KiB including a coarse index allowance. Replace assumptions with actual samples, ingest rates and `pg_total_relation_size` before approval. Large object bytes are excluded; WAL, replicas, backups and S3 are budgeted separately.
- **Workload:** Interactive lookup by identity and approved foreign keys; batch scans for import/reconciliation. Peak-day figure above is a scenario assumption, not a service-level commitment.
- **Partitioning:** None proposed initially; decide from measured scale/query plans. Check late data and partition count.
- **Files:** originals, full-resolution geometry, arrays, media and large exports may be immutable S3 objects. Keep searchable identity, required facts, hashes, coverage, access and provenance in PostgreSQL; use manifests and selective reads.
- **Retention/risks/benchmark:** preserve accepted evidence and corrections. Review late arrivals, contention, index/partition growth and recovery. Benchmark joins, filters, spatial access, ingestion bursts, concurrent access and interrupted publication.
### `political.positions` — Attributed policy statements

- **Example:** Manifesto position
- **Profile:** relation; planning envelope below.

| Column | Proposed type | Meaning | Nullable | Default | Relationship | Units / validation | Proposed disposition |
|---|---|---|---|---|---|---|---|
| `id` | `uuid` | Proposed stable identity | No | Rust UUIDv7 candidate | Primary key | UUIDv7 candidate; unique and immutable after publication | KEEP (candidate match to current SQL/Dryv field; confirm meaning) |
| `party_id` | `uuid` | Party | No | — | FK → `political.parties` | UUID syntax; FK target must exist when the relationship is required | ADD (proposed target field; pending user approval) |
| `topic_id` | `uuid` | Topic | No | — | FK → `reference.topics` | UUID syntax; FK target must exist when the relationship is required | ADD (proposed target field; pending user approval) |
| `statement` | `text` | Published position | No | — | — | Nonblank when required; enforce domain-specific length, normalization and controlled vocabulary | ADD (proposed target field; pending user approval) |
| `announced_on` | `date` | Announcement | Yes | — | — | Type checked; domain constraints and units must be approved for this field | ADD (proposed target field; pending user approval) |

- **Current SQL/Dryv fields without a proposed same-name column:** `code`, `created_at`, `is_current`, `title`, `unit_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version`. **Disposition:** unresolved per field; propose KEEP, REMOVE, RENAME, MOVE, MERGE, SPLIT or DERIVE in review. Do not drop these fields until the user resolves each one.
- **FK action/cardinality:** Each non-null FK is many-to-one to its named target; nullable FKs are optional. Candidate delete/update behavior is RESTRICT/NO ACTION for accepted records; cascading canonical deletion is not proposed. Confirm uniqueness and exact behavior during review.
- **Constraints:** Do not convert analyst categorization to party self-description. Exact keys and cross-field checks remain for review.
- **Indexes:** primary key on `id`; candidate B-tree indexes on FK columns `party_id`, `topic_id` for joins and referenced-entity filters; add temporal/spatial indexes only where the stated query needs them and benchmarks support them.
- **Relationships:** resolve each FK target. Main allows cross-schema FKs. Main and Operations have no cross-database FK.
- **Evidence/time:** preserve exact source/version, observation/retrieval time, historical context and uncertainty where applicable. Approve the exact evidence path for this table.
- **Growth/storage estimate (illustrative planning envelope, not measured):** Low: initial 1,000, +2,000/year, peak 100/day; five-year 11,000 rows ≈ 10.7 MiB live row+index budget; Expected: initial 10,000, +20,000/year, peak 1,000/day; five-year 110,000 rows ≈ 107.4 MiB live row+index budget; High: initial 100,000, +200,000/year, peak 10,000/day; five-year 1,100,000 rows ≈ 1,074.2 MiB live row+index budget. Model: initial rows + annual accepted rows × 5; multiply by a per-row budget of 1 KiB including a coarse index allowance. Replace assumptions with actual samples, ingest rates and `pg_total_relation_size` before approval. Large object bytes are excluded; WAL, replicas, backups and S3 are budgeted separately.
- **Workload:** Interactive lookup by identity and approved foreign keys; batch scans for import/reconciliation. Peak-day figure above is a scenario assumption, not a service-level commitment.
- **Partitioning:** None proposed initially; decide from measured scale/query plans. Check late data and partition count.
- **Files:** originals, full-resolution geometry, arrays, media and large exports may be immutable S3 objects. Keep searchable identity, required facts, hashes, coverage, access and provenance in PostgreSQL; use manifests and selective reads.
- **Retention/risks/benchmark:** preserve accepted evidence and corrections. Review late arrivals, contention, index/partition growth and recovery. Benchmark joins, filters, spatial access, ingestion bursts, concurrent access and interrupted publication.


## Queries, lifecycle, capacity and approval

**Representative query:** Which party affiliations and coalitions were documented at a date?

Lifecycle: preserve source bytes; extract into candidate revisions; validate; review or use approved deterministic checks; atomically publish; serve. Corrections create explicit versions/supersession. Preserve disagreement and uncertainty.

Capacity is unmeasured. Use low/expected/high input scenarios, explicit formulas and workload benchmarks; do not assume sizes or universal partitions.

**Status:** NOT REVIEWED. Schema existence, tables, columns, relationships, partitioning and S3 choices require user approval. Feedback: none. Approval reference/date/revision: none. Implementation authorization: not granted. Material changes reopen approval.
<details>
<summary>Earlier schema proposal preserved for history; superseded and not an approval</summary>

---
id: DOC-5E71D4BA902F
name: Political domain schema redesign
type: documentation
tags: [improvements, schema-redesign, political, planning]
extra: {status: planning_only}
---

> **11 November 2026 precedence:** the connected foundation update at the end of this document supersedes conflicting jurisdiction, compatibility and cross-domain assumptions in the historical proposal below. Detailed table names remain design candidates; task 03 is prepared for design work, not a claim of completed implementation.

# Political — parties, party organizations, affiliations and internal leadership

**PLANNING ONLY. No table/schema change or Taskcode task is authorized.**

## User decision and conceptual boundary

Keep `political` **separate from `electoral`**. Political entities and ideological positions are not identical to elections, and real people remain anchored in `person`. Preserve neutral, globally applicable political classifications rather than encoding a single nation's party system. An individual can change political affiliations, stand as a candidate for one party at an earlier election, hold an internal party office, or hold a government office; those are different relationships and time intervals.

## Existing schema and table-level review

Current active tables, verified in the entity catalogue:

| Table | Existing responsibility; candidate treatment |
|---|---|
| `political.parties` | Canonical party identity; review registration status, aliases, legal jurisdiction, identifiers and historical continuity. **Retain concept.** |
| `political.memberships` | Person-to-party association over valid time; audit uniqueness, type of membership, evidence, uncertain affiliation and expiry. |
| `political.units` | Party internal geographic/organizational branches; distinguish units from `geography.units`. |
| `political.ideologies` | Named political theories/ideological concepts; review whether these belong in reference scheme or remain domain entities. |
| `political.alignments` | Existing party-ideology association; **do not confuse with alliances/coalitions** without examining its exact columns. |
| `political.positions` | Party posts/leadership position definitions, distinct from constitutional/government offices. |
| `political.holders` | People holding party positions with start/end/acting/verified status and historical evidence. |

**Column audit needed for each current table:** `id`/stable business identifiers, names, `jurisdiction_id`, `geo_unit_id` if any, `party_id`, `person_id`/`individual_id`, `position_id`, validity, record version, provenance links, and type identifiers. This is a **review checklist**, not a statement that each listed column exists on every table. Extract the full column/type/index/FK report from current entities and actual PostgreSQL before deciding rename or removal.

## Relationship plan: real foreign keys

Political memberships and holders should FK to `person.individuals`, with party/position FKs inside `political`. A party may reference a legal identity in `organization.entities` where that entity really exists; the party and organization must not be collapsed into one concept automatically. Jurisdiction is distinct from county branch territory and from election seat geography; links to `reference` and `geography` must reflect actual semantics. Where party units have multiple geographic scopes, evaluate an explicit typed junction with hard FKs. Link nomination/party at an election through `electoral` at the historical election date, not by copying today's membership onto an old result.

**Questions for SQL review:** What was the person's documented party at election time? Are two same-named parties in separate jurisdictions different identities? Which party unit represents county scope versus merely having an office physically in that county? Which party office did a person hold during a coalition period? What is the source of an asserted ideological alignment?

## Acquisition categories and patterns

- **1A static seeded:** carefully curated registered and historical parties, official identifiers and controlled party-post types.
- **1B pattern seeded:** expected party leadership positions or geographic party branches only when approved party structures establish them; an expected chapter is not proof it exists.
- **2A automated collected:** registrations, party leadership changes, official membership/affiliation announcements, electoral nominations, deregistration and alliances.
- **2B derived:** membership histories, leadership tenure, official party-linked vote summaries and neutral aggregate analysis.

Add acquisition eligibility to table comments/Markdown, with per-row lineage identifying actual acquisition. No pattern may invent human membership or affiliations.

## Redesign candidates, tradeoffs and migration

An explicit `coalitions`/`alliances` concept may be useful but only after auditing whether existing relationships represent dated coalitions reliably. Controlled `ideologies` may benefit from dedicated classes if relationships carry more than a label; otherwise simplify vocabulary tables. Prefer stable party IDs and dated name/status/affiliation history over rewriting past values. Enforce FKs to person/organization/jurisdiction and membership temporal constraints without deleting historic ties.

Preserve existing party and member identifiers, API contracts, source attributions and importer mappings during any later migration. Audit all old classification FKs, political-membership join uniqueness, and distinctions between party membership, elected office and governance appointment.

## Explicitly open user decisions

1. Optional vs required party→legal-organization FK.
2. Party alliances/coalitions: standalone table vs typed party relationship.
3. Historic disputed/provisional/dissolved registrations and their source requirements.
4. Party chapter scope and physical HQ/branch address ownership.
5. Whether ideology classification needs its own dedicated table.
6. Which fields are permitted to change automatically, with review and audit.

**Links:** [Schema redesign index](README.md) · [Master record](../mzizi-data-schema-storage-and-pipelines-redesign.md) · [Classification/patterns](../data-categories-and-patterns.md).

## Human review — editable user notes and design sign-off

**Review status:** `NOT REVIEWED` — AI-authored proposals in this document are not final approval.

**In my own words, what this schema should represent and exclude:**

> _My understanding and questions:_

**Tables/columns I want to keep, rename, move, merge, split, remove or add (and why):**

> _My proposed changes and alternative names:_

**Hard foreign keys, geographical and legal scope, pattern generation, classification and evidence I want changed or explained:**

> _My technical feedback, disagreements and alternatives:_

**Real data and queries I want to use to validate this design:**

> _My examples and expected results:_

**Unresolved decisions I want to discuss further:**

> _My remaining questions:_

**Final user decision:** `NOT DECIDED` / `NEEDS CHANGES` / `DESIGN VALIDATED BY USER` / `APPROVED FOR TASK PLANNING`.

**Approval reference and date:** _None. Only record explicit later user authorization. Even design validation does not authorize code, migration or Taskcode task creation._

## Mandatory per-table temporal, rigid-column and deletion review (2026-11-07)

**USER REQUIREMENT; planning only.** Examine every existing/proposed field and expressly record **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** for `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision`, `is_current`, `status`, `version`, `created_at`, `updated_at` and other copied/rigid flags. These fields are **opt-in by justified meaning**, not blanket schema conventions. Assess `deleted_at` only for recoverable soft deletion where appropriate. The full policy and migration/approval checklist is in [schema redesign README](README.md).

**Domain-specific guidance:** Political parties may have dated registration/dissolution events, but membership and internal position holding are independent dated relationships. Ideologies and party position definitions should not automatically carry validity/precision/is_current fields. Genuine mergers, splits, changes of affiliation and disputed histories need explicit lifecycle evidence rather than soft delete.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.

## 2026-11-11 — Connected foundation direction (controlling for task 03)

Parties, coalitions and memberships are actual political/organization-domain records, not reference labels. Link classifications to schemes and actual affiliations to people/organizations with periods and evidence. Candidacy affiliation in an election does not establish timeless party membership; local presence/branches and geographic coverage require their own evidence. Legal registration and other requirements use typed links to exact provisions/rules, without treating citation as compliance.

Task 03 specifies the political/electoral/governance integration contract; task 04 finalizes political identity, membership, coalition and legal-rule relationships. Cross-border movements and historical organizations must not be forced into single-country ownership or inferred territorial control.

Read [the connected foundation](../connected-reference-geography-legal-foundation.md) for the decisions, candidate models, query examples, proof cases and primary research sources. Fresh construction in `mzizi_new` has no legacy database ID/data compatibility requirement; existing S3 evidence remains protected. This update records accepted direction and design deliverables, not final DDL or broad implementation authorization.

## 2026-11-11 — System-expansion alignment

Political parties and affiliations remain distinct from History interpretation; historical claims link to dated party facts and evidence without duplicating membership/event systems. See the [system-expansion proposal](../advancement-and-system-expansion.md). This alignment note does not approve proposed schemas, tables or implementation.

</details>
