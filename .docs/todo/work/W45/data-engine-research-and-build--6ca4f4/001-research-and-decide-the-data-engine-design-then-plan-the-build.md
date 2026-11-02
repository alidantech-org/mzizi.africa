---
{id: TSK-BD46EDE97821,name: "Research and decide the data engine design, then plan the build",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T06:09:04.136Z,updated_at: 2026-11-02T07:10:08.184Z,due_at: 2026-11-03,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T07:10:08.184Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-BD46EDE97821/1793603408186-start,started_at: 2026-11-02T07:10:08.465Z}]}}}
---

# Research and decide the data engine design, then plan the build

## Goal

Turn the data engine from a README into a decided design and a ready-to-run task plan. The outcome is a set of decision records, an updated architecture document and detailed tasks for the build, so the next phase can start without re-litigating basics.

## Context

Read .docs/handoffs/data-engine-research-build-plan-handoff.md first; it lists what exists (the NestJS API with 69 generated tables, Dryv contracts, fixtures, the dev schema script), what is missing, the constraints and the nine research questions. The user proposed grouping the two engines as source/backend/engine with data and database packages instead of the sibling data-engine and db-engine folders; the recommendation is to accept it as a grouping while keeping two separately runnable packages. The legacy extractors and seeds live in source/backend/api-legacy and were inventoried in .docs/docs/audits/LEGACY_MODEL_INVENTORY.md but never run. This task is research and planning only: experiments are welcome, but no production engine code is built here.

## Acceptance checklist

- [x] Confirm the folder layout with the user and, if confirmed, record the decision and list every reference that must change.
- [ ] Decide the language and toolchain for each package, including where schema truth lives so generated entities and migrations cannot drift.
- [ ] Decide how layer contracts are authored and shared across TypeScript and Python, with a tiny experiment generating or exporting one contract.
- [x] Decide the job model, staging model and promotion rules, each as a short decision record.
- [ ] Run each legacy extractor on a real sample and record keep, rewrite or drop with reasons.
- [ ] Confirm or replace the geography boundary vertical slice and choose its dataset and licence.
- [ ] Update ARCHITECTURE.md, MIGRATION.md and the roadmap, then create detailed build tasks with acceptance checklists and due dates, and run task validate.

## Progress
- 2026-11-02: layout confirmed (DEC-ENGINE-LAYOUT); DATA_INTAKE_PLAN.md written; DEC-DATA-ENGINE-DESIGN proposed; build tasks 002 to 010 created.
- Live database has 18 schemas and 89 tables, not 91 as the handoff states.
- Legacy audit was a code read only, not a run on a sample: anti-detection code is dropped, pdf_extractor is a rewrite from parts. Items 2, 3, 5, 6 and 7 remain open: the toolchain and Python-contract experiments, a real extractor run, the boundary dataset and licence choice, and the ARCHITECTURE, MIGRATION and roadmap updates.
