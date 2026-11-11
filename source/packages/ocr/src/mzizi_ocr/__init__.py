"""OCR through the system Tesseract. A missing engine or language pack is a clear error, never an empty page."""

from . import ocr
from .ocr import DEFAULT_LANGUAGES, OcrUnavailable, check, recognise, render_png, version

__all__ = ["DEFAULT_LANGUAGES", "OcrUnavailable", "check", "ocr", "recognise", "render_png", "version"]
__version__ = "0.1.0"
