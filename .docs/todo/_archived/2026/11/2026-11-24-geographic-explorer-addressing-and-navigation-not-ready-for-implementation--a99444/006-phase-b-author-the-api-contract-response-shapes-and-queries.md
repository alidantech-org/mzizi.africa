---
{id: TSK-0A9E5ED02AFE,name: "Phase B: author the API contract, response shapes and queries",type: task,status: archived,priority: medium,created_at: 2026-11-18T22:29:03.503Z,updated_at: 2026-11-24T19:14:49.099Z,order: 6144,extra: {readiness: ready,implementation_authorized: true,status_history: [{from: planned,to: in-progress,at: 2026-11-19T12:29:32.807Z},{from: in-progress,to: archived,at: 2026-11-24T19:14:49.099Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-0A9E5ED02AFE/1795091372808-start,started_at: 2026-11-19T12:29:34.033Z,end_ref: refs/tracking/TSK-0A9E5ED02AFE/1795547689114-end,ended_at: 2026-11-24T19:14:49.100Z,summary: {files: 1756,insertions: 47706,deletions: 16771}}]}},archived_at: 2026-11-24T19:23:21.131Z}
---

# Phase B: author the API contract, response shapes and queries

## Current owner-approved integration slice

The November 20 direction supersedes earlier web generation and planning-only prose below. Keep this same delivery programme: no second backlog. The web UI, theme, pages and navigation are handwritten. Dryv owns backend contracts, generated validation/controllers/service signatures, and the shared typed Next API Bridge client. Typed project-owned backend readers are allowed. App/dev generation and engine operations are outside this slice.

Implement anonymous setup in the welcome-page dialog, using registered country roots and canonical place slugs, country-scoped search and child-place reads, coordinate candidates requiring confirmation, independent device preferences, and a real place overview with honest recorded coverage. Preserve the permanent `/demo`; no prototype import or fallback dataset enters the real application. Do not add root seed inputs or reset a database. The remaining subject migrations in the broader programme remain open.

### Integration slice acceptance

- [x] Generate one shared route registry, grouped typed request helpers, compatibility re-exports and a client-safe routes/types barrel.
- [x] Generate and implement explicit-country bootstrap, context, search, children, coordinate and overview endpoints with validated named responses.
- [x] Connect the handwritten welcome dialog and canonical country/place pages through server-rendered generated-client reads.
- [x] Verify API scoping, identity errors, pagination, language/cookies, SSR and the complete setup flow; preserve `/demo` and record quality limitations.


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

## Comments

### 2026-11-19T22:36:33.435Z · PETER IRUNGU

Owner approved backend/client integration plan: shared generated next-api-bridge client with one routes.ts and feature-grouped request helpers; handwritten UI and permanent demo; anonymous welcome-dialog setup with cookie preferences; typed custom backend handlers are allowed. Implement bootstrap/context/search/children/coordinate resolution and initial overview, preserve active consumers with generated compatibility exports, and stop web frontend generation. No root seed additions or database resets are authorised by this work.

### 2026-11-20T07:19:09.617Z · PETER IRUNGU

Owner narrowed the immediate delivery: finish backend and Dryv contracts, regenerate and verify api-ts, then commit only backend/contracts/client work before any further web changes. Preserve all existing web edits untouched; no web migration or web commit in this checkpoint.

### 2026-11-20T08:02:18.014Z · PETER IRUNGU

Backend checkpoint contains six implemented typed explorer reads (bootstrap/context/search/children/coordinate resolution/overview), generated controller/DTO integration, PostgreSQL pagination with safe-offset rejection, canonical identity checks and validated SQL result parsing. Backend generation and contract/API typechecks pass. Verification covers live Kenya/South Africa reads plus generated DTO/controller tests. Commit is limited to backend, Dryv, API client and their documentation/tests; frontend migration is intentionally deferred without shims.
