"""Exercise competing PDF table layouts against known synthetic rows."""

from pdfmaker import make_pdf
from pytest import MonkeyPatch

from mzizi_extraction import DocumentProfile, OcrMode, extract_pdf_document
from mzizi_extraction.document.lines import Word
from mzizi_extraction.document.models import TableBlock
from mzizi_extraction.document.table_models import ColumnType, ReviewReason, TableColumn, TableSchema, TableStrategy
from mzizi_extraction.document.table_quality import geometry

ROWS = (
    ("Office Location", "Distance"),
    ("Community Centre", "10 metres"),
    ("Station Hall", "20 metres"),
    ("Library Room", "30 metres"),
    ("County Office", "40 metres"),
)
SCHEMA = TableSchema(
    columns=(
        TableColumn(name="Office Location", required=True),
        TableColumn(name="Distance", type=ColumnType.QUANTITY, units=("metres",)),
    )
)


def test_mixed_ruled_pdf_selects_a_strategy_per_table() -> None:
    decorated = {
        "text": [
            (x, 480 - i * 20, value) for i, row in enumerate(ROWS) for x, value in zip((77, 210), row, strict=True)
        ],
        "grid": (72, 390, 2, 5, 130, 20),
        "draw": ["115 390 25 100 re S"],
    }
    rectangular = {
        "text": [
            (x, 300 - i * 20, value) for i, row in enumerate(ROWS) for x, value in zip((77, 210), row, strict=True)
        ],
        "draw": [f"{x} {y} 130 20 re S" for x in (72, 202) for y in range(210, 310, 20)],
    }
    pdf = make_pdf(
        [
            {
                "text": decorated["text"] + rectangular["text"],
                "grid": decorated["grid"],
                "draw": decorated["draw"] + rectangular["draw"],
            }
        ]
    )
    result = extract_pdf_document(pdf, DocumentProfile(ocr=OcrMode.OFF, table_schema=SCHEMA, figures=False))
    assert [block.rows for block in result.pages[0].blocks if isinstance(block, TableBlock)] == [ROWS, ROWS]
    assert result.table_review is not None
    assert [item.selected for item in result.table_review.tables] == [TableStrategy.STRICT, TableStrategy.RULES]
    assert [item.table for item in result.table_review.tables] == [1, 2]


def test_borderless_table_aligns_words_and_without_schema_is_flagged() -> None:
    text = [(x, 480 - i * 20, value) for i, row in enumerate(ROWS) for x, value in zip((77, 210), row, strict=True)]
    pdf = make_pdf([{"text": text}])
    result = extract_pdf_document(pdf, DocumentProfile(ocr=OcrMode.OFF, auto_tables=True, figures=False))
    table_rows = [block.rows for block in result.pages[0].blocks if isinstance(block, TableBlock)]
    assert table_rows == [ROWS]
    assert result.table_review is not None
    (decision,) = result.table_review.tables
    assert decision.selected is TableStrategy.TEXT
    assert decision.review_required and ReviewReason.TEXT_WITHOUT_SCHEMA in decision.reasons
    assert decision.candidates[0].rows == ROWS


def test_schema_flags_an_invalid_value_but_preserves_optional_blanks() -> None:
    rows = (*ROWS[:2], ("Station Hall", ""), ("Library Room", "later"), ROWS[-1])
    pdf = make_pdf(
        [
            {
                "text": [
                    (x, 480 - i * 20, value)
                    for i, row in enumerate(rows)
                    for x, value in zip((77, 210), row, strict=True)
                    if value
                ],
                "grid": (72, 390, 2, 5, 130, 20),
            }
        ]
    )
    result = extract_pdf_document(pdf, DocumentProfile(ocr=OcrMode.OFF, table_schema=SCHEMA, figures=False))
    assert result.table_review is not None
    (decision,) = result.table_review.tables
    assert decision.review_required and ReviewReason.SCHEMA in decision.reasons
    assert len(decision.candidates) >= 2
    for candidate in decision.candidates[:2]:
        assert candidate.metrics.invalid_values == 1
        assert candidate.metrics.missing_required == 0
        assert candidate.metrics.columns[1].invalid_rows == (4,)
        assert candidate.metrics.columns[1].filled_rows == 3
        assert candidate.rows == rows


