---
id: DOC-SCHEMA-OPERATIONAL-20261112
name: Schema redesign operational index
type: documentation
extra: {status: scope_agreed, implementation: not_authorized}
---

# operational

System and workflow data live in a separate **Operations database**, outside the civic knowledge database (Main). The seven assignments below are agreed scope; their detailed tables, columns and contracts remain proposals.

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
