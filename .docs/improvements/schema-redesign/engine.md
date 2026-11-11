---
id: DOC-E5386C01A9B4
name: Engine staging pipeline processing and pattern runtime redesign
type: documentation
tags: [improvements, schema-redesign, engine, staging, pipelines, patterns, planning]
extra: {status: planning_only, architecture_choice: open}
---

# Engine — pipelines, runs, staging, generation, quality and controlled promotion

**PLANNING ONLY.** The user wants `engine`/`staging` simplified, with all pipeline runs, decisions and processing concerns easy to understand, auditable and scalable. Exact runtime packages/services and final engine table set are **not decided**, and Taskcode tasks will be directed by the user individually later.

## User request: independent pipelines, one coherent operational model

Instead of a monolithic data engine, build independently runnable **data pipelines** (e.g. governance leadership, procurement, legal sources, statistics, website Markdown extraction) that can work simultaneously toward one shared coverage goal or different goals. Reuse standalone packages for agent/AI, scraping, web rendering, extraction, file access, normalization, validation, entity matching, dedup, generation and promotion. Pipeline execution is not the same as the canonical data domain. The `engine` schema is the proposed operational control center; `source` preserves evidence, `filesystem` manages logical file/object references, `audit` records immutable decisions, and domain tables store canonical data.

The user requests explanation of how architecture/code will look and has **not** approved one central queue, microservices, Python-only workers, or directory layout. A later separate database is a *future* possibility, not a current requirement.

## Current migration-owned tables: 13 existing operating records

| Current table | Ownership and redesign question |
|---|---|
| `engine.migrations` | TypeORM migration-history bookkeeping; do not mix with business pipeline jobs. |
| `engine.jobs` | Existing queued work, input hashing/generation, retries, concurrent `SKIP LOCKED` claims. |
| `engine.match_candidates` | Proposed same-identity pair/merge suggestions; strict evidence and confidence review. |
| `engine.match_clusters` | Possible candidate clusters; cannot auto-merge different persons/organizations solely by names. |
| `engine.gaps` | Known missing coverage/research targets with source/geo context. |
| `engine.gap_attempts` | Attempts to resolve gaps, work status and provenance. |
| `engine.claims` | Candidate field-level claims/correction suggestions, with conflict state. |
| `engine.claim_standings` | Comparing/reconciling competing claims; audit the actual status model. |
| `engine.quality_findings` | Reproducible quality/integrity problems, fingerprint and review status. |
| `staging.runs` | Existing stage/import run context; evaluate overlap with `engine.jobs` and pipeline-level runs. |
| `staging.candidates` | Validated/unvalidated candidate records, natural keys, payload hashes and origin. |
| `staging.issues` | Candidate/integrity/extraction errors and quarantine statuses. |
| `staging.promotions` | Result of promoting approved candidate data into canonical domain rows. |

`access` and `identity` data move toward `auth`, **not engine**. `audit` remains a separate accountable-actor/decision concern; engine may FK to audit or vice versa. Avoid merging all operational logs into one opaque JSON table. A job, a run, a candidate, a correction proposal, a verified record and an audit decision have different lifecycles.

## Proposed concepts for evaluation — not approved tables

| Candidate | Why it might improve clarity |
|---|---|
| `pipelines` | Registered workflow identity, domain objective and allowed start/retry semantics. |
| `pipeline_versions` | Version of pipeline DAG/config/tool requirements and structured input/output contract. |
| `runs` | A pipeline or declared shared goal instance, owner, scope, status, timestamps, input version and summary. |
| `jobs` | Individually schedulable step or fan-out unit with idempotent key, dependencies, lock/lease/retries and output. |
| `dependencies` | Explicit job/pipeline input dependencies; maybe a table or validated JSON DAG if truly immutable. |
| `candidates`, `issues`, `promotions` | Possibly relocate from staging while preserving identity and review history; don't create duplicates. |
| `patterns` and `pattern_versions` | Central registry for domain-specific pattern definitions and approved versions. |
| `generations` and `generation_outputs` | Sync/dry-run previews, actual produced expected/canonical rows and provenance. |
| `reviews` and `decisions` | Workflow state (not duplicate the immutable approval action in `audit`). |
| `artifacts`/`outputs` | Durable pointers to `filesystem.versions` and `source.captures` rather than copied bytes. |
| `metrics`/`coverage` | Derived dashboard views as needed; consider computed read views rather than hot counters. |

The exact schema may preserve `staging` physically if that makes transactions and access control clearer. **The user suggests a simpler shared `engine`, but consolidation is subject to per-table analysis.**

## Workflows and SQL/foreign-key boundaries

