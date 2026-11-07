---
id: DOC-6E391A2B4C05
name: MZIZI improvements planning index
type: documentation
tags: [improvements, architecture, planning, index]
extra: {status: planning_only, task_creation: user_directed_only}
---

# MZIZI improvement planning — compact document index

**Planning and discussion only. Not approved for code changes, migrations, infrastructure work, or Taskcode task creation.**

The user wants **few, useful cross-cutting documents**, but explicitly requested an individual detailed document for each of the 18 proposed schema domains. This is an organized reference library for a user-led schema redesign, data acquisition/generation improvements, a file manager backed by an **already deployed S3-compatible service**, and modular concurrent pipelines. The project will create Taskcode groups/tasks **one by one only when and how the user directs**, after discussing and approving design details. The user, not this document, determines implementation order.

## Read in this order

| Document | Role |
|---|---|
| [Master planning register](mzizi-data-schema-storage-and-pipelines-redesign.md) | Full record of all user concerns, 18 answers, 22 open decisions, recommendations, current 24-schema/141-table inventory and handoff constraints. **Do not discard this register.** |
| [Schema redesign folder](schema-redesign/README.md) | Audit method, scope, candidate regroupings, per-table/per-column decision template. **All 18 requested domain design files now exist following the user's explicit request; no additional placeholder files will be created automatically.** |
| [Data classification and pattern generation](data-categories-and-patterns.md) | Seeded/static, seeded/pattern, collected, derived; eligible table/class tags; pattern ownership, versions, corrections, sync, lineage and UI. |
| [File manager and external S3](file-management-and-s3.md) | Logical folders/tags, clear structure, hashes/dedup, source files/derivatives, URLs and integration with the user's existing service. |
| [Detailed source redesign and website intelligence](source-redesign/README.md) | Human table-by-table source/website review, root discovery, link graphs, fuzzy/ML ranking, vector-index options, adaptive extraction, pattern-schema alternative and open decisions. **Planning only; no consolidation approved.** |
| [Site structure, content hashing and Markdown conversion](site-structure-and-markdown-extraction.md) | HTML/CSS/JavaScript-aware discovery, rendered content → readable Markdown, site/tree/section change detection, accurate extraction and mapping. |
| [Independent pipelines and packages](independent-data-pipelines.md) | Pipeline composition, reusable agent/scraper/extractor/file packages, concurrency, dependencies, caching, safety, run control and alternatives. |

**Reason for this layout:** More detailed schema review benefits from a dedicated folder because the user will evaluate each domain and individual table, but the cross-cutting subjects belong in **four substantive documents**, not one tiny file per topic. Keep descriptions nonduplicative: the master is the decision record; focused files explain design/tradeoffs.

## Standing instructions

- `develop` only. Never change `main`, create a branch or worktree, or change `.github/**` without permission.
- No automatic Taskcode task group or tasks. The user will specify the sequence and content one task at a time when ready.
- No present permission to change database naming rules, Dryv schemas, API, migrations, S3 config, or deployed data. In particular the user **rejects** the old "no cross-schema foreign keys" rule, but that rule must only be replaced during a separately approved coordinated migration.
- Preserve original evidence, dates, corrections, provenance and the user's four acquisition classes throughout all designs.
- A recommendation is not a user decision. The procurement model, generic FK mechanism, exact schema compression, contact ownership, pipeline deployment model, and numerous other items remain open.
- Consult `AGENTS.md`, `.docs/docs/DOMAINS.md`, `.docs/docs/DATA_LIFECYCLE.md`, `.docs/docs/ARCHITECTURE.md`, current contracts and engine code before planning a specific implementation.
- This layout is itself provisional. Do not proliferate documents without a clear new scope and user direction.

**Status:** Comprehensive planning preserved; detailed user-led schema/column review and architectural approval remain pending.


## Required schema-column simplification review (2026-11-07)

The user rejected automatically adding `valid_from/to`, `valid_from_precision/to_precision`, `is_current` and other generic rigid columns everywhere. The [schema redesign README](schema-redesign/README.md) now defines a **mandatory per-table KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD review** across all 18 domain designs. It also evaluates selective `deleted_at` soft deletion for recoverable user-managed records, separately from real-world retirement, source evidence, corrections and privacy erasure. **No final per-table decisions or migrations are approved.** The older broad date-precision convention must be reconciled during a separately authorized code/docs migration, not modified silently now.

## Source redesign — deep research follow-up

The [source-redesign index](source-redesign/README.md) now links [prior art/build-versus-reuse](source-redesign/10-prior-art-and-build-vs-reuse.md), [tool integration contracts](source-redesign/11-tool-integration-and-contracts.md), [artifact storage/lineage](source-redesign/12-artifact-lifecycle-and-lineage.md), and [research experiments](source-redesign/13-benchmarks-and-research-questions.md). These are **planning only**, not approval of source/website consolidation, a pattern schema, new tables or deployed tools.


## 2026-11-07 design findings: semantic fields, freshness and activity-triggered research

The user directed **documentation of the two most recent architecture discussions without implementation**:

1. **Understandable column naming and data freshness:** [Schema-wide naming/freshness review](schema-redesign/README.md) now requires domain-specific column names (e.g. `joined_on`, `appointed_on`, `commenced_on` when they represent actual facts), justified instead of generic `valid_from/to`, and centralized, explainable per-table-default/field-group/relationship/record verification histories. [Reference](schema-redesign/reference.md) covers policy; [engine](schema-redesign/engine.md) records attempted versus successful verification; [source](schema-redesign/source.md) distinguishes changed downloads from verified facts.
2. **Schedules, real events and agent/admin triggers:** [Activity](schema-redesign/activity.md) and [reference](schema-redesign/reference.md) now plan jurisdiction/legal recurrence and reporting schedules, announcements, cancellations, verified occurrences and links to canonical election/census/parliamentary/budget records. [Independent pipeline design](independent-data-pipelines.md) covers authorized official-site monitoring, a single engine scheduling boundary, targeted refresh, and admin-submitted event/recheck requests.

[Master register sections 27–28](mzizi-data-schema-storage-and-pipelines-redesign.md) preserve the user's specific concerns, repository findings, recommendations, unresolved decisions and non-implementation status. No additional schema-review placeholder files were created; the existing 18 schema-review files remain available for the user's eventual one-by-one approval. The two cross-cutting improvement documents linked above record separate planning discussions. **No Taskcode tasks, migrations, schema edits or application code changes were authorized.**

## Person identity, participation and entity prominence

Two additional cross-cutting proposals record the recent design discussion. Both are planning-only and preserve the user's review/approval of schemas and implementation:

| Document | Purpose |
|---|---|
| [Person identity, media enrichment and community-assisted data refinement](person-identity-media-and-community-refinement.md) | Mzizi Swipe, citizen and county-watcher feedback, verified official submissions, admin review, reversible identity resolution, CSS/HTML portrait discovery, existing filesystem/S3 storage and the legal gate for any facial biometrics |
| [Cross-domain entity prominence, ambiguity and research discoverability](entity-prominence-and-discoverability.md) | Explainable 0–1 prominence for people, geographic units and institutions; reference-driven office categories; contextual ranking; separate ambiguity/evidence/source credibility; AI-assisted research prioritization |

The existing person model already uses filesystem attachments for portraits. These proposals do not approve a new participation, media, prominence or biometric schema. See also the [source-redesign index](source-redesign/README.md).
