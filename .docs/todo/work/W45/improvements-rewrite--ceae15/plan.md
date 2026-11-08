---
{id: GRP-AF9EA7CEAE15,name: improvements-rewrite,type: documentation,extra: {created_at: 2026-11-08T06:46:16.748Z}}
---

# Ordered plan

Complete design review in this dependency order: 01 auth, 02 filesystem/S3, 03 reference/patterns/geography, 04 remaining domain schemas, 05 source/website, 06 independent pipelines. Maintain one detailed task per milestone and refine acceptance within that same record. Start with current repository evidence, identify primary-key and referential-integrity defects, then specify exact target tables and columns with examples and a migration mapping. User review of a design is separate from authorization to execute migrations.

Reference owns shared pattern definitions; engine owns execution, and domain schemas own generated records. Filesystem uses the existing S3 deployment and models logical folders without prematurely creating folder trees or seed taxonomies. Destination schemas must be settled before detailed source/pipeline architecture. Preserve provenance interfaces during early work. Risks include stale planning inventories, orphaned soft references, inconsistent temporal fields and consumer breakage. Address them through explicit current-to-target mapping and meaningful focused checks. Work only on develop, use Taskcode for task state, and leave application code, live data, infrastructure and GitHub automation untouched in this planning change.
