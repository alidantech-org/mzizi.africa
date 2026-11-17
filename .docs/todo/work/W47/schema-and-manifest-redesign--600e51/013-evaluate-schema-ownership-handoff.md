---
{id: TSK-2DC2EDF32543,name: Evaluate schema ownership handoff,type: task,status: archived,priority: medium,created_at: 2026-11-17T11:59:08.288Z,updated_at: 2026-11-17T18:42:06.511Z,order: 13312,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T11:59:14.747Z},{from: in-progress,to: completed,at: 2026-11-17T11:59:40.166Z},{from: completed,to: archived,at: 2026-11-17T11:59:45.848Z},{from: archived,to: completed,at: 2026-11-17T14:54:31.357Z},{from: completed,to: in-progress,at: 2026-11-17T14:54:31.563Z},{from: in-progress,to: completed,at: 2026-11-17T14:54:41.822Z},{from: completed,to: archived,at: 2026-11-17T14:54:42.014Z},{from: archived,to: completed,at: 2026-11-17T15:29:29.281Z},{from: completed,to: in-progress,at: 2026-11-17T15:29:29.484Z},{from: in-progress,to: completed,at: 2026-11-17T15:31:29.446Z},{from: completed,to: archived,at: 2026-11-17T15:31:30.297Z},{from: archived,to: completed,at: 2026-11-17T15:33:50.914Z},{from: completed,to: in-progress,at: 2026-11-17T15:33:51.126Z},{from: in-progress,to: completed,at: 2026-11-17T15:35:17.908Z},{from: completed,to: archived,at: 2026-11-17T15:35:18.442Z},{from: archived,to: completed,at: 2026-11-17T18:00:22.587Z},{from: completed,to: in-progress,at: 2026-11-17T18:00:22.803Z},{from: in-progress,to: completed,at: 2026-11-17T18:00:35.081Z},{from: completed,to: archived,at: 2026-11-17T18:00:35.666Z},{from: archived,to: completed,at: 2026-11-17T18:19:34.193Z},{from: completed,to: in-progress,at: 2026-11-17T18:19:34.398Z},{from: in-progress,to: completed,at: 2026-11-17T18:20:01.975Z},{from: completed,to: archived,at: 2026-11-17T18:20:03.225Z},{from: archived,to: completed,at: 2026-11-17T18:30:11.570Z},{from: completed,to: in-progress,at: 2026-11-17T18:30:11.772Z},{from: in-progress,to: completed,at: 2026-11-17T18:30:13.780Z},{from: completed,to: archived,at: 2026-11-17T18:30:14.344Z},{from: archived,to: completed,at: 2026-11-17T18:42:03.176Z},{from: completed,to: in-progress,at: 2026-11-17T18:42:03.401Z},{from: in-progress,to: completed,at: 2026-11-17T18:42:05.830Z},{from: completed,to: archived,at: 2026-11-17T18:42:06.511Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-2DC2EDF32543/1794929369495-start,started_at: 2026-11-17T15:29:30.197Z,end_ref: refs/tracking/TSK-2DC2EDF32543/1794929489449-end,ended_at: 2026-11-17T15:31:29.447Z,summary: {files: 5,insertions: 207,deletions: 11}},{base_ref: refs/tracking/TSK-2DC2EDF32543/1794929631135-start,started_at: 2026-11-17T15:33:51.511Z,end_ref: refs/tracking/TSK-2DC2EDF32543/1794929717910-end,ended_at: 2026-11-17T15:35:17.908Z,summary: {files: 1,insertions: 116,deletions: 0}},{base_ref: refs/tracking/TSK-2DC2EDF32543/1794938422807-start,started_at: 2026-11-17T18:00:23.489Z,end_ref: refs/tracking/TSK-2DC2EDF32543/1794938435082-end,ended_at: 2026-11-17T18:00:35.081Z,summary: {files: 1,insertions: 37,deletions: 97}},{base_ref: refs/tracking/TSK-2DC2EDF32543/1794939574408-start,started_at: 2026-11-17T18:19:34.987Z,end_ref: refs/tracking/TSK-2DC2EDF32543/1794939601977-end,ended_at: 2026-11-17T18:20:01.975Z,summary: {files: 1,insertions: 16,deletions: 1}},{base_ref: refs/tracking/TSK-2DC2EDF32543/1794940211782-start,started_at: 2026-11-17T18:30:12.393Z,end_ref: refs/tracking/TSK-2DC2EDF32543/1794940213784-end,ended_at: 2026-11-17T18:30:13.781Z,summary: {files: 1,insertions: 13,deletions: 1}},{base_ref: refs/tracking/TSK-2DC2EDF32543/1794940923412-start,started_at: 2026-11-17T18:42:04.122Z,end_ref: refs/tracking/TSK-2DC2EDF32543/1794940925833-end,ended_at: 2026-11-17T18:42:05.830Z,summary: {files: 1,insertions: 10,deletions: 2}}]}}}
---

# Evaluate the schema ownership handoff

## Goal

Evaluate the supplied schema ownership handoff as an investigation brief, checking whether it accurately describes current contracts and sets useful boundaries for subsequent architecture work. The outcome is a review in chat with concrete corrections and evidence, rather than execution of the handoff's full proposed investigation or implementation plan.

## Context

The owner requested evaluation of an attached handoff covering Filesystem, Source, Legal, Geography, Reference and Official. Its proposals are explicitly unapproved. This review preserves that distinction and makes no changes to schema contracts, generated files, runtime code, seed inputs or architectural documentation. Current repository evidence is necessary because the handoff contains assertions about dataset identity, content documents, language tags and crawler links. The existing worktree has an unrelated task modification which must be preserved. Task tracking is maintained separately from the proposed architecture changes under the repository's mandatory tracking rules.

