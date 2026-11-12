---
{id: TSK-744E1FD3DEFB,name: Reconcile Mzizi system expansion documentation,type: task,status: archived,priority: medium,created_at: 2026-11-11T11:23:13.756Z,updated_at: 2026-11-12T05:54:22.515Z,order: 7168,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-11T11:23:17.952Z},{from: in-progress,to: completed,at: 2026-11-11T11:31:42.862Z},{from: completed,to: in-progress,at: 2026-11-11T17:40:51.545Z},{from: in-progress,to: archived,at: 2026-11-12T05:54:22.515Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-744E1FD3DEFB/1794396197962-start,started_at: 2026-11-11T11:23:18.861Z,end_ref: refs/tracking/TSK-744E1FD3DEFB/1794396702864-end,ended_at: 2026-11-11T11:31:42.862Z,summary: {files: 35,insertions: 870,deletions: 13}},{base_ref: refs/tracking/TSK-744E1FD3DEFB/1794418851548-start,started_at: 2026-11-11T17:40:53.487Z,end_ref: refs/tracking/TSK-744E1FD3DEFB/1794462862518-end,ended_at: 2026-11-12T05:54:22.516Z,summary: {files: 100,insertions: 11442,deletions: 4179}}]}},archived_at: 2026-11-12T05:54:25.705Z}
---

---
{id: TSK-744E1FD3DEFB,name: Reconcile Mzizi system expansion documentation,type: task,status: in-progress,priority: medium,created_at: 2026-11-11T11:23:13.756Z,updated_at: 2026-11-11T17:40:51.545Z,order: 7168,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-11T11:23:17.952Z},{from: in-progress,to: completed,at: 2026-11-11T11:31:42.862Z},{from: completed,to: in-progress,at: 2026-11-11T17:40:51.545Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-744E1FD3DEFB/1794396197962-start,started_at: 2026-11-11T11:23:18.861Z,end_ref: refs/tracking/TSK-744E1FD3DEFB/1794396702864-end,ended_at: 2026-11-11T11:31:42.862Z,summary: {files: 35,insertions: 870,deletions: 13}},{base_ref: refs/tracking/TSK-744E1FD3DEFB/1794418851548-start,started_at: 2026-11-11T17:40:53.487Z}]}}}
---

---
{id: TSK-744E1FD3DEFB,name: Reconcile Mzizi system expansion documentation,type: task,status: in-progress,priority: medium,created_at: 2026-11-11T11:23:13.756Z,updated_at: 2026-11-11T17:40:51.545Z,order: 7168,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-11T11:23:17.952Z},{from: in-progress,to: completed,at: 2026-11-11T11:31:42.862Z},{from: completed,to: in-progress,at: 2026-11-11T17:40:51.545Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-744E1FD3DEFB/1794396197962-start,started_at: 2026-11-11T11:23:18.861Z,end_ref: refs/tracking/TSK-744E1FD3DEFB/1794396702864-end,ended_at: 2026-11-11T11:31:42.862Z,summary: {files: 35,insertions: 870,deletions: 13}},{base_ref: refs/tracking/TSK-744E1FD3DEFB/1794418851548-start,started_at: 2026-11-11T17:40:53.487Z}]}}}
---

# Reconcile and publish the Mzizi system expansion documentation

## Goal

Make the expanded Mzizi Africa vision understandable and consistent across the central proposal, improvement indexes, domain design documents and project architecture documentation. The result must distinguish active implementation, existing design proposals, user-confirmed decisions and new hypothetical ideas. It must help a future architect work through the expanded knowledge system without treating proposed domains or tables as approved SQL.

## Context

The user supplied a documentation-only handoff dated 11 November 2026. The working proposal already exists at `.docs/improvements/advancement-and-system-expansion.md`; it is untracked at task start and must be preserved and reconciled rather than discarded. The connected Reference–Geography–Legal foundation and Task 03 (`TSK-7E5E18758D9C`) remain controlling for that bounded work. Task 04 (`TSK-D6949284672E`) is broader downstream schema design and must not be silently completed or expanded into implementation. Work directly on `develop`; do not modify SQL, migrations, seeds, runtime contracts, applications, infrastructure, production data or `.github/**`. Use Task CLI, preserve existing user review notes, and run `task validate` after documentation changes.

## Acceptance checklist

