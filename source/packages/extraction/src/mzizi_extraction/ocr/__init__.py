"""OCR through the system Tesseract. A missing engine or language pack is a clear error, never an empty page."""

from mzizi_extraction.ocr.tesseract import (
    DEFAULT_LANGUAGES,
    RENDER_SCALE,
    OcrLine,
    OcrUnavailable,
    Recognition,
    check,
    recognise,
    recognise_lines,
    render_png,
    version,
)

__all__ = [
    "DEFAULT_LANGUAGES",
    "RENDER_SCALE",
    "OcrLine",
    "OcrUnavailable",
    "Recognition",
    "check",
    "recognise",
    "recognise_lines",
    "render_png",
    "version",
]
