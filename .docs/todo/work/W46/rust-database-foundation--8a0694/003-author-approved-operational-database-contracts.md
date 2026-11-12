---
{id: TSK-45A6D71C9E20,name: Author approved Operational database contracts,type: task,status: completed,priority: high,created_at: 2026-11-12T08:00:00.000Z,updated_at: 2026-11-12T10:11:12.538Z,order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T09:19:02.985Z},{from: in-progress,to: completed,at: 2026-11-12T10:11:12.538Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-45A6D71C9E20/1794475142987-start,started_at: 2026-11-12T09:19:03.715Z,end_ref: refs/tracking/TSK-45A6D71C9E20/1794478272548-end,ended_at: 2026-11-12T10:11:12.538Z,summary: {files: 12,insertions: 2133,deletions: 288}}]}}}
---

---
{id: TSK-45A6D71C9E20,name: Author approved Operational database contracts,type: task,status: in-progress,priority: high,created_at: 2026-11-12T08:00:00.000Z,updated_at: 2026-11-12T09:19:02.985Z,order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T09:19:02.985Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-45A6D71C9E20/1794475142987-start,started_at: 2026-11-12T09:19:03.715Z}]}}}
---

---
{id: TSK-45A6D71C9E20,name: Author approved Operational database contracts,type: task,status: in-progress,priority: high,created_at: 2026-11-12T08:00:00.000Z,updated_at: 2026-11-12T09:19:02.985Z,order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T09:19:02.985Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-45A6D71C9E20/1794475142987-start,started_at: 2026-11-12T09:19:03.715Z}]}}}
---

---
{id: TSK-45A6D71C9E20,name: Author approved Operational database contracts,type: task,status: in-progress,priority: high,created_at: 2026-11-12T08:00:00.000Z,updated_at: 2026-11-12T09:19:02.985Z,order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T09:19:02.985Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-45A6D71C9E20/1794475142987-start,started_at: 2026-11-12T09:19:03.715Z}]}}}
---

# Author the approved Operational database contracts

## Goal

Implement the user-approved 45-table design for the seven schemas in the single `mzizi_operations` database as complete Dryv contracts. The accepted design is recorded in `.docs/decisions/DEC-OPERATIONAL-DATABASE-20261112.md` and in the owning Operational schema design documents. This task is limited to Operational contract authoring and validation.

## Context

The user explicitly approved all seven Operational schema inventories and the listed columns on 12 November 2026, and authorized implementation. The approved table counts are Auth (11), Acquisition (7), Engine (10), Staging (6), Analytics (5), Audit (2) and Management (4). The existing files are scaffolding; the existing Auth definitions are drafts and must be reconciled with the approved design rather than preserved as authoritative.

Read `.docs/rules/schema-contract-authoring.md`, `.docs/rules/code-columns.md`, `.docs/_plan/schema-redesign/README.md`, `.docs/_plan/schema-redesign/contract-authoring.md`, the Operational index and all seven owning schema design documents before editing. Follow `AGENTS.md` and preserve unrelated changes. Work only on `develop`.

## Acceptance checklist

- [x] Reconcile `dryv/contracts/schemas/_shared.ts` for properties needed by these contracts; keep non-enum reusable properties centralized and schema-local properties enum-only. Do not assume the earlier shared catalogue review was blanket-approved.
- [x] Author all approved Auth tables and their complete semantics, without a universal lifecycle base.
- [x] Author all approved Audit tables, preserving append-only attribution and decision semantics.
- [x] Author all approved Engine tables, including run/job separation, dependency integrity, attempts, checkpoints, event ordering, outbox delivery and artifact references.
- [x] Author all approved Acquisition tables, including versioned collection policy, crawl frontier, access attempts, observations and discovered links.
- [x] Author all approved Staging tables, including immutable revisions, mappings, findings, reviews and idempotent promotion requests.
- [x] Author all approved Analytics tables, including experiment, request, projection, result and evaluation relationships.
- [x] Author all approved Management tables, preserving publication idempotency and reconciliation semantics.
- [x] Resolve same-database cross-schema foreign keys and type-safe references; do not create cross-database foreign keys to Main.
- [x] Define field types, nullability, defaults, primary keys, uniqueness, checks, indexes, delete/update behavior and query exposure with documented reasons.
- [x] Verify all 45 approved table and column inventories against the decision record; do not silently add, remove or rename approved objects.
- [x] Document any Dryv capability gaps exactly; do not weaken constraints or invent unsupported syntax.
- [x] Run the appropriate Dryv type, contract and generation checks available in the repository; run `task validate` after documentation edits and report pre-existing failures separately.
- [x] Keep Main Phase 01 contracts untouched and Phase 02 deferred.
- [x] Do not generate/apply SQL migrations, provision databases, load seeds, migrate data or deploy.

## Implementation notes

The seven Operational schema files are under `dryv/contracts/schemas/operational/`. The only target database is `mzizi_operations`. Cross-schema FKs within this database are allowed when the relationship is real and enforceable. Main references use typed identifiers and application-level validation. Engine execution does not make a candidate accepted knowledge; Staging controls review and promotion; Management records publication coordination but cannot claim Main committed without authoritative acknowledgement.

The user does not require table-by-table approval for this Operational design. Resolve implementation details coherently under the approved semantics and document them. If a material gap requires a new table or a change to the approved column inventory, record the issue and request a focused decision rather than silently changing the accepted baseline.


## Progress

The seven Operational schema contracts now define all 45 approved tables and exactly the 424 approved columns. All reusable non-enum properties are centralized in `dryv/contracts/schemas/_shared.ts`; the schema files declare enums locally. Every table has an explicit storage namespace and primary key, including the two composite-key joins. The contracts add 80 resolvable Operational relations with explicit RESTRICT update/delete behavior, unique natural/idempotency indexes, foreign-key lookup indexes, and queue/time lookup indexes. Required fields have no implicit defaults; named database operations supply them. Stable identity codes use the shared lowercase dotted-code profile. Audit events/decisions, staging revisions/findings/reviews and engine events are create-only; job dependencies reject a job referring to itself.

Validation passed through `bun run database:check`: TypeScript typecheck, Biome format check, Dryv doctor (`READY`) and Runtime IR compilation. An IR audit matched the approved table/column inventory, verified all relation targets and counted the primary keys, 80 relations and 120 secondary indexes.

The Rust model/SQL packs are still not active for the dedicated database authoring source because Dryv multi-authoring support is pending, as documented in `.docs/_plan/database-foundation/DRYV_MULTI_AUTHORING.md`. Therefore this work validates authored contracts and Runtime IR; it does not claim generated Rust models or SQL migration behavior. SQL generation/application, database provisioning and deployment remain outside this task. Main Phase 01 contracts were not edited.
No new HTTP or unrestricted read surface was added for the internal Operational tables; callers continue to use named database operations, and the seven table groups are composed into the dedicated database authoring app.

The first `task validate` run surfaced a pre-existing stale link in `.docs/_plan/source-redesign/README.md` to the former website-contract path. The link now points to the archived historical contract, and the required validation was rerun.
