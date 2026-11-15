---
{id: TSK-02EEFBC5F08B,name: Verify coverage across Markdown-first acquisition,type: task,status: archived,priority: medium,created_at: 2026-11-15T12:54:06.253Z,updated_at: 2026-11-15T13:28:59.889Z,order: 18432,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-15T12:54:44.983Z},{from: in-progress,to: completed,at: 2026-11-15T13:28:57.244Z},{from: completed,to: archived,at: 2026-11-15T13:28:59.889Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-02EEFBC5F08B/1794747284985-start,started_at: 2026-11-15T12:54:45.826Z,end_ref: refs/tracking/TSK-02EEFBC5F08B/1794749337253-end,ended_at: 2026-11-15T13:28:57.244Z,summary: {files: 46,insertions: 2347,deletions: 462}}]}}}
---

# Verify coverage across Markdown-first acquisition

## Goal

Make it possible to compare what Mzizi captured with an expected listing, identify lost table cells and media references, and choose attachments before storing their bytes.

## Context

Prior research runs saved the Nairobi roster, Papers Laid and the IEBC DataTables listing. The first sample lost inline portraits when CSS capture was off, and a merged HTML table exposed shifted columns. The browser can inventory computed media on one page and the sections capability reports some continuation outcomes. Expand those mechanisms through the normal crawler and preserve evidence with the run. Keep the source selection and project-specific rules in local manifests or replay inputs. Retain policy checks, byte limits, and existing downloader entry points. Replay saved HTML without network access and report missing or excess evidence so a later run can be compared.

## Acceptance checklist

- [x] Replay saved listing captures using typed expected counts, links and cells.
- [x] Reconstruct merged and grouped table cells and retain structured evidence with Markdown.
- [x] Capture browser media and scoped traversal evidence across successive listing views.
- [x] Produce a contextual attachment plan with explicit candidate and byte budgets before invoking the downloader.
- [x] Verify Nairobi and IEBC cases, exercise regressions with local tests, and document supported scope.

## Comments

### 2026-11-15T13:28:55.802Z · PETER IRUNGU

Implemented offline HTML and PDF replay, linked media inventories and bounded lazy scans, structured HTML grids, manifest-based browser fallback, traversal evidence, and budgeted attachment selection. The 24-view HTML replay passed with the Nairobi roster, Papers Laid and IEBC captures. Disabling CSS images returned exit code 1 and exposed the missing portraits. The live IEBC crawl recorded 105 new table rows and a disabled continuation over 11 views. Live pre-download selection stored 735,355 bytes for one reviewed useful PDF under a 1 MiB budget. The fresh Nairobi browser run captured five pages and encountered timeouts; the saved 11-page roster passed offline. The nutrition PDF replay detected two missing real tables and a spurious table. The focused suite passed 123 tests plus the references-only follow-up, with lint, type and manifest validation passing in scope. The repository-wide suite also reported existing structure and unrelated test failures.
