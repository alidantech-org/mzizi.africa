---
{id: TSK-13DE1B22175A,name: Complete public governance content and comparison screens,type: task,status: completed,priority: medium,created_at: 2026-11-18T11:55:37.706Z,updated_at: 2026-11-18T12:47:35.681Z,order: 3072,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-18T11:55:42.591Z},{from: in-progress,to: completed,at: 2026-11-18T12:10:47.012Z},{from: completed,to: in-progress,at: 2026-11-18T12:14:15.276Z},{from: in-progress,to: completed,at: 2026-11-18T12:23:17.182Z},{from: completed,to: in-progress,at: 2026-11-18T12:43:26.183Z},{from: in-progress,to: completed,at: 2026-11-18T12:47:35.681Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-13DE1B22175A/1795002942593-start,started_at: 2026-11-18T11:55:43.133Z,end_ref: refs/tracking/TSK-13DE1B22175A/1795003847023-end,ended_at: 2026-11-18T12:10:47.012Z,summary: {files: 74,insertions: 5914,deletions: 554}},{base_ref: refs/tracking/TSK-13DE1B22175A/1795004055286-start,started_at: 2026-11-18T12:14:16.071Z,end_ref: refs/tracking/TSK-13DE1B22175A/1795004597184-end,ended_at: 2026-11-18T12:23:17.182Z,summary: {files: 4,insertions: 76,deletions: 8}},{base_ref: refs/tracking/TSK-13DE1B22175A/1795005806185-start,started_at: 2026-11-18T12:43:27.095Z,end_ref: refs/tracking/TSK-13DE1B22175A/1795006055691-end,ended_at: 2026-11-18T12:47:35.681Z,summary: {files: 27,insertions: 1611,deletions: 523}}]}},archived_at: 2026-11-24T19:23:25.827Z}
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

- [x] Deliver web/mobile tree parity with a bottom level filter, zoom/pan/fit/reset controls, discoverable leadership navigation and reliable selected-node details; verify no invented cross-level edges.

## Comments

### 2026-11-18T12:05:29.512Z · PETER IRUNGU

Implemented generated-client reads with a strict named parsing boundary, backend-driven institution directory/detail and leadership graph, Markdown/GFM library, actual Constitution chapter/provision navigation and comparison options/ladder/table. Web typecheck and production build passed. Five parser regression tests passed. Live reads validated 114 institutions, three reference categories, six default tree nodes, 26 Constitution links, content catalogue and comparison ladder. Parent is performing browser screenshot QA. Development data and missing performance/legal text remain labelled; Acts without provision records are not linked to unrelated Constitution text.

### 2026-11-18T12:06:56.614Z · PETER IRUNGU

Browser QA by coordinating agent confirmed the 114-institution directory and IEBC institution-to-tree navigation with five appointed holders. Corrected the all-holders introductory text (it no longer describes an elected-only view) and increased tree connector contrast in dark mode. Node details use an explicit card button; branch expansion is a separate control. Follow-up web typecheck and all five Bun tests pass. Actual constitutional wording and child links are now served by the backend through content slugs. Interface localisation remains partial where API labels and existing phrase coverage are missing.

### 2026-11-18T12:08:11.100Z · PETER IRUNGU

A real browser click exposed encoded-slash legal slugs being encoded twice in Next route params. Added one route parsing boundary decode and a regression covering encoded, already decoded and malformed addresses. Web typecheck and six tests now pass; coordinating agent is rechecking the actual Chapter 1 link.

### 2026-11-18T12:10:46.341Z · PETER IRUNGU

Browser recheck confirmed encoded Chapter 1 renders and lists Articles 1, 2 and 3. Suppressed redundant legal-basis panels for legal provisions/instruments so the reader proceeds directly to child provisions. Added server-resolved person biography and place explanation sections to existing profiles after backend enabled UUID subject lookup. Final targeted typecheck and six tests pass; production build passed earlier, and final browser comparison QA remains coordinated by the parent.

### 2026-11-18T12:23:02.174Z · PETER IRUNGU

Resumed after live QA found comparison percentages multiplied by 100 twice. Added comparisonDifference formatter with documented API percentage semantics: 395.2 remains +395.2%, and 15.7 remains +15.7%. Zero baseline now has its own undefined-relative-percent state, separate from missing data. Added regressions for positive, negative, zero, missing and zero-baseline results; eight web tests and typecheck pass. Place search clears chosen results to avoid persistent dropdown clutter. Final production build is running with parent coordination.

### 2026-11-18T12:23:16.826Z · PETER IRUNGU

Final production build passed with comparison fixes included. Audited the other percentage-change screen: statistics change is a fraction by backend contract, so its existing fraction formatter is correct and remains unchanged. git diff --check is clean. No further web edits are active; parent can restart development serving and perform final visual recheck.

### 2026-11-18T12:47:31.874Z · PETER IRUNGU

Implemented requested web/mobile leadership parity: bottom selected-level filter removes unrelated nodes and cross-level edges without invented connections; initial level follows the selected place or first populated API scope. Added bounded zoom in/out, fit/reset, drag-scroll panning with pointer cleanup and keyboard pan/zoom controls. Selected details scroll into view and keep actual profile routes. Leadership is now directly discoverable in desktop navigation. Added /explore feature hub, /profile browser-local preferences/saved-region shortcuts, and five-destination mobile-browser navigation with a stationary decorated trophy. Shared errors offer stable retry and optional technical details. Eleven tests cover response semantics, percentage scale, scope filtering/default and server-rendered graph controls. Latest web visual QA unavailable because browser tool is unavailable; do not equate these tests with screenshots.
