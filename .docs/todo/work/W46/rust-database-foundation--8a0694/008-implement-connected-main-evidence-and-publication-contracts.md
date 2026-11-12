---
{id: TSK-D47EF2FA7531,name: Implement connected Main evidence and publication contracts,type: task,status: in-progress,priority: medium,created_at: 2026-11-12T13:54:11.431Z,updated_at: 2026-11-12T13:54:14.665Z,order: 8192,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T13:54:14.665Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-D47EF2FA7531/1794491654668-start,started_at: 2026-11-12T13:54:15.470Z}]}}}
---

# Complete Main Source, Filesystem and Legal contracts with Operations integration

## Goal

Author a coherent contract graph for the Main `source`, `filesystem` and `legal` schemas, update `reference` only where necessary, and reconcile all seven approved Operational schemas with discovery through canonical publication. The result must preserve the distinction between accepted Main knowledge, operational work, and object bytes in SeaweedFS. Cross-database identifiers remain typed external references; no PostgreSQL FK may cross `mzizi` and `mzizi_operations`.

## Context

The user authorized contract design and implementation in the Main and Operational Database Contract Implementation Handoff dated 12 November 2026. It requires versioned Source manifests, stable source identities for websites and APIs, durable evidence and citations, immutable Filesystem versions and lineage, versioned Legal instruments/provisions, Reference-mediated Legal relationships, and an idempotent publication protocol. Existing Operational inventories and decisions remain authoritative. Genuine new tables or material departures need a rationale and documented disposition. Geography's accepted nine-table inventory and country model remain in force; do not introduce jurisdiction terminology, a duplicate country catalogue, generic `target_type`/`target_id` Legal pointers, hand-written SQL, migrations, deployments, data changes, S3 changes, seed imports, or generation activation. Inspect existing contracts and callers before changing them. Follow AGENTS.md, schema-authoring rules, and root Bun/Task commands.

## Acceptance checklist

- [ ] Audit current Main contracts, all seven Operational contracts, design documents, callers, app composition, persistence mapping and Dryv pack capabilities; record current state and gaps.
- [ ] Author Source identities, websites/APIs, documents/captures, evidence/citations, verifications/attributions, versioned manifests and durable publication receipts with typed same-database relations where supported.
- [ ] Author Filesystem folders, files, immutable versions, object metadata, access, unified tagging, file extensions and typed version lineage; document unsupported storage invariants.
- [ ] Author Legal instrument/provision identities, exact versions, amendments and typed Reference/Geography/Official/Filesystem relationships while preserving historical text and separate legal dates.
- [ ] Integrate the seven Operational contracts for acquisition, execution, staging evidence, review, idempotent publication, Auth external references, analytics lineage and operational audit; preserve the approved 45-table baseline unless a justified proposal is documented.
- [ ] Update Reference for required Source, Filesystem and Legal classifications and typed mediation; keep unapproved additions explicit and out of active composition where required.
- [ ] Document the complete same-database FK graph, cross-database external-reference contract, end-to-end data flow, supported and unsupported Dryv features, and unresolved decisions in owning schema docs, a decision record and a handoff.
- [ ] Run root Bun typechecks, formatting, contract audits/doctors/compiles, `task validate` and applicable relationship/capability checks; report unsupported or unavailable runtime scenarios accurately.
- [ ] Review the final diff and ensure no migration, database provisioning, deployment, seed import, S3 mutation, workflow change or generated artifact was performed.

## Related records

See the implementation handoffs in the user-provided attachments, `.docs/_plan/schema-redesign/README.md`, the Main Phase 01 Source/Filesystem/Legal/Reference documents, the seven Operational schema documents, `.docs/_plan/guides/connected-reference-geography-legal-foundation.md`, and the existing operational approval record. The current contracts in `dryv/contracts/schemas/` remain the source to reconcile rather than copying proposal tables blindly.
