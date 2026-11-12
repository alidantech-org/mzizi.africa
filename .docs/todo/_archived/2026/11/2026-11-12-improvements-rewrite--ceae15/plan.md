---
{id: GRP-AF9EA7CEAE15,name: improvements-rewrite,type: documentation,extra: {created_at: 2026-11-08T06:46:16.748Z}}
---

---
{id: GRP-AF9EA7CEAE15,name: improvements-rewrite,type: documentation,extra: {created_at: 2026-11-08T06:46:16.748Z}}
---

# Ordered plan

Complete design review in this dependency order: 01 auth, 02 filesystem/S3, 03 reference/patterns/geography, 04 remaining domain schemas, 05 source/website, 06 independent pipelines. Maintain one detailed task per milestone and refine acceptance within that same record. Start with current repository evidence, identify primary-key and referential-integrity defects, then specify exact target tables and columns with examples and a fresh initialization/disposition mapping for `mzizi_new`. User review of a design is separate from authorization to execute migrations.

Reference owns shared pattern definitions; engine owns execution, and domain schemas own generated records. Filesystem uses the existing S3 deployment and models logical folders without prematurely creating folder trees or seed taxonomies. Destination schemas must be settled before detailed source/pipeline architecture. Preserve provenance interfaces during early work. Risks include stale planning inventories, orphaned soft references, inconsistent temporal fields and consumer breakage. Address them through explicit current-to-target mapping and meaningful focused checks. Work only on develop, use Taskcode for task state, and leave application code, live data, infrastructure and GitHub automation untouched in this planning change.

## User-directed root seed convention

Use root seed/ for every curated/manual/AI-prepared system bootstrap input: global catalogs/auth baselines, jurisdiction-specific folders, system and reference-owned pattern bodies, site structures and seed source artifacts. Read seed/README.md for manifests, dependency/loader bindings, immutable registration in bucket mzizi and generated/local ignore policies. Treat old per-service fixture locations as adoption inventory, not new source-of-truth locations. No legacy compatibility, ID preservation or data migration is required for fresh mzizi_new construction. Actual existing S3 objects remain protected. This new direction supersedes earlier preservation wording; that earlier status is superseded by the seed relocation and task-02 final publication notes; verify current interfaces rather than repeating those operations. Tasks 02/03 finalize folder/type/pattern models before actual seed generation; task 06 designs shared execution after domain schemas.

## Task 03 preparation — 11 November 2026

The user accepted the connected reference/geography/legal/domain direction and requested documentation and local-agent readiness. Read [the foundation](../../../../../_plan/guides/connected-reference-geography-legal-foundation.md) and [Task 03 design record](./003-design-reference-owned-patterns-and-harden-geography.md). Task 03 specifies countries, schemes/values, parallel dated geography, minimal legal-basis interfaces, pattern/version/lineage and UI capability contracts. Task 04 completes legal/governance/electoral/political/statistical implementations and regional/history integration. No new task group is needed. Detailed physical design remains distinct from significant-change authorization.

Auth/filesystem implementation is recorded in their task notes; task 02 still has in-progress metadata despite final seven-table/file_relations and live-publication notes. Verify deliverables and report metadata discrepancies without inventing completion. Preserve existing S3 and scoped access. The code naming rule applies to identity, not geographic ancestry. Old jurisdiction/world, compatibility and single-tree proposals do not override the accepted foundation.
