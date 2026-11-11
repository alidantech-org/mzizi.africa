"""PDF extractor: text per page, tables, and an honest report of pages that need OCR.

Libraries (see DEC-PDF-EXTRACTION): pypdfium2 (BSD/Apache) for fast text and scan detection and
pdfplumber (MIT) for tables. PyMuPDF is faster but AGPL-licensed, so it is not used. OCR is not
performed unless the `ocr` profile is requested: a page with images and no text layer is then reported as
`ocr_required` and the result is partial, never silently empty. With `ocr`, scanned pages are read by the
system Tesseract (see ocr.py) and kept as lower-confidence text segments that say they are machine-read.
"""

from __future__ import annotations

import io
import json
import re
from typing import Any

import pdfplumber
import pypdfium2 as pdfium

from mzizi_ocr import ocr

from .result import Output

MAX_BYTES = 256 * 1024 * 1024
MAX_PAGES = 3000
TABLE_PAGE_LIMIT = 400
MIN_TEXT_CHARS = 20


def _diag(level: str, code: str, message: str, locator: dict | None = None) -> dict:
    out = {"level": level, "code": code, "message": message}
    if locator is not None:
        out["locator"] = json.dumps(locator, sort_keys=True)
    return out


def clean_table(rows: list[list]) -> list[list[str]]:
    """Drops columns that are empty in every row and collapses whitespace; the raw cell text is otherwise unchanged.

    Cells keep their order and no value is merged or invented: split headers (a title row and a unit row) stay two rows.
    """
    normalised = [
        [re.sub(r"\s+", " ", cell).strip() if isinstance(cell, str) else "" for cell in row] for row in rows if row
    ]
    width = max((len(r) for r in normalised), default=0)
    padded = [r + [""] * (width - len(r)) for r in normalised]
    keep = [i for i in range(width) if any(r[i] for r in padded)]
    return [[r[i] for i in keep] for r in padded if any(r[i] for i in keep)]


def _read_scanned(document: Any, scanned: list[int], segments: list[dict], diagnostics: list[dict]) -> list[int]:
    """OCRs scanned pages; returns the pages still unread (all of them when the engine is unavailable)."""
    languages = ocr.DEFAULT_LANGUAGES
    try:
        engine = ocr.check(languages)
    except ocr.OcrUnavailable as error:
        diagnostics.append(_diag("error", "ocr_engine_unavailable", str(error)))
        return scanned
    unread: list[int] = []
    for number in scanned:
        try:
            text, confidence = ocr.recognise(ocr.render_png(document[number - 1]), languages)
        except Exception as error:
            diagnostics.append(
                _diag(
                    "warning",
                    "ocr_failed",
                    f"page {number}: {type(error).__name__}: {str(error)[:150]}",
                    {"page": number},
                )
            )
            unread.append(number)
            continue
        if len(text.strip()) < MIN_TEXT_CHARS:
            diagnostics.append(
                _diag("warning", "ocr_no_text", f"page {number}: OCR found no readable text", {"page": number})
            )
            unread.append(number)
            continue
        method = {"engine": "tesseract", "version": engine, "languages": languages, "method": "ocr"}
        segments.append(
            {
                "key": f"page-{number}",
                "kind": "text",
                "locator": json.dumps({"page": number, "ocr": True}),
                "content": json.dumps(
                    {"text": text, "ocr": method, "meanConfidence": round(confidence, 3)}, ensure_ascii=False
                ),
                "confidence": round(min(confidence, 0.9), 3),
            }
        )
        if confidence < 0.6:
            diagnostics.append(
                _diag(
                    "warning",
                    "ocr_low_confidence",
                    f"page {number}: mean OCR confidence {confidence:.2f}",
                    {"page": number},
                )
            )
    diagnostics.append(
        _diag(
            "info",
            "ocr",
            f"{len(scanned) - len(unread)} of {len(scanned)} scanned pages read with {engine} ({languages})",
        )
    )
    return unread


def extract_pdf(data: bytes, profile: str | None = None) -> Output:
    if len(data) > MAX_BYTES:
        return Output(
            "failed", diagnostics=[_diag("error", "too_large", f"{len(data)} bytes exceeds the {MAX_BYTES} byte limit")]
        )
    if not data.startswith(b"%PDF"):
        return Output("failed", diagnostics=[_diag("error", "not_pdf", "the file does not start with %PDF")])
    try:
        document = pdfium.PdfDocument(data)
    except pdfium.PdfiumError as error:
        return Output(
            "failed",
            diagnostics=[
                _diag("error", "unreadable_pdf", f"{str(error)[:200]} (encrypted or damaged files are not opened)")
            ],
        )
    pages = len(document)
    diagnostics = [_diag("info", "pages", f"{pages} pages")]
    if pages > MAX_PAGES:
        return Output(
            "failed",
            diagnostics=[
                *diagnostics,
                _diag("error", "too_many_pages", f"{pages} pages exceeds the limit of {MAX_PAGES}"),
            ],
        )

    segments: list[dict] = []
    scanned: list[int] = []
    for number in range(pages):
        page = document[number]
        text = page.get_textpage().get_text_range()
        if len(text.strip()) < MIN_TEXT_CHARS:
            if list(page.get_objects(filter=[pdfium.raw.FPDF_PAGEOBJ_IMAGE])):
                scanned.append(number + 1)
            continue
        segments.append(
            {
                "key": f"page-{number + 1}",
                "kind": "text",
                "locator": json.dumps({"page": number + 1}),
                "content": json.dumps({"text": text}, ensure_ascii=False),
                "confidence": 1,
            }
        )
    if scanned and profile and "ocr" in profile:
        scanned = _read_scanned(document, scanned, segments, diagnostics)
    for number in scanned:
        diagnostics.append(
            _diag(
                "warning",
                "ocr_required",
                f"page {number} has images and no text layer; OCR is not performed",
                {"page": number},
            )
        )

    tables = 0
    if profile and "tables" in profile:
        try:
            with pdfplumber.open(io.BytesIO(data)) as plumber:
                for number, page in enumerate(plumber.pages[:TABLE_PAGE_LIMIT], start=1):
                    for index, table in enumerate(page.find_tables(), start=1):
                        rows = clean_table(table.extract())
                        if len(rows) < 2 or max(len(r) for r in rows) < 2:
                            continue  # one-cell "tables" are layout boxes, not data
                        tables += 1
                        segments.append(
                            {
                                "key": f"page-{number}-table-{index}",
                                "kind": "table",
                                "locator": json.dumps({"page": number, "table": index}),
                                "content": json.dumps(
                                    {"rows": rows, "bbox": [round(v, 1) for v in table.bbox]}, ensure_ascii=False
                                ),
                                "confidence": 0.7,
                            }
                        )
        except Exception as error:  # table detection is best effort; text is already extracted
            diagnostics.append(
                _diag("warning", "table_extraction_failed", f"{type(error).__name__}: {str(error)[:200]}")
            )
        if pages > TABLE_PAGE_LIMIT:
            diagnostics.append(
                _diag(
                    "warning", "table_page_limit", f"tables were read on the first {TABLE_PAGE_LIMIT} of {pages} pages"
                )
            )
        diagnostics.append(
            _diag("info", "tables", f"{tables} tables kept (empty columns dropped; split headers left as rows)")
        )

    text_pages = sum(1 for s in segments if s["kind"] == "text")
    diagnostics.append(_diag("info", "text_pages", f"{text_pages} pages with a text layer, {len(scanned)} scanned"))
    if not segments:
        return Output("failed", diagnostics=diagnostics)
    return Output("partial" if scanned else "succeeded", segments, diagnostics)
