---
id: DOC-6E391A2B4C05
name: MZIZI improvements planning index
type: documentation
tags: [improvements, architecture, planning, index]
extra: {status: planning_only, task_creation: user_directed_only}
---

# MZIZI improvement planning — compact document index

**Planning and discussion only. Not approved for code changes, migrations, infrastructure work, or Taskcode task creation.**

The user explicitly requested **few, useful documents** rather than dozens of thin files. This is an organized reference library for a user-led schema redesign, data acquisition/generation improvements, a file manager backed by an **already deployed S3-compatible service**, and modular concurrent pipelines. The project will create Taskcode groups/tasks **one by one only when and how the user directs**, after discussing and approving design details. The user, not this document, determines implementation order.

## Read in this order

| Document | Role |
|---|---|
| [Master planning register](mzizi-data-schema-storage-and-pipelines-redesign.md) | Full record of all user concerns, 18 answers, 22 open decisions, recommendations, current 24-schema/141-table inventory and handoff constraints. **Do not discard this register.** |
| [Schema redesign folder](schema-redesign/README.md) | Audit method, scope, candidate regroupings, per-table/per-column decision template. **Future individual schema design files will be added only when the user chooses to review those schemas**, not in bulk. |
| [Data classification and pattern generation](data-categories-and-patterns.md) | Seeded/static, seeded/pattern, collected, derived; eligible table/class tags; pattern ownership, versions, corrections, sync, lineage and UI. |
| [File manager and external S3](file-management-and-s3.md) | Logical folders/tags, clear structure, hashes/dedup, source files/derivatives, URLs and integration with the user's existing service. |
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
