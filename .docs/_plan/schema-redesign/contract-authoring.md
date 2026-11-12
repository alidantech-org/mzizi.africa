---
id: PLAN-SCHEMA-CONTRACT-AUTHORING
name: Agree Dryv schema contract authoring before implementation
type: plan
tags: [dryv, schemas, review, contracts]
extra: {status: proposed, implementation_authorized: false, task: TSK-52BC741A0D7E}
---

# Agree schema contract authoring

The next task is to agree how schema designs become complete Dryv definitions before continuing schema implementation. The requested layout is `dryv/contracts/schemas/_shared.ts`, `dryv/contracts/schemas/mzizi/<schema>.ts` and `dryv/contracts/schemas/operational/<schema>.ts`. The [proposed authoring agreement](../../rules/schema-contract-authoring.md) contains the review process, shared-property conventions, per-schema checklist and file-header template. It is a proposal, not blanket schema approval.

## Existing agreement and remaining review

The [catalogue](README.md) already assigns twelve Main and seven Operational schemas. Preserve those responsibilities and keep Phase 02 deferred. Placement approval allows planning a schema file; it does not approve its tables or columns. Earlier foundation discussions selected an Auth/global-vocabulary proof slice, but those choices do not approve every detail in the current files. The latest instruction requires explicit review before further schema construction.

This drafting task changes documentation and Task records only. Existing uncommitted foundation code belongs to ongoing work and is preserved. No contract shell, entity, pack activation, generated SQL or database change is part of this draft.

## Review sequence

1. Agree the authoring conventions, including shared scalar properties, explicit per-table semantics, header states and the complete-contract checklist.
2. Reconcile the existing `_shared.ts`, Auth and Reference drafts against the agreed conventions. Resolve shared code validation and the universal entity base first, since both affect every consumer.
3. Review Auth and Reference one coherent subset at a time in their existing design documents. Record exact approved definitions and KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD / MERGE / SPLIT dispositions; preserve unresolved questions.
4. Once agreed, create comment-only shells for other scope-agreed schemas as needed. Their headers state `Approved definitions: none` and `Generation: excluded`; no empty shell implies a completed design.
5. Write only approved definitions, using supported Dryv constructs. Resolve Dryv capability gaps before including affected definitions in generation. Verify approval selection and the generated semantics before subsequent database work.

Approval of this process does not approve any of the nineteen detailed schemas. It also does not authorize a migration, deployment or data import. Application contracts continue to compose schemas separately from schema authoring.

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

The drafting deliverable is a linked, reviewable agreement with no implied table approval. The agreement task remains open until the user accepts or revises it. Later schema-authoring work is complete only when each selected definition has recorded approval, a truthful header, complete supported Dryv semantics and passing appropriate checks. Unapproved and unsupported definitions remain excluded.

Baseline documentation validation already reports a broken website-contract link in `.docs/_plan/source-redesign/README.md` after the ongoing contract relocation. Record this separately from any errors introduced by the drafting task.

## Scaffolding follow-up — 12 November 2026

The user subsequently authorized creation of all nineteen schema files and consolidation of non-enum properties in `_shared.ts`. Files now contain candidate table inventories taken from their owning design dictionaries, with separators after each entry. Existing Auth and Reference drafts are preserved and use shared scalar profiles; app imports follow the existing Reference file. This supersedes the earlier documentation-only limit for this follow-up, without approving the candidate contracts. Detailed schema reviews and generation remain pending.
