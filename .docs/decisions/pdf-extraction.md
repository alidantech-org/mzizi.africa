---
{id: DEC-PDF-EXTRACTION,name: Decision - PDF extraction libraries and OCR stance,type: decision,tags: [data-engine,extraction,legacy]}
---

# Decision: PDF extraction libraries and OCR stance

Date: 2026-11-02. Experiment on four real public PDFs, each downloaded once by hand: two IEBC party-list files (10 and 81 pages), the Parliament "Budget Explainer" (39 pages, tables) and the Parliament "Mwananchi Guide to the Budget Statement" (18 pages, fully scanned). The files are not stored in the repository.

| Library | Result on the samples | Licence | Decision |
| --- | --- | --- | --- |
| pypdfium2 | text for all text-layer pages in 0.06 to 0.35 s per file; detects image-only pages | BSD / Apache | **keep**: text, page count, scan detection |
| pdfplumber (pdfminer) | same text; finds real ruled tables (the budget explainer yielded 22 tables: MDA recurrent, development and total in Kshs millions; county allocations); 10 to 50 times slower on text | MIT | **keep for tables only**, and only when the `tables` profile asks |
| PyMuPDF | same text, fastest, has table finding | **AGPL-3.0** (commercial licence needed otherwise) | **drop** for licence reasons |
| camelot, tabula, pytesseract (legacy requirements) | not run: they need Ghostscript, Java and Tesseract system packages that are not installed | | **undecided**; revisit with OCR |

Findings: the guide PDF has no text layer on any page, so the extractor reports `ocr_required` per page and returns a failed or partial result instead of an empty success. Table cells come back with merged-cell artefacts: the unit row is separate from the header and data columns are offset from header columns (for example `386,510` sits one column to the right of its `Recurrent` header). The extractor therefore drops only wholly empty columns and keeps rows in order; column alignment, unit and scale detection belong to the mapping step of the finance wave and must be checked per document.

The legacy `pdf_extractor` modules were not run (they are tied to the old API and its dependencies); the library choices above replace them, and the quality scorer and NLP modules are classification concerns for the intelligence layer. OCR stays out of v1: it needs a licence-checked engine, system packages and an explicit flag in the result, so scanned documents are reported, not silently skipped.
