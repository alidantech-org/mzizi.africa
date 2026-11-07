---
id: DOC-BE3021A75C4D
name: Reference and jurisdiction redesign
type: documentation
tags: [improvements, schema-redesign, reference, planning]
extra: {status: planning_only, implementation: not_approved}
---

# Reference and jurisdiction redesign

**Planning only. Not approved for code changes or Taskcode task creation.** The user will direct the order of final design review and later tasks. All physical table/column changes below are proposals, not authorized migrations.

## 1. Current domain, user intent and boundaries

The current reference schema has two tables, classifications and jurisdictions. Many domains refer to classification IDs via generic type_id/level_id or kind_id columns. The user's concern is that reference types and jurisdictions have become **confusing and difficult to query**, while their identifiers are used everywhere. The redesign should distinguish *territorial/legal jurisdiction identity*, *controlled vocabularies*, *real domain relationships*, and *mere descriptive labels*. Do not blindly merge reference into geography: jurisdiction establishes a legal/administrative context, and geographical units represent territory; link them with real constraints.

**User requirements:** every lookup must be traceable and queryable with real FKs; ensure that the selected classification belongs to the expected scheme, not merely that its UUID exists. Improve naming, comments and semantics; avoid a generic bucket that hides domain behavior.

## 2. Current database table and column inventory

These **real migration-declared** table/column names are from `source/backend/engine/database/migrations/1793607856459-initial.ts` and relevant subsequent CREATE-table migrations. They form the **baseline**, not a certified live/current column audit: later ALTER migrations, current TypeORM entities and deployed schema may add/remove/rename fields. Compare against `source/backend/api/src/modules/`, Dryv and PostgreSQL before finalizing any column decision. This document deliberately does not invent exact types/FKs not yet checked against live metadata.

| Existing table | Columns declared at initial CREATE TABLE (baseline) |
|---|---|
| `reference.classifications` | `id`, `code`, `created_at`, `is_current`, `jurisdiction_id`, `label`, `legal_basis`, `order`, `scheme`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |
| `reference.jurisdictions` | `id`, `code`, `created_at`, `is_current`, `kind`, `name`, `updated_at`, `valid_from`, `valid_from_precision`, `valid_to`, `valid_to_precision`, `version` |



## 3. Potential target table responsibilities — **proposals only**

| Candidate | Recommendation and tradeoff |
|---|---|
| `jurisdictions` | Retain stable identity for jurisdiction/legal authority, with code, type, temporal validity and a designated/typed link to root territorial unit. Final home **open**. |
| `schemes` | Consider explicit classification schemes (e.g. office-kind, admin level, legal instrument kind) with jurisdiction and period applicability. |
| `values` | Consider values with unique (scheme, code), label, ordering, valid time, optional parent, deprecation/supersession. |
| Domain-specific lookups | Retain/introduce for definitions with behavior, such as legal processes or governance office rules; not everything belongs in `reference.values`. |

**Alternative:** Keep one `classifications` table but make scheme/scope/type validation strict using composite keys/FKs. Compare complexity and existing data conversion before choosing.

## 4. Strong relationships, geography, law and query design

Every reference ID must resolve to a real row in PostgreSQL. A `geography.units.jurisdiction_id` must reference the chosen jurisdiction table; `geography.units.level_id` must resolve to an appropriate level of that jurisdiction and period. Consider composite FK involving scheme ID where type enforcement needs to be declarative. Generic `classification_id` fields should be renamed only where the intended dimension is clear; avoid global "type" that means different things in every domain.

Do not define an all-purpose polymorphic target_kind + target_id relation as an escape hatch for poor classification design. A `reference` value is not a substitute for a real `governance.institutions` or `organization.entities` reference.

## 5. Four-class acquisition, patterns and traceability

Mostly **seeded/static** curated jurisdiction and vocabulary definitions, with some **seeded/pattern** structural expectations (e.g. country-specific administrative level sequences). Automated collection may suggest new classification values, but should not silently change approved vocabularies. Derived reports can count coverage by controlled category. Document allowed acquisition classes in per-table comments; row-level lineage and curator/source evidence remain separate.

For all retained/new tables, add concise PostgreSQL **schema/table/column comments**, plus a maintained Markdown/table registry describing each column's meaning, nullability decision, allowed acquisition classes and expected pattern/automated inputs. Record per-row origin via traceable lineage and real FKs where structurally possible. Do not treat a table's class eligibility as every row's origin.

