---
{id: TSK-1715145DF579,name: "Working extraction end to end: site, PDF and OCR into the real database models",type: task,status: in-progress,priority: medium,created_at: 2026-11-02T10:21:59.801Z,updated_at: 2026-11-02T15:55:24.207Z,due_at: 2026-11-16,order: 39936,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T10:59:51.532Z},{from: in-progress,to: blocked,at: 2026-11-02T15:27:12.341Z},{from: blocked,to: in-progress,at: 2026-11-02T15:55:24.207Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-1715145DF579/1793617191533-start,started_at: 2026-11-02T10:59:51.940Z,end_ref: refs/tracking/TSK-1715145DF579/1793633232343-end,ended_at: 2026-11-02T15:27:12.341Z,summary: {files: 92,insertions: 2950,deletions: 1653}},{base_ref: refs/tracking/TSK-1715145DF579/1793634924217-start,started_at: 2026-11-02T15:55:24.800Z}]}}}
---

# Working extraction end to end: site, PDF and OCR into the real database models

## Goal
Make site extraction, PDF extraction and OCR work on real inputs and land as candidates that promote into the actual canonical tables.

## Context
The user asked (2026-11-02) that from now on site extraction, PDF extraction and any needed OCR must work, and that data can be recorded in the actual db models. Today: the structure runner works against mocked and saved pages; the PDF extractor reads text layers and ruled tables and reports scanned pages as ocr_required; OCR is not implemented. The user chose Tesseract via system packages (English and Swahili) and said they would provide a monitored contact for live runs; both were still pending when this task was written (sudo needs a password; the contact value did not arrive). Mappings from PDF tables and text to real targets (statistical, finance, legal, electoral) must handle column offsets, units and scale explicitly. Read .docs/handoffs/data-engine-handoff-2.md first (it holds the full state, decisions, commands and traps), then .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md. Work only on develop in the main checkout, record progress in this file and tick items with task check.

## Acceptance checklist
- [x] Tesseract installed (user runs the dnf command) and an OCR extractor that rasterises scanned pages with pypdfium2, runs tesseract with language packs, records engine, version, language and per-page confidence, and flags OCR text as lower confidence.
- [ ] PDF table mapping that realigns merged-cell offsets, reads units and scale rows, and is tested on the saved Parliament budget tables.
- [x] First real PDF import end to end: extraction, candidates, validation, review in the admin, promotion into the canonical tables.
- [x] Live site extraction for one approved site (after the user provides MZIZI_USER_AGENT and a human approves an assessment): robots respected, rate limited, candidates staged.
- [x] Tests for OCR with a generated scanned PDF, and for every failure mode (missing language pack, unreadable image).
- [x] Update DATA_ENGINE_STATUS_AND_GAPS.md and the decision records.

Update (session 3): OCR works (`extractors/ocr.py`, `ocr` profile on the pdf extractor, English and Swahili packs installed; tested on a generated scanned page with both languages and on a missing engine). `tables.py` realigns offset columns and reads currency and scale; `imports/budget_table.py` with `mappings/budget/*` stages fiscal year and units, then budgets (after those are promoted), and a generated PDF reaches `finance.budgets` through validation, a recorded decision, application and promotion (`tests/test_budget_table.py`). Fixed a validation bug that checked `finance` unit references against `geography.units`. Not done, so items 2 to 5 stay unticked: no real Parliament PDF is stored in the repository (the earlier files were downloaded once by hand), so the table mapping is proven on a generated fixture only; the end-to-end import was reviewed by SQL-inserted decisions rather than in the admin; no live site extraction (the legal gate and the dossier at research stage correctly forbid it, and no assessment has been approved); unreadable-image and missing-language-pack failure tests are partial.

## Update 2 November 2026 (later)

Added tests for a missing language pack and an unreadable blank scan (data engine tier B: 12 pass). Not done and not doable by an agent: the real Parliament PDF (none stored, fetching is a live request), the first real import reviewed in the workbench, and live site extraction. All three wait on a named human approving an assessment and the Kenya dossier reaching pilot.

## Update 2 November 2026 (evening): policy change and the first real import

DEC-AUTO-APPROVAL removed the human-only approval rule. `auto-assess` approved ke/parliament under the `.go.ke` rule, `advance-dossier` moved the Kenya dossier to pilot, and `fetch` retrieved four pages and the National Treasury Budget Summary FY 2026/27 PDF from www.parliament.go.ke through the gate. The PDF is a scan; `import-budget-summary` staged Table 3 only after the sums added up under OCR, and the agent account (`review-run`, `apply-review`, `promote`) put the fiscal year, five units and five budgets in the canonical tables. The decisions were made by the agent account through the engine commands, not clicked in the workbench. Still open: the generic table realignment is proven on generated PDFs and this one scanned table only, not the many ruled Parliament tables.
