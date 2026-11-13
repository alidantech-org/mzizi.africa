"""What a caller asks of structured extraction."""

from __future__ import annotations

from enum import StrEnum

from mzizi_extraction.core import Frozen, Limits


class OcrMode(StrEnum):
    AUTO = "auto"  # OCR only pages with no usable text layer
    OFF = "off"
    FORCE = "force"  # OCR every page


class DocumentProfile(Frozen):
    ocr: OcrMode = OcrMode.AUTO
    languages: str = "eng"
    tables: bool = True
    figures: bool = True
    page_renders: bool = False
    #: Caption words in the document's language ("Figure", "Table", ...). Supplied by the caller; empty means the
    #: caption is found by position and style alone.
    caption_labels: tuple[str, ...] = ()
    limits: Limits = Limits()