A goal "verify leadership for 47 counties" expands to independently claimable jobs; procurement and statistics may run concurrently. Each job has stable pipeline/version/input keys, dependencies, source policy, resource quota, attempt count, error type and output artifact FKs. A job must be retryable and idempotent; two workers may not silently promote conflicting canonical edits. The system needs bounded concurrency, dependency-aware resumption, cancellation/pause, source rate limits, extraction caching and human review states.

Use hard FKs `jobs.run_id`, `issues.candidate_id`, `promotion.candidate_id`, `generation.pattern_version_id`, `generation_outputs.generation_id`, `capture.file_version_id`, `audit actor`, and other structurally known targets. Generic target-record links (e.g., one candidate for any domain table) need a type-safe strategy: explicit typed associations or a constrained canonical record registry; a bare schema/table name and UUID alone is not enforceable. Preserve source tool/extractor/AI model/prompt version and method without duplicating authoritative provenance.

## Data classification and patterns across everything

**1A static** records can be seeded deliberately with documented IDs/evidence. **1B pattern** runs generate expected entities from approved, jurisdiction-scoped, versioned rules; **2A collected** pipelines acquire and extract external evidence into staged candidates; **2B derived** pipelines recompute formulas/dependency outputs only when inputs or tool versions change.

Every table must document its eligible class in PostgreSQL and Markdown; record-level lineage must identify the actual class, inputs, pattern, capture, versions and reviewer. Patterns may be mostly DB-managed, with approved versioned CSV/YAML/JSON or site-structure bundles in `filesystem`. Support admin viewing, editing, approving, dry-running and click-to-generate/synchronize, without bypassing established permission or review gates. Pattern changes should generate a diff of expected/adopted/retired/conflicted rows—not automatically delete historical office holders.

## Hashing, correction and change-aware execution

Use distinct hashes for immutable S3 bytes, semantic Markdown content, DOM subsections/site manifests, normalized candidate payloads, pipeline input/tool configuration, and derived outputs. Recheck old URLs according to refresh policy; seeing one URL previously does not make it immutable. Cached extraction results can be reused only when input and extractor/template versions remain compatible. Propagate invalidation through declared dependencies.

Existing `engine/database/src/claims.ts` only permits narrowly scoped annotation fills, not general overwrites. Design a reviewed correction path that separates mistaken fact, real-world historical change, pattern expectation revision and duplicate-identity merge. Protect source evidence and valid time, track corrected assertion versions and audit. Review policies differ by field sensitivity, data class and evidence quality.

## Candidate runtime/package architecture (not chosen)

- **Option A:** one Python/Bun runtime with pluggable pipeline modules; easy start, weaker failure isolation.
- **Option B — assistant lean:** modular reusable packages, independently runnable workers, a common durable PostgreSQL orchestration/queue and strong service contracts; not yet user-approved.
- **Option C:** independently deployed microservices with queue/events and more infrastructure.
- **Option D:** hybrid split by expensive render/AI extraction workloads if real volumes justify it.

See [independent pipelines](../independent-data-pipelines.md) for flow, code examples and tradeoffs. Database `engine` ownership is not synonymous with where scraper/agent/extractor packages physically run.

## Example queries and design proof cases

- Show all pipeline runs supporting a Kenya national-scoped source update and all its county jobs, with independent progress.
- Resume just three failed counties without re-downloading the unchanged other 44 county artifacts.
- Compare generated office expectations before and after a revised legal rule, preserving verified occupants.
- Re-extract a Markdown section on tool update despite unchanged raw HTML; avoid repeated extraction of unrelated pages.
- Show why a proposed supplier identity merge was rejected and which original source records it affected.
- Track an official-source crawl blocked by collection policy without fabricating a capture.
- Run a legal publications pipeline while procurement imports run, avoiding shared resource and canonical conflicts.

## Open decisions and migration approach

1. Exact pipeline process/package/service boundaries and language choices.
2. Job/run/dependency granularity, separate goal object, concurrency quotas, budgets and worker/resource lease semantics.
3. Whether to physically merge `staging` and `engine`; avoid collisions with current `engine.migrations`.
4. Central pattern registry + per-domain rules; DB functions vs workers for deterministic generation.
5. FK strategy for generic candidates/claims/attributions and canonical target versions.
6. Reviewer privileges, immutable `audit` event link, correction policies and AI agent accountability.
7. Status taxonomy, metrics, log retention, observability, distributed task locking and outage recovery.
8. Data acquisition schedules, site revalidation rules and dependency invalidation.
9. When a future independent engine database becomes justified given today’s desired cross-schema FK guarantees.

Audit all migration-created tables and live rows, TypeORM/engine writer paths and source contracts first. Preserve job/candidate/promotion IDs and history. Implementation tasks, new packages, database moves and tests require **subsequent user direction and approval**.

**References:** [Master register](../mzizi-data-schema-storage-and-pipelines-redesign.md) · [Pattern classes](../data-categories-and-patterns.md) · [Pipelines](../independent-data-pipelines.md) · [Audit](audit.md).

