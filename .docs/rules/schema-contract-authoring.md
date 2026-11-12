---
id: RULE-SCHEMA-CONTRACT-AUTHORING
name: Schema contract authoring agreement
type: rule
tags: [dryv, schemas, contracts, review]
extra: {status: proposed, agreed: false, recorded_on: 2026-11-12}
---

# Schema contract authoring agreement

**Proposed for discussion.** The folder layout and requirement for explicit schema review come from the user's instruction. The detailed conventions below await agreement. This document does not approve any table, field, index, relation or migration. See the [review plan](../_plan/schema-redesign/contract-authoring.md) and [schema catalogue](../_plan/schema-redesign/README.md).

## Ownership and layout

```text
dryv/contracts/schemas/
  _shared.ts
  mzizi/
    reference.ts
    geography.ts
    ...one file per reviewed Main schema
  operational/
    auth.ts
    engine.ts
    ...one file per reviewed Operations schema
```

- Filename, Dryv group and storage namespace use the catalogue's schema name: `reference.ts` defines `reference`, not a separate `vocabulary` group. Export names follow that owner, such as `reference` and `referenceSchemas`.
- `mzizi/` maps to database `mzizi`; `operational/` maps to database `mzizi_operations`. One table has exactly one schema owner and database target.
- Schema files own stored entities and their full persistence definitions. Application composition, operations, HTTP routes, request/response projections and pagination belong under `dryv/contracts/apps/`. Defining a table does not expose it automatically through an API.
- Authored contracts are the source of truth. Generated Rust and SQL belong to the database backend; do not reproduce column definitions in Rust, SQL templates or a separate handwritten persistence model.
- Use explicit application imports for reviewed definitions; do not activate every file with directory globs. Existing drafts must be reviewed against this agreement before being treated as compliant.

## Shared definitions

- Put scalar property declarations in `_shared.ts`: strings, numbers, booleans, UUIDs, dates/timestamps, closed technical enums, formats, ranges and reusable validation rules. Use meaningful names such as `BusinessCode`, `LanguageTag`, `AuthAccountStatus` and `OidcSubject`, rather than a universal `String` or `Status`.
- Properties with different meanings or limits remain distinct, even when both are strings. Describe units, format and validation semantics. Domain-specific enums can be named by their owning domain within the shared file; controlled vocabularies remain data.
- Schema files reference those properties with Dryv fields. Nullability, optional input presence, defaults, relations, uniqueness and table invariants are decided at the field/table use site. A reusable property does not silently make a field required, unique or indexed.
- Reusable predicate definitions live in `_shared.ts`; the owning schema declares where they apply. Cross-field or domain-specific rules remain explicit beside the owning entity. `_shared.ts` must not import domain schema files.
- Shared helpers are opt-in and transparent. Do not require a universal stored-entity base that adds creation/update time, version, validity, soft deletion or UUID primary keys to every table. Choose lifecycle fields and composite keys by meaning.
- Follow the [code-column rule](code-columns.md): identity columns are named `code`, use dot-separated lowercase segments, and have the prescribed length, depth, shape and uniqueness. Any requested exception needs an explicit recorded decision; a looser shared string is not equivalent validation.
- Changing a shared definition requires reviewing every consuming schema. Previous approvals cannot silently cover a changed shared meaning or constraint.

## A complete per-schema definition

For each approved table or coherent table subset, define and review all applicable items below. Record a reason when an item is not applicable; do not invent features merely to fill the checklist.

