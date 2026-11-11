---
{id: TSK-7E5E18758D9C,name: Design reference-owned patterns and harden geography,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:27.515Z,updated_at: 2026-11-11T04:21:44.934Z,depends_on: [TSK-3EA8C40B0F60],order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-11T04:17:53.977Z},{from: in-progress,to: planned,at: 2026-11-11T04:21:44.934Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-7E5E18758D9C/1794370673997-start,started_at: 2026-11-11T04:17:54.414Z,end_ref: refs/tracking/TSK-7E5E18758D9C/1794370904939-end,ended_at: 2026-11-11T04:21:44.935Z,summary: {files: 14,insertions: 338,deletions: 2}}]}}}
---

# 03 — Design the connected reference, geography and pattern foundation

## Goal

Produce the precise foundation specification that lets Mzizi explain modern and historical knowledge through place, time, meanings, legal support and actual domain relationships. Deliver an implementation-ready design and bounded integration contracts rather than another generic vocabulary proposal. The controlling discussion is recorded in [connected foundation](../../../../improvements/connected-reference-geography-legal-foundation.md); follow the [local-agent handoff](../../../../handoffs/task03-connected-foundation-local-agent.md).

## Context and authorization

The user accepted the architectural direction on 10–11 November and requested documentation, task readiness and a local-agent handoff. This task remains a detailed design milestone: routine research, inspection, specifications, contract examples and focused design validation are authorized. Significant schema/application implementation and destructive database operations require the concrete reviewed design and applicable authorization; this preparation does not silently start task 04 or a production deployment.

Use modern countries as the organizational umbrella for modern governance, with explicit territorial links. Geography supports Africa, countries, overlapping administrative/electoral/statistical systems, cross-border organizations' coverage, historical areas and uncertain/hypothetical representations. Do not force country ownership on every entity or retain `world` as a legal jurisdiction. Country context, authority, legal applicability, service coverage and physical location are separate. Reference defines meanings; real domains own entities/rules; direct typed FK relationships connect them. A county's legal authority does not make it another top-level country context.

Auth and filesystem have implementation notes: inspect their current contracts, do not rebuild them. Filesystem's latest recorded design has seven tables including `file_relations` and a paths view; older eight-table/extractions and file-type-table proposals are superseded. Preserve exact file versions, S3 evidence and scoped RBAC. Task 02 remains recorded as in-progress despite its final delivery notes; verify actual outputs and report that metadata discrepancy instead of claiming formal completion or altering its state without evidence.

Inspect active Dryv contracts, SQL under `source/schema/`, packages under `source/packages/`, the Python engine under `source/backend/engine/`, NestJS API under `source/backend/api/`, current tests and readers/writers. Archives are read-only design evidence, never runnable dependencies. Distinguish repository findings, delivery-note claims and live verification. `mzizi_new` is disposable: no legacy ID/data compatibility is required. Existing S3 artifacts are not disposable.

## Acceptance checklist

- [ ] Inventory active reference/geography consumers and dependencies; record KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD dispositions and superseded assumptions. Verify auth/filesystem readiness and bootstrap constraints.
- [ ] Specify countries, schemes, values, descriptions/labels, applicability and semantic relations. Enforce correct scheme membership through actual keys; demonstrate wrong-scheme rejection. Follow the universal `code` rule without treating code prefixes as geographic truth.
- [ ] Specify geographic units/types, names, changes, dated typed relationships and sourced boundary representations. Include Africa, country roots, parallel hierarchies, disputed/reconstructed/hypothetical areas and unknown geometry; no independently editable universal parent chain.
- [ ] Resolve physical places, actual presence, occupancy and contact ownership; distinguish legal duty from evidence of a building, holder or service. Use explicit country-root scope for known nationwide reach without inventing coverage from headquarters.
- [ ] Specify minimal stable legal instrument/provision identities and exact-version evidence interfaces, multiple typed legal bases and territorial/subject/personal/temporal applicability. Define real FK bootstrap order; full legal schema implementation belongs to task 04.
- [ ] Map governance office/institution/rules/holders, electoral contests/candidacies/results and political affiliations to reference, geography and legal contracts. Separate selection result from term commencement and candidacy affiliation from ongoing party membership.
- [ ] Specify EAC/COMESA organization, dated membership, organs/office mandates and legal support as downstream contracts; define a reproducible member-territory map without claiming sovereignty or uniform treaty applicability. Continental representation requires an actual sourced mandate.
- [ ] Specify reference-owned pattern identities, immutable versions/artifact bindings, applicability, legal/policy support, definition dependencies, resource prerequisites, engine run dependencies and FK-backed lineage. Reject cycles where appropriate, bound fan-out, preview changes, preserve independent edits/history and use deterministic identities.
- [ ] Prove the pattern interface against implemented filesystem folders: parent-first creation, deterministic inherited metadata/access, preview/apply contract, unchanged repeat run, conflict behavior, lazy system log folders and no implicit deletion/access widening. Governance generation remains a contract case until its destination is settled.
- [ ] Specify topic/capability discovery and input/result contracts under `source/schema/`; give population, representatives and budget query traces with date, geographic rule, evidence, methodology, gaps and explicit national fallback. GPS is location only; UI choices follow actual data availability.
- [ ] Document statistical semantic safeguards using census, revised estimate, language-use survey and approximate historical population cases. Preserve shared measurement machinery with typed domain meaning and boundary/release/method context; no automatic aggregation of incompatible coverage.
- [ ] Deliver exact per-table columns, SQL types, nullability, defaults, PK/FK/unique/check constraints, indexes, deletion rules and schema/table/column comments. Justify temporal/version/deletion fields individually and record the four acquisition classes separately from actual row origin.
- [ ] Provide fresh initialization/dependency order for `mzizi_new`, root `seed/` definitions/manifests and recognized parameter bindings. Separate artifact registration from record application; reuse filesystem publication and lineage rather than creating a second registry.
- [ ] Validate four end-to-end design fixtures (Kenyan governor legal bases, contest-to-office-to-holder, regional organ/member coverage and uncertain historical area), plus wrong-scheme/cycle/as-of/idempotency cases; label fixtures versus implemented runtime truth.
- [ ] Update reference/geography and affected domain improvement documents, task-04 dependency contracts and decisions; run `task validate` and appropriate contract checks, report results honestly and return a concrete design for significant-change approval before implementation.

## Source documentation

- [Connected model and research](../../../../improvements/connected-reference-geography-legal-foundation.md)
- [Reference](../../../../improvements/schema-redesign/reference.md), [geography](../../../../improvements/schema-redesign/geography.md), [legal](../../../../improvements/schema-redesign/legal.md)
- [Patterns and acquisition](../../../../improvements/data-categories-and-patterns.md)
- [Schema review policy](../../../../improvements/schema-redesign/README.md)
- [Seed convention](https://github.com/alidantech-org/mzizi.africa/blob/develop/seed/README.md)

## Preparation progress — 11 November 2026

The latest remote `develop` was inspected at `fc40f28dd03e01b52d5f8995dbc308f6fd7c81b9`. Preparation reconciles the discussion and research into the connected foundation, domain-document updates and local-agent handoff. Design acceptance items remain unchecked: recording the direction does not mean the exact SQL, runtime or proof cases are complete. Task 04 remains dependent on this task. Work directly on `develop`; no branches/worktrees, `.github/**` changes or infrastructure changes.
