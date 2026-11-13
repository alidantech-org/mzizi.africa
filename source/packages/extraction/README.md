# mzizi-extraction

PDF, GeoJSON, CSV and JSON extraction with honest diagnostics.

Extractors never touch a database and never repair silently.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/extraction`.

## Layout

`core/` result types, `pdf/` text and tables, `geo/` GeoJSON, `tabular/` CSV and JSON, `ocr/` Tesseract OCR (a missing engine raises `OcrUnavailable`, never an empty page). OCR was folded in from the former `mzizi-ocr` package.

## Structured documents (`document/`)

`extract_pdf_document(bytes, DocumentProfile)` turns a PDF into a typed `DocumentOutput`: pages of headings (by font size, or bold standalone lines), paragraphs with bold/italic spans, list items (typed or drawn bullets), tables (pdfplumber), figures (embedded images and vector diagrams cropped to PNG, with in-figure text as alt text), captions found by position and style (plus `caption_labels` from the profile), two-column reading order, and repeating headers/footers removed. Pages with no usable or garbled text are OCR'd automatically with Tesseract (`OcrMode.AUTO`; `OFF`, `FORCE`), keeping line-height-based headings and a confidence per page. `render_markdown`, `table_csv` and `encode_document` (wire form with base64 assets) produce the outputs. The model is source-neutral so an HTML backend can fill it later. Known limits: no layout AI, so complex magazines, rotated text and tables without ruling lines are weaker; drawn text in images is OCR'd only on whole scanned pages.