- [x] Audit active schemas/contracts and relevant design documents; label existing implementation, prior proposals, confirmed decisions, hypothetical expansion and unresolved questions accurately.
- [x] Refine the central system-expansion proposal with candidate domains/tables, domain ownership, spatial and temporal semantics, acquisition/evidence lifecycle, query and UI/API capabilities, technical standards and open decisions.
- [x] Reconcile the improvements index, master redesign register, schema-redesign index and justified existing domain design files without erasing previous findings or conflating actual and proposed schema counts.
- [x] Update main project purpose, story, architecture, lifecycle, domains and migration documentation only where needed, retaining all unimplemented ideas as proposals.
- [x] Verify cross-domain ownership and FK logic for Geography/Civic, Environment/Statistical, Biology/Agriculture, Agriculture/Economy, Economy/Statistical, History/Activity, History/Geography, History/Heritage, and Person/Statistical.
- [x] Check Markdown frontmatter, relative links, index references, schema-count wording, proposal status and documentation-specific consistency; record remaining architectural questions.
- [x] Run `task validate`; report its result and confirm the work stayed documentation-only with no Task 03 acceptance status changes.

## Comments

### 2026-11-11T17:40:51.255Z · PETER IRUNGU

Follow-up work authorized by the user: produce the two-database review package, preserve this task history, validate the documentation, and keep implementation readiness blocked until individual schema approval.

### 2026-11-11T18:10:43.351Z · PETER IRUNGU

Delivery: the two-database package is ready for user review; implementation remains blocked pending approval of each retained schema/table/column and resolution of the documented conflicts. The catalogue has 35 schema review files and 192 proposed tables. `task validate`, `bun run docs:validate`, `git diff --check`, Dryv checks and all typechecks passed. The combined `bun run check` failed on structure/formatting, Python database tests encountering DuplicateSchema (`auth` already exists), and one API e2e route test returning 404; see `.docs/improvements/README.md`. User requested one commit/push containing this package and all other shared agent changes; no schema approval is implied.

## Two-database documentation follow-up — 11 November 2026

The user authorized implementation of the documentation plan only. Keep all design content under .docs/improvements; Task CLI records are the sole write exception. Preserve prior task acceptance and unrelated workspace edits. Main owns accepted domain records, sources, evidence and published file metadata; Operations owns auth, acquisition, execution, staging and analytical work. S3 holds bytes. Rust exclusively manages both relational databases through Dryv contracts; disposable Python-native scraping/NLP vector indexes are an explicit exception. No schema or table is approved by this documentation pass. All retained designs require individual user sign-off before implementation readiness. Plan fresh databases and selective verified imports without changing existing databases or objects.

## Follow-up acceptance

- [x] Refresh the current inventory and gap register and write the two-database rules, Rust/Dryv and capacity specifications.
- [x] Complete all 35 schema review files with table/column dictionaries, relationships, growth/storage decisions and unapproved review records.
- [x] Reconcile indexes, knowledge-platform documents, source/vector, pipeline, filesystem and connected-foundation planning without erasing history.
- [x] Validate links, frontmatter, ownership, column/FK targets, catalogue coverage and allowed file scope; run required repository checks and report baseline failures.
- [x] Record delivery and the blocked user-approval readiness gate without approving implementation.

## Schema catalogue reorganization — 12 November 2026

### Goal and context

Reorganize the existing 35 schema documents into Operational, Phase 01 and Phase 02 without changing executable contracts, SQL, seeds, applications or database data. The supplied handoff assigns seven operational schemas to a separate Operations database and twelve schemas to the civic accountability pilot, including geography and geospatial queries. Preserve useful proposals, inventories, human review notes and explanations; table and column approval remains separate from the agreed scope. Consolidate Person and Organization into Official, Political and Electoral into Politics, and Participation into Accountability while preserving distinct record types. Every remaining schema belongs in deferred, unapproved Phase 02 immediately; moving a document does not start its planning. Keep the branch on develop and leave GitHub workflows untouched.

### Reorganization acceptance

- [x] Inventory every original schema document and record its destination before removing superseded root files.
- [x] Preserve proposal tables and explanations, reconcile Phase 01 ownership and Reference-mediated legal relationships, and document Operations publication boundaries.
- [x] Create complete root and folder indexes, label all Phase 02 proposals deferred and unapproved, and update relative links and affected project guidance.
- [x] Verify content coverage, schema assignments, links and documentation-only scope; run bun run docs:validate and bun run check and record their actual results.

### Progress

The clean develop checkout contains 35 root schema documents. The mapped result will contain 33 schema documents: seven Operational, twelve Phase 01 and fourteen Phase 02. Consolidation changes the document count without discarding source proposals.
