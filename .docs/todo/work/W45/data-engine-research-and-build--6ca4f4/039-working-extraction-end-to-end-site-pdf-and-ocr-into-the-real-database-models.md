---
{id: TSK-1715145DF579,name: "Working extraction end to end: site, PDF and OCR into the real database models",type: task,status: planned,priority: medium,created_at: 2026-11-02T10:21:59.801Z,updated_at: 2026-11-02T10:21:59.801Z,due_at: 2026-11-16,order: 39936}
---

# Working extraction end to end: site, PDF and OCR into the real database models

## Goal
Make site extraction, PDF extraction and OCR work on real inputs and land as candidates that promote into the actual canonical tables.

## Context
The user asked (2026-11-02) that from now on site extraction, PDF extraction and any needed OCR must work, and that data can be recorded in the actual db models. Today: the structure runner works against mocked and saved pages; the PDF extractor reads text layers and ruled tables and reports scanned pages as ocr_required; OCR is not implemented. The user chose Tesseract via system packages (English and Swahili) and said they would provide a monitored contact for live runs; both were still pending when this task was written (sudo needs a password; the contact value did not arrive). Mappings from PDF tables and text to real targets (statistical, finance, legal, electoral) must handle column offsets, units and scale explicitly. Read .docs/handoffs/data-engine-handoff-2.md first (it holds the full state, decisions, commands and traps), then .docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md. Work only on develop in the main checkout, record progress in this file and tick items with task check.

## Acceptance checklist
- [ ] Tesseract installed (user runs the dnf command) and an OCR extractor that rasterises scanned pages with pypdfium2, runs tesseract with language packs, records engine, version, language and per-page confidence, and flags OCR text as lower confidence.
- [ ] PDF table mapping that realigns merged-cell offsets, reads units and scale rows, and is tested on the saved Parliament budget tables.
- [ ] First real PDF import end to end: extraction, candidates, validation, review in the admin, promotion into the canonical tables.
- [ ] Live site extraction for one approved site (after the user provides MZIZI_USER_AGENT and a human approves an assessment): robots respected, rate limited, candidates staged.
- [ ] Tests for OCR with a generated scanned PDF, and for every failure mode (missing language pack, unreadable image).
- [ ] Update DATA_ENGINE_STATUS_AND_GAPS.md and the decision records.
