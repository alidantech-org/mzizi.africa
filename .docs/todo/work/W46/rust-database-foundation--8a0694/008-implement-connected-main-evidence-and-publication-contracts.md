---
{id: TSK-D47EF2FA7531,name: Implement connected Main evidence and publication contracts,type: task,status: completed,priority: medium,created_at: 2026-11-12T13:54:11.431Z,updated_at: 2026-11-12T14:43:16.467Z,order: 8192,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T13:54:14.665Z},{from: in-progress,to: blocked,at: 2026-11-12T14:29:58.124Z},{from: blocked,to: in-progress,at: 2026-11-12T14:31:50.721Z},{from: in-progress,to: completed,at: 2026-11-12T14:36:05.091Z},{from: completed,to: in-progress,at: 2026-11-12T14:40:53.498Z},{from: in-progress,to: completed,at: 2026-11-12T14:43:16.467Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-D47EF2FA7531/1794491654668-start,started_at: 2026-11-12T13:54:15.470Z,end_ref: refs/tracking/TSK-D47EF2FA7531/1794493798128-end,ended_at: 2026-11-12T14:29:58.125Z,summary: {files: 21,insertions: 1511,deletions: 154}},{base_ref: refs/tracking/TSK-D47EF2FA7531/1794493910724-start,started_at: 2026-11-12T14:31:51.269Z,end_ref: refs/tracking/TSK-D47EF2FA7531/1794494165096-end,ended_at: 2026-11-12T14:36:05.091Z,summary: {files: 11,insertions: 136,deletions: 26}},{base_ref: refs/tracking/TSK-D47EF2FA7531/1794494453506-start,started_at: 2026-11-12T14:41:02.362Z,end_ref: refs/tracking/TSK-D47EF2FA7531/1794494596470-end,ended_at: 2026-11-12T14:43:16.467Z,summary: {files: 66,insertions: 1973,deletions: 149}}]}}}
---

# Complete Main Source, Filesystem and Legal contracts with Operations integration

## Goal

Author a coherent contract graph for the Main `source`, `filesystem` and `legal` schemas, update `reference` only where necessary, and reconcile all seven approved Operational schemas with discovery through canonical publication. The result must preserve the distinction between accepted Main knowledge, operational work, and object bytes in SeaweedFS. Cross-database identifiers remain typed external references; no PostgreSQL FK may cross `mzizi` and `mzizi_operations`.

## Context

The user authorized contract design and implementation in the Main and Operational Database Contract Implementation Handoff dated 12 November 2026. It requires versioned Source manifests, stable source identities for websites and APIs, durable evidence and citations, immutable Filesystem versions and lineage, versioned Legal instruments/provisions, Reference-mediated Legal relationships, and an idempotent publication protocol. Existing Operational inventories and decisions remain authoritative. Genuine new tables or material departures need a rationale and documented disposition. Geography's accepted nine-table inventory and country model remain in force; do not introduce jurisdiction terminology, a duplicate country catalogue, generic `target_type`/`target_id` Legal pointers, hand-written SQL, migrations, deployments, data changes, S3 changes, seed imports, or generation activation. Inspect existing contracts and callers before changing them. Follow AGENTS.md, schema-authoring rules, and root Bun/Task commands.

## Acceptance checklist

- [x] Audit current Main contracts, all seven Operational contracts, design documents, callers, app composition, persistence mapping and Dryv pack capabilities; record current state and gaps.
- [x] Author Source identities, websites/APIs, documents/captures, evidence/citations, verifications/attributions, versioned manifests and durable publication receipts with typed same-database relations where supported.
- [x] Author Filesystem folders, files, immutable versions, object metadata, access, unified tagging, file extensions and typed version lineage; document unsupported storage invariants.
- [x] Author Legal instrument/provision identities, exact versions, amendments and typed Reference/Geography/Official/Filesystem relationships while preserving historical text and separate legal dates.
- [x] Integrate the seven Operational contracts for acquisition, execution, staging evidence, review, idempotent publication, Auth external references, analytics lineage and operational audit; preserve the approved 45-table baseline unless a justified proposal is documented.
- [x] Update Reference for required Source, Filesystem and Legal classifications and typed mediation; keep unapproved additions explicit and out of active composition where required.
- [x] Document the complete same-database FK graph, cross-database external-reference contract, end-to-end data flow, supported and unsupported Dryv features, and unresolved decisions in owning schema docs, a decision record and a handoff.
- [x] Run root Bun typechecks, formatting, contract audits/doctors/compiles, `task validate` and applicable relationship/capability checks; report unsupported or unavailable runtime scenarios accurately.
- [x] Review the final diff and ensure no migration, database provisioning, deployment, seed import, S3 mutation, workflow change or generated artifact was performed.

