---
id: PLAN-SCHEMA-CONTRACT-AUTHORING
name: Agree Dryv schema contract authoring before implementation
type: plan
tags: [dryv, schemas, review, contracts]
extra: {status: operational_design_accepted, implementation_authorized: operational_and_reference_geography_foundation_contract_development, task: TSK-5E7AE1C69541, main_phase_01_review_pending: true}
---

# Agree schema contract authoring

The user approved the complete 45-table Operational design. For Main Phase 01, the existing Reference inventory and Geography's nine-table inventory/responsibilities are accepted foundations; detailed fields, new Reference tables, classification values and full contract semantics remain under review. Current drafts live in `dryv/contracts/schemas/mzizi/reference.ts` and `geography.ts`. The requested layout also includes `dryv/contracts/schemas/_shared.ts` and `dryv/contracts/schemas/operational/<schema>.ts`. The [schema-authoring agreement](../../rules/schema-contract-authoring.md) contains shared-property conventions, the per-schema checklist and the file-header template. Other Main Phase 01 schemas remain subject to individual review.

## Existing agreement and remaining review

The [catalogue](README.md) assigns twelve Main Phase 01 and seven Operational schemas, with all remaining schemas deferred to Phase 02. The 45 Operational tables and listed columns are approved by [DEC-OPERATIONAL-DATABASE-20261112](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/decisions/DEC-OPERATIONAL-DATABASE-20261112.md). The Operational decision covers Operations only. Reference and Geography have separate user approval recorded in their owning Phase 01 documents; other Main schemas remain pending.

This implementation phase changes the seven Operational Dryv schema files and their owning design documentation. Preserve unrelated foundation work. Do not activate generation, generate/apply SQL migrations, provision databases, import seeds or change existing databases.

## Review and implementation sequence

1. Implement the approved 45-table Operational design first, beginning with the shared scalar catalogue only where required by the approved contracts. Keep `_shared.ts` limited to reusable non-enum properties and rules; schema-local properties are allowed only for enums. Reconcile the existing Auth draft rather than treating it as final.
2. Author complete contracts for all seven Operational schemas: Auth, Audit, Engine, Acquisition, Staging, Analytics and Management. Resolve types, nullability, defaults, keys, relationships, constraints and indexes consistently across the one Operations database.
3. Validate every contract and the cross-schema relationship graph. Document exact Dryv capability gaps rather than weakening constraints or inventing syntax.
4. Reference's existing inventory and Geography's nine table names/responsibilities are accepted. Their detailed field contracts remain proposals; Geography stays out of generation while PostGIS semantics are unsupported. Other Main Phase 01 contracts remain individually gated.
5. Keep Phase 02 deferred. No migrations, database provisioning, data changes or deployment are authorized by Operational design approval.

## Findings to resolve, not implementation changes

Observed in the working tree on 12 November 2026:

| Draft area | Finding | Proposed treatment |
|---|---|---|
| Shared properties | `BusinessCode` has a slash-based example and a 200-character bound; the current rule uses dots, 255 characters and at most 16 segments. | Review one shared code contract against the actual rule, including validation and generated enforcement. |
| Shared entity base | Every entity inherits identity, created/updated time and version. | Make shared field groups optional; decide columns and keys by each table's meaning. |
| Shared concerns | Transport, HTTP failures and read-surface helpers live beside scalar properties. | Keep schema `_shared.ts` focused on property/rule reuse; move application concerns to application-owned contracts in later implementation. |
| Reference naming | `mzizi/reference.ts` declares a `vocabulary` group. | Align file, group and schema ownership as `reference`; vocabulary remains a responsibility within Reference. |
| Detailed approval | Auth and Reference drafts lack headers identifying exact approved objects and approval records. | Reconcile them with their design reviews; their presence is not proof of approval. |
| Relations and indexes | Supersession/grantor references and preferred-label uniqueness are partly explained in comments rather than complete persistence definitions. | Review complete semantics; report unsupported Dryv features instead of silently weakening them. |
| Code uniqueness | The current Reference draft uses scheme-scoped code uniqueness, while the repository code rule requires table-wide uniqueness. | Explicitly resolve the conflict before approving that constraint; do not silently override either design. |
| Application composition | Database app imports point to `schemas/vocabulary.ts`, while the draft file is under `schemas/mzizi/reference.ts`. | Correct imports as part of the later reviewed contract implementation, not this drafting task. |

These observations are not a claim that the current generator or Rust service implements the proposed contracts. The working tree is actively changing; recheck each finding before editing it. Older design guidance also conflicts with the agreed same-database cross-schema FK direction and needs reconciliation in implementation work.

## Completion criteria

The Operational design approval is recorded in DEC-OPERATIONAL-DATABASE-20261112 and in all seven owning design documents. Operational contract authoring is authorized. Work is complete only when all 45 approved tables have truthful headers, complete supported Dryv semantics, resolved relationships and passing appropriate checks. Reference and Geography inventory acceptance authorizes coordinated contract development; it does not approve detailed fields or extensions. Other Main Phase 01 schemas remain excluded until reviewed.

Baseline documentation validation already reports a broken website-contract link in `.docs/_plan/source-redesign/README.md` after the ongoing contract relocation. Record this separately from any errors introduced by the drafting task.

## Scaffolding follow-up — 12 November 2026

The user subsequently authorized creation of all nineteen schema files and consolidation of non-enum properties in `_shared.ts`. Files contain the approved Operational inventories plus Main Phase 01/Phase 02 candidate scaffolding. The existing Auth draft must be reconciled to the approved 11-table Auth design. For Reference and Geography, only the existing Reference inventory and the nine Geography table names/responsibilities are accepted; detailed contract designs and Reference additions remain under review. Other Main Phase 01 schemas remain pending.
