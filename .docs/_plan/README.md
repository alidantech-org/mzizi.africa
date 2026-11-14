---
id: DOC-6E391A2B4C05
name: MZIZI improvements planning index
type: documentation
tags: [improvements, architecture, planning, index]
extra: {status: planning_only, task_creation: user_directed_only}
---

# MZIZI improvement planning — compact document index

**Planning and discussion only. Expansion proposals are not approved for SQL, API implementation, migrations, infrastructure work or deployment. Documentation tasks are tracked through the repository Task workspace; that tracking does not approve implementation.**

The user wants a small set of useful cross-cutting documents alongside detailed domain design documents. The library covers a user-led schema redesign, data acquisition/generation, a file manager backed by the existing S3-compatible service, and modular pipelines. The system-expansion proposal describes the broader research and product vision; domain documents refine possible ownership. Implementation order and approval remain user-directed.

## Read in this order

| Document | Role |
|---|---|
| [System expansion and advancement proposal](guides/advancement-and-system-expansion.md) | Broad vision, five exploration areas, candidate domains/tables, ownership boundaries, spatial/statistical lifecycle, product capabilities, standards and unresolved questions. Hypothetical and not SQL-approved. This document frames the expansion. |
| [Master planning register](guides/mzizi-data-schema-storage-and-pipelines-redesign.md) | Preserves user concerns, prior research, decisions, recommendations, historical inventory and unresolved design questions. **Do not discard this register.** |
| [Schema redesign folder](schema-redesign/README.md) | Operational, Phase 01 civic accountability and deferred Phase 02 schemas, with a complete relocation inventory and retained proposal dictionaries. |
| [Data classification and pattern generation](guides/data-categories-and-patterns.md) | Seeded/static, seeded/pattern, collected, derived; eligible table/class tags; pattern ownership, versions, corrections, sync, lineage and UI. |
| [File manager and external S3](guides/file-management-and-s3.md) | Logical folders/tags, clear structure, hashes/dedup, source files/derivatives, URLs and integration with the user's existing service. |
| [Detailed source redesign and website intelligence](source-redesign/README.md) | Human table-by-table source/website review, root discovery, link graphs, fuzzy/ML ranking, vector-index options, adaptive extraction, pattern-schema alternative and open decisions. **Planning only; no consolidation approved.** |
| [Site structure, content hashing and Markdown conversion](guides/site-structure-and-markdown-extraction.md) | HTML/CSS/JavaScript-aware discovery, rendered content → readable Markdown, site/tree/section change detection, accurate extraction and mapping. |
| [Independent pipelines and packages](guides/independent-data-pipelines.md) | Pipeline composition, reusable agent/scraper/extractor/file packages, concurrency, dependencies, caching, safety, run control and alternatives. |
| [Mzizi engine CLI and capability proving](mzizi-engine/README.md) | `mzizi` developer CLI to run extraction, fetch, scraping, browser, manifest and filesystem capabilities on local files and URLs, with a git-ignored `.dev/` workspace and dev-only Mongo/vector services. Planning only. |

**Document authority:** The expansion proposal sets broad vision and hypothetical cross-domain boundaries; the master register preserves design history and decisions; the connected foundation controls Task 03; individual domain documents own detailed analysis. Where they conflict, retain the accepted specific decision and record the mismatch for resolution. Keep summaries linked rather than duplicating whole designs.

## Standing instructions

- `develop` only. Never change `main`, create a branch or worktree, or change `.github/**` without permission.
- No automatic Taskcode task group or tasks. The user will specify the sequence and content one task at a time when ready.
- Scope and approvals are recorded in the active schema redesign catalogue and owning decisions. Reviewed same-database cross-schema foreign keys are allowed; cross-database foreign keys remain prohibited. Contract work does not by itself authorize migrations, S3 changes or deployed data changes.
- Preserve original evidence, dates, corrections, provenance and the user's four acquisition classes throughout all designs.
- A recommendation is not a user decision. The procurement model, generic FK mechanism, exact schema compression, contact ownership, pipeline deployment model, and numerous other items remain open.
- Consult `AGENTS.md`, `.docs/docs/DOMAINS.md`, `.docs/design/architecture/DATA_LIFECYCLE.md`, `.docs/docs/ARCHITECTURE.md`, current contracts and engine code before planning a specific implementation.
- This layout is itself provisional. Do not proliferate documents without a clear new scope and user direction.

**Status:** Comprehensive planning preserved; detailed user-led schema/column review and architectural approval remain pending.


## Required schema-column simplification review (2026-11-07)

The user rejected automatically adding `valid_from/to`, `valid_from_precision/to_precision`, `is_current` and other generic rigid columns everywhere. The [schema redesign README](schema-redesign/README.md) now defines a **mandatory per-table KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD review** across all original 18 domain designs; expansion briefs follow the same review discipline. It also evaluates selective `deleted_at` soft deletion for recoverable user-managed records, separately from real-world retirement, source evidence, corrections and privacy erasure. **No final per-table decisions or migrations are approved.** The older broad date-precision convention must be reconciled during a separately authorized code/docs migration, not modified silently now.