## Related records

See the implementation handoffs in the user-provided attachments, `.docs/_plan/schema-redesign/README.md`, the Main Phase 01 Source/Filesystem/Legal/Reference documents, the seven Operational schema documents, `.docs/_plan/guides/connected-reference-geography-legal-foundation.md`, and the existing operational approval record. The current contracts in `dryv/contracts/schemas/` remain the source to reconcile rather than copying proposal tables blindly.

## Comments

### 2026-11-12T14:22:54.190Z · PETER IRUNGU

Continuation progress: linked acquisition.access_attempts.artifact_id and acquisition.observations.artifact_id to engine.artifacts with restrictive same-Operations relations. This closes a concrete gap between retrieval observations and retained temporary artifacts. Dryv typecheck, active database doctor and compile pass after this edit. Docs updated in operational/acquisition.md and the handoff. Cross-database Main refs remain typed IDs; active Main group composition and pack enforcement remain unresolved.

### 2026-11-12T14:23:17.386Z · PETER IRUNGU

Continuation progress: staging.revisions.artifact_id now has a restrictive same-Operations FK to engine.artifacts.id. Updated the Staging design and handoff. Verified Dryv typecheck, database doctor/compile, task validation and diff whitespace check. Cross-database evidence links in revision_sources remain external references, as required.

### 2026-11-12T14:28:52.787Z · PETER IRUNGU

Continuation validation: the separate Main review entrypoint with Reference, Geography, Filesystem, Source, Legal and Reference-Legal passes TypeScript, Dryv doctor and compile (94 typed relation fields). The active Operations database application still passes database:check. Contract audit passes (588 schemas, 230 operations); task validate and git diff --check pass. Root format:check reports only Ruff blocked by the existing uv workspace reference to missing mzizi-database; Biome, Cargo fmt and web Prettier pass. Root typecheck reports only the same uv/mypy workspace failure; the other seven steps pass. Official/Governance-specific Reference legal associations remain unresolved pending exact target contracts, so acceptance item 4 remains open. No migrations, DB/S3/seed/deployment or generated-output changes were made.

### 2026-11-12T14:29:57.889Z · PETER IRUNGU

Blocker: acceptance item 4 remains open because dryv/contracts/schemas/mzizi/official.ts contains only candidate inventory comments and exports no official.entities schema. A typed FK from Legal cannot be written or compiled against an unreviewed, nonexistent target. Resolving this requires an approved Official entity contract/table target; no proxy or guessed target was added.

### 2026-11-12T14:31:51.427Z · PETER IRUNGU

Resuming after inspecting the handoff: it explicitly requires Legal instruments and Source publishers to point to canonical official.entities, and lists reference.official_entity_legal_bases as a typed association. The Official design already names official.entities and its candidate identity fields, but the contract file is only a stub. I will author this narrowly scoped dependency slice, retain the remaining Official inventory as unapproved, and document the addition as an integration requirement rather than blanket Official-schema approval.

### 2026-11-12T14:36:03.961Z · PETER IRUNGU

Resolved the prior Official-target blocker from the handoff evidence. Authored the minimum official.entities contract (ID, code, name, Reference kind, optional registration/dissolution dates) without approving the remaining Official inventory; added restrictive typed relations from Source publishers/sources and Legal instruments, plus reference.official_entity_legal_bases. The composed Main review now passes doctor/compile and contains 100 typed relation fields across Reference, Geography, Filesystem, Source, Legal, Official and Reference-Legal. Root typecheck and format checks were rerun: only the existing uv/mypy/Ruff workspace-member failure remains; all other root steps passed. Documentation and task status updated; no DB activation or mutations.

### 2026-11-12T14:41:02.666Z · PETER IRUNGU

Follow-up requested: move all typed Reference-Legal schemas into the existing reference.ts contract file and remove the separate reference-legal.ts authoring module.

### 2026-11-12T14:43:15.949Z · PETER IRUNGU

Follow-up complete: all Legal basis link and typed association schema definitions now reside in dryv/contracts/schemas/mzizi/reference.ts. They are registered in a Reference-owned, separate Dryv group using the reference storage namespace; the Main review app composes that group while the active Operations app continues to compose only the base Reference vocabulary. The standalone reference-legal.ts file was removed. Typecheck, Main doctor/compile, active database:check, task validate and diff check pass.
