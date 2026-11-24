---
{id: TSK-93B71EF8F52F,name: "Finish mobile governance, content, comparison and final UI corrections",type: task,status: completed,priority: medium,created_at: 2026-11-18T11:55:27.765Z,updated_at: 2026-11-18T12:49:32.442Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-18T11:55:35.762Z},{from: in-progress,to: completed,at: 2026-11-18T12:11:51.907Z},{from: completed,to: in-progress,at: 2026-11-18T12:23:03.671Z},{from: in-progress,to: completed,at: 2026-11-18T12:26:01.166Z},{from: completed,to: in-progress,at: 2026-11-18T12:29:41.479Z},{from: in-progress,to: completed,at: 2026-11-18T12:30:21.445Z},{from: completed,to: in-progress,at: 2026-11-18T12:43:30.780Z},{from: in-progress,to: completed,at: 2026-11-18T12:49:32.442Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-93B71EF8F52F/1795002935764-start,started_at: 2026-11-18T11:55:36.406Z,end_ref: refs/tracking/TSK-93B71EF8F52F/1795003911910-end,ended_at: 2026-11-18T12:11:51.908Z,summary: {files: 75,insertions: 5950,deletions: 555}},{base_ref: refs/tracking/TSK-93B71EF8F52F/1795004583674-start,started_at: 2026-11-18T12:23:04.473Z,end_ref: refs/tracking/TSK-93B71EF8F52F/1795004761168-end,ended_at: 2026-11-18T12:26:01.166Z,summary: {files: 13,insertions: 228,deletions: 48}},{base_ref: refs/tracking/TSK-93B71EF8F52F/1795004981482-start,started_at: 2026-11-18T12:29:42.323Z,end_ref: refs/tracking/TSK-93B71EF8F52F/1795005021447-end,ended_at: 2026-11-18T12:30:21.446Z,summary: {files: 4,insertions: 13,deletions: 3}},{base_ref: refs/tracking/TSK-93B71EF8F52F/1795005810782-start,started_at: 2026-11-18T12:43:31.306Z,end_ref: refs/tracking/TSK-93B71EF8F52F/1795006172451-end,ended_at: 2026-11-18T12:49:32.443Z,summary: {files: 30,insertions: 1707,deletions: 532}}]}},archived_at: 2026-11-24T19:23:25.827Z}
---

# Finish the mobile civic experience and final interface corrections

## Goal

Finish the Flutter work requested by the owner after the previous implementation stopped: the app must expose the backend governance, institution, explanatory content and comparison capabilities through a consistent mobile interface, and it must honour the final stationary trophy and Home header design. The result should let a citizen explore their region and understand the evidence and missing data without encountering placeholder destinations.

## Context

The existing app under source/apps/app already has five tabs, media and chart components, an Android splash and generated SDK operations. Its institution and Constitution routes still point to placeholders, its tree uses the older grouped leader endpoint, and its comparison page only manually compares three fixed figures. The previous task TSK-A7FBFA1B238D and backend task TSK-FD1D0A4A6B63 provide historical context, while the current owner transcript gives the final design. Work stays on develop and preserves the existing uncommitted implementation. Backend contracts remain owned by the backend agent, and installation and device screenshots are coordinated by the root agent.

## Acceptance checklist

- [x] Apply the final stationary decorated trophy in a real notched bottom bar and logo-left, region-right Home header.
- [x] Replace placeholder institution and Constitution routes with SDK-backed directories, details and formatted explanatory content, including legal basis and explicit evidence gaps.
- [x] Render backend-defined governance categories, institution switching, connected trees, level focus and honest performance states.
- [x] Implement suggested nearest and top comparisons, backend hierarchy selection and missing level states, without fixed metric definitions.
- [x] Provide layout-safe shimmer, error and empty states, and avoid opening rankings on an empty metric when data exists.
- [x] Run Flutter analysis and tests, document actual validation, and provide root agent with routes for phone screenshot verification.

## Navigation and focused graph follow-up

The owner reproduced a Navigator duplicate-page-key assertion after opening a leader from the tree. Custom fade pages must use the unique router page key for every stack entry, including repeated visits to the same leader. The node sheet must return the chosen destination before pushing it from the still-mounted parent screen. The level selector now belongs below the graph and changes visible content instead of dimming an otherwise overwhelming full graph. Filters must preserve only real backend edges, and an empty level must remain changeable rather than trapping navigation.

