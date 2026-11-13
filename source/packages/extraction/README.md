# mzizi-extraction

PDF, GeoJSON, CSV and JSON extraction with honest diagnostics.

Extractors never touch a database and never repair silently.

See [../README.md](../README.md) for the package map and workspace commands. Tests: `uv run pytest source/packages/extraction`.

## Layout

`core/` result types, `pdf/` text and tables, `geo/` GeoJSON, `tabular/` CSV and JSON, `ocr/` Tesseract OCR (a missing engine raises `OcrUnavailable`, never an empty page). OCR was folded in from the former `mzizi-ocr` package.
