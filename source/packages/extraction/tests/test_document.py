"""Structured PDF extraction: headings, emphasis, lists, tables, figures, furniture, columns and automatic OCR."""

from __future__ import annotations

import io
import shutil

import pytest
from pdfmaker import make_pdf
from PIL import Image, ImageDraw, ImageFont

from mzizi_extraction import DocumentProfile, OcrMode, encode_document, extract_pdf_document
from mzizi_extraction.document import FigureBlock, Heading, ListItem, Paragraph

BOLD, REGULAR, ITALIC = "F2", "F1", "F3"


def body_page(n: int) -> dict:
    return {
        "text": [
            (72, 760, "Running header", REGULAR, 9),
            (72, 40, f"Page {n}", REGULAR, 9),
            (72, 700, "Annual Report", BOLD, 24),
            (72, 660, "Background", BOLD, 16),
            (72, 640, "This is the first line of a paragraph that", REGULAR, 11),
            (72, 627, "continues here with a bold word", REGULAR, 11),
            (72, 600, "- first point", REGULAR, 11),
            (72, 586, "- second point", REGULAR, 11),
            (72, 560, "Important note", BOLD, 11),
            (72, 520, "Figure 1: a caption", ITALIC, 10),
        ],
        "grid": (72, 300, 2, 2, 100, 20),
    }


def extract(pdf: bytes, **options):
    return extract_pdf_document(pdf, DocumentProfile(ocr=OcrMode.OFF, **options))


def test_headings_paragraphs_lists_and_bold_are_recovered() -> None:
    output = extract(make_pdf([body_page(i) for i in range(1, 5)]))
    blocks = output.pages[0].blocks
    headings = [b for b in blocks if isinstance(b, Heading)]
    assert [h.level for h in headings][:2] == [1, 2]
    assert "".join(s.text for s in headings[0].spans) == "Annual Report"
    paragraph = next(b for b in blocks if isinstance(b, Paragraph))
    assert "first line of a paragraph that continues here" in "".join(s.text for s in paragraph.spans)
    assert [b for b in blocks if isinstance(b, ListItem)] and len([b for b in blocks if isinstance(b, ListItem)]) == 2


def test_repeating_headers_and_page_numbers_are_dropped() -> None:
    markdown = encode_document(extract(make_pdf([body_page(i) for i in range(1, 5)]))).markdown
    assert "Running header" not in markdown
    assert "Page 3" not in markdown


def test_tables_become_markdown_and_csv_with_a_caption() -> None:
    page = body_page(1)
    page["text"] += [(80, 335, "Name"), (180, 335, "Value"), (80, 315, "A"), (180, 315, "1")]
    wire = encode_document(extract(make_pdf([page])))
    assert wire.tables and wire.tables[0].csv.splitlines()[0] == "Name,Value"
    assert "| Name | Value |" in wire.markdown


def test_vector_diagrams_are_saved_as_images_with_their_labels() -> None:
    draw = [f"{100 + 60 * i} 400 55 40 re S" for i in range(5)] + ["100 445 m 400 445 l S", "100 447 m 400 470 l S"]
    page = {"text": [(72, 700, "Overview", BOLD, 18), (110, 415, "Node")], "draw": draw}
    output = extract(make_pdf([page]))
    figures = [b for b in output.pages[0].blocks if isinstance(b, FigureBlock)]
    assert figures and figures[0].figure_kind == "diagram"
    assert output.assets and output.assets[0].data.startswith(b"\x89PNG")
    assert "Node" in figures[0].alt


def test_ocr_off_reports_pages_that_need_it_instead_of_guessing() -> None:
    output = extract(make_pdf([{"image": True}]))
    assert output.status.value in {"failed", "partial"}


@pytest.mark.skipif(shutil.which("tesseract") is None, reason="needs Tesseract")
def test_scanned_page_is_read_automatically_and_keeps_its_heading() -> None:
    image = Image.new("L", (1275, 1650), 255)
    draw = ImageDraw.Draw(image)
    big = ImageFont.load_default(size=90)
    small = ImageFont.load_default(size=36)
    draw.text((100, 120), "Budget Review", font=big, fill=0)
    for i in range(6):
        draw.text((100, 330 + i * 60), "Spending was approved by the county assembly", font=small, fill=0)
    buffer = io.BytesIO()
    image.save(buffer, format="PDF")
    output = extract_pdf_document(buffer.getvalue(), DocumentProfile())
    page = output.pages[0]
    assert page.ocr and page.ocr_confidence
    assert any(isinstance(b, Heading) and "Budget" in b.spans[0].text for b in page.blocks)
    assert any(isinstance(b, Paragraph) and "county assembly" in b.spans[0].text for b in page.blocks)
