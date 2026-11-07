---
id: DOC-9A8E56DB1C01
name: Source redesign and adaptive website intelligence review index
type: documentation
tags: [improvements, source-redesign, index, website, architecture]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# Source redesign and adaptive website intelligence — review index

**PLANNING ONLY.** This folder records the user's evolving requirements and assistant design options. Its creation authorizes **documentation only**: no database merge, migration, table creation, new deployed service, crawler launch, ML training, Taskcode task/group, schema-contract changes or workflow modifications. The user will evaluate existing tables and columns and decide later how implementation tasks are created and ordered.

## Intent and boundaries

Mzizi should discover, understand, monitor, map and preserve public information from African institutional websites without requiring a known per-site YAML structure. Structure definitions remain useful for explicit, repeatable, high-value collection, but they are **not a prerequisite** for intelligent discovery. Site families, fuzzy structures, semantic memory, learned models, agent tooling, incremental content processing and independent pipelines should cooperate. The canonical database remains evidence-first; ML and LLM outputs are proposals unless validated under an approved promotion policy.

The user also wants to **re-evaluate**, not automatically merge, the current `website` and `source` schemas. A simpler `source` domain with websites, domains, TLD/zone data, pages, paths, links and visits is an **option**, not an approved outcome. Avoid premature normalization: each existing or proposed table must be understandable to the human reviewer, demonstrate real usage, maintain enforceable relationships, and justify why its lifecycle cannot sensibly live in a parent record, JSON metadata or an existing file reference.

A third cross-cutting idea is a dedicated **`pattern` schema** for managing reusable rules across domains; this is a candidate to compare against `engine`-owned patterns and narrowly domain-owned semantics. No pattern schema, table count or location has been approved.

## Read the documents

| Document | Questions addressed |
|---|---|
| [01 — Existing inventory and boundaries](01-current-inventory-and-boundaries.md) | What exactly exists in repository contracts/migrations, and what do we already reuse? |
| [02 — Source schema and human review](02-source-schema-and-human-review.md) | How to simplify without data loss, and how should every table and column be approved? |
| [03 — Root discovery, URLs, links and site memory](03-discovery-links-and-site-memory.md) | How do unknown websites yield an observable page/link inventory without endless crawling? |
| [04 — Site templates, optional YAML and extraction](04-structures-templates-and-extraction.md) | How do header/main/footer learning, family expectations and Markdown extraction cooperate? |
| [05 — Semantic retrieval, ranking, ML and agents](05-semantics-ranking-ml-and-agents.md) | How can cheap retrieval narrow LLM context and models learn from county websites? |
| [06 — Change detection and deduplication](06-incremental-change-dedup.md) | What can be reused, what must be refreshed and when do downstream results go stale? |
| [07 — Storage and vector-service alternatives](07-storage-and-vector-options.md) | Which data belongs in PostgreSQL, S3 and a possible dedicated vector database? |
| [08 — Shared pattern-management alternative](08-pattern-management-cross-domain.md) | How do versioned patterns generate ordinary records without per-schema duplication? |
| [09 — Autonomous pipelines and decision register](09-pipelines-autonomy-and-decisions.md) | What executes independently, what remains gated, how will we measure success, what is open? |

## User directions that must survive every later redesign

1. **No assumed source/website collapse.** Consider `source.*` website/domain/page/path/visit naming, but do not mark physical relocation approved. Compare keep/separate/consolidate alternatives against real columns and queries.
2. **Human-understandable table review.** No premature normalization, no predetermined schema count, no invented table list accepted by default. Show each current table, columns, keys, users, purpose, candidate options, migration consequences and decision status.
3. **Shared pattern management is to be evaluated.** Prefer not to give every eligible domain its own redundant pattern manager; investigate a dedicated `pattern` schema vs a common engine registry, retaining domain-specific semantics.
4. **Four acquisition classes** remain distinguishable: 1A static curated seed; 1B rule/pattern generated expectation; 2A externally collected evidence; 2B internally derived values. Expected offices/domains are not verified actual occupants/sites.
5. **Geography and history are real.** Kenya-wide scope links to Kenya's root geo unit when applicable; legal/institutional scope differs from physical address. Preserve historical validity, evidence, consent and uncertainty.
6. **Unknown sites are first-class.** Root probing and redirect histories; link extraction; external/internal classification; URL identity and dedup; page inventory, page availability, likely content, template learning and coverage.
7. **AI should be selective.** Exact/fuzzy rules, lexical/semantic retrieval, graph and ML ranking narrow what is sent to LLMs; verified examples feed specialist models. Do not ship whole DOMs or site registries unnecessarily.
8. **Changes should lead to adaptation.** Recheck URLs when due; compare bytes, normalized content, DOM subtrees, templates and output dependencies; preserve original snapshots and avoid unnecessary re-fetching/reprocessing without hiding real updates.
9. **Storage ownership stays clear.** Relational identities and history in PostgreSQL; original and Markdown artifacts in the existing S3-backed file system; vector index possibly in a separate replaceable service, selected only after evaluation.
10. **Legal collection control is independent.** Technical capacity to discover a URL never implies authority to fetch or publish it. Preserve source assessments, collection gate and review.
11. **No automatic Taskcode work.** The user directs task creation one by one after documentation and schema review. Work directly on `develop` only when authorized; no `.github/**` modifications.

