---
id: DOC-F63B18A2C705
name: Neutral global legal domain and law-driven generation
type: documentation
tags: [improvements, schema-redesign, legal, planning]
extra: {status: planning_only, implementation: not_approved}
---

> **11 November 2026 precedence:** the connected foundation update at the end of this document supersedes conflicting jurisdiction, compatibility and cross-domain assumptions in the historical proposal below. Detailed table names remain design candidates; task 03 is prepared for design work, not a claim of completed implementation.

# Neutral global legal domain and law-driven generation

**Planning only. Not approved for code changes or Taskcode task creation.** The user will direct the order of final design review and later tasks. All physical table/column changes below are proposals, not authorized migrations.

## 1. Current domain, user intent and boundaries

Keep `legal` recognizable but make it understandable, neutral and internationally applicable. The user requires connections to constitutions, Acts, Bills, laws, provisions, legislative processes, amendments, authority for ministries/offices and evidence of real activities. Model laws over time, without assuming every country has the same Parliament, legal hierarchy, customary-law treatment or assent procedure.

Distinguish identity and versions of legal instruments; draft/proposal ≠ enacted instrument; passing/assent/commencement/publication ≠ identical event; legislation that establishes an office ≠ evidence that a person currently occupies the office. Legal models must be auditable by jurisdiction and time.

## 2. Current database table and column inventory

These **real migration-declared** table/column names are from `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database/migrations/1793607856459-initial.ts` and relevant subsequent CREATE-table migrations. They form the **baseline**, not a certified live/current column audit: later ALTER migrations, current TypeORM entities and deployed schema may add/remove/rename fields. Compare against `source/backend/api/src/modules/`, Dryv and PostgreSQL before finalizing any column decision. This document deliberately does not invent exact types/FKs not yet checked against live metadata.

| Existing table | Columns declared at initial CREATE TABLE (baseline) |
|---|---|
| `legal.amendments` | `id`, `amending_instrument_id`, `code`, `created_at`, `instrument_id`, `is_current`, `summary`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `legal.changes` | `id`, `amendment_id`, `created_at`, `is_current`, `kind`, `new_text`, `previous_text`, `provision_id`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `legal.instruments` | `id`, `code`, `content_hash`, `created_at`, `document_url`, `is_current`, `issuing_institution_id`, `jurisdiction_id`, `kind_id`, `status`, `summary`, `title`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `legal.links` | `id`, `created_at`, `is_current`, `note`, `provision_id`, `target_id`, `target_kind`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `legal.provisions` | `id`, `citation`, `code`, `content`, `created_at`, `heading`, `instrument_id`, `is_current`, `kind`, `parent_id`, `previous_version_id`, `sort_order`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |



## 3. Potential target table responsibilities — **proposals only**

| Current or candidate | Meaning / possible change |
|---|---|
| `instruments` | Constitutions, statutes, regulations, orders, treaties and other legal instruments; review kind/status/version and jurisdiction. |
| `provisions` | Numbered articles, sections, parts and schedules with stable identity and dated text versions. |
| `amendments` and `changes` | Track instrument-wide amendment events separately from specific provision replacements, insertions, repeals and retroactive applicability. |
| `links` | Typed legal basis, enactment and instrument–instrument relations with explicit links to compatible target tables where possible. |
| `proposals` / `bills` (proposed) | Jurisdiction-neutral proposed instrument/change; may never become law. |
| `processes` / `proceedings` (proposed) | Actual lawmaking processes and dated readings, committee actions, votes, assent etc. |
| `process_definitions` (proposed) | Versioned process patterns defined by jurisdiction and institution type. |
| `rules` / `applicability` (proposed) | Formalized establishment/authorization obligations and their geographic/institutional reach. |

## 4. Strong relationships, geography, law and query design

Prefer **real FK**: `legal.provisions.instrument_id`, dated `legal.amendments.instrument_id`, `governance.rules.legal_basis_id` (or a well-typed junction to provisions), `governance.institutions` establishment and `procurement` relevant law where factually applicable. A pattern rule can carry the establishing provision, while generated offices retain traced pattern lineage; do not add identical law IDs to every generated row by reflex. Build typed relationships such as established_by, authorized_by, repealed_by and regulated_by, with temporal semantics. Be careful not to equate cited legal basis with regulatory compliance.

## 5. Four-class acquisition, patterns and traceability