## Source redesign — deep research follow-up

The [source-redesign index](source-redesign/README.md) now links [prior art/build-versus-reuse](source-redesign/10-prior-art-and-build-vs-reuse.md), [tool integration contracts](source-redesign/11-tool-integration-and-contracts.md), [artifact storage/lineage](source-redesign/12-artifact-lifecycle-and-lineage.md), and [research experiments](source-redesign/13-benchmarks-and-research-questions.md). These are **planning only**, not approval of source/website consolidation, a pattern schema, new tables or deployed tools.


## 2026-11-07 design findings: semantic fields, freshness and activity-triggered research

The user directed **documentation of the two most recent architecture discussions without implementation**:

1. **Understandable column naming and data freshness:** [Schema-wide naming/freshness review](schema-redesign/README.md) now requires domain-specific column names (e.g. `joined_on`, `appointed_on`, `commenced_on` when they represent actual facts), justified instead of generic `valid_from/to`, and centralized, explainable per-table-default/field-group/relationship/record verification histories. [Reference](schema-redesign/mzizi-db/phase-01/reference.md) covers policy; [engine](schema-redesign/mzizi-operational-db/engine.md) records attempted versus successful verification; [source](schema-redesign/mzizi-db/phase-01/source.md) distinguishes changed downloads from verified facts.
2. **Schedules, real events and agent/admin triggers:** [Activity](schema-redesign/mzizi-db/phase-02/activity.md) and [reference](schema-redesign/mzizi-db/phase-01/reference.md) now plan jurisdiction/legal recurrence and reporting schedules, announcements, cancellations, verified occurrences and links to canonical election/census/parliamentary/budget records. [Independent pipeline design](guides/independent-data-pipelines.md) covers authorized official-site monitoring, a single engine scheduling boundary, targeted refresh, and admin-submitted event/recheck requests.

[Master register sections 27–28](guides/mzizi-data-schema-storage-and-pipelines-redesign.md) preserve the user's specific concerns, repository findings, recommendations, unresolved decisions and non-implementation status. No additional schema-review placeholder files were created; the existing 18 schema-review files remain available for the user's eventual one-by-one approval. The two cross-cutting improvement documents linked above record separate planning discussions. **No Taskcode tasks, migrations, schema edits or application code changes were authorized.**

## Person identity, participation and entity prominence

Two additional cross-cutting proposals record the recent design discussion. Both are planning-only and preserve the user's review/approval of schemas and implementation:

| Document | Purpose |
|---|---|
| [Person identity, media enrichment and community-assisted data refinement](guides/person-identity-media-and-community-refinement.md) | Mzizi Swipe, citizen and county-watcher feedback, verified official submissions, admin review, reversible identity resolution, CSS/HTML portrait discovery, existing filesystem/S3 storage and the legal gate for any facial biometrics |
| [Cross-domain entity prominence, ambiguity and research discoverability](guides/entity-prominence-and-discoverability.md) | Explainable 0–1 prominence for people, geographic units and institutions; reference-driven office categories; contextual ranking; separate ambiguity/evidence/source credibility; AI-assisted research prioritization |

The existing person model already uses filesystem attachments for portraits. These proposals do not approve a new participation, media, prominence or biometric schema. See also the [source-redesign index](source-redesign/README.md).

## 2026-11-08 — Root seed convention and folder/file-type design

The user now requires all manually or AI-prepared seed inputs, including auth baselines and site-structure YAML/JSON/CSV/code artifacts, under repository-root `seed/`. The authoritative convention and design proposal are in [seed/README.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md). Use global file types without jurisdiction linkage, jurisdiction-specific fixed folder CSVs, and system/jurisdiction pattern definitions producing concrete folders from actual resources. Shared pattern definitions belong in reference, execution in engine. Files link to concrete folder and physical type; exact versions retain their actual format. Global/system/jurisdiction files are separated locally, and manifests identify dependencies, keys, recognized loaders/targets, hashes and S3 destination for each adopted artifact. Generated/reproducible outputs may be ignored but require replay or fetch metadata.

Existing SeaweedFS configuration is fixed: bucket `mzizi`, region `us-east-1`, existing environment credentials, laptop endpoint `http://192.168.100.13:18333`, Docker endpoint `http://object-storage:8333` on `home-services`, public origin `https://res.alidantech.org/mzizi/`. Only `public/` allows anonymous reads; every other prefix is private. Do not provision storage, regenerate credentials, use per-object public ACLs or change infrastructure. Local logical folder paths need not mirror object keys. Seed CSV bytes normally go under `internal/seeds/` even when their rows define public folders.

This approves documentation and the directory convention; bulk legacy relocation, actual catalog content, production folder generation, runtime manifest support and S3 uploads remain future work. Existing objects require inspection; disposable `mzizi_new` does not imply disposable S3. No backward compatibility is needed for the approved database rewrite. Earlier per-service seed locations and preservation/compatibility statements are historical and are superseded for this rewrite by the newer user direction.

