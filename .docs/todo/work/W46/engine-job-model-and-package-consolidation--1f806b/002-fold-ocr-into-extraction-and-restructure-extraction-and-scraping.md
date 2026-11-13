---
{id: TSK-3B0BF09037A7,name: Fold ocr into extraction and restructure extraction and scraping,type: task,status: in-progress,priority: medium,created_at: 2026-11-13T09:53:30.075Z,updated_at: 2026-11-13T10:12:27.693Z,order: 2048,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-13T09:56:27.509Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-3B0BF09037A7/1794563787510-start,started_at: 2026-11-13T09:56:27.976Z}]}}}
---

# Fold ocr into extraction and restructure extraction and scraping into small modules

## Goal

`mzizi-ocr` is about 110 lines and its only consumer is `mzizi-extraction`. Fold it into `extraction/ocr/`. Then restructure `extraction` and `scraping` so package roots hold only `__init__.py` plus subfolders and no module is much over 300 lines, with tests kept green.

## Context

Both libraries are liked by the user and pass their tests (extraction 10, scraping 3, ocr 1). Packages must stay pure: no database, no direct network or object-store access. A missing Tesseract engine must still raise `OcrUnavailable`, never an empty page. See `ENGINE_JOB_MODEL.md` principles and the package table.

## Acceptance checklist

- [x] OCR code and its test live under `extraction/ocr/`; the `mzizi-ocr` project, its workspace entry and docs are removed; behaviour on a missing engine is unchanged and tested.
- [x] `extraction` is organised into subfolders by responsibility (for example `pdf/`, `geo/`, `tabular/`, `ocr/`) with no module over about 300 lines.
- [x] `scraping` is organised into subfolders (selectors, fields, transforms, links) with no module over about 300 lines, and has more than the current 3 tests covering each primitive.
- [x] `uv run pytest source/packages/extraction source/packages/scraping` passes and READMEs and the package map are updated.

## Comments

### 2026-11-13T10:31:51.751Z · PETER IRUNGU

ocr folded into extraction/ocr; extraction and scraping rewritten to frozen pydantic contracts, one parsing boundary each, regex confined to scraping/text/patterns.py (interim home until the patterns package, TSK-D2BC6AE00DFF). Largest module 136 lines (extraction), tests 11 + 9+3.