**Static seeded:** canonical constitutional/instrument identities, curated legal hierarchies and jurisdiction procedure definitions. **Pattern seeded:** versioned office/service/legal process rules. **Automated collected:** enacted bills, gazettes, law updates, provisions and dated proceedings from approved sources. **Derived:** effective-law timelines, impacted office patterns, legal coverage or historical snapshots. Original legal text remains evidence in `source`/`filesystem`, linked to versioned provisions, not overwritten.

For all retained/new tables, add concise PostgreSQL **schema/table/column comments**, plus a maintained Markdown/table registry describing each column's meaning, nullability decision, allowed acquisition classes and expected pattern/automated inputs. Record per-row origin via traceable lineage and real FKs where structurally possible. Do not treat a table's class eligibility as every row's origin.

## 6. Query scenarios the design must support

What provision authorized a ministry in 2019? Which offices were generated from a statutory rule and which are directly observed? Is a proposed Bill enacted, pending, withdrawn or superseded? Which law version applied at an election/contract date? What legal amendment changed the expected number/type of positions? What other jurisdictions use a different lawmaking path?

## 7. Migration, preservation, integrity and compatibility

Audit current instrument `kind_id`, `jurisdiction_id`, `issuing_institution_id` and `legal.links` polymorphic references; distinguish stable IDs from version numbers and `content_hash` of legal text. Separate source-publication facts from legal effective dates. Implement actual FKs as appropriate across `reference`, `governance` and `legal`, with optional typed links. Revise Dryv contracts and importers with historical continuity, no one-off Kenya enum.

Global requirements: check live data, orphans, actual FK constraints, indexes and enum/lookup validity; reconcile every old→new table/column; preserve historical identities, evidence, versioning and record counts; update Dryv, API, ingestion and filesystem references with migrations only after explicit user approval. Never rewrite canonical facts to make a schema migration pass.

## 8. Decisions the user has not yet approved

1. Which legal process concepts genuinely need standalone tables vs `activity` events?
2. How to model legal hierarchy, customary/historical legal sources and treaties across jurisdictions?
3. Where should effect/commencement and retroactive dates live?
4. What can be pattern-generated from a law, versus requiring independent evidence?
5. Should a law/provision FK point at a stable identity or a specific published version?
6. What automatic amendment detection and review policies are acceptable?

## 9. Related planning resources and decision status

See [master register](../mzizi-data-schema-storage-and-pipelines-redesign.md), [schema review index](README.md), [data classes/patterns](../data-categories-and-patterns.md), and [independent pipelines](../independent-data-pipelines.md). **Any preference noted here is a planning recommendation; the user decides the final schema/table/column specification and authorizes tasks one at a time.**

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

**Domain-specific guidance:** A law may have enacted, commenced, amended, repealed and published dates with distinct meanings; avoid generic valid_from/to on every provision. Provision versions can inherit effective context from the instrument but may have independent amendment history. Legal currentness is an as-of legal query; historical or approximate dates merit precision only where evidenced. No ordinary trash deletion of enacted legal history.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.

## 2026-11-11 — Connected foundation direction (controlling for task 03)

Separate stable legal instruments/provisions, their textual versions/languages, legal effect periods and exact filesystem evidence. Typed domain-specific associations can link offices, institutions, structured rules, electoral rules, political requirements and geographic changes to multiple precise provision versions. Basis roles distinguish establishment, powers, selection and boundary alteration. Do not duplicate contradictory legal support through both rule and entity links without an authority policy; do not claim `target_kind + target_id` provides referential integrity.

Territorial, personal, subject and temporal applicability differ. Spatial inclusion alone cannot establish applicable law, and cited support is not proof of compliance or settled interpretation. Extracted text is not executable behavior; reviewed structured rules and registered handlers implement supported behavior. Historical/customary/de facto institutions may have non-statutory documented bases and must not be assigned invented constitutional support. Task 03 defines the minimal legal interface/bootstrap order and proof cases; task 04 finalizes full instruments/provisions/processes and downstream legal associations.

Read [the connected foundation](../connected-reference-geography-legal-foundation.md) for the decisions, candidate models, query examples, proof cases and primary research sources. Fresh construction in `mzizi_new` has no legacy database ID/data compatibility requirement; existing S3 evidence remains protected. This update records accepted direction and design deliverables, not final DDL or broad implementation authorization.
