---
{id: GRP-B087576CA4F4,name: Data engine research and build,type: documentation,extra: {created_at: 2026-11-02T06:08:54.874Z}}
---

# Plan

## Approach

Start from the handoff in .docs/handoffs/data-engine-research-build-plan-handoff.md. First answer the layout question (the proposed source/backend/engine with data and database packages) and the language, shared-contract, job-model, staging and promotion questions through small experiments, recording each as a decision. Then author the layer contracts, build the database package, build the data package, wire staging and promotion, and prove the chain with a geography boundary slice before importing legacy seeds.

## Milestones

1. Decision records and an updated architecture document.
2. Contracts for artifact references, extraction results, candidate records and promotion decisions.
3. Database package with migrations, seeds, integrity checks and derived PostGIS columns.
4. Data package with a job runner and one real extractor.
5. Staging, review and promotion working end to end on the geography slice.
6. Legacy seed import in priority order.

## Risks

Boundaries blurring between extraction, intelligence and the database lifecycle. Schema truth drifting between the generated entities and migrations. Plain-id links without foreign keys silently breaking. Reusing legacy extractors of unknown quality or licence. A shared no-auth local database that also holds other projects' data.
