---
{id: TSK-B3B5DF20AABE,name: Evaluate document and web extraction tools for Mzizi,type: task,status: archived,priority: medium,created_at: 2026-11-17T06:44:26.417Z,updated_at: 2026-11-17T06:46:01.267Z,order: 24576,extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-17T06:44:30.311Z},{from: in-progress,to: completed,at: 2026-11-17T06:46:00.292Z},{from: completed,to: archived,at: 2026-11-17T06:46:01.267Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-B3B5DF20AABE/1794897870314-start,started_at: 2026-11-17T06:44:30.977Z,end_ref: refs/tracking/TSK-B3B5DF20AABE/1794897960300-end,ended_at: 2026-11-17T06:46:00.293Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Evaluate document and web extraction tools for Mzizi

## Goal

Turn the supplied document intelligence proposal into decisions that can be tested against Mzizi's existing extraction and acquisition workflow. Explain capability boundaries and identify external tools that address observed gaps in layout, table fidelity, web record extraction and linking.

## Context

Mzizi has an EngineRuntime, source-neutral extraction types, a browser and crawler, and prior acquisition evaluations. The existing evidence lifecycle is the starting point. Compare upstream tools against this baseline and distinguish documented features from demonstrated performance on Mzizi sources. Prioritize cases available in the local corpus, including a difficult PDF and a real directory with repeated cards. The requested work is an evaluation. Keep implementation choices as proposals with measurable adoption criteria and use existing Task work to inform follow-ups.

## Acceptance checklist

- [x] Compare the pasted proposal with active code and recorded acquisition results.
- [x] Verify candidate tools against upstream documentation and explain their limitations for Mzizi's examples.
- [x] Recommend a bounded evaluation using existing artifacts, with metrics that reveal incorrect values, missing records and lost evidence.

## Comments

### 2026-11-17T06:45:57.757Z · PETER IRUNGU

The current pdfplumber/PDFium/Tesseract structured extractor returned 11 and 13 rows on Nutrition brief pages 2 and 4, and recovered the two saved numeric spot checks (29.7 and -28.8). The first page 4 row repeats the label across two cells in the output, which deserves source verification. Saved Nairobi Assembly roster coverage references 11 present HTML files and 125 cards. Compare optional Docling against current extraction on the same original pages; reserve PaddleOCR PP-StructureV3 for weak scans. Use the existing manifest item selector and bounded Playwright fallback for verified card extraction; investigate DOM-based item discovery as a selector suggestion. Candidate mapping should preserve raw text, source anchors, valid time and review state. Compare per-cell exactness, row coverage, reading order, anchor completeness, runtime, RAM and reviewer corrections. Upstream tools were researched; their relative performance on the corpus remains an experiment.

### 2026-11-17T06:46:15.416Z · PETER IRUNGU

Verified on this checkout: all 71 extraction package tests passed. The documented web replay command exits 3 because its scraping.replay operation is unregistered; the direct extraction package call produced the PDF baseline above. Root check exits 1 during format, typecheck and tests, including engine policy test collection. Task validation passed.
