---
{id: GOAL-GRP-AF9EA7CEAE15,name: improvements-rewrite goal,type: documentation,extra: {created_at: 2026-11-08T06:46:16.748Z,group: GRP-AF9EA7CEAE15}}
---

# improvements-rewrite

Create an understandable, strongly related and evidence-aware Mzizi data foundation through six ordered design milestones: auth; filesystem and existing S3; reference-owned patterns and geography; remaining domains; source custody and website design; independent pipelines. Every milestone must identify exact tables, columns, primary keys, foreign keys, constraints, indexes and lifecycle semantics, comparing the current contracts, migrations and runtime usage before proposing changes. The design must keep provenance and raw-evidence rules for the product, but existing records and identifiers are not preserved.

Success means the user can review concrete data models and application queries, understand how generated structure differs from observed facts, and authorize coordinated implementation with a clear current-to-target design map. Task creation was authorized on 8 November 2026. Later that day the user authorized a clean rewrite in `mzizi_new`; see the policy section below. Application deployment is still not implied. Existing improvement documents remain source references and historical decisions must be reconciled explicitly. Folder structure and file-type seeds are deferred to reference/pattern design and later engine use, including jurisdiction and geography grouping.

## Clean-rewrite policy (user instruction, 2026-11-08)

The earlier policy (preserve canonical identities, useful records, migration mapping, compatibility) is superseded for this group. The user approved building new schemas from scratch in a separate PostgreSQL database named `mzizi_new`. Its data and schemas are disposable and may be dropped and reseeded. Existing project data and schema designs are reference material only. There is no requirement for legacy ID preservation, data migration, dual writes, compatibility views or old API compatibility. Success now means a coherent, secure, documented schema built fresh in `mzizi_new` and verified by focused checks. Destructive operations target `mzizi_new` only. See `.docs/decisions/clean-rewrite-mzizi-new.md`.
