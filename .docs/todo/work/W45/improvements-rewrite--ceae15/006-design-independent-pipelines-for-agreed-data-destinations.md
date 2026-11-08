---
{id: TSK-7ED801464BFD,name: Design independent pipelines for agreed data destinations,type: task,status: planned,priority: medium,created_at: 2026-11-08T06:46:29.468Z,updated_at: 2026-11-08T06:46:29.468Z,depends_on: [TSK-0B9CCF587F64],order: 6144}
---

# 06 — Design independent pipelines for agreed data destinations

## Goal

Deliver a precise, understandable and reviewable design for this milestone in the improvements rewrite, preserving useful existing functionality and establishing reliable inputs for the next milestone.

## Context

Depends on reviewed source design and all destination schema designs, tasks 01-05. Design pipelines around exact data needs and relationships, not a generic engine rewrite. Reuse the existing queue, extractors, storage adapters and controlled promotion where appropriate. Separate workflow, reusable package, worker and orchestrator. Define shared scheduling, source admission, retries, leases, idempotency, resource budgets, caching and cancellation. Reference owns patterns; engine applies them. Schedule-driven, source-change and manual refresh triggers share execution machinery. Defer new brokers, vector services, custom ML and topology choices unless evidence justifies them.

Inspect current Dryv contracts, generated entities, migration history, runtime readers/writers and existing tests before proposing changes. Distinguish repository evidence from a verified live database audit. For every table specify purpose, columns, SQL types, nullability, defaults, primary keys, foreign keys including cross-schema relationships, unique/check constraints, indexes, deletion behavior and comments. Use KEEP/REMOVE/DERIVE/MOVE/RENAME/ADD decisions with migration mapping; preserve stable IDs, evidence and existing data. Justify temporal/version fields individually. This task is planned design work: creation does not authorize migrations, application changes, deployment or execution of subsequent tasks. Record user design decisions before proposing a coordinated implementation. Work on develop only and do not modify .github. Tasks remain planned until explicitly started.

## Source documentation

- [independent-data-pipelines.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/independent-data-pipelines.md)
- [data-categories-and-patterns.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/data-categories-and-patterns.md)
- [schema-redesign/engine.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/engine.md)
- [source-redesign/09-pipelines-autonomy-and-decisions.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/09-pipelines-autonomy-and-decisions.md)
- [source-redesign/10-prior-art-and-build-vs-reuse.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/10-prior-art-and-build-vs-reuse.md)
- [source-redesign/11-tool-integration-and-contracts.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/11-tool-integration-and-contracts.md)
- [source-redesign/13-benchmarks-and-research-questions.md](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/source-redesign/13-benchmarks-and-research-questions.md)

## Acceptance checklist

- [ ] Map each proposed pipeline input, step and output to exact agreed tables, pattern versions, source artifacts and review policy.
- [ ] Specify reusable package boundaries and independently runnable workers with one coordinated queue/admission boundary.
- [ ] Define concurrency-safe promotion, retries/resume, deduplication, lineage, freshness and affected-dependency invalidation.
- [ ] Plan county leadership proof with preserved evidence and a second independent workload to verify isolation and bounded concurrency.
- [ ] Document baseline comparisons, measurable acceptance checks, deployment alternatives and staged implementation tasks for later explicit authorization.
