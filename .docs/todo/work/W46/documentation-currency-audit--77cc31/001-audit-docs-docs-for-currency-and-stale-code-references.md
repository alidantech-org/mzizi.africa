---
{id: TSK-EC5B013C1392,name: Audit .docs/docs for currency and stale code references,type: task,status: completed,priority: medium,created_at: 2026-11-12T06:00:33.053Z,updated_at: 2026-11-12T06:14:02.185Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T06:00:38.819Z},{from: in-progress,to: completed,at: 2026-11-12T06:13:43.719Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-EC5B013C1392/1794463238823-start,started_at: 2026-11-12T06:00:39.542Z,end_ref: refs/tracking/TSK-EC5B013C1392/1794464023722-end,ended_at: 2026-11-12T06:13:43.719Z,summary: {files: 139,insertions: 291,deletions: 3496}}]}}}
---

# Audit `.docs/docs` for current purpose and accuracy

## Goal

Create an evidence-based audit of the project documentation so the user can decide which files still explain the overall system and which specific documents have become stale, redundant or tied to missing code. The user especially wants review of references to website/site acquisition, Kenya-specific planning, seed locations, historical data-engine paths and other details that may no longer describe the active repository. The requested result is a file-by-file recommendation, not deletion in this pass.

## Context

The active repository uses reusable capabilities in `source/packages/`, the Python engine in `source/backend/engine/`, NestJS in `source/backend/api/`, schemas and SQL in `source/schema/`, prepared input in root `seed/`, and root Bun commands in `scripts/`. The inherited Python implementations are historical under `.docs/_archives/2026-11-08-rewrite-snapshot/` and must never be treated as active code. The user has explicitly asked to compare important overall-system documentation with stale documents, particularly documents pointing at missing code. The root `README.md`, `AGENTS.md`, active source READMEs, links and actual repository paths are the evidence sources. Keep the audit read-only except for this Task record; no documentation should be removed until the user reviews the audit.

## Acceptance checklist

- [x] Inventory every Markdown file in `.docs/docs/`, including audit reports, and identify its purpose and inbound references.
- [x] Check each concrete code/path claim against the active source tree and label references to archived or missing code accurately.
- [x] Identify outdated system claims, duplication, country/site/seed-specific guidance and which overall-system documents are still useful.
- [x] Recommend KEEP, REVISE, HISTORICAL, MERGE or REMOVE per file with brief evidence and dependencies.
- [x] Validate the audit record and deliver the file-by-file findings without deleting project documents.

## Comments

### 2026-11-12T06:01:20.502Z · PETER IRUNGU

Audit completed read-only on 12 November 2026. Inventory: 38 Markdown files under .docs/docs (including four audits). Compared explicit paths, active source tree, AGENTS.md, root README, source/package READMEs, dryv contracts and seed manifest. Key findings: the six AGENTS-mandated purpose/story/architecture/lifecycle/domain/migration files should remain but ARCHITECTURE, DATA_LIFECYCLE, DOMAINS and MIGRATION contain substantial superseded ownership/schema/runtime narrative; SYSTEM, GOALS, STORY remain core with small currency updates. Strong current task-oriented specs: FILESYSTEM_SCHEMA, development-setup, testing-guide, repository-map, geography-api-contract (mobile contract), and LEGALITY_SAFETY_AND_COMPLIANCE (policy baseline; separate legal review). Major stale/replace/archive candidates: DATA_ENGINE_STATUS_AND_GAPS, DATA_INTAKE_PLAN, EXECUTION_PLAN, implementation-roadmap, old DATABASE_DESIGN, FILESYSTEM_DESIGN, PEOPLE_DESIGN, WEBSITE_DESIGN, SITE_STRUCTURE_SPEC, old Kenya site/dossier docs, and all four audits as historically dated reference. Broken active-code references include archived  commands in DATA_INTAKE_PLAN; current source paths in ARCHITECTURE's file/data/intelligence/db engine ownership sections describe archives as target services; filesystem design says archived files service owns/writes current metadata; SourcING_DESIGN and related Dryv comments refer to top-level standalone files but their active counterparts now reside under ; several seed inventory paths are absent or likely relocated. Current AGENTS explicitly requires WHY, STORY, ARCHITECTURE, DATA_LIFECYCLE, DOMAINS, MIGRATION and README links WHY/GOALS/STORY/DOMAINS; preserve these entry points. No docs deleted or edited. Root-wide task validation currently has extensive broken links outside this audit's new Task record, so do not attribute its previous 166-link failure to this audit.

### 2026-11-12T06:13:43.371Z · PETER IRUNGU

User approved a documentation reorganization. Completed: `.docs/docs/` now contains exactly README.md, WHY.md, GOALS.md, STORY.md, SYSTEM.md, ARCHITECTURE.md, DOMAINS.md and ROADMAP.md. Detailed current guidance is grouped under `.docs/design/` in six indexed folders: architecture, data, geography, acquisition, operations and policy. Removed the stale audit directory, superseded planning/inventory documents and `.docs/guidance/`; useful Dryv and site-authoring guidance was rewritten and moved into design. Updated links in AGENTS, README, seed, source, Dryv and rules. Added a Bun structure test enforcing the exact core-doc set, at most seven design folders with an index in each, and valid local links under the docs/design trees. `bun test scripts/mz.test.ts` passes all 17 tests; `git diff --check` passes; a direct tree assertion passes. `bun run structure` still fails on the pre-existing 526-line source/backend/engine/src/mzizi_engine/filesystem_api.py. `bun run format:check` reports pre-existing Python formatting issues. `task validate` reports 172 workspace-wide broken links, largely pre-existing improvement/archive references outside docs/design. The new documentation subtree link check passes.
