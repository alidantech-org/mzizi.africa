---
id: DOC-A9C753E14D60
name: Audit records and accountable operational decisions redesign
type: documentation
tags: [improvements, schema-redesign, audit, provenance, planning]
extra: {status: planning_only}
---

# Audit — accountable decisions, immutable actions and review evidence

**PLANNING ONLY. User requirement: keep system audit separate from public/officer participation and separate in concept from the engine's current execution state.**

## Why audit must remain distinguishable

The existing `audit` schema has three tables. It currently mixes reviewer decisions with some commenting/evidence patterns. The user wants `participation` separately for public feedback and official participation and simpler ``engine` for running pipelines and review workflow. Audit should record **what action/decision occurred, who or what performed it, on which record version, when, with what justification and what prior state**. It is not a generic place for public comments, and it should not become the canonical source of real-world government actions.

An `engine` worker's attempt, retry or processing status is operational; the **decision to approve/reject a claim or correction** and changes to policy must remain auditable. The decision may be tracked operationally in the engine, with an immutable audit record; keep one authoritative decision outcome and a clear link between it and the audit trail. Evidence files stay in `filesystem`, provenance sources in `source`, and account actor identities in `auth`.

## Current tables and selective restructuring

| Existing table | Existing role; redesign review |
|---|---|
| `audit.comments` | Review/research comments; split public participation from internal record review comments only if semantically justified. |
| `audit.evidence` | Evidence references associated with a review; compare `source.attributions`/`verifications` and file citations; avoid duplicating the evidence identity. |
| `audit.decisions` | Review decisions/approval outcomes; preserve actor, original target, policy, version and reason with immutable history. |

**Potential** `audit.events` or `audit.actions` could represent general system mutations, access grants, pattern approvals, migration decisions, or other verifiable actions. Evaluate append-only audit requirements and volume before adding a huge global log. A review comment attached to a claim is not automatically an end-user participation statement. Resist moving all three existing tables blindly into `engine`.

## Hard foreign keys and generic targets

Known actor: FK to `auth.accounts` (or explicit service/agent actor identity); decision/review source: FK to `engine.claims` / `engine.candidates` / `engine.pattern_versions` where applicable; evidence FK to `source.captures`/`filesystem.versions`; affected domain row (person/institution/contract/law) should be addressed through typed FK associations or a rigorously enforced shared canonical record registry. A text `target_kind` and bare UUID do **not** enforce the existence of that row. Auditing an old version may require a stable canonical identity plus version pointer; snapshot meaningful before/after values and source reason, rather than rejoining a now-changed row and claiming it was always so.

Do not build global cross-schema cascading deletes on append-only audit evidence. Retention, legal hold and privacy must be designed, especially where individual user accounts are deleted or contributions retracted.

## Four acquisition classes and traceability

The domain's operational records are primarily **automatically generated observations of actual actions** by trusted system/users, plus carefully defined **static policy/decision-type classifications**. Pattern definitions can prescribe expected review actions, but cannot generate the fact that an approval took place. Derived reports may aggregate audit outcomes/correction metrics without rewriting the original records. Table comments should clearly state which of the standard seeded-static, seeded-pattern, auto-collected or derived classes truly apply and avoid categorizing audit events as seeded facts.

## Query and retention examples

Show which user/service promoted a conflicting person ID and the old→new identity resolution; which pattern version was approved before generating offices; what source assessment permitted a crawler run; why a procurement county link was corrected, on what evidence; whether a claim was reviewed versus auto-accepted under policy; who granted access to a restricted research record.

Operational review dashboards may show filtered engine workflow status, while audit queries remain append-only actor/date/subject oriented. Avoid publishing internal audit notes or secrets in the public API.

## Migration questions and risks

Audit the exact three current TypeORM entity fields and their generic target references, source/evidence overlap, existing reviewer flows and API users. Determine which `audit.comments` are internal versus public-facing; never move a private correction discussion into published `participation` without user permission. Ensure unique decision chain, actor FK, target reference integrity, time and immutability. Consider partitioning high-volume append-only events only when necessary.

**Explicitly open:** new general audit.events table; how operational engine decisions map to append-only audits; reliable target FK design; audit retention/PII/legal hold; service agent identities; which review comments are participation; indexed query patterns and read permissions; timeline of policy/version changes.

**References:** [Master register](../mzizi-data-schema-storage-and-pipelines-redesign.md) · [Engine](engine.md) · [Participation](participation.md) · [Auth](auth.md) · [Source](source.md).

**Status: audit remains separate as a concern; exact physical tables not approved.**

## Human review — editable user notes and design sign-off

**Review status:** `NOT REVIEWED` — AI-authored proposals in this document are not final approval.

**In my own words, what this schema should represent and exclude:**

> _My understanding and questions:_

**Tables/columns I want to keep, rename, move, merge, split, remove or add (and why):**

> _My proposed changes and alternative names:_

**Hard foreign keys, geographical and legal scope, pattern generation, classification and evidence I want changed or explained:**

> _My technical feedback, disagreements and alternatives:_

**Real data and queries I want to use to validate this design:**

> _My examples and expected results:_

**Unresolved decisions I want to discuss further:**

> _My remaining questions:_

**Final user decision:** `NOT DECIDED` / `NEEDS CHANGES` / `DESIGN VALIDATED BY USER` / `APPROVED FOR TASK PLANNING`.

**Approval reference and date:** _None. Only record explicit later user authorization. Even design validation does not authorize code, migration or Taskcode task creation._

## Mandatory per-table temporal, rigid-column and deletion review (2026-11-07)

**USER REQUIREMENT; planning only.** Examine every existing/proposed field and expressly record **KEEP / REMOVE / DERIVE / MOVE / RENAME / ADD** for `valid_from`, `valid_to`, `valid_from_precision`, `valid_to_precision`, `is_current`, `status`, `version`, `created_at`, `updated_at` and other copied/rigid flags. These fields are **opt-in by justified meaning**, not blanket schema conventions. Assess `deleted_at` only for recoverable soft deletion where appropriate. The full policy and migration/approval checklist is in [schema redesign README](README.md).

**Domain-specific guidance:** Audits and accountable decisions are immutable time-stamped events rather than indefinitely valid entities. Keep recorded_at/decided_at and versioned correction events where necessary; no is_current toggling of history or blanket soft deletion. Distinguish public participation withdrawal from permanent audit evidence.

**OPEN for human review:** exact per-table/column disposition, derived status and as-of queries, pattern/legal links, justified precision, recoverable deletion versus domain lifecycle, history/identity preservation and hard-FK impact. No code or migration is authorized.