## Decision terminology

- **USER CONFIRMED:** User expressly established a requirement (not a blanket permission to implement).
- **USER DIRECTION / LEAN:** Desired avenue to evaluate; implementation detail remains open.
- **ASSISTANT PROPOSAL:** Recommended architecture, not accepted by the user.
- **OPEN:** Needs evidence, alternatives or human table-level decision.
- **REJECTED / NOT APPROVED:** Must not be treated as an implementation choice.
- **APPROVED FOR IMPLEMENTATION:** Separate, explicit authorization, not present here.

## Review and evidence protocol

For any proposed table, show the **current** Dryv contract + migration + runtime usage, then the **candidate** design. Do not claim a live table contains rows from code or fixture evidence alone. A future read-only live DB audit should enumerate row counts, actual constraints, duplicate/orphan hazards and code paths if access is approved. Evaluate concrete queries and retention costs before splitting a table.

A prospective review record should contain current purpose; all columns and constraints; candidate keep/rename/merge/split/remove/add decisions; entity lifecycle; acquisition classes; evidence; geo/legal/temporal scope; FK design; alternatives; migration impact; human rationale and approval status. No decision is inferred from silence.

## Related existing plans and repository evidence

- [Schema redesign/source](../schema-redesign/source.md) — current `source` + `website` audit baseline.
- [Schema redesign guide](../schema-redesign/README.md) — mandatory human review method.
- [Master planning register](../mzizi-data-schema-storage-and-pipelines-redesign.md) — broader all-domain context.
- [Data categories and patterns](../data-categories-and-patterns.md) — four classes and shared pattern lifecycle.
- [Website Markdown extraction](../site-structure-and-markdown-extraction.md) — current site-structure and semantic hashing proposal.
- [Independent pipelines](../independent-data-pipelines.md) — shared workers and concurrency.
- [File manager / S3](../file-management-and-s3.md) — artifact ownership and reuse.
- [Existing website contracts](../../../dryv/contracts/domains/website/index.ts), [site structure specification](../../docs/SITE_STRUCTURE_SPEC.md), [website design](../../docs/WEBSITE_DESIGN.md).

**Scope:** architectural analysis and documentation only; no migration design is final.

## Research integration (2026-11-07)

Research findings **do not** approve the source/website merge, any new SQL tables, a vector service, ML training, crawler replacement or automatic task creation. The newer pattern option **reference-owned definitions + engine execution** remains a candidate for human review.

| New focused document | Purpose |
|---|---|
| [10 — Prior art and build vs reuse](10-prior-art-and-build-vs-reuse.md) | Literature, production precedents, tool candidates, avoidable duplication |
| [11 — Tool integration and contracts](11-tool-integration-and-contracts.md) | How fetch, link discovery, parsers, S3, retrieval, ML and review connect |
| [12 — Artifacts and lineage](12-artifact-lifecycle-and-lineage.md) | Capture/observation/file/derivative identities, storage, versioning and replay |
| [13 — Research and benchmarks](13-benchmarks-and-research-questions.md) | Held-out Kenyan/African sites, baseline comparisons, stop/go criteria |


## New cross-workstream trigger and freshness requirements (2026-11-07)

Source/site discovery and readable Markdown extraction should serve the **same shared event-driven freshness pipeline**, not invent an independent news-watcher scheduler. Approved site-specific source manifests can select which official pages/sections to monitor for elections, census releases, parliamentary schedules, budgets and appointments. Meaningful changed DOM/Markdown sections create sourced **activity candidates and targeted re-verification triggers**; downloading a page or seeing a new source hash is not proof that the real-world event occurred or a canonical fact changed. Admin-initiated research uses the same bounded engine queue and source permissions.

**Further planning:** [activity](../schema-redesign/activity.md), [reference schedules](../schema-redesign/reference.md), [engine verification](../schema-redesign/engine.md), and [single orchestration boundary](11-tool-integration-and-contracts.md). No change to site collection permission, schema, scheduled workers or tools is authorized.
