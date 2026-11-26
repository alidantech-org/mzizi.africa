---
{id: TSK-C0CBBAE03B20,name: Rebuild seeds from patterns and make engine generation work,type: task,status: completed,priority: high,created_at: 2026-11-25T21:36:57.065Z,updated_at: 2026-11-25T23:13:25.226Z,order: 12288,depends_on: [TSK-8158061FE85F],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-25T23:12:20.145Z},{from: in-progress,to: completed,at: 2026-11-25T23:13:25.226Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C0CBBAE03B20/1795648340148-start,started_at: 2026-11-25T23:12:25.070Z,end_ref: refs/tracking/TSK-C0CBBAE03B20/1795648405230-end,ended_at: 2026-11-25T23:13:25.227Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Rebuild seeds from patterns and make engine generation work

## Goal
Rebuild the seed so Kenya's structure comes from patterns: countries and hierarchies, areas from the existing county, constituency, ward and sub-county data, then the county government, county assembly and ward MCA patterns, parliament, commissions, NG-CDF committees, premises, contact and domain slots, election cycles for 2013, 2017 and 2022 and the expected 2027 cycle with contest and holder slots. Seeding must still work normally, and the engine must be able to call the generate function and report the coverage views. Success is a seeded `mzizix` where a run of the generator creates the expected rows and a second run creates nothing.

## Context
Seed data lives only in the git-ignored `.dev/seed/` (DEC-SEED-OUTSIDE-GIT-20261125); never commit it. The pipeline map is in `.dev/research/research_notes/Seed and engine impact/map.md`. Placeholders are structure only: never people, never invented names. Evidence-only rows (results, candidates, figures) are never generated. Counts from the research stay parameters with a source and date: for example conflicting NG-CDF committee sizes and marginalised-seat counts are recorded, not resolved. Task TSK-67FD455410F2 is editing the loader; coordinate by reading its changes first.

## Acceptance checklist
- [x] Convert the existing geography and reference seed to the area table with feature, geometry slot and parent, preserving codes.
- [x] Write the Kenya patterns and templates (county government, assembly, ward MCA, parliament, commissions, NG-CDF, election cycle) as seed files.
- [x] Teach the engine a `template.generate` operation that calls the database function and a coverage-report operation, and keep existing seed commands working.
- [x] Replace the seeded positions and offices with generated ones and verify counts (for example 47 governor offices, 1,450 ward MCA offices).
- [x] Load the seed into `mzizix` with the documented recipe and run it twice to prove the generator is idempotent.
- [x] Record the row counts per table under Progress.

## Progress

2026-11-26. Done. Builder `.dev/seed/rebuild/patterns.py` (git-ignored; backups in `data/_before_patterns/`): 2,138 Kenya areas (47 electoral counties, 290 constituencies, 1,450 wards, 47 administrative counties, 304 sub-counties) and 52,542 for the other countries, 394 expected geometries, 7 positions (once per role), vocabulary additions, 4 patterns, 32 templates, 26 lines, 44 texts. The engine operations `template.generate` and `template.coverage` call the database function. Result after generation: 4 election cycles (2013, 2017, 2022 held; 2027 scheduled), 498 institutions, 1,928 offices (47 governors, 47 deputy governors, 47 senators, 47 woman representatives, 290 members of the National Assembly, 1,450 ward members), 7,712 terms and holder slots, 7,524 contests, 47 premises, 94 contact slots, 394 pending geometries. A second run creates nothing. The documented `load.py` was stale (missing base files, a repeated locale row); the incremental loader `batches.py` was used after clearing its ledger (old ledger saved in `data/_before_patterns/`). Another session (task TSK-67FD455410F2) also edits this seed workspace.
