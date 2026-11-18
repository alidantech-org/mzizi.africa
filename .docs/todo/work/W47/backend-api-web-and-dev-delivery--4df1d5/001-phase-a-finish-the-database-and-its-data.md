---
{id: TSK-8D39DE723E29,name: "Phase A: finish the database and its data",type: task,status: completed,priority: medium,created_at: 2026-11-18T22:29:03.112Z,updated_at: 2026-11-18T22:38:45.448Z,order: 1024,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-18T22:38:43.798Z},{from: in-progress,to: completed,at: 2026-11-18T22:38:45.448Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-8D39DE723E29/1795041523810-start,started_at: 2026-11-18T22:38:44.814Z,end_ref: refs/tracking/TSK-8D39DE723E29/1795041525450-end,ended_at: 2026-11-18T22:38:45.449Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Phase A: finish the database and its data

## Goal

Finish the schema work and fill the mzizi_ux database with real seed, proposed seed and invented test data for every table the redesign added, so every later phase has data to read. It follows the delivery plan backend-web-dev-delivery-plan and the decisions recorded with it, and it runs autonomously, ending at its gates with a commit and a push.

## Context

Read the delivery plan, the design documents in .docs/design, the feature register and the Dryv plan note. The Dryv repository holds uncommitted owner changes that are never committed or reverted. Seed additions follow the seed rules and invented data is tagged dev.

## Acceptance checklist

- [x] Remove contents.slug and generate slug registry rows for every routable subject, with history rows and the county-rooted paths.
- [x] Seed metric definitions, copy keys in English and Swahili, geography levels, display hints and country context rows.
- [x] Add dev data for events, schedules, seasons, facilities, polling stations and polls, obligations and reports, coverage, and community tables.
- [x] Seed validators pass, the engine loads the seed, row counts are reported and dryv:database:verify passes.
