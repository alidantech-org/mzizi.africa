"""Structured PDF extraction: headings, emphasis, lists, tables, figures, furniture, columns and automatic OCR."""

from __future__ import annotations

import io
import shutil

import pytest
from pdfmaker import make_pdf
from PIL import Image, ImageDraw, ImageFont

from mzizi_extraction import DocumentProfile, OcrMode, encode_document, extract_pdf_document
from mzizi_extraction.document import FigureBlock, Heading, ListItem, Paragraph, TableBlock

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


def test_strict_table_lines_keep_rectangles_from_splitting_cells() -> None:
    pdf = make_pdf(
        [
            {
                "text": [
                    (77, 325, "Office Location"),
                    (180, 325, "Distance"),
                    (77, 305, "Community Centre"),
                    (180, 305, "10 metres"),
                ],
                "grid": (72, 300, 2, 2, 100, 20),
                "draw": ["110 300 30 40 re S"],
            }
        ]
    )
    expected = (("Office Location", "Distance"), ("Community Centre", "10 metres"))
    default = extract_pdf_document(pdf, DocumentProfile(ocr=OcrMode.OFF))
    strict = extract_pdf_document(pdf, DocumentProfile(ocr=OcrMode.OFF, strict_table_lines=True))
    assert [block.rows for block in default.pages[0].blocks if isinstance(block, TableBlock)] != [expected]
    assert [block.rows for block in strict.pages[0].blocks if isinstance(block, TableBlock)] == [expected]
    assert encode_document(strict).tables[0].csv.splitlines() == [
        "Office Location,Distance",
        "Community Centre,10 metres",
    ]


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


@pytest.mark.parametrize(("first", "last", "expected"), [(2, 3, [2, 3]), (3, None, [3, 4]), (None, 2, [1, 2])])
def test_pdf_page_range_preserves_source_numbers(first: int | None, last: int | None, expected: list[int]) -> None:
    from mzizi_extraction.core import Limits

    pdf = make_pdf([body_page(i) for i in range(1, 5)])
    output = extract(pdf, first_page=first, last_page=last, page_renders=True, limits=Limits(max_pages=2))
    assert [page.number for page in output.pages] == expected
    assert [asset.name for asset in output.assets if asset.name.startswith("pages/")] == [
        f"pages/page-{number}.png" for number in expected
    ]
    assert any(str(d.code) == "pdf_page_range" and "of 4" in d.message for d in output.diagnostics)


@pytest.mark.parametrize(
    ("first", "last", "code"), [(1, 3, "too_many_pages"), (3, 5, "pdf_page_range"), (5, None, "pdf_page_range")]
)
def test_pdf_page_range_rejects_overruns(first: int, last: int | None, code: str) -> None:
    from mzizi_extraction.core import Limits

    output = extract(
        make_pdf([body_page(i) for i in range(1, 5)]), first_page=first, last_page=last, limits=Limits(max_pages=2)
    )
    assert str(output.status) == "failed"
    assert output.pages == ()
    assert str(output.diagnostics[-1].code) == code


@pytest.mark.parametrize(("first", "last"), [(0, 1), (2, 1), (1, -1)])
def test_pdf_profile_rejects_invalid_bounds(first: int, last: int) -> None:
    from pydantic import ValidationError

    with pytest.raises(ValidationError):
        DocumentProfile(first_page=first, last_page=last)


def test_ocr_timeout_keeps_native_text_and_continues_to_next_page(monkeypatch: pytest.MonkeyPatch) -> None:
    from subprocess import TimeoutExpired

    from mzizi_extraction.document import pdf_backend, pdf_scan
    from mzizi_extraction.ocr.tesseract import OcrLine, OcrPage

    calls = 0

    def recognise(png: bytes, languages: str) -> OcrPage:
        nonlocal calls
        calls += 1
        if calls == 1:
            raise TimeoutExpired("tesseract", 120)
        return OcrPage(
            words=(),
            lines=(OcrLine(text="Next page OCR", block=1, x0=280, x1=500, top=270, bottom=320, confidence=0.9),),
        )

    monkeypatch.setattr(pdf_backend, "check", lambda languages: "test OCR")
    monkeypatch.setattr(pdf_scan, "recognise_page", recognise)
    output = extract_pdf_document(
        make_pdf([body_page(1), body_page(2)]), DocumentProfile(ocr=OcrMode.FORCE, figures=False, tables=False)
    )
    assert str(output.status) == "partial"
    assert [page.number for page in output.pages] == [1, 2]
    markdown = encode_document(output).markdown
    assert "Annual Report" in markdown
    assert "Next page OCR" in markdown
    assert any(str(d.code) == "ocr_failed" and "page 1" in d.message for d in output.diagnostics)


def test_native_text_document_does_not_start_ocr_or_open_raster_pages(monkeypatch: pytest.MonkeyPatch) -> None:
    from mzizi_extraction.document import pdf_backend

    def unexpected(*args: object) -> None:
        pytest.fail("native text extraction should not need an OCR probe or a PDFium page")

    monkeypatch.setattr(pdf_backend, "check", unexpected)
    monkeypatch.setattr(pdf_backend.pdfium.PdfDocument, "__getitem__", unexpected)
    pages = [{"text": body_page(number)["text"]} for number in (1, 2)]
    output = extract_pdf_document(make_pdf(pages))
    assert str(output.status) == "succeeded"
    assert [page.number for page in output.pages] == [1, 2]
    assert "Annual Report" in encode_document(output).markdown


def test_unavailable_ocr_is_checked_once_for_multiple_pages(monkeypatch: pytest.MonkeyPatch) -> None:
    from mzizi_extraction.document import pdf_backend
    from mzizi_extraction.ocr import OcrUnavailable

    probes = []

    def unavailable(languages: str) -> None:
        probes.append(languages)
        raise OcrUnavailable("test OCR unavailable")

    monkeypatch.setattr(pdf_backend, "check", unavailable)
    output = extract_pdf_document(
        make_pdf([body_page(1), body_page(2)]), DocumentProfile(ocr=OcrMode.FORCE, figures=False)
    )
    assert probes == ["eng"]
    codes = [str(item.code) for item in output.diagnostics]
    assert codes.count("ocr_engine_unavailable") == 1
    assert codes.count("ocr_required") == 2
    assert str(output.status) == "partial"
