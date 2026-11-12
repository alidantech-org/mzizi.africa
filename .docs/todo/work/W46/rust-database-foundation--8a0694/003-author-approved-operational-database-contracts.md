---
{id: TSK-45A6D71C9E20,name: Author approved Operational database contracts,type: task,status: planned,priority: high,created_at: 2026-11-12T08:00:00.000Z,updated_at: 2026-11-12T08:00:00.000Z,order: 3072,extra: {status_history: []}}
---

# Author the approved Operational database contracts

## Goal

Implement the user-approved 45-table design for the seven schemas in the single `mzizi_operations` database as complete Dryv contracts. The accepted design is recorded in `.docs/decisions/DEC-OPERATIONAL-DATABASE-20261112.md` and in the owning Operational schema design documents. This task is limited to Operational contract authoring and validation.

## Context

The user explicitly approved all seven Operational schema inventories and the listed columns on 12 November 2026, and authorized implementation. The approved table counts are Auth (11), Acquisition (7), Engine (10), Staging (6), Analytics (5), Audit (2) and Management (4). The existing files are scaffolding; the existing Auth definitions are drafts and must be reconciled with the approved design rather than preserved as authoritative.

Read `.docs/rules/schema-contract-authoring.md`, `.docs/rules/code-columns.md`, `.docs/_plan/schema-redesign/README.md`, `.docs/_plan/schema-redesign/contract-authoring.md`, the Operational index and all seven owning schema design documents before editing. Follow `AGENTS.md` and preserve unrelated changes. Work only on `develop`.

## Acceptance checklist

- [ ] Reconcile `dryv/contracts/schemas/_shared.ts` for properties needed by these contracts; keep non-enum reusable properties centralized and schema-local properties enum-only. Do not assume the earlier shared catalogue review was blanket-approved.
- [ ] Author all approved Auth tables and their complete semantics, without a universal lifecycle base.
- [ ] Author all approved Audit tables, preserving append-only attribution and decision semantics.
- [ ] Author all approved Engine tables, including run/job separation, dependency integrity, attempts, checkpoints, event ordering, outbox delivery and artifact references.
- [ ] Author all approved Acquisition tables, including versioned collection policy, crawl frontier, access attempts, observations and discovered links.
- [ ] Author all approved Staging tables, including immutable revisions, mappings, findings, reviews and idempotent promotion requests.
- [ ] Author all approved Analytics tables, including experiment, request, projection, result and evaluation relationships.
- [ ] Author all approved Management tables, preserving publication idempotency and reconciliation semantics.
- [ ] Resolve same-database cross-schema foreign keys and type-safe references; do not create cross-database foreign keys to Main.
- [ ] Define field types, nullability, defaults, primary keys, uniqueness, checks, indexes, delete/update behavior and query exposure with documented reasons.
- [ ] Verify all 45 approved table and column inventories against the decision record; do not silently add, remove or rename approved objects.
- [ ] Document any Dryv capability gaps exactly; do not weaken constraints or invent unsupported syntax.
- [ ] Run the appropriate Dryv type, contract and generation checks available in the repository; run `task validate` after documentation edits and report pre-existing failures separately.
- [ ] Keep Main Phase 01 contracts untouched and Phase 02 deferred.
- [ ] Do not generate/apply SQL migrations, provision databases, load seeds, migrate data or deploy.

## Implementation notes

The seven Operational schema files are under `dryv/contracts/schemas/operational/`. The only target database is `mzizi_operations`. Cross-schema FKs within this database are allowed when the relationship is real and enforceable. Main references use typed identifiers and application-level validation. Engine execution does not make a candidate accepted knowledge; Staging controls review and promotion; Management records publication coordination but cannot claim Main committed without authoritative acknowledgement.

The user does not require table-by-table approval for this Operational design. Resolve implementation details coherently under the approved semantics and document them. If a material gap requires a new table or a change to the approved column inventory, record the issue and request a focused decision rather than silently changing the accepted baseline.