**Status: future architecture under discussion, not ready for implementation.**

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

## Related source redesign planning

See [source redesign and adaptive website intelligence](../source-redesign/README.md) for the consolidated planning-only review of unknown-site discovery, link/URL deduplication, optional YAML structures, semantic retrieval/ML, incremental processing, the dedicated vector index alternatives and the shared pattern-schema option. **No source/website collapse, new pattern schema or target table set has been approved.**


## 2026-11-07 refinement: reference-owned pattern/watch definitions, engine-owned work

**User lean (not approved DDL):** Instead of defining independent pattern tables in every domain or necessarily creating a new `pattern` schema, investigate `reference` as the home for shared **long-lived pattern and watcher definitions**. `engine` remains the home for execution, retries, gaps and claims. The pattern is established by real jurisdiction/geography/legal records; a generated canonical record may activate further *preapproved* pattern applications.

**Engine runtime concepts to evaluate:** a versioned pattern application/run, generated-output reconcile result, dependency invalidation, one pending research job per deduplicated gap/trigger, watcher evaluation log, source capability selection, claim/quality/review and eventual controlled update. Much of this already exists in `engine.jobs`, `engine.gaps`, `gap_attempts`, `claims`, `claim_standings`, `staging.candidates` and `promotions`; reuse before adding tables.

**Watcher manifests mostly DB-managed:** `reference` definition and file version; engine compiles approved conditions from validated Dryv/table metadata and runs field/relationship/coverage/freshness/conflict checks. A rule can trigger on established row creation, missing FK relation, upstream source change, legal amendment, geo unit change or age of verification. Unknown/not-applicable/known-absent/verified/conflicted states prevent endless retries. Pipeline tools produce candidates with evidence; policy-controlled reviewer promotion fills real domain fields/relationships and preserves history.

**Core neutrality defect observed in repository:** `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/data/src/mzizi_data/reinforcement.py` hardcodes a `RULES` dictionary naming `knbs`, `iebc`, `orpp`, `kenya_law`; `gapclose.py` has `orpp_refill` and Kenya-specific party code values; `.docs/_archives/2026-11-08-rewrite-snapshot/source/backend/engine/database/src/patterns.ts` defaults to `ke`, knows county numbers and uses `ke-office-patterns.json`. Their generic orchestration behavior should become context-free; country facts and official adapter choices should be loaded via source/jurisdiction manifests and registered tools. Dedicated IEBC/KNBS adapters can still exist as **plugins**, just not as conditions hardcoded into the universal watcher. No tests/code/refactor are authorized yet.

**Dependency safety:** a directed acyclic prerequisite graph, bounded fan-out, stable natural keys and input-version hashes, dry-run/preview/diff before apply, non-destructive sync, independent legal/geo applicability tests and transaction-controlled promotion. Source changes trigger re-evaluation of **affected** rows, not a whole-database rescan. The chosen generated-output hard-FK mechanism remains OPEN.

Full discussion: [Data classes and pattern graph](../data-categories-and-patterns.md). **No tasks or runtime changes authorized.**

## Mandatory per-table temporal, rigid-column and deletion review (2026-11-07)

**USER REQUIREMENT; planning only.** Examine every existing/proposed field and expressly record **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** for `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision`, `is_current`, `status`, `version`, `created_at`, `updated_at` and other copied/rigid flags. These fields are **opt-in by justified meaning**, not blanket schema conventions. Assess `deleted_at` only for recoverable soft deletion where appropriate. The full policy and migration/approval checklist is in [schema redesign README](README.md).

**Domain-specific guidance:** Jobs, runs, gaps, candidates, attempts, claims and quality findings need created/queued/started/completed/rechecked timestamps and explicit workflow state, not real-world validity or is_current by convention. Approved patterns may have applicability periods in reference; their engine executions do not inherit them as event validity. Operational retention/cleanup should be planned independently of public history.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.


## 2026-11-07 proposal: evidence-backed freshness, scheduled/event/manual triggers

**USER IDEA:** An engine should continuously identify facts that require revalidation, react to meaningful scheduled or actual `activity` changes, and accept authorized ad-hoc agent/admin research requests. This expands—not replaces—the existing shared patterns and fill-in-the-gaps watcher design. All schema proposals remain OPEN.

### Distinguish freshness from canonical modification

- `last_checked_at`: an attempt was made; a failed request may legitimately update this but does **not** confirm accuracy.
- `last_verified_at`: evidence satisfying the applicable verifier policy reaffirmed the particular fact or relationship; it may advance without any domain row update.
- `last_source_seen_at`: a source/webpage was seen or revalidated; this is not independent fact verification.
- `last_changed_at`: a detected or accepted fact change **with precisely documented meaning**; do not conflate source HTML change, source claim change and accepted canonical mutation.
- `next_check_at`: computed or scheduled follow-up from applicable rule, risk and observed outcomes.