## Acceptance checklist

- [x] Read the supplied handoff and distinguish the requested evaluation from executing its deliverables.
- [x] Check material assertions against current contracts, seed examples and relevant runtime ownership.
- [x] Present a prioritised evaluation with concrete amendments and identify verification limits.

## Notes

No architecture proposal is approved by this review. Findings will be recorded here after inspection and reported with source references in chat.

## Comments

### 2026-11-17T11:59:39.547Z · PETER IRUNGU

Evaluation: useful investigation brief with explicit approval boundaries, but needs amendments before execution. Current Source documents are unique by sha256, not publication identities. Dataset records currently identify individual seed CSVs; provenance ties records to dataset and CSV line, so a logical-dataset/artifact proposal must retain exact-input traceability. Crawler already exports LinkRecord and links.csv and persists site_links through its activity port. Legal already has Source document, evidence and citation relationships. Direct Filesystem references do not imply duplicate storage ownership. Geography name language is already nullable; Kenya short name is explicitly seeded en. Require separate evaluation of language identity, tag identity, canonical name selection and null uniqueness. The proposed one-to-one geographic profile needs testing against representations with different CRS or resolution. Reviewed source and seed examples only; no live database, generated-output parity or full root suite verification. No implementation or seed changes made. Task start succeeded but automatic change tracking was unavailable because its external lock path is read-only.

### 2026-11-17T14:54:41.452Z · PETER IRUNGU

Follow-up inspection supersedes the earlier language findings: Reference now declares Language and LanguageName; Geography, Official, Reference labels and Legal wording use required languageId relationships. Generated SQL includes language foreign keys and the Geography default-name partial unique index. Seed inputs use language_code; no language_tag occurrence was found in seed/data, generated database schemas or authored PostgreSQL contracts. Kenya remains explicitly en in names.csv, and its short name is not the default; the original default-name requirement still needs verification. Registry special records und/mul/zxx exist; no per-name locale field was found in the inspected contracts. Source and Geography still declare separate datasets and Geography still has plain fileVersionRefId fields. These are file-based findings, not proof of a live migration or executed runtime checks. No contracts or seed inputs were changed.

### 2026-11-17T15:29:30.424Z · PETER IRUNGU

Owner follow-up authorizes amending the handoff and explaining central ownership: Filesystem for files; Source for sourcing, URLs, captures and source officialness; Reference for schemes and languages; Legal for legal effects on other records. Documentation only. Consolidate the supplied attachment into a repository handoff, incorporate current language implementation and multi-source contributions, and preserve implementation restrictions.

### 2026-11-17T15:31:28.818Z · PETER IRUNGU

Amended handoff saved at .docs/handoffs/HANDOFF-SCHEMA-OWNERSHIP.md. It supersedes the attachment for continued investigation, records owner-directed central ownership, scopes officialness to Source, preserves many-source contributions, updates language current-state findings and keeps all implementation restricted. task validate passed. Only the handoff and this tracking task were edited for this follow-up; unrelated worktree changes preserved.

### 2026-11-17T15:33:51.714Z · PETER IRUNGU

Follow-up: inspect all six current schema inventories and append a table-by-table proposed disposition with explicit field moves, multi-source provenance and Source authority ownership. Proposed design only; no contract, seed or runtime edits.

### 2026-11-17T15:35:17.588Z · PETER IRUNGU

Appended concrete table disposition proposal covering every current table in Filesystem, Source, Reference, Legal, Geography and Official. Includes proposed authority assessments, dataset artifacts, optional discoveries, extended provenance, Legal locator migration and dataset/profile migration. All exact field structures remain proposals. task validate passed; no implementation changes made.

### 2026-11-17T18:00:23.752Z · PETER IRUNGU

Documented owner feedback as revised goal in HANDOFF-SCHEMA-OWNERSHIP.md. Removed superseded conservative table disposition and rejected Geography dataset profiles; replaced with Source concept redesign, full Legal responsibility review and purpose-bearing feature/geometry links to central products/artifacts/files. Detailed table structures remain open, no implementation authorized. Owner requested committing all edits from this chat; scope is this handoff and this task record only.

### 2026-11-17T18:20:00.730Z · PETER IRUNGU

Recorded owner direction to remove filesystem.file_relations and centralize exact artifact derivation in Source. Confirmed current Source tables do not yet replace arbitrary file-to-file lineage and current package/engine callers depend on the relation table. Fresh contract inventory includes filesystem.media with source_url, another address ownership leak to resolve. Documentation only; task validate run.

### 2026-11-17T18:30:12.627Z · PETER IRUNGU

Recorded answers to design questions 1–3: phase scoped to Source/Filesystem; logical product, edition/release and exact representation distinguished; Source uses classified I/O relationships, not mandatory engine events. Optional external loose execution IDs only. Multiple contributing inputs supported. Scheme values vs enums remains a detailed choice. Other questions not answered by this reply remain open. Corrected prior handoff wording requiring execution actor/time/parameters.

### 2026-11-17T18:42:04.395Z · PETER IRUNGU

Recorded owner approval of all remaining recommendations: contextual source authority, discovery separate from captures, media descriptions moved into Source product model, dataset product separate from acquisition channel, and separate ownership review for configuration/publication records. All eight design decisions now answered. Exact schema proposal and migration remain unapproved; no implementation changes.
