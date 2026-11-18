---
{id: TSK-FD1D0A4A6B63,name: "Governance, institutions, content, legal basis and compare: data and API",type: task,status: archived,priority: medium,created_at: 2026-11-18T11:15:34.040Z,updated_at: 2026-11-18T12:47:49.573Z,order: 1024,extra: {status_history: [{from: planned,to: completed,at: 2026-11-18T11:15:44.952Z},{from: completed,to: in-progress,at: 2026-11-18T11:55:01.378Z},{from: in-progress,to: completed,at: 2026-11-18T12:24:40.240Z},{from: completed,to: archived,at: 2026-11-18T12:24:41.620Z},{from: archived,to: completed,at: 2026-11-18T12:44:58.889Z},{from: completed,to: in-progress,at: 2026-11-18T12:44:59.117Z},{from: in-progress,to: completed,at: 2026-11-18T12:47:48.523Z},{from: completed,to: archived,at: 2026-11-18T12:47:49.573Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-FD1D0A4A6B63/1795002901394-start,started_at: 2026-11-18T11:55:02.486Z,end_ref: refs/tracking/TSK-FD1D0A4A6B63/1795004680243-end,ended_at: 2026-11-18T12:24:40.240Z,summary: {files: 81,insertions: 6190,deletions: 585}},{base_ref: refs/tracking/TSK-FD1D0A4A6B63/1795005899119-start,started_at: 2026-11-18T12:44:59.759Z,end_ref: refs/tracking/TSK-FD1D0A4A6B63/1795006068525-end,ended_at: 2026-11-18T12:47:48.523Z,summary: {files: 26,insertions: 1385,deletions: 503}}]}}}
---

## Goal

Give the apps everything they need for a clear picture of how Kenya is governed: arms of government, every public body with what created it and who leads it, a leaders tree by how the seat is held, explanatory texts with resolved images, the legal basis of bodies, offices and places, and places to compare with. Nothing about the classification is hard-coded in the apps.

## Context

Dryv contracts gained `governance.institutions.arm_id` and `establishment_basis_id`, `reference.values.position`, `filesystem.contents` and `filesystem.content_tags`. The API gained nine operations (institutions, tabs, tree, content, legal basis, compare options, comparison). The dev seed models arms, ministries and state departments, commissions, courts, Parliament, county governments, the elected tree and nominated seats; people are invented and tagged `dev`. Design: `.docs/design/data/GOVERNANCE_AND_CONTENT.md`.

## Acceptance checklist

- [x] Reference schemes for arm, establishment basis, office tier (with parents), how a seat is held, leader tabs, level, relationship and mandate kind, content category and classification; ordered by `position`.
- [x] Bodies, ministries with Cabinet Secretaries and Principal Secretaries, courts, commissions, funds, county governments and the elected tree exist as rows with relationships, mandates and Constitution effects.
- [x] `filesystem.contents` holds markdown with front matter and `media:` references that the API resolves; texts exist for every body, arm, level, the Constitution and general topics, in English and some in Swahili.
- [x] The API serves the directory, a body, tabs, the tree, content, legal basis, compare options and a comparison; `/v1/locality/{featureId}` works without repeating the id.
- [x] Smoke checks and database-backed tests cover them; `bun run check` is green.

## Comments

### 2026-11-18T11:55:01.117Z · PETER IRUNGU

Owner approved continuation after interrupted transcript. Reopening backend verification to check live response edge cases, appointment filtering, comparison hierarchy and remaining KNBS acquisition evidence. Existing implementation and frontend work remain intact; no root seed additions or database rebuilds are included.

### 2026-11-18T12:08:11.888Z · PETER IRUNGU

Continuation verified: API typecheck clean; full database-backed API suite 5188 passed (54 existing todo); final modified insight/empty-state suites 22 passed including holder/place UUID legal effects and full stored institution codes. Generic positioned native-PDF reader and research HTTP regression suites 8 passed; strict mypy on five changed runtime/extraction modules clean; structure 1036 files conform; task validate passed. Live Constitution navigation exposes stored provisions through existing ContentPage, keeping development explainers labelled. KNBS real PDF resolves all47 counties and each male+female+intersex sum equals its total; aggregate47564296. Six footnotes remain explicit unresolved/invalid rows and target-required mappings remain open draft issues; nothing promoted or seeded. API restarted persistently through bun run dev api; HTTP200 confirmed. Metric localisation and reference-driven metric definitions remain incomplete, documented rather than hidden. Awaiting final root check from integration agent before final task completion.

### 2026-11-18T12:12:43.232Z · PETER IRUNGU

Final follow-up: Constitution article and preamble reads assemble stored descendant clauses inline with source provision/citation metadata; chapter navigation and child links stay available. Article1 wording assertions pass. Content-by-subject now resolves existing individual biographies and geography UUIDs; development Constitution overview overclaim softened in fixture and single current dev row. Final insight tests 22 passed; extraction plus engine research HTTP tests now 9 passed, including partial empty selections and non-PDF rejection. No canonical data, prepared seeds or SDK contracts changed in this continuation.

### 2026-11-18T12:24:39.925Z · PETER IRUNGU

Final resumed verification after root quality suite and engine restart: bun run dev:stack -- smoke passes every API/engine/proxy/frontend check. Real positioned KNBS proof rerun again resolves47 county codes with each sex total and aggregate47564296 verified. Baringo Central subcounty and constituency are distinct records; API returns correct kindCode and subcounty statistics has explicit missing-data gaps. Mobile agent notified to remove county fallback label. Existing limitation remains: leaderboard/computed metric contracts have no language input and no approved translated metric definitions exist; no translations, schema data or metric claims were invented. Root final quality suite confirmed green; backend continuation criteria met.

### 2026-11-18T12:45:00.003Z · PETER IRUNGU

Owner follow-up requests current-active governance only. Reopened to fix future-start and scheduled-end holder filtering, abolished office and dissolved body validity, and consistent directory/tree/tab count predicates. Exact start inclusive and end exclusive follow existing locality semantics; year-only periods retain current-year uncertainty. No schema or seed changes.

### 2026-11-18T12:47:04.689Z · PETER IRUNGU

Current-active follow-up implemented with one shared SQL predicate module. Exact start inclusive and exact end exclusive; future scheduled end remains current; exact dates override year fields; year-only current end remains uncertain/current until year closes. Applied to tree holders, institution directory/profile, tab counts, institution leader counts, performance cohorts and mandates; recursive links reject deleted relations and inactive bodies. Historical leaderProfile remains independent and unmodified. PostgreSQL boundary regression exercises12 date/deletion cases across holders/offices/institutions/mandates without writes. Final targeted3 suites23 tests passed; API typecheck clean; documentation updated. No schema, seeds, SDK or running-service commands changed.

## Continuation acceptance

- [x] Verify live governance, institution, content, legal and comparison reads against the development database after the interrupted work.
- [x] Cover absent and invalid categories, explicit institution category filters, and reference-driven comparison levels with regression checks.
- [x] Audit the real KNBS PDF extraction path without accepting the previous monkeypatched draft as end-to-end proof.
- [x] Record verification, update the owning guide and run document validation without weakening existing checks.

## Current-active follow-up

- [x] Current tree, institution directory, counts and performance cohorts share exact-date and year-bound active predicates.
- [x] PostgreSQL regressions cover future starts, future scheduled ends, ended today, year-only periods and soft deletes without mutating development data.
- [x] Historical individual profile reads remain accessible, documentation states unknown-date semantics and targeted API checks pass.