**These are semantic metadata concepts, not five automatically required columns on each domain row.** Favor centralized verification histories linked to a **field group, relationship or relevant canonical record/version**, with row-level exceptions where necessary. A broad `table was refreshed` watermark is not proof that every field or row was verified.

### Candidate responsibilities (avoid premature tables)

| Owner | Candidate responsibility | Existing structure to inspect |
|---|---|---|
| `reference` | `freshness_policies`, schedule/pattern/watch definitions and versions | Existing reference classes and approved pattern planning |
| `activity` | Schedule instances, sourced official announcements/real-world occurrences, rescheduling and cancellations | `calendar.events`/`links` |
| `engine` | Due-check evaluation, triggering/dedup, `verification_checks` / `refresh_requests` / schedule firings if needed, workers, gaps and candidates | `engine.jobs`, `gaps`, `gap_attempts`, `claims`, `quality_findings`, `staging` |
| `source` | Verified claim evidence, captures, source observability, review and provenance | `source.verifications`/`captures`/`attributions` |
| `audit` / `auth` | Actor identity, permissions, human submissions, review decisions and correction history | Current account/role and audit entities |

### Event-driven + periodic + manual scheduling in one control plane

Accepted input types: (1) a scheduled due window or legal reporting deadline, (2) an approved announcement or verified occurrence, (3) a new/changed official-source page or Markdown section, (4) a canonical/legal/pattern or geographic dependency change, (5) an authorized admin request or agent-directed monitoring instruction, (6) a previously unresolved coverage gap that becomes due.

Proposed flow: **receive trigger → resolve immutable rule/policy version → evaluate jurisdiction/geo/temporal scope → identify affected domain rows and field groups → deduplicate `(rule_version, subject, target_field_group, cause/evidence_version, due_window)` → enforce source permissions and source-host admission → run bounded verification → record checks and source evidence → unchanged / new candidate / contradiction / unknown / inaccessible / deferred → review/promotion as applicable → next_check/retry.**

**Avoid runaway loops:** trigger provenance and dependency graph, depth/fan-out limits, trigger ID ancestry, cooldown/debounce, bounded retries, one job lease per dedup key, stop on proven unchanged result, and no event notification loop just because `last_verified_at` advances. One authoritative engine scheduler/lease/admission system must govern all third-party crawlers/agents; do not let each external tool launch an independent refresh scheduler.

### Hotness is granular and adaptive, not just a table flag

Start with classifications such as `hot` (active leadership/elections/tenders), `warm` (contacts/current budgets), `cold` (stable historical definitions), and `event-driven` (official releases and disputed/historic facts). **Exact cadences are NOT approved.** The same table can have hot office-holder relationships and cold party identity fields. Evaluate scope at table default → field group/relationship → exceptional record. Factors: age since successful verification, expected change rate, source confidence/availability, severity of stale information, official calendar/event signals, observed content-tree change, source access budgets and review priority.

A new source fetch should not change a canonical fact just because it is new; a check can result in verified **unchanged** with an updated verification event. A stale indicator is **not a claim of falsity**. A scheduled event passing its planned date is not proof that it occurred. Keep data quality/research state separate from real-world entity lifecycle and workflow status.

### Manual submission and agent-driven monitoring

An authorized admin can: (a) propose activity with evidence, (b) request re-verification without claiming a change, (c) approve a verified event according to RBAC, or (d) configure a scoped recurring monitor under approved capabilities/budgets. Agent tasks such as "watch these approved official sites for announcements about this institution" must become a persisted, bounded rule/monitor with source policy and an execution audit; not an unbounded conversational instruction. Human/agent action has account/service identity and traceable decision/validation.

**Research outcomes:** successful no-change verification; supported new canonical candidate; conflicting evidence requiring review; missing relationship; source unavailable; publisher-reported withdrawal; deliberate known-absence or not-applicable; canceled/overdue event schedule. Do not falsely advance `last_verified_at` when only a failed check or a source download occurred.

**Unresolved design decisions:** whether the verification ledger physically lives under `engine` or `source`; how to enforce hard FK lineage for generic field-group checks; table/field-group policy registry representation; schedule-rule recurrence and timezone/legal exceptions; scheduler dedup keys; what source events are trusted to auto-trigger; cost/volume retention; which updates bypass human review. **No code/migration/task authorization.**

## 2026-11-11 — System-expansion alignment

Spatial/environmental transformations and domain acquisitions remain engine jobs with pinned inputs, methods and outputs; engine execution does not own canonical domain facts. See the [system-expansion proposal](../advancement-and-system-expansion.md). This alignment note does not approve proposed schemas, tables or implementation.