## 2026-11-11 — Task 03 connected foundation and latest delivery state

The user accepted the connected reference/geography/legal/domain direction and requested task-03 readiness. Read [the connected foundation](guides/connected-reference-geography-legal-foundation.md), then review the current Task record for ordered design deliverables and acceptance cases. Task 04 retains full downstream schema ownership.

Modern country identities organize governance, geography links territories/history/cross-border coverage, reference defines meanings, legal provisions support authority/rules, and typed domain FKs join actual entities. UI uses topic/capability contracts rather than arbitrary table traversal. Statistical meaning requires domain definitions and exact period/method/coverage/release context. The linked foundation records research, regional membership maps, historical uncertainty and methodology.

The latest remote filesystem task notes supersede the older upload/type/extraction proposals in this index: seven tables with `file_relations`, a paths view, no file-type/extension/object tables, and reported live publication/checks. Task 02 still has in-progress metadata; verify its actual outputs. Earlier blanket planning/no-task wording and publication-pending statements are historical, not a rollback of authorized completed work. No infrastructure or S3 changes are part of this preparation.


## 2026-11-11 — Expansion-document reading order

Start with [Advancement and System Expansion](guides/advancement-and-system-expansion.md) for the five exploration areas and broad architecture. Use the [master register](guides/mzizi-data-schema-storage-and-pipelines-redesign.md) for history and unresolved decisions. For foundation work, follow the [connected Reference–Geography–Legal foundation](guides/connected-reference-geography-legal-foundation.md) and its Task 03 specification. For domain details, consult the existing [schema redesign index](schema-redesign/README.md), which now assigns every schema to Operational, Phase 01 or deferred Phase 02. All new candidate tables and schemas remain hypothetical pending review.


## 2026-11-11 — Two database direction
Start with the [knowledge-platform document index](knowledge-platform/README.md) for the ordered current package and links to background architecture.


The user has directed a two-database target: Main stores accepted cross-domain knowledge, verified sources/evidence and published file metadata; Operations stores authentication, acquisition, pipelines/runs, staging, analytical work and operational audit. S3 stores file bytes. Python-native scraping/NLP vector indexes are disposable and rebuildable. Rust exclusively manages relational access; Dryv is the target contract authority. See [two database rules](knowledge-platform/two-database-rules.md), [Rust/Dryv management](knowledge-platform/rust-dryv-management.md), [capacity and storage](knowledge-platform/capacity-partitioning-storage.md), and the [schema approval catalogue](schema-redesign/README.md). Earlier four/five/eight/nine database layouts are superseded. The checkout has 24 migrations, 49 declared tables and 124 Dryv entities with material divergence. Candidate schema/table/column designs remain unapproved; user approval is required before implementation readiness. The older no-cross-schema-FK and TypeScript database-owner documents require later reconciliation. No existing database or S3 artifact may be removed by this planning direction.
## 2026-11-11 — Two-database package delivery status

The documentation package is ready for user review: 7 Operational schemas, 12 Phase 01 schemas and 14 deferred Phase 02 schemas, retaining 192 inherited detailed table proposals with column dictionaries, relationships, capacity envelopes, and explicit unapproved statuses. Review each schema and its tables in [the schema dashboard](schema-redesign/README.md). The 12 November schema assignments are agreed; detailed tables/columns and implementation remain unapproved.

Documentation checks passed: `task validate`, `bun run docs:validate`, and `git diff --check`. The current combined-work `bun run check` did not pass: the structure check flags `source/backend/engine/src/mzizi_engine/filesystem_api.py` at 526 lines; Python formatting/lint checks report unformatted files; Python DB tests fail with `DuplicateSchema: schema "auth" already exists`; one API end-to-end case expects a non-404 pipeline candidate route but receives 404 (843 API test files passed, 1 failed). Type checks passed (8/8), and Dryv contract/persistence checks passed (124 entity catalog, 11 same-name SQL matches). These implementation findings are recorded for the owners to address; this documentation review did not approve implementation readiness.

Implementation readiness remains blocked until the user explicitly reviews each retained schema, every table and column, each open current-field disposition, cross-schema relationships, capacity/partition choices and the data/file retention decisions. The prior project documentation and rules have not been reconciled with this package; specifically, current TypeScript database-owner and no-cross-schema-FK guidance conflicts with the proposed future Rust boundary and Main-local FKs. Reconcile those sources before implementation. Fresh Main/Operations generation and selective import require a separately approved cutover plan; preserve existing databases and S3 objects until then.

## Schema catalogue organization — 12 November 2026

The [catalogue](schema-redesign/README.md) now contains Operational, Phase 01 and Phase 02 folders. Every unassigned schema belongs in Phase 02, deferred and unapproved; relocation is not the start of planning. Official combines identity documents, Politics combines political/electoral documents, and Accountability includes Participation. All operational schemas, including Management, live in Operations. Reference is the only schema linking to Legal for domain legal relationships. Geography/geospatial queries are in the civic pilot. The earlier review order and broad expansion ambitions below/above do not activate deferred schema work.
