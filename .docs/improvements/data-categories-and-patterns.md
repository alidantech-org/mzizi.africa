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

## Related source redesign planning

See [source redesign and adaptive website intelligence](source-redesign/README.md) for the consolidated planning-only review of unknown-site discovery, link/URL deduplication, optional YAML structures, semantic retrieval/ML, incremental processing, the dedicated vector index alternatives and the shared pattern-schema option. **No source/website collapse, new pattern schema or target table set has been approved.**


## New user direction, 2026-11-07 — reference-owned pattern graph and real-row fill-in-the-gaps

**Status: planning discussion, NOT an approved schema or runtime.** This section records the user's newest preferences, which refine earlier suggestions that each domain should have its own pattern tables or that \`place.expectations\` should be the default output.

### Decisions and unanswered questions, verbatim in meaning

- **USER LEAN — pattern ownership:** Explore managing shared cross-domain pattern definitions **inside \`reference\`**, alongside jurisdiction, classifications and the other established data required by pattern evaluation. Do **not** create a dedicated \`pattern\` schema on the basis of the prior recommendation.
- **USER DIRECTION — dependency chain:** Pattern establishment should start from **existing, real** records, usually jurisdictions, geographical units, legal instruments/provisions and rules. A pattern can produce canonical records that in turn become inputs for **subsequent pattern applications**. This may branch or merge: one versioned dependency graph, not a Kenya-specific fixed linear hierarchy.
- **OPEN — generated-row link implementation:** No exact lineage/FK structure selected. Evaluate FK-backed associations, direct origin links where genuinely single-origin, and alternatives that still enforce referenced-record existence. Do not accept \`target_kind + target_id\` alone as a hard FK.
- **OPEN — physical place materialization:** Patterns may establish geographically scoped presence or occupation relationships associated with actual offices, while exact premises, address or coordinates are found later. Determine when a **real presence** is established versus only a legal **obligation to maintain premises**; never manufacture a specific building, address or actual occupant.
- **USER LEAN — manifest management:** Watcher and pattern definitions should be **mostly database-managed**, with approved immutable/versioned files stored in \`filesystem\` for large/complex rule bodies, source manifests and site structures.
- **USER REQUIREMENT — jurisdiction neutrality:** Generic engine and pattern/watcher logic must not directly encode IEBC, KNBS, ORPP, Kenya law or fixed Kenyan administrative counts. Such particulars belong in jurisdiction-specific *data/manifests/source adapters*, with reusable capability interfaces.

### Proposed coherent schema ownership (not yet accepted)

| Schema | Proposed ownership |
|---|---|
| \`reference\` | Definition registry: pattern identity, immutable versions, categories, graph dependencies, applicability, validated target/field bindings, watch definitions, source-selection requirements and activation rules |
| \`geography\`, \`legal\`, \`governance\`, etc. | Canonical inputs and outputs, including partially researched real-world entities; domain-specific business rules remain in owning domain |
| \`engine\` | Evaluations, generation runs, output reconciliation, gaps, watcher state, discovery jobs, retries, candidates, claim reviews and promotion |
| \`filesystem\` | Immutable file versions: large rule/CSV/YAML/JSON bundles, source-site structures, generated discovery plans and pipeline evidence artifacts, stored with existing external S3 |
| \`source\` | Verified publishers and site/source profiles, captures, research methods and evidence |
| \`audit\` | Accountable human/agent approval, corrections, pattern activation and record-change decisions |

Keep \`reference\` for long-lived **reusable definitions**; \`engine\` for transient **operational state**. The reference schema must not become a generic opaque dumping ground, and the table catalogue must reflect validated, versioned Dryv/PostgreSQL contracts rather than executable arbitrary SQL.

### Pattern hierarchy is a directed acyclic dependency graph (DAG)

Example dependency shape (conceptual):

\`\`\`text
reference.jurisdictions              legal.provisions
        |                                   |
        v                                   |
geography.units + geo relationships         |
        |                                   |
        +----------- validated scope -------+
                        |
                applicable pattern version
                        |
             real governance.institutions
                        |
             real governance.offices
                        |
             watch holder/place relations
                        |
        independently verified records/relations
                        |
        may enable another applicable pattern
\`\`\`

Other inputs can include a verified organization, finance unit, period, website structure, or evidence-backed institution. Country-specific instance values stay in seed data, registries and manifests. An existing child record may activate a *preapproved* downstream pattern definition; that does **not** mean it can automatically author and execute unapproved new rule code.

Versioned dependency edges must specify input/output data contracts, applicability by jurisdiction/geo level/period and law, required evidence, stable natural keys, trigger events, and failure/stop conditions. Reject invalid cycles, bound fan-out, and compare input/version hashes for idempotency. A later change in geo/legal input should only invalidate impacted descendants and preserve verified historical records. Different patterns can share outputs only through conflict-aware identity resolution and recorded multiple contributors.

### Pattern result classification — three different actions

| Establishment level | Canonical write | Gap or discovery action |
|---|---|---|
| **Existence established** by verified legal/structural authority and correct applicability | Create or adopt the **real domain row** (e.g. \`governance.offices\`) even if attributes are null or related rows unknown | Watch missing holder, date, place, contact, supporting evidence and freshness according to rules |
| **Entity/presence independently established, details unknown** | Create or adopt canonical entity or proven presence relationship; leave unknown attributes nullable with explicit state/provenance | Investigate address, geocoding, full naming or the real related entity |
| **Only plausible/hypothetical** | **NO new canonical fact** | Emit deduplicated research/discovery job; optionally store a file-backed research plan and evidence; promote a canonical row only after establishment |

\`place.expectations\` should not be the default place for guaranteed entities. Its existing migration and accepted historical design must be **reevaluated**, but not removed just because this new option looks preferable. If a place is actually established, use \`geography.places\` even when the address/coordinates are missing; if merely required by an office rule, create a **gap for physical premises**, not an invented occupied building or an asserted occupancy.

### Physical presence nuance — preserve the user's option without false claims

A known office may have a legal obligation to provide a physical service point while MZIZI lacks its address. Possible designs to compare:

1. **Office + relationship gap (minimal):** real office; watched gap says locate physical presence; create \`place\` and an occupancy FK only after site existence is supported.
2. **Real geo-scoped presence, place unresolved:** a verified presence record/occupancy concept with FK to office and geo unit, **nullable place FK**, and explicit \`location_unknown\` state; later link verified \`place.id\`. This is appropriate when an actual presence is established, not solely legally expected.
3. **Verified named site, incomplete physical details:** real place row with known name or other stable identity, geo scope/precision and null street/coordinates, plus real occupancy link.

Do not prefill an arbitrary address string. Keep geospatial scope, physical site, occupancy, statutory obligation and research completeness distinct, and model one/many physical premises correctly.

### Mostly DB-managed pattern and watcher manifests

Potential **\`reference\` definition concepts**: \`patterns\`, \`pattern_versions\`, \`pattern_dependencies\`, \`pattern_bindings\`, \`watch_rules\`, \`watch_versions\`, plus shared classifications **only if** they have genuine unique semantics. These are **candidate table names**, not approved DDL. Tags, categories and cross-domain links should support discoverability, but must not replace real FKs with an unconstrained EAV graph. Pattern bodies may be a validated declarative DB structure or an approved \`filesystem.versions\` object reference. \`engine\` uses approved versions and records runs and outcomes. APIs/admin UI eventually allow draft/edit/preview/diff/approve/activate/sync, with clear permissions and audit.

**Watch rule scope** can be table/field, missing relationship, missing entity, stale evidence, conflicting claim or incomplete required coverage. Evaluate applicability before queueing; accepted states may be \`unknown\`, \`known_absent\`, \`not_applicable\`, \`disputed\`, \`stale\` or \`verified\`, distinct from entity identity and historical life-cycle status.

The manifest specifies: registered target table and allowed columns; canonical/jurisdiction/geo scope; predicate and condition kind; required relationship cardinality; source selection by publisher role/capabilities; bounded pipeline operations; review/promotion policy; triggers (on materialization, dependent update, new source, freshness deadline); retry policy and dedup key. Use validated manifests and registered implementations, not arbitrary user-authored SQL/Python executed as a privileged worker.

**User-neutrality rule:** generic capabilities like \`lookup_official_registry\`, \`extract_election_results\`, \`extract_statistical_dataset\`, \`find_current_office_holder\`, \`resolve_physical_premises\` receive source-specific adapters and scope manifests at runtime. \`iebc\`, \`knbs\`, \`orpp\`, \`kenya_law\` are **configuration data, named adapters or jurisdiction fixtures**, never branching logic in the universal watch engine.

### Unresolved matters (explicitly not approved)

- Final placement of pattern definitions in \`reference\` versus a dedicated schema, after checking if \`reference\` becomes conceptually overloaded.
- Exact pattern version/applicability/dependency/target table design and typed **hard-FK lineage** to any generated row.
- How much source evidence is sufficient to establish a real entity versus authorize only a research task.
- Whether an unknown-place occupancy should use nullable \`place_id\`, a separate confirmed \`presence\` identity, or no row until independently located.
- Watcher rule ownership (\`reference\` definitions/\`engine\` evaluation), SQL compilation/query safety, permissions and change propagation.
- How to reconcile previous \`place.expectations\`, historical office patterns, existing seed fixtures and claims without losing provenance.
- Exact country-neutral manifest schema, adapter discovery and no-Kenya-hardcoding refactor boundaries.
- Runtime approvals, negative findings/known absence, stale refresh policy, budgets and safe automatic correction thresholds.

**No migrations, engine refactor, task creation or program changes are authorized by this discussion.**