def test_geometry_distinguishes_split_words_and_duplicate_cell_assignments() -> None:
    word = Word(text="Office", x0=2, top=2, x1=8, bottom=8, size=6)
    bounds = (0.0, 0.0, 10.0, 10.0)
    split = (((0.0, 0.0, 5.0, 10.0), (5.0, 0.0, 10.0, 10.0)),)
    overlapping = (((0.0, 0.0, 7.0, 10.0), (3.0, 0.0, 10.0, 10.0)),)
    assert geometry(bounds, split, [word]) == (1.0, 1.0, 0.0)
    assert geometry(bounds, overlapping, [word]) == (1.0, 1.0, 1.0)


def test_forced_ocr_retains_colored_grid_values_with_one_raster(monkeypatch: MonkeyPatch) -> None:
    import shutil

    import pytest

    if shutil.which("tesseract") is None:
        pytest.skip("requires Tesseract")
    from pypdfium2 import PdfBitmap, PdfPage

    render = PdfPage.render
    rendered: list[float] = []

    def counted_render(page: PdfPage, *, scale: float) -> PdfBitmap:
        rendered.append(scale)
        return render(page, scale=scale)

    monkeypatch.setattr(PdfPage, "render", counted_render)
    operations = ["1 0.1 0.1 rg 222 500 150 90 re f", "0 0 0 rg"]
    operations += [f"{72 + column * 150} 500 0.5 120 re f" for column in range(4)]
    operations += [f"72 {500 + row * 30} 450 0.5 re f" for row in range(5)]
    rows = (("Rank", "Risk", "Value"), ("1", "Alpha", "29.7"), ("2", "Beta", "5.3"), ("3", "Gamma", "-28.8"))
    text = [
        (84 + column * 150, 600 - row * 30, value, "F1", 12)
        for row, cells in enumerate(rows)
        for column, value in enumerate(cells)
    ]
    operations += [f"BT /{font} {size} Tf {x} {y} Td ({value}) Tj ET" for x, y, value, font, size in text]
    result = extract_pdf_document(
        make_pdf([{"draw": operations}]),
        DocumentProfile(ocr=OcrMode.FORCE, auto_tables=True, figures=False),
    )
    tables = [block for block in result.pages[0].blocks if isinstance(block, TableBlock)]
    assert len(tables) == 1 and tables[0].rows == rows
    assert result.table_review is not None
    (decision,) = result.table_review.tables
    assert decision.selected is TableStrategy.OCR_GRID
    assert decision.review_required and ReviewReason.OCR_TEXT in decision.reasons
    assert len(rendered) == 1


def test_optional_ocr_table_failure_preserves_recognized_page_text(monkeypatch: MonkeyPatch) -> None:
    import shutil

    import pytest

    if shutil.which("tesseract") is None:
        pytest.skip("requires Tesseract")

    from pdfplumber.page import Page
    from PIL import Image

    from mzizi_extraction.document.ocr_tables import OcrTableScan

    def unavailable(
        page: Page,
        number: int,
        schema: TableSchema | None,
        image: Image.Image,
        languages: str,
    ) -> OcrTableScan:
        raise ValueError("table detector unavailable")

    monkeypatch.setattr("mzizi_extraction.document.pdf_scan.ocr_tables", unavailable)
    output = extract_pdf_document(
        make_pdf([{"text": [(72, 700, "Recognized page text remains available", "F1", 16)]}]),
        DocumentProfile(ocr=OcrMode.FORCE, figures=False),
    )
    from mzizi_extraction.core import Code
    from mzizi_extraction.document import render_markdown

    assert "Recognized page text remains available" in render_markdown(output.pages)
    assert any(diagnostic.code is Code.TABLE_EXTRACTION_FAILED for diagnostic in output.diagnostics)


def test_scoped_table_extraction_preserves_cells_and_source_page() -> None:
    text = [(x, 480 - i * 20, value) for i, row in enumerate(ROWS) for x, value in zip((77, 210), row, strict=True)]
    pdf = make_pdf([{"text": [(72, 700, "Cover")]}, {"text": text, "grid": (72, 390, 2, 5, 130, 20)}])
    result = extract_pdf_document(
        pdf, DocumentProfile(ocr=OcrMode.OFF, table_schema=SCHEMA, figures=False, first_page=2, last_page=2)
    )
    (page,) = result.pages
    (table,) = [block for block in page.blocks if isinstance(block, TableBlock)]
    assert page.number == table.page == 2
    assert table.rows == ROWS
    assert result.table_review is not None
    (decision,) = result.table_review.tables
    assert decision.page == 2
