---
{id: TSK-9474E2316D87,name: Set up a fresh Next.js web project,type: task,status: archived,priority: medium,created_at: 2026-11-19T13:26:17.561Z,updated_at: 2026-11-19T13:28:25.744Z,order: 9216,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-19T13:26:44.944Z},{from: in-progress,to: completed,at: 2026-11-19T13:28:23.905Z},{from: completed,to: archived,at: 2026-11-19T13:28:25.744Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-9474E2316D87/1795094804949-start,started_at: 2026-11-19T13:26:48.363Z,end_ref: refs/tracking/TSK-9474E2316D87/1795094903908-end,ended_at: 2026-11-19T13:28:23.906Z,summary: {files: 11,insertions: 100,deletions: 140}}]}},archived_at: 2026-11-24T19:25:20.163Z}
---

# Complete public governance, content and place comparison screens

## Goal

Finish the public web experience requested by the owner so visitors can understand institutions, follow leader relationships, open explanatory content and legal foundations, and choose meaningful places to compare. The result must consume existing API contracts and preserve evidence and explicit missing-data states instead of inventing public facts.

## Context

The earlier governance backend task TSK-FD1D0A4A6B63 reports nine new reads and generated clients, but deliberately excluded application screens. The interrupted redesign left the public leaders page using the older tree and no institution, Constitution or comparison routes. Existing uncommitted work belongs to the owner and must be preserved. This continuation works directly on develop, changes only the public web application and its documentation, and coordinates API changes with the backend agent. Governance classifications, hierarchy, metrics and scope labels must come from the API. No seed inputs or GitHub configuration are in scope.

## Acceptance checklist

- [x] Audit generated client contracts and implement typed reads for governance, institutions, content, legal basis and comparison without UI-owned domain rules.
- [x] Deliver institution directory/detail, Constitution/content reading and legal-basis navigation with honest missing-data and development-data labels.
- [x] Replace the old leaders display with API-driven categories, institution selection, connected tree, scope highlighting and available performance measures.
- [x] Deliver comparison suggestions and a level ladder using nearest/top options and explicit unavailable levels from the API.
- [x] Run targeted web type checking and build, provide browser QA routes to the parent, and record observed limitations and documentation updates.

## Comments

### 2026-11-19T13:27:40.289Z · PETER IRUNGU

Generated the empty App Router starter with create-next-app@latest and upgraded Tailwind and its Turbopack loader to registry latest 4.3.5. Preserved the owner archive and moved the old proxy into it. Only app/page.tsx is an application route. Build and typecheck pass; production HTTP smoke check returned 200 with expected homepage. Task validation passes. Root check has reported existing formatting, lint and mypy failures outside the starter; remaining checks are still running.

### 2026-11-19T13:28:15.847Z · PETER IRUNGU

Owner requested the Next.js src directory layout. Moved the single App Router page, layout and stylesheet into src/app and updated the import alias and README paths. No additional application routes were added.

### 2026-11-19T13:28:23.028Z · PETER IRUNGU

Final src/app build and typecheck both pass. Root check failed existing formatting, lint and mypy checks outside the starter; pytest was stopped after partial progress rather than reported as passing. Task validation passes.