## 6. Query scenarios the design must support

Find every allowed classification and meaning for a jurisdiction in a particular year; identify all records using a retired value; resolve an institution's jurisdiction/root geo unit; list the precise scheme of any type_id; identify a source reference that currently points to a nonexistent or wrong-scheme value.

## 7. Migration, preservation, integrity and compatibility

Audit every existing reference.classifications row, scheme, code, jurisdiction and FK usage before normalization. Map old IDs to stable new IDs without breaking dependent tables. Prefer semantic migration views/aliases only if needed and time-bounded. Add comments and indexes based on actual queries. Country-root vs jurisdiction identity requires historical test cases before any NOT NULL enforcement.

Global requirements: check live data, orphans, actual FK constraints, indexes and enum/lookup validity; reconcile every old→new table/column; preserve historical identities, evidence, versioning and record counts; update Dryv, API, ingestion and filesystem references with migrations only after explicit user approval. Never rewrite canonical facts to make a schema migration pass.

## 8. Decisions the user has not yet approved

1. Keep jurisdictions in reference, or move its identity under geography/legal while preserving stable references?
2. Separate schemes/values or enforce stronger constraints on current classifications?
3. How to represent global/universal vocabularies vs jurisdiction-specific variants and temporal changes?
4. Which domain-specific enums can become rows, and which tiny closed technical states remain enums?
5. Who approves new values when data pipelines discover unfamiliar categories?

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


## 2026-11-07 user-led revision: explore shared pattern definitions within reference

**Review status remains NOT REVIEWED / not approved for physical changes.** The user proposed keeping the cross-domain pattern registry in `reference`, **beside** jurisdiction identities and classifications, rather than assuming a new `pattern` schema or separate pattern managers in every domain.

This is a **user preference to investigate**, not confirmation that `reference` has the final capacity or semantic ownership for all patterns. In the candidate division: `reference` maintains stable definition identities, approved versions, applicability, categories/labels, links, validated target bindings and watch-rule definitions; `engine` owns run/job/evaluation/gap state; `geography`, `legal` and other domains own the real facts that establish/apply these rules. Filesystem holds approved large versioned manifests.

The **hierarchical/cascading input model** starts with existing `reference.jurisdictions` and verified `geography.units` / `legal.provisions`, producing canonical domain records whose existence and validity can enable later patterns. Model cross-pattern prerequisites as a versioned **DAG** (multiple inputs, no invalid cycles), not an uncontrolled generic string-target graph. A generated record may supply input to a *preapproved* subsequent pattern application, but must not silently create new executable rules.

**Candidate names for study only:** `reference.patterns`, `pattern_versions`, `pattern_dependencies`, `pattern_bindings`, `watch_rules` and `watch_versions`. Do **not** add all of them without a per-table justification; do **not** merge real legal provisions or geo units into `reference`. Categories/labels serve discovery, not referential integrity. Strong cross-schema FKs are still a user requirement; for dynamic targets compare typed association and properly enforced registry strategies. Validate rule language and Dryv table metadata rather than allowing arbitrary SQL/Python against user-selected table names.

**Human review questions added:** Does this scope overload `reference`? Which patterns are definitional (reference-owned) versus domain-specific legal/governance facts? What is the approved dependency-graph/target binding and lineage FK structure? Which watcher definitions belong beside patterns? What source/jurisdiction-specific rules can stay in versioned manifests without introducing country-specific core code?

Full detailed proposal: [Data classes and pattern graph](../data-categories-and-patterns.md). The former suggestion of a dedicated `pattern` schema is **an alternative, not a decision**.

## Mandatory per-table temporal, rigid-column and deletion review (2026-11-07)

**USER REQUIREMENT; planning only.** Examine every existing/proposed field and expressly record **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** for `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision`, `is_current`, `status`, `version`, `created_at`, `updated_at` and other copied/rigid flags. These fields are **opt-in by justified meaning**, not blanket schema conventions. Assess `deleted_at` only for recoverable soft deletion where appropriate. The full policy and migration/approval checklist is in [schema redesign README](README.md).

**Domain-specific guidance:** Jurisdiction and classification identities should not inherit four validity/precision fields by template. Effective applicability belongs to genuinely versioned patterns, jurisdictions or classifications where justified. An authorized pattern can establish records; review whether those records need their own independent lifecycle. Do not soft-delete approved definitions as though they were drafts.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.
