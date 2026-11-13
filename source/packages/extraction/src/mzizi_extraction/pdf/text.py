"""Text-layer reading: one `text` segment per page that has enough text, and the pages that look scanned."""

from __future__ import annotations

import pypdfium2 as pdfium

from ..core import Locator, Segment, SegmentKind, TextContent


def read_text_layer(document: pdfium.PdfDocument, min_chars: int) -> tuple[list[Segment], list[int]]:
    """Text segments for pages with a text layer, and the 1-based numbers of pages with images but no text."""
    segments: list[Segment] = []
    scanned: list[int] = []
    for index in range(len(document)):
        number = index + 1
        page = document[index]
        text = page.get_textpage().get_text_range()
        if len(text.strip()) < min_chars:
            if list(page.get_objects(filter=[pdfium.raw.FPDF_PAGEOBJ_IMAGE])):
                scanned.append(number)
            continue
        segments.append(
            Segment(
                key=f"page-{number}",
                kind=SegmentKind.TEXT,
                locator=Locator(page=number),
                content=TextContent(text=text),
                confidence=1.0,
            )
        )
    return segments, scanned
