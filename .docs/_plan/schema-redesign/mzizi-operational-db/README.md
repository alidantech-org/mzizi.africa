---
id: DOC-SCHEMA-OPERATIONAL-20261112
name: Schema redesign operational index
type: documentation
extra: {status: accepted, approval: approved, implementation: dryv_contracts_authorized, database: mzizi_operations, approved_on: 2026-11-12, tables: 45, migrations: not_authorized, deployment: not_authorized}
---

# operational

System and workflow data live in a separate **Operations database**, outside the civic knowledge database (Main). The seven Operational schemas and their 45-table/column inventory were explicitly accepted and approved on 12 November 2026. Dryv contract authoring is authorized; migrations and deployment are not.

[Full catalogue and relocation inventory](../README.md)

## Schema documents

| Schema | Scope |
|---|---|
| [auth](auth.md) | Accounts, authentication, roles, permissions and service identities. |
| [acquisition](acquisition.md) | Source discovery, crawl state, observed links and access attempts. |
| [engine](engine.md) | Pipeline definitions/releases, jobs, runs, attempts, checkpoints and delivery coordination. |
| [staging](staging.md) | Candidate revisions, mappings, validation findings and review workflows. |
| [analytics](analytics.md) | Analytical requests, working projections, experiments and unpublished outputs. |
| [audit](audit.md) | Operational and security events only; never official civic data or public accountability findings. |
| [management](management.md) | Migration, contract and publication bookkeeping scoped to Operations. |

## Candidate to accepted record

A Staging candidate is an immutable proposed revision with inputs, mappings, validation findings and review state. It may be incomplete, contradicted or rejected; neither a successful Engine job nor an Audit event makes it accepted knowledge. An accepted Phase 01 record has passed the declared admission gate and is published as a versioned domain record with durable Source provenance and exact Filesystem artifacts. Keep raw evidence, historical validity, retrieval time, uncertainty, disagreement and model/tool attribution where applicable.

## Publication coordination

Engine coordinates retryable work; Staging pins the reviewed revision, contract, evidence and expected target version; Management records requests and reconciliation. The database publication boundary verifies authorization, inputs, artifacts and hashes, then atomically writes accepted civic versions and evidence within Main. Operations receives or recovers the acknowledgement using an idempotency key and payload hash. A conflicting retry must not silently overwrite accepted data.

There is no cross-database foreign key or distributed transaction spanning Operations, Main and object storage. The exact civic-side durable idempotency representation remains under contract review; placing Management here does not authorize a Main Management schema. Operations logs can diagnose a failed delivery but cannot prove a historical claim or public accountability finding. Durable acceptance/provenance survives operational log retention. Accepted public findings, complaints and responses belong in Accountability, supported by Source evidence.


## Integration implementation status — 12 November 2026

The seven approved contracts remain in place. Integration additions authored under the Main/Operations handoff are `engine.pipeline_releases.manifest_release_ref_id` (opaque Main reference with pinned hash/schema/capability versions) and `staging.revision_sources` (normalized multiple Main evidence/citation/file/manifest references). These are authored contract changes; app validation is required for external IDs, and no cross-database FK is declared. The 45-table approved inventory is preserved; the staging association is a proposed addition requiring inventory approval before migration.

## Approved inventory — 12 November 2026

The user approved the complete 45-table Operational design. The owning documents below contain the accepted table and column inventories and their implementation boundaries. See [DEC-OPERATIONAL-DATABASE-20261112](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/decisions/DEC-OPERATIONAL-DATABASE-20261112.md) for the formal decision.

| Schema | Tables | Approved responsibility |
|---|---:|---|
| [auth](auth.md) | 11 | Accounts, login identities and scoped authorization |
| [acquisition](acquisition.md) | 7 | Source discovery, collection policies and retrieval observations |
| [engine](engine.md) | 10 | Pipelines, runs, jobs, retries, checkpoints and delivery |
| [staging](staging.md) | 6 | Candidates, revisions, mappings, validation and review |
| [analytics](analytics.md) | 5 | Experiments, analytical requests, projections and results |
| [audit](audit.md) | 2 | Operational/security events and formal decisions |
| [management](management.md) | 4 | Schema release history and publication reconciliation |
| **Total** | **45** | **One Operations database: `mzizi_operations`** |

The earlier proposal inventories and pending-approval wording are superseded by this approval. Main Phase 01 schemas remain unapproved and will be reviewed individually later; Phase 02 remains deferred. No migrations or deployment are authorized.
