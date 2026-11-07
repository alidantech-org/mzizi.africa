---
id: DOC-826E1B3A4F5C
name: Data categories pattern generation and lineage design
type: documentation
tags: [improvements, planning, data-classification, seeds, patterns, lineage]
extra: {status: planning_only}
---

# Data classes, reusable patterns, generation, lineage and corrections

**PLANNING ONLY — architectural possibilities to review with the user; not a finalized implementation design.**

This is a **cross-cutting requirement** for every domain and activity, not just the database-engine seeds. The user's original distinction is **two main categories** with **four subcategories**, preserved exactly in intent:

| Top-level class | Subcategory | Definition |
|---|---|---|
| 1. Seeded | **1A Static curated seeds** | Finite, individually researched/prepared data, often changing infrequently. Can be corrected. |
| 1. Seeded | **1B Pattern-generated seeds** | Repeatable structures derived from established, researched rules and applicable parent units, e.g., an expected governor office per county. |
| 2. Automated/generated | **2A Externally collected/extracted data** | Records researched by loops/jobs using authoritative or suitable external sources, often after patterns create coverage expectations. |
| 2. Automated/generated | **2B Internally derived data** | Versioned computed indicators and transformations from existing data and formulas. |

**Do not equate an expected role, office, branch or law-derived structure with an observed real-world holder, valid address, functioning facility or compliant transaction.** Generated expectations are editable and reviewable as research changes.

## User requirements to preserve

- Every table should have an explicit Markdown/DB comment documenting **which acquisition classes are eligible**; a schema can also have a planning category/tag.
- Eligible domains should have first-class, **mostly database-managed patterns**. Do not force the same pattern table into every domain if it has no coherent pattern use.
- Patterns can be **created, edited, versioned, viewed, compared, generated and synchronized** through a future backend/admin UI. A click-to-generate/sync feature is desired, including logs and feedback.
- Support local CSV/folder/file-managed definitions and object-backed artifacts for **large/complex patterns**, including site structure patterns. Prefer DB for registry and operational metadata.
- Track pattern version, inputs, applicability, expected cardinality, date, legal/geographic basis, result identity, actual generated row, later edits/supersession, and work runs.
- Consider **PostgreSQL functions/procedures** for deterministic set-based cases; use packages/workers for external evidence, AI and complex operations. Evaluate tradeoffs before deciding.
- Pattern/seed redesign must affect the **whole** proposed schema, file system, pipeline, data quality and gap detection—not just one seed command.

## Suggested conceptual representation — not approved names

- A pattern **definition** identifies purpose, applicable domain/target, authority, jurisdiction/geo level/type, inputs, allowed parameters, generation policy and author.
- An immutable **version** stores the rule body (small validated JSON) or points to a versioned `filesystem` artifact (CSV/JSON/Markdown/site structure), plus a content hash and effective period.
- A **generation run** records start/end, triggering actor/worker, version, inputs/input hashes, jurisdiction, geo scope, dry-run vs apply, failures, counts and decisions.
- **Generation outputs** link pattern/run to expected or proposed canonical rows, recording existing/adopted vs newly created vs skipped vs retired vs awaiting evidence.
- Domain-specific structured rules remain where they carry real semantics: `governance.rules`, office patterns, legal processes, website structural patterns, statistical series expectations and finance report schedules.
- **Canonical record lineage** identifies actual acquisition category, contributing source artifacts/claims, pattern version or extraction/derivation version. A table's eligible category must **not** be inferred as the category of every row.
- **Coverage metrics** compute expected vs identified vs independently verified vs unverified vs no-details-found vs legally inapplicable. Avoid false completeness.

**Critical open modeling choice:** Which tables have a direct `pattern_id`/`generation_id` FK, and which use a generic lineage registry with typed FK associations? Hard FKs across schemas are the new user requirement, and generic kind+ID pairs are not equivalent to database-enforced FKs. Compare safe approaches before implementation.

## Pattern creation and synchronization lifecycle

1. Research a law, official administrative structure, or repeatable website family. Distinguish researched hypothesis from official verification.
2. Record the scope and legal/administrative authority, including a **dated legal provision or validated policy** when appropriate.
3. Author a rule, define inputs and expected output semantics. Schema-validate rule and identify source/author.
4. Preview **which rows would be created, adopted, changed, deactivated, or left unchanged**; show unresolved dependencies and data conflicts.
5. Approve the pattern version and execute idempotent deterministic generation, with traceable run metadata.
6. Independently collect evidence for actual holders, addresses, contacts, elected results, budgets and other claims. **No inferred occupant or location from a mere expected office**.
7. If a rule changes, perform a new versioned diff; preserve historical truth and distinguish erroneous expectation from real-world change. Reconciliation must not overwrite independently verified facts.
8. Trigger dependent collection, validation, derived computation and correction review only for impacted records.

### Example (Kenya) and country-wide scope

Country-wide institutions such as IEBC/ministry belong to Kenya's **root geo unit for scope**. County institutions/offices scope to the proper county unit. The actual ministry HQ may be in Nairobi, while it legally serves Kenya. No missing/unknown address is fabricated.

Pattern: `47 verified county geo units + valid gubernatorial role pattern -> 47 expected governor offices`. That says **nothing** about the names of 47 living current governors. Each holder needs independent dated evidence and review. Some positions have variable legal cardinality or temporal applicability; not all offices are 1-per-unit.

Existing `ke-office-patterns.json` and `governance-catalogue.ts` implement part of this already. A previously noted **1,450 vs 1,452 ward count discrepancy** must be resolved before trusting bulk regeneration; verify current repository and source data rather than blindly fixing counts.

## Correction, verification and class-aware safeguards

- Static curated seeds: identifiable curator/source; mistakes corrected with new evidence and a review trail.
- Pattern-generated records: new pattern version and expected-vs-actual diff; respect independently verified overrides and historic validity.
- Collected records: duplicate-hash check, source provenance, canonical identity resolution; contradictory facts become reviewable claims.
- Derived records: formula/version/input hashes, idempotent recalculation, stale results detection; never claim derived values are directly observed.
- Person and organization dedup: names alone are weak evidence; use identifiers and independent corroboration. Flag conflicting geography/periods rather than auto-merge.
- Track who/what changed a claim, when it was asserted vs when it was true, old and new value, source artifact, model/tool version and review decision.
- Different policy thresholds for different data classes, sensitivity and consequences. More detailed thresholds **not yet approved**.

Reuse existing `engine.claims`, `staging.candidates`, `engine.match_candidates`, `engine.quality_findings`, `source.attributions` and derived calculations; do not duplicate these blindly in new schemas.

## Pending user decisions

1. Exact per-table category tag format, authoritative machine-readable registry and PostgreSQL comment synchronization.
2. Pattern registry vs per-domain rules; which pattern definitions belong in SQL, structured JSON, files or folders.
3. Permission and review policy for creating, editing, approving and applying a pattern in the admin UI.
4. SQL-function generation vs worker generation, with a common audit and canonical promotion path.
5. Stable identity and lineage FKs, given the user's cross-schema hard-FK requirement.
6. Pattern version effective dates, adoption of legacy generated rows, legal changes and confidence.
7. Domain-specific correction policies and coverage status vocabulary.

**Hand-off:** This is an evaluation plan, not authority to add database tables or create Taskcode tasks. The user decides the review/task sequence later.
