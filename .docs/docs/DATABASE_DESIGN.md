---
{id: DOC-DATABASE-DESIGN,name: DATABASE_DESIGN,type: documentation,tags: [database,schemas,scale]}
---

# Database design

The canonical PostgreSQL database is organised into domain schemas that are designed to be separable: one schema can move to its own database later without changing another schema. Names follow `.docs/rules/database-naming.md`.

## Principles

1. **One schema per domain, full words.** `geography`, `organization`, `statistical`, never `geo`, `org`, `statistic`.
2. **No cross-schema foreign keys.** Inside a schema, tables may use real foreign keys. Between schemas, a record refers to another by plain id (a soft reference). Integrity across schemas is checked by the database engine's integrity jobs, not by the database. This is what lets a schema be split off later and what keeps one domain's DDL from locking another's.
3. **Provenance lives in `source`, not in data rows.** A data table carries only what describes the thing itself: its valid time, record time and version. Where a claim came from, how it was produced, how confident we are, and whether it has been verified are held by the `source` schema, which points at data rows by (`schema.table`, id). Data tables know nothing about sources.
4. **Bytes live in object storage, metadata in `filesystem`.** No table stores file contents. Anything with media (source PDFs, avatars, logos, scans) is a file in `filesystem`, linked from the thing that uses it through `filesystem.attachments`.
5. **Humans are modelled once.** `person` holds every real human (officials, historical figures, authors, reviewers) with names, profile, contacts and public handles. `identity` holds platform accounts and grants. They link by id.
6. **Append-only where history matters.** Attributions, verifications, comments, decisions and file events are never updated; corrections are new rows.
7. **Controlled vocabularies are data.** Levels, kinds and types are `reference.classifications` rows scoped by jurisdiction, not enums or columns. Small closed technical states (a file's processing state) stay enums.

## Engine-owned objects outside the catalogue

`staging` (runs, candidates, issues, promotions: validation and review before promotion), `engine` (migration history and the data engine job queue) and `geography.boundary_shapes` (PostGIS shapes derived from the GeoJSON text by a trigger). They are created by hand-written migrations in `source/backend/engine/database/migrations`, are not Dryv entities, and are not served by the API (the API role may see staging candidate ids only, for review decisions). The catalogue below lists the Dryv-generated schemas (19 including `website`).

## Schema catalogue

| Schema | Purpose | Tables |
| --- | --- | --- |
| `reference` | jurisdictions and vocabularies | `jurisdictions`, `classifications` |
| `geography` | places, boundaries, lineage | `units`, `relationships`, `boundaries`, `names`, `changes` |
| `legal` | instruments and provisions | `instruments`, `provisions`, `amendments`, `changes`, `links` |
| `person` | real humans | `individuals`, `names`, `profiles`, `contacts`, `handles` |
| `identity` | platform accounts and authorisation | `accounts`, `grants` |
| `governance` | institutions and offices | `institutions`, `relationships`, `offices`, `rules`, `procedures`, `stages`, `holders` |
| `electoral` | elections | `elections`, `seats`, `candidates`, `results`, `manifestos`, `commitments` |
| `political` | parties | `parties`, `memberships`, `units`, `ideologies`, `positions`, `alignments`, `holders` |
| `calendar` | events | `events`, `links` |
| `organization` | legal entities | `entities`, `identifiers`, `ownerships`, `locations` |
| `finance` | public finance | `years`, `units`, `budgets`, `transfers`, `revenues`, `expenditures`, `entries` |
| `debt` | borrowing | `loans`, `disbursements`, `repayments` |
| `procurement` | tenders and contracts | `tenders`, `bids`, `contracts`, `milestones`, `variations` |
| `statistical` | indicators and observations | `periods`, `categories`, `indicators`, `fields`, `datasets`, `observations` |
| `civic` | public services | `services`, `amenities`, `posts`, `deliveries` |
| `filesystem` | files, versions, media | `stores`, `formats`, `folders`, `objects`, `files`, `versions`, `variants`, `attachments`, `uploads`, `events` |
| `source` | where claims come from | `publishers`, `documents`, `captures`, `methods`, `attributions`, `verifications` |
| `website` | known sites, domains, structures (see `WEBSITE_DESIGN.md`) | `sites`, `domains`, `site_publishers`, `structures`, `structure_versions`, `structure_files`, `checks`, `families`, `domain_patterns`, `members`, `subjects`, `traits`, `relations`, `fingerprints`, `assessments`, `dossiers` |
| `audit` | discussion and review | `comments`, `evidence`, `decisions` |

Reference tables (`reference`) are read constantly and change rarely; `filesystem.events`, `source.attributions` and `audit.*` are the heavy append-only tables.

## Designing for heavy traffic on one database today

- **Identifiers.** All primary keys are UUIDs. Production should use time-ordered UUIDv7 (`uuidv7()` is built in from PostgreSQL 18) as the column default, set by database-engine migrations, so inserts append to the index instead of scattering. Development synchronisation uses the generator's default and is not representative.
- **No hot counters.** Folder file counts and sizes are not stored on the folder row; they are computed or rolled up asynchronously. A counter updated on every upload serialises concurrent writers.
- **Immutable rows for the big tables.** Objects, versions, attributions, verifications, events and decisions are insert-only. Insert-only tables avoid row locks, bloat and vacuum pressure, and are cheap to replicate.
- **Partitioning plan.** `source.attributions` and `filesystem.events` are range-partitioned by creation time (monthly) by the database engine; their indexes are leading (`target_kind`, `target_id`) for lookups and BRIN on the timestamp. `statistical.observations` is the other large table and partitions by period granularity or jurisdiction when it grows. Partition keys are in the contracts as plain columns, so the choice can change without touching the API.
- **Read path.** The API reads through a SELECT-only role and can point at a replica unchanged. Public lists are current-only by default with bounded paging; search uses indexed columns.
- **Separation later.** Because no foreign key crosses a schema, moving `filesystem`, `source` or `audit` to a dedicated database is a connection-string and data-copy exercise, not a redesign. Cross-schema joins in hand-written queries (geography reads joining `source`) are the only coupling and are listed in the data engine handoff.
- **Large values.** Geometry and long text live in dedicated columns and are never selected in list views.

## Normalisation notes

- Provenance moved out of every data table (see `SOURCING_DESIGN.md`); previously each of 69 tables repeated ten evidence columns.
- Humans moved out of `governance` into `person`; `governance.holders` refer to an individual, never copy a name.
- Files are one logical `files` row, many immutable `versions`, each pointing at one deduplicated `objects` row; renditions are `variants`.
- Money has an explicit currency column and no default; dates carry a precision; vocabularies are classifications.
- Remaining review candidates, recorded rather than done: split `geography.boundaries` geometry into its own table if metadata scans become hot; add a `reference.languages` vocabulary used by names, profiles and documents; split `organization.identifiers` into verified registries once the first registry import exists.
