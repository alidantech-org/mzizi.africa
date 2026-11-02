---
{id: TSK-7FEE00CCCDF3,name: "Tier B document extractors v1: HTML legal text and PDF text and tables",type: task,status: completed,priority: medium,created_at: 2026-11-02T09:55:57.899Z,updated_at: 2026-11-02T10:01:15.621Z,due_at: 2026-12-11,order: 24576,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-02T09:57:11.824Z},{from: in-progress,to: completed,at: 2026-11-02T10:01:15.621Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-7FEE00CCCDF3/1793613431825-start,started_at: 2026-11-02T09:57:12.214Z,end_ref: refs/tracking/TSK-7FEE00CCCDF3/1793613675623-end,ended_at: 2026-11-02T10:01:15.622Z,summary: {files: 7,insertions: 310,deletions: 2}}]}}}
---

# Tier B document extractors v1: HTML legal text and PDF text and tables

## Goal
Add the extractors that statutes, gazettes, budgets and results need, so Tier B sources can enter through the same job, result and candidate path as Tier A.

## Context
Only GeoJSON and World Bank JSON extractors exist. The legacy pdf_extractor (pdfplumber, PyMuPDF, camelot, tabula, pytesseract) was audited by reading only and judged a rewrite from parts; its stealth scraper code is dropped. Choose a PDF text and table approach after running candidates on real Kenyan PDFs saved from the pilot sources (IEBC party list PDFs, Parliament budget PDFs), keep page, table and cell locators, report scanned pages instead of guessing, and make OCR optional and explicitly flagged. HTML legal text extraction must preserve article and clause structure with pinpoint locators. Read .docs/docs/DATA_INTAKE_PLAN.md, .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md and .docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md first. Work only on develop, record progress in this file and tick items with task check.

## Acceptance checklist
- [x] Run candidate PDF libraries on real saved PDFs (four were used) and record keep, rewrite or drop with reasons in a decision record.
- [x] PDF text and table extractor producing ExtractionResult segments with page and cell locators and diagnostics for scanned or empty pages.
- [x] HTML legal text extractor keeping article, clause and heading structure.
- [x] OCR is not performed in v1: scanned pages are reported as ocr_required and the result is partial or failed.
- [x] Tests on small real excerpts; update the legacy inventory with the final disposition of pdf_extractor.

## Progress
Done: PDF extractor (pypdfium2 text and scan detection, pdfplumber tables on request, empty-column cleaning, page and table locators, honest handling of scanned and unreadable files), HTML legal extractor (heading path, article and clause locators), a real-sample comparison recorded in DEC-PDF-EXTRACTION, synthetic PDF test builder and 8 tests. Limits: tables keep merged-cell offsets (alignment is a mapping concern), OCR is not performed, camelot, tabula and tesseract were not evaluated (no system packages), the HTML extractor needs the real Kenya Law markup to be tuned, and heading-based article detection assumes "12. Title" numbering.
