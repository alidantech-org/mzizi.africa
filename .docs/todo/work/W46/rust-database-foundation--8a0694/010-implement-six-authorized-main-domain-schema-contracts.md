---
{id: TSK-F6D5ACE9AA21,name: Implement six authorized Main domain schema contracts,type: task,status: completed,priority: medium,created_at: 2026-11-12T15:52:33.417Z,updated_at: 2026-11-12T16:26:33.916Z,order: 10240,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-12T15:52:38.599Z},{from: in-progress,to: completed,at: 2026-11-12T16:26:33.916Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-F6D5ACE9AA21/1794498758603-start,started_at: 2026-11-12T15:52:39.362Z,end_ref: refs/tracking/TSK-F6D5ACE9AA21/1794500793923-end,ended_at: 2026-11-12T16:26:33.916Z,summary: {files: 31,insertions: 1794,deletions: 334}}]}}}
---

# Implement the six authorized Main domain contracts

## Goal

Implement the coordinated Main database contracts for Official, Governance, Politics, Civic, Finance and Accountability so accepted institutional, political, civic and financial facts share canonical identities and can be analyzed with attributable evidence. The work must follow the user's 12 November 2026 handoff and preserve the Main/Operations boundary. Accountability remains analytical and read-only unless the current architecture can express useful queries without inventing stored facts.

## Context

The user explicitly authorized contract development for these six domains and provided a detailed implementation handoff. Existing files are comment-only shells except the minimum `official.entities` integration dependency. Existing uncommitted Rust pack and generated-output changes must be preserved. Main schemas connect to Reference, Geography, Legal through Reference, Source and Filesystem; no FK may cross to Operations. Do not create migrations, change database contents, deploy, import seeds, modify S3 artifacts, create workflows or modify the legacy API entrypoint. Keep procurement records under Civic, financial flows at their actual reporting granularity, and accountability findings as analytical signals rather than conclusions.

## Acceptance checklist

- [x] Implement the six neutral Official tables and remove duplicate person/organization identity patterns.
- [x] Implement Governance institutions, offices, holders, mandates, relationships and geographic authority with typed same-Main relations.
- [x] Implement Politics parties, memberships, coalitions, elections, contests, candidates, electorates, results, manifestos and manifest items with historical affiliations.
- [x] Implement Civic services, projects, project features and procurement lifecycle tables; do not duplicate Geography assets or service locations.
- [x] Implement Finance fiscal periods, budgets, versions, appropriations, funds, flows and debts; remove finance.units and preserve aggregate/transaction granularity.
- [x] Keep Accountability free of speculative stored records and document supported read-only analytical outputs and any Dryv view/query limitation.
- [x] Compose persisted Main schemas explicitly in the database review application, assign each namespace to mzizi, remove Procurement assignment and preserve existing named operations.
- [x] Reconcile database contract audit rules to cross-schema same-database FKs and multiple role-specific relations without weakening unrelated checks.
- [x] Update all six owning design docs, Procurement relocation, schema catalogues, authoring plan, architecture/design docs and decision/handoff records; retain archives as history.
- [x] Run deterministic contract checks and logical dry-runs for roads, election, public services, finance and derived accountability; run format/typecheck/audit/doctor/compile and task validation.
- [x] Review final diff, document any SQL-pack limitation precisely, and confirm no migrations or live database changes were performed.
