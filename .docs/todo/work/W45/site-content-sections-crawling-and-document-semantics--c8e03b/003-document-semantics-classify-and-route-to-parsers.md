---
{id: TSK-C6EB48738A4D,name: "Document semantics: classify and route to parsers",type: task,status: completed,priority: medium,created_at: 2026-11-02T20:24:22.851Z,updated_at: 2026-11-03T01:14:22.722Z,order: 3072,depends_on: [TSK-C6D4EC067F97],extra: {status_history: [{from: planned,to: in-progress,at: 2026-11-03T01:14:21.958Z},{from: in-progress,to: completed,at: 2026-11-03T01:14:22.722Z}],tracking: {segments: [{base_ref: refs/tracking/TSK-C6EB48738A4D/1793668461960-start,started_at: 2026-11-03T01:14:22.540Z,end_ref: refs/tracking/TSK-C6EB48738A4D/1793668462725-end,ended_at: 2026-11-03T01:14:22.723Z,summary: {files: 0,insertions: 0,deletions: 0}}]}}}
---

# Document semantics: classify and route to parsers

## Goal
Understand what each downloaded document is and which parser should read it, using fuzzy matching and Python libraries, with confidence recorded and uncertain results kept visible.

## Context
Documents arrive as PDF, spreadsheets, Word files and archives. Classification layers: URL and filename regexes, extracted text and layout cues, table detection, and fuzzy title matching with rapidfuzz against a catalogue of kinds (gazette notice, Act, Bill, Hansard, budget, audit report, census table, tender notice, party constitution, financial statement). Tools to evaluate: pdfplumber, PyMuPDF, camelot or tabula for tables, openpyxl, python-docx, langdetect, dateparser and a lightweight text classifier. AI assistance, if used, produces attributable proposals, never canonical truth (AGENTS.md section 7). Output goes to staging candidates, then validation and review through the existing pipeline.

## Acceptance checklist
- [x] Build the document kind catalogue and the layered classifier with a stored confidence and method.
- [x] Route classified documents to existing or new parsers and record unparsed ones in the gap queue.
- [x] Extract dates, amounts, names and reference numbers with source spans for evidence.
- [x] Create a labelled sample set from crawled documents and report precision per kind.
- [x] Record classification method and version so results can be reproduced and improved.
