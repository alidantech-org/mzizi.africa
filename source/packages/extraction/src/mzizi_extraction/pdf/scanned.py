"""OCR of scanned pages. Returns the pages still unread; nothing is guessed when the engine is unavailable."""

from __future__ import annotations

import pypdfium2 as pdfium

from ..core import (
    Code,
    Diagnostic,
    ExtractionProfile,
    Locator,
    OcrMethod,
    Segment,
    SegmentKind,
    TextContent,
    error,
    info,
    warning,
)
from ..ocr import OcrUnavailable, check, recognise, render_png

OCR_CONFIDENCE_CAP = 0.9
LOW_CONFIDENCE = 0.6


def _failure(number: int, problem: Exception) -> Diagnostic:
    message = f"page {number}: {type(problem).__name__}: {str(problem)[:150]}"
    return warning(Code.OCR_FAILED, message, Locator(page=number))


def read_scanned(
    document: pdfium.PdfDocument, scanned: list[int], profile: ExtractionProfile
) -> tuple[list[Segment], list[Diagnostic], list[int]]:
    """OCR segments, diagnostics and the pages that remain unread."""
    languages = profile.languages
    try:
        engine = check(languages)
    except OcrUnavailable as problem:
        return [], [error(Code.OCR_ENGINE_UNAVAILABLE, str(problem))], scanned
    method = OcrMethod(engine="tesseract", version=engine, languages=languages)
    segments: list[Segment] = []
    diagnostics: list[Diagnostic] = []
    unread: list[int] = []
    for number in scanned:
        locator = Locator(page=number)
        try:
            result = recognise(render_png(document[number - 1]), languages)
        except Exception as problem:  # OCR is best effort per page; the page is reported as unread
            diagnostics.append(_failure(number, problem))
            unread.append(number)
            continue
        if len(result.text.strip()) < profile.limits.min_text_chars:
            diagnostics.append(warning(Code.OCR_NO_TEXT, f"page {number}: OCR found no readable text", locator))
            unread.append(number)
            continue
        content = TextContent(text=result.text, ocr=method, mean_confidence=round(result.confidence, 3))
        confidence = round(min(result.confidence, OCR_CONFIDENCE_CAP), 3)
        segments.append(
            Segment(
                key=f"page-{number}",
                kind=SegmentKind.TEXT,
                locator=Locator(page=number, ocr=True),
                content=content,
                confidence=confidence,
            )
        )
        if result.confidence < LOW_CONFIDENCE:
            message = f"page {number}: mean OCR confidence {result.confidence:.2f}"
            diagnostics.append(warning(Code.OCR_LOW_CONFIDENCE, message, locator))
    read = len(scanned) - len(unread)
    diagnostics.append(info(Code.OCR, f"{read} of {len(scanned)} scanned pages read with {engine} ({languages})"))
    return segments, diagnostics, unread
