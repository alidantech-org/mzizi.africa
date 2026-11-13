"""PDF extractor: text layer, optional OCR for scanned pages and optional tables, with honest diagnostics."""

from __future__ import annotations

import pypdfium2 as pdfium

from ..core import (
    Code,
    Diagnostic,
    ExtractionProfile,
    Locator,
    Output,
    SegmentKind,
    Status,
    error,
    failed,
    info,
    warning,
)
from .scanned import read_scanned
from .tables import read_tables
from .text import read_text_layer

PDF_MAGIC = b"%PDF"


def _unreadable(problem: pdfium.PdfiumError) -> Output:
    return failed(error(Code.UNREADABLE_PDF, f"{str(problem)[:200]} (encrypted or damaged files are not opened)"))


def extract_pdf(data: bytes, profile: ExtractionProfile | None = None) -> Output:
    profile = profile or ExtractionProfile()
    limits = profile.limits
    if len(data) > limits.max_bytes:
        return failed(error(Code.TOO_LARGE, f"{len(data)} bytes exceeds the {limits.max_bytes} byte limit"))
    if not data.startswith(PDF_MAGIC):
        return failed(error(Code.NOT_PDF, "the file does not start with %PDF"))
    try:
        document = pdfium.PdfDocument(data)
    except pdfium.PdfiumError as problem:
        return _unreadable(problem)
    pages = len(document)
    diagnostics: list[Diagnostic] = [info(Code.PAGES, f"{pages} pages")]
    if pages > limits.max_pages:
        diagnostics.append(error(Code.TOO_MANY_PAGES, f"{pages} pages exceeds the limit of {limits.max_pages}"))
        return Output(status=Status.FAILED, diagnostics=tuple(diagnostics))

    segments, scanned = read_text_layer(document, limits.min_text_chars)
    if scanned and profile.ocr:
        ocr_segments, ocr_diagnostics, scanned = read_scanned(document, scanned, profile)
        segments.extend(ocr_segments)
        diagnostics.extend(ocr_diagnostics)
    for number in scanned:
        message = f"page {number} has images and no text layer; OCR is not performed"
        diagnostics.append(warning(Code.OCR_REQUIRED, message, Locator(page=number)))

    if profile.tables:
        table_segments, table_diagnostics = read_tables(data, pages, profile)
        segments.extend(table_segments)
        diagnostics.extend(table_diagnostics)

    text_pages = sum(1 for s in segments if s.kind is SegmentKind.TEXT)
    diagnostics.append(info(Code.TEXT_PAGES, f"{text_pages} pages with a text layer, {len(scanned)} scanned"))
    if not segments:
        return Output(status=Status.FAILED, diagnostics=tuple(diagnostics))
    status = Status.PARTIAL if scanned else Status.SUCCEEDED
    return Output(status=status, segments=tuple(segments), diagnostics=tuple(diagnostics))
