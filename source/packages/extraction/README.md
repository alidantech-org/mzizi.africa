# mzizi-extraction

PDF, GeoJSON, CSV and JSON extraction with honest diagnostics.

Extractors never touch a database and never repair silently.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/extraction`.

## Layout

`core/` result types, `pdf/` text and tables, `geo/` GeoJSON, `tabular/` CSV and JSON, `ocr/` Tesseract OCR (a missing engine raises `OcrUnavailable`, never an empty page). OCR was folded in from the former `mzizi-ocr` package.

## Structured documents (`document/`)

`extract_pdf_document(bytes, DocumentProfile)` turns a PDF into a typed `DocumentOutput`: pages of headings (by font size, or bold standalone lines), paragraphs with bold/italic spans, list items (typed or drawn bullets), tables (pdfplumber), figures (embedded images and vector diagrams cropped to PNG, with in-figure text as alt text), captions found by position and style (plus `caption_labels` from the profile), two-column reading order, and repeating headers/footers removed. Pages with no usable or garbled text, or sparse native text amid dense vector lettering, are OCR'd automatically with Tesseract (`OcrMode.AUTO`; `OFF`, `FORCE`), keeping line-height-based headings and a confidence per page. `render_markdown`, `table_csv` and `encode_document` (wire form with base64 assets) produce the outputs. The model is source-neutral so an HTML backend can fill it later. Known limits: no layout AI, so complex magazines, rotated text and tables without ruling lines are weaker; OCR reading order and lettering recognition remain subject to review.

Set `DocumentProfile(first_page=101, last_page=200)` to extract an inclusive range while keeping source page numbers in structure and asset paths. The document page limit applies to the selected range. Typography and running headers are inferred within that range. Tesseract is checked on the first page that needs OCR. Page OCR and ruled-grid OCR reuse one raster. If OCR fails on a page, extraction retains any usable native text, continues with the remaining pages and reports partial coverage when it recovers content.

Set `DocumentProfile(strict_table_lines=True)` when decorative rectangles split cells in a ruled PDF table. This detects borders drawn as lines and leaves rectangle-only table grids to the default detector.

Set `DocumentProfile(auto_tables=True)` to compare ruled and strict-line detectors per table region. The comparison retries weak candidates and searches unoccupied horizontal bands with text alignment. It evaluates header shape, row consistency, sparse columns, value types and how well the grid fits the PDF's words. The scores are heuristics. Close scores, overlapping regions, possible missing rows and type or field mismatches are review findings. Candidate rows are included when review is required. On OCR pages, narrow rectangle borders can establish a grid for cropped cell OCR. Colored backgrounds and borders are removed from the recognition image. Every OCR grid table is marked for review. Native-text comparison remains unavailable on those pages, and unsupported scanned or borderless grids can remain in page text.

Pass a `TableSchema` as `table_schema` to enable comparison with expected columns. The typed `TableSchema` (and the `--table-schema` JSON file of the developer CLI, which has no published schema) supports an ordered list of names, aliases, optional required fields and value types. Empty optional values remain empty. Names must be unique. Dates use ISO format, numbers use decimal text and quantity columns declare their allowed unit suffixes. Multiple header rows can be checked by joining their text in each column for comparison. Extracted cell values and headers are preserved.

### HTML pages

Pass `include_css_images=True` to include HTTP(S) image references from inline `background` and `background-image` declarations. The converter resolves relative references against the page URL. It does not load stylesheets, execute JavaScript, or fetch the images.

`extract_html_document(html, base_url, boilerplate)` fills the same `Page` model from a web page: headings, paragraphs, lists, tables (cells keep their inline Markdown, so links survive), figures and captions. Inline emphasis and links keep their spacing and destinations (`Read the **annual report** from [this page](https://example.org/report.pdf).`); `learn_boilerplate(pages)` finds headers, footers and navigation repeated across a site's pages so they are left out of each page's Markdown.

HTML document extraction preserves sibling body regions in malformed captures and excludes document-head metadata and comments. Image-only anchors retain their link destination alongside the image reference.

## Legislation (`legislation/`)

`parse_instrument` reads a constitution (chapters and articles with a margin column of headings). `parse_act(path, ActLayout)` reads an Act of Parliament into the same `Node` tree: parts, sections, subsections, paragraphs, sub-paragraphs, definitions (quoted terms in an interpretation section), schedules with numbered items, and the print's amendment annotations (`[Act No. 2 of 2022, s. 4.]`, kept on `Node.notes`). The publisher's running headers, where the body starts and how a section heading sits (`inline` or `bold-above`) are an `ActLayout` supplied by the caller, never code in this package. Markers are accepted only in the expected order (4, 4A, 4B, 5; (1), (1A), (2); (a), (b), (ha)), and the section numbers found are compared with the Act's own contents page (`ActReport.missing_from_body`, `not_in_contents`, `unplaced`). `legislation.citations.find_citations` finds citations as a reader does: `section 27(1)(c)`, lists (`sections 5, 7 and 12`, `Article 10, (a) and (b)`, `4(1)(a), (b) or (c)`), ranges (`sections 12 to 15`), the instrument cited (this one, the Constitution, or a named one such as `the Survey Act, Cap. 299`) and instruments named alone (`in accordance with the Constitution`), each with its relation (`in-accordance-with`, `subject-to`, `under`, `read-with`, `amends`, `as-defined-in`, `refers-to`). Mapping the tree to database rows is the caller's job. Known limits: text PDFs only (no OCR path yet); amendment Acts and subsidiary legislation are untested.

## Local streaming extraction

`mzizi_extraction.stream` provides source-located iterators over CSV, TSV, JSON arrays, JSON Lines and read-only XLSX worksheet rows. It also produces bounded derived page batches from a file-backed PDF. The engine owns artifact and journal writes through [`mzizi extract stream`](../../backend/engine/README.md#local-streaming-extraction). The record iterator keeps one logical record at a time. PDF batches hold the copied pages and their extraction in memory. XLSX readers also retain workbook-level metadata and shared strings.

### Operator-selected native PDF tables

`extract_positioned_tables(bytes, selections)` in `document/positioned_tables.py` reads native character geometry in caller-selected regions. `PositionedTable` and `PositionedColumn` define page, bounding box, ordered column coordinates, optional row-label indentation bounds, and explicit per-column character removal or trailing-leader trimming. These are caller data rather than publisher rules in the package. The result uses ordinary `DocumentOutput`/`TableBlock` contracts with page and region locators and a mandatory review diagnostic. Source bytes are unchanged. Columns cannot overlap or leave their region; regions cannot leave the source page. Native text is required; empty regions remain partial results and there is no OCR fallback in this explicit mode. The engine research table-draft endpoint accepts these selections as `positioned_tables` and preserves unresolved names and unmapped fields for review.
