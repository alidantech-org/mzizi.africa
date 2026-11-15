---
{id: TSK-1644B13C4835,name: Compare and review competing PDF table extractions,type: task,status: archived,priority: medium,created_at: 2026-11-15T07:55:45.894Z,updated_at: 2026-11-15T08:08:03.786Z,order: 11264,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T07:55:50.629Z},{from: in-progress,to: completed,at: 2026-11-15T08:08:01.389Z},{from: completed,to: archived,at: 2026-11-15T08:08:03.786Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-1644B13C4835/1794729350639-start,started_at: 2026-11-15T07:55:51.243Z,end_ref: refs/tracking/TSK-1644B13C4835/1794730081407-end,ended_at: 2026-11-15T08:08:01.390Z,summary: {files: 21,insertions: 833,deletions: 11}}]}}}
---

# Compare and review competing PDF table extractions

## Goal

Let users opt into comparing ruled and text-aligned table detections through the existing Mzizi Markdown extraction command. Prefer a table whose columns fit the source geometry and whose data matches known field expectations, and expose ambiguous differences before the results are used as database input.

## Context

The strict-line option fixed decorative rectangle interference on one IEBC directory, but other PDF tables use rectangle edges as real borders and a single document can mix layouts. Automatic selection must work at table-region level, use lightweight scoring against source word positions and column signals, and leave existing manually selected modes available. PDF content and source-specific field expectations are user-provided inputs. The tool will expose diagnostics and alternate rows so reviewers can compare a result to the original PDF.

## Acceptance checklist

- [x] Compare default and strict ruled-table modes and try text alignment for weak or borderless regions.
- [x] Report header quality, sparsity, type and geometry checks, and any schema mismatches with per-table provenance and alternatives for review.
- [x] Validate a documented optional schema through the CLI and keep existing commands usable.
- [x] Test decorative borders, real rectangular borders, borderless layouts and ambiguous alternatives, and replay the saved IEBC directory.

## Comments

### 2026-11-15T08:07:59.627Z · PETER IRUNGU

Implemented --auto-tables and --table-schema on extraction.markdown. Both test the two ruled strategies, with bounded text-alignment retries and table-review.json. Verified the manually labeled decorative, genuine-rectangle and borderless fixtures, optional blanks, invalid values and duplicate source-word geometry. Both saved IEBC replays reproduced all 47 manual strict CSVs byte-for-byte with 293 rows. Unconstrained auto flagged one close layout; the schema flagged 26 tables with 79 values outside the specified distance format. All 41 extraction tests and targeted Ruff and mypy checks pass. The wider check already reports the existing lint, type, structure and filesystem integration failures.