- [x] Give all custom route pages their router identity and reproduce tree-sheet-to-leader navigation plus repeated pushes in widget regression tests.
- [x] Move levels into horizontal bottom controls, remove inactive-level nodes, and preserve only actual visible relationships without synthetic parentage.
- [x] Add fit, reset and bounded zoom controls with usable pan/pinch interaction, then run analysis, tests and hand final source to root for fresh APK screenshots.

## Comments

### 2026-11-18T12:09:28.341Z · PETER IRUNGU

Implemented final stationary notched trophy/Home header, API-backed institution/content/Constitution routes, backend-driven connected graph and level focus, comparison hierarchy/nearest/top suggestions, formatted Markdown and legal links, profile legal references and speeches, screen-specific shimmer and safe errors. First validation passed Flutter analyze and 18 tests. Root agent owns installation and visual screenshots; final rebuild needed after camera/speech polish. Added source/apps/app/README.md with active behavior and limits.

### 2026-11-18T12:11:24.295Z · PETER IRUNGU

Final source validation: bun run typecheck --only app reports no issues and bun run test --only app passes 19 tests. Tests cover bounded graph relationships/cycles, nullable governance category, actual backend score parsing, missing comparison values, all shimmer layouts/reduced motion, narrow error retry, stationary notched trophy and existing tiles/saved strings. Root agent has route and rebuild instructions for device verification. API-owned metric text remains English where untranslated; no verified social post URLs were introduced; visual verification belongs to root continuation task.

### 2026-11-18T12:25:44.810Z · PETER IRUNGU

Resumed after user requested all agents finish. Mobile compare already calculates percentage once, now distinguishes zero baseline/recorded zeros from missing data. Fixed a real geographic classification defect: suffix county also matched sub-county; exact final code-segment matching repairs saved ranking scope on launch and Home names parent ranking context. Wider single-line tree rail and backend score explanation address phone QA. Fullscreen maps retain controls, gallery handles empty/out-of-range input, selected language reaches picker search, search uses shimmer/empty/retry states, incomplete date labels are safe, and statistics rows use actual recorded-series sparklines. Added comparison/gallery regressions; final checks pending.

### 2026-11-18T12:26:00.787Z · PETER IRUNGU

Follow-up final validation passed: Flutter analyze no issues and 22 Flutter tests pass, including zero-baseline/percentage-point regression and gallery safety. Task workspace validates. Source frozen and handed back to root for final APK build and screenshots; no device actions performed by this agent.

### 2026-11-18T12:30:16.407Z · PETER IRUNGU

Final phone screenshot exposed a factual presentation gap: sampled ranking values lacked a visible development notice. Added concise shared notice above Rankings tabs and at top of Home, translated into Swahili, preserving detailed provenance notices elsewhere. Source frozen again for root final APK rebuild.

### 2026-11-18T12:49:07.958Z · PETER IRUNGU

Reproduced the exact Navigator line4083 duplicate-key assertion with a tree node sheet opening a leader even after state.pageKey was added. Root cause also included leaving a buried ShellRoute then pushing back into that same shell. All product routes now share one shell, typed SelfFramedGoRoute metadata preserves pages with their own Scaffold, every custom fade page has router identity, and node sheets wait dismissal completion before navigation. Regression now covers actual canvas to sheet to View leader, same-leader repeated push, back and reopening. Levels moved to horizontal bottom controls; selected-level filtering preserves real edges only, default scope prefers selected place populated level, zoom/fit/reset added. First corrected topology run passed25 tests; final suite rerunning after typed metadata/default-scope additions.

### 2026-11-18T12:49:30.609Z · PETER IRUNGU

Final navigation/graph follow-up validation: bun run format --only app passed, bun run typecheck --only app no issues, bun run test --only app all26 pass. Exact reported duplicate-shell assertion reproduced before topology correction and now absent through tree node sheet→leader, repeated same destination, back and reopening. Regression uses actual AppShell and typed SelfFramedGoRoute metadata. Source frozen for root fresh APK installation and screenshots.