| Area | Required review detail |
|---|---|
| Purpose | Owner, database, schema/table name, meaning of a row, admission and lifecycle |
| Fields | Meaning, shared property, storage mapping, units/precision, nullability, default and derivation; input optionality separately from SQL nullability |
| Identity | Primary/composite keys, stable business codes, natural uniqueness, generated identity behavior |
| Relationships | Exact target/columns, cardinality, optionality, FK or typed reference, update/delete behavior, ownership and dependency |
| Integrity | Unique/check/exclusion constraints, cross-field rules, cycles, allowed transitions, immutable history and enforcement location |
| Indexes | Query or invariant served, ordered key columns, uniqueness, method, predicate/expression and included columns where needed |
| Time and evidence | Historical, observation, retrieval and workflow meanings; exact Source/Filesystem references, uncertainty and correction behavior |
| Access | Sensitive fields, access expectations, retention/deletion rules and any required database permissions |
| Physical features | Required extensions, PostGIS types, generated columns, functions, triggers, views or partitions when justified |
| Documentation | Descriptions for entities/fields and non-obvious relations or indexes; examples and approved field dispositions |

“Complete indexes” means every required, justified index, not every possible index. Query filter metadata does not create or prove a physical index. Do not replace a partial unique constraint with an ordinary index, or omit a second relation because a generator cannot name it.

Within a database, reviewed cross-schema foreign keys are allowed. Across databases, use typed references and explicit integrity/recovery behavior, never a foreign key. Reference is the only domain schema linking to Legal. Retain the catalogue's Official/Governance, Politics, Accountability, Source/Filesystem and operational ownership boundaries. Phase 02 is not an implicit dependency of Phase 01.

## File header and review states

The opening comment is the first content in each schema file, before imports. It identifies the design and exact approved subset. Example for a scope-only file:

```ts
/**
 * Schema: reference
 * Database: mzizi
 * Responsibility: Shared definitions and classifications.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/reference.md
 * Review: scope-agreed; detailed contract pending
 * Approved definitions: none
 * Approval record: none
 * Generation: excluded
 * Open items: Table, field, relationship and index review.
 */
```

- **Scope agreed:** the schema responsibility/placement is accepted. A comment-only `.ts` shell with `export {}` may be created. No entity definitions or generation imports follow from scope approval alone.
- **Contract proposed:** detailed alternatives and dictionaries remain in the owning review document. Existing executable drafts do not establish approval. This task neither creates new unapproved entities nor deletes existing drafts.
- **Contract approved:** record the exact tables, fields, relations, constraints and indexes, the relevant shared-definition revision, decision/date and exclusions in the owning review document. Only that approved subset becomes authored Dryv definitions.
- **Generation ready:** the approved subset and dependencies compile and retain every required semantic through Dryv IR and the selected packs. Explicit application composition includes only that verified subset.
- Approval of one table is not approval of its entire schema. Material changes reopen review for the affected object and dependent definitions; unrelated approvals remain intact.
- Phase 02 receives no new contract shells or definitions until explicitly prioritized. No current design document is automatically relabeled approved by this agreement.

The header summarizes the review record; it is not an enforcement mechanism or a second approval authority. Generation needs a checked, explicit selection tied to the recorded approved subset. Implementing that check is a later step, not behavior claimed by this document.

## Dryv capability gaps and validation

Use supported Dryv authoring constructs and verify their emitted IR and generated output. If a required index, constraint, relation, default or database feature cannot survive that path, record the exact gap and required Dryv enhancement. Do not invent fluent methods, hand-maintain equivalent SQL, silently downgrade constraints, or claim that a comment implements a rule. The affected definition stays out of generation until its full contract is supported; independent approved definitions may proceed.

Before marking a subset generation ready, validate target placement, field/key coverage, shared-property dependencies, every declared relation, constraints and indexes, ownership boundaries, and approval selection. Compare generated models/SQL with the reviewed definitions, check deterministic generation, and test meaningful valid/invalid cases once runtime generation exists. Compiling TypeScript alone is not proof of database enforcement.

Contributor work uses Task on `develop`. Record field dispositions and approval changes in the same owning review document and task. Run `task validate` after documentation changes; implementation work additionally runs the root quality suite and applicable contract/database checks. This proposal does not authorize applying a migration or changing live data.
