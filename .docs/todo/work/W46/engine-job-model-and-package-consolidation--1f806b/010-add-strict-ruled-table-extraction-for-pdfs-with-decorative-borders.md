---
{id: TSK-88BA5C45888A,name: Add strict ruled-table extraction for PDFs with decorative borders,type: task,status: archived,priority: medium,created_at: 2026-11-15T07:42:54.880Z,updated_at: 2026-11-15T07:44:27.438Z,order: 10240,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T07:42:57.322Z},{from: in-progress,to: completed,at: 2026-11-15T07:44:26.416Z},{from: completed,to: archived,at: 2026-11-15T07:44:27.438Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-88BA5C45888A/1794728577340-start,started_at: 2026-11-15T07:42:58.168Z,end_ref: refs/tracking/TSK-88BA5C45888A/1794728666418-end,ended_at: 2026-11-15T07:44:26.416Z,summary: {files: 8,insertions: 43,deletions: 3}}]}}}
---

# Add strict ruled-table extraction for PDFs with decorative borders

## Goal

Allow a researcher to extract clean structured tables from a PDF whose decorative rectangles interfere with Mzizi's default table detector. Make the corrected extraction available through the existing Mzizi Markdown CLI and capability while preserving the default detector for documents that use rectangle edges as real cell borders.

## Context

The saved IEBC constituency office directory produced valid CSV syntax with six to nine columns where the printed tables show four. The structured output already contains the wrong cells, so repairing CSV serialization would leave the underlying problem in place. The extractor uses pdfplumber for table detection. Its strict line strategy ignores rectangle edges. This can be useful for ruled tables with decorative backgrounds, but it can omit actual boundaries in other PDFs. Use a source-neutral opt-in profile setting and keep the extracted record separate from any later source-specific normalization or database import.

## Acceptance checklist

- [x] Add an opt-in setting to the Markdown extraction capability and CLI and document the setting's effect.
- [x] Verify on a test PDF that decorative rectangle edges do not split a genuine cell with the setting enabled.
- [x] Re-extract the saved IEBC directory with the setting, check the four-column result, and report any remaining limits on using the rows as records.

## Comments

### 2026-11-15T07:44:25.756Z · PETER IRUNGU

Verified with the saved IEBC directory. The strict mode preserves 47 tables and produces consistent four-column headers, compared with the original six to nine columns. The 293 rows still need source-specific reconciliation against constituencies, including office-only rows. All 37 extraction tests pass, targeted Ruff checks pass and extraction package mypy passes. The root check reported formatting and structure failures in files outside this change.
