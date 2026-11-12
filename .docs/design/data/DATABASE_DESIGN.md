---
{id: DOC-DATABASE-DESIGN,name: DATABASE_DESIGN,type: documentation,tags: [database,schemas,scale]}
---

# Database design

> **Currency note — 12 November 2026:** This guide contains pre-rewrite schema names and implementation assumptions. The active schema layout and approval states are in the [schema redesign catalogue](../../_plan/schema-redesign/README.md). Same-database cross-schema foreign keys are allowed by the current schema-authoring rules. The paragraphs below are architecture background where they do not conflict with that catalogue, `AGENTS.md`, or the authored contracts.

PostgreSQL stores domain schemas in the Main and Operations database targets recorded by the current catalogue. Names follow `.docs/rules/database-naming.md`. Moving a schema between database targets may change foreign-key and query boundaries and requires a reviewed migration plan.

## Principles

1. **One schema per domain, full words.** `geography`, `organization`, `statistical`, never `geo`, `org`, `statistic`.
2. **Foreign keys follow database boundaries, not schema names.** Reviewed foreign keys within one PostgreSQL database, including across schemas, are allowed when the target is authored and the selected SQL pack preserves the relation. Foreign keys must never cross the `mzizi` / `mzizi_operations` database boundary; use typed identifiers and documented recovery/integrity operations there. Splitting a schema later may require FK and query redesign.
3. **Provenance lives in `source`, not in data rows.** A data table carries only what describes the thing itself: its valid time, record time and version. Where a claim came from, how it was produced, how confident we are, and whether it has been verified are held by the `source` schema, which points at data rows by (`schema.table`, id). Data tables know nothing about sources.
4. **Bytes live in object storage, metadata in `filesystem`.** No table stores file contents. Anything with media (source PDFs, avatars, logos, scans) is a file in `filesystem`, linked from the thing that uses it through `filesystem.attachments`.
5. **Humans are modelled once.** `person` holds every real human (officials, historical figures, authors, reviewers) with names, profile, contacts and public handles. `identity` holds platform accounts and grants. They link by id.
6. **Append-only where history matters.** Attributions, verifications, comments, decisions and file events are never updated; corrections are new rows.
7. **Controlled vocabularies are data.** Reusable classifications belong in `reference.schemes` and `reference.values`; country-specific applicability must use `reference.countries` or an explicit typed scope. Do not hardcode geographic classes or feature types as enums. Small closed technical states (such as a file processing state) may remain enums.

## Historical implementation note

The former `staging`, `engine` and `geography.boundary_shapes` descriptions below referred to the archived pre-rewrite service and migrations. They are not current contract or runtime claims. The active Rust database service, schema ownership, and SQL generation state are documented in `source/backend/README.md`, `source/backend/database/README.md`, and the schema redesign catalogue. The Rust SQL pack currently remains a generation skeleton and must not be treated as a migration source.

## Current schema catalogue

The old 21-schema table inventory formerly shown here is retired. Use the [schema redesign catalogue](../../_plan/schema-redesign/README.md), which records the current Main and Operations assignments, implemented Main contracts, approved Operational inventories, and Phase 02 deferrals. In particular, Reference uses `countries`, `schemes`, `values`, measurement `units`, `topics`, and pattern tables; Geography uses the accepted `features`, `units`, `places`, `names`, `identifiers`, `geometries`, `relationships`, `changes`, and `datasets` inventory. The six authorized Main domain contracts are implemented in Dryv and composed with the foundation groups; Accountability contains no persisted entities. Their owning Phase 01 documents state the current table grains and the remaining SQL-pack gates.

Reference tables (`reference`) are read constantly and change rarely; `filesystem.events`, `source.attributions` and `audit.*` are the heavy append-only tables.

## Designing for heavy traffic on one database today

- **Identifiers.** Primary-key types and defaults belong to the approved contract and selected generator. UUIDv7 is a candidate production default where the PostgreSQL version and generation path support it; the current SQL skeleton does not implement this policy.
- **No hot counters.** Folder file counts and sizes are not stored on the folder row; they are computed or rolled up asynchronously. A counter updated on every upload serialises concurrent writers.
- **Immutable rows for the big tables.** Objects, versions, attributions, verifications, events and decisions are insert-only. Insert-only tables avoid row locks, bloat and vacuum pressure, and are cheap to replicate.
- **Partitioning plan.** Partitioning for Source, Filesystem or Statistical data is a future measured decision. Choose keys and indexes from approved table contracts, access patterns and observed size; do not infer a deployed partition scheme from this planning guide.
- **Read path.** A SELECT-only API role, read replicas, bounded paging and indexed search are target architecture. This document does not claim they are deployed.
- **Separation later.** Same-database cross-schema FKs are allowed where explicitly authored. Moving a referenced schema to another database requires replacing those FKs with typed cross-database references and defined integrity/recovery behavior; it is not guaranteed to be a connection-string-only change.
- **Large values.** Geometry and long text live in dedicated columns and are never selected in list views.

## Normalisation notes

- Provenance moved out of every data table (see `design/data/SOURCING_DESIGN.md`); previously each of 69 tables repeated ten evidence columns.
- Humans moved out of `governance` into `person`; `governance.holders` refer to an individual, never copy a name.
- Files are one logical `files` row, many immutable `versions`, each pointing at one deduplicated `objects` row; renditions are `variants`.
- Money has an explicit currency column and no default; dates carry a precision; vocabularies are classifications.
- The old candidate list for `geography.boundaries`, `reference.languages`, and `organization.identifiers` is superseded by the current schema catalogue and owner documents; do not interpret it as a current proposal or implementation.

## Statistical dimensions and derived values — historical proposal

> The following table names and field ideas are retained as historical statistical design notes. They are not active approved contracts; consult the current Phase 02 Statistical proposal before implementation.

Decision: breakdowns of a figure (county, sex, age group, community, religion, urban or rural) are rows, not a JSON column. `statistical.dimensions` and `statistical.dimension_members` (hierarchy through `parent_id`, `reference_code` for external codes) are joined to an observation through `statistical.observation_dimensions`, unique per observation and dimension. A JSON column cannot be constrained, indexed by member or given hierarchy. Observations also carry `measure_type`, `estimate_kind` (census, projection, survey, administrative, derived), `denominator_observation_id` and `denominator_value`, `margin_of_error`, `standard_error`, and a `vintage_id` (`statistical.vintages`, with `supersedes_id`) plus `release_label`. A computed value lists its inputs and computation in `statistical.observation_derivations`. Provenance stays in the source schema.
