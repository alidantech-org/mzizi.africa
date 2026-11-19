---
{id: TSK-0A9E5ED02AFE,name: "Phase B: author the API contract, response shapes and queries",type: task,status: in-progress,priority: medium,created_at: 2026-11-18T22:29:03.503Z,updated_at: 2026-11-19T12:29:32.807Z,order: 6144,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T12:29:32.807Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0A9E5ED02AFE/1795091372808-start,started_at: 2026-11-19T12:29:34.033Z}]}}}
---

# Phase B: author the API contract, response shapes and queries

## Goal

Author in the contracts every composed read, typed response section and data-driven query the web screens need, so no screen assembles endpoints and no section is dynamic. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and is now governed by the consolidated group readiness gate; no runtime work, commit or push is authorized yet.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Acceptance checklist

- [ ] Replace every dynamic section with typed schemas and unions.
- [ ] Author composed reads per screen from the address map, including context, slug resolution, copy delivery, preferences and interactions with the mobile-only write rule.
- [ ] Author the generic metric engine over statistics.metrics and list every hand query as a recorded Dryv gap.
- [ ] Contracts typecheck, doctor and compile and no dynamic field remains.

## Consolidated ownership and readiness

This existing task now owns API contract and data requirements for the combined frontend repair, rather than a parallel API redesign. It remains planned and authorized for implementation. Product reads must support explicit country and place context, effective language, reviewed evidence, historical applicability and typed URL-selected views. Preserve role-derived indicator lookup and the delivered engagement operations as regression requirements. The existing task's old autonomous push instruction is superseded by the group's planning gate. The metric catalogue is part of this task, not a competing first project. Check current schema work with its owning tasks before changing contracts or assuming a proposed table exists.

## Integrated acceptance checklist

- [ ] Author typed composed screen documents and reads for all selected views, including contextual place overview with representatives, procurement and media; avoid UI endpoint composition.
- [ ] Make metrics, indicator roles, available geographic levels, temporal selection and ranking defaults data-driven; remove the code-owned metric catalogue and year assumptions without losing verified role lookup.
- [ ] Specify applicability separately for legal effects, officials, projects, budgets, statistics, sources and evidence; local observations and ancestor comparisons stay distinct.
- [ ] Cover distance-ordered nearest facilities, generated download/export support and remaining finance/election capabilities; distinguish absent schema, absent records and absent implementation.
- [ ] Declare stable pagination, ordering, filter choices, copy and scope metadata, keeping all product reads reachable through generated clients and types.
- [ ] Treat new seed inputs and missing curated data as separate owner approvals; never fabricate records to make a screen appear complete.

## Implementation authorization

The owner explicitly requested implementation of the integrated database, API and web redesign on 19 November 2026. That request supersedes earlier planning-only gates in this record. Implement web only, with realistic labelled synthetic development fixtures, contract-generated screen reads and clients/types. Engine operations, the dev frontend, Flutter and real-data acquisition are excluded. The accepted plan in this conversation is authoritative where older task prose conflicts. Seed-file approval rules remain in force.
