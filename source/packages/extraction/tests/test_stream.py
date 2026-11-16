"""Streaming input boundaries and source coordinates."""

from decimal import Decimal
from pathlib import Path

import pytest
from openpyxl import Workbook
from pdfmaker import make_pdf

from mzizi_extraction import DocumentProfile, OcrMode, encode_document, extract_pdf_document
from mzizi_extraction.tabular.stream import pdf_batches, stream_records


@pytest.mark.parametrize(
    ("text", "array"),
    [
        ('[{"n":1.0000000000000000001},true,null]', None),
        ('{"before":[0],"rows":[{"n":1.0000000000000000001},true,null],"after":[2]}', "rows"),
    ],
)
def test_stream_json_array_keeps_decimal_precision_and_validates_trailer(
    tmp_path: Path, text: str, array: str | None
) -> None:
    path = tmp_path / "records.json"
    path.write_text(text)
    records = list(stream_records(path, "json", array))
    assert [row.number for row in records] == [1, 2, 3]
    assert records[0].value == {"n": Decimal("1.0000000000000000001")}
    assert "1.0000000000000000001" in records[0].json_line()
    assert [row.value for row in records[1:]] == [True, None]
    path.write_text(text + " broken")
    import ijson

    with pytest.raises(ijson.JSONError):
        list(stream_records(path, "json", array))


def test_stream_rejects_missing_named_array(tmp_path: Path) -> None:
    path = tmp_path / "missing.json"
    path.write_text('{"rows":{}}')
    with pytest.raises(ValueError, match="was not found"):
        list(stream_records(path, "json", "rows"))


def test_stream_jsonl_keeps_physical_line_positions(tmp_path: Path) -> None:
    path = tmp_path / "rows.jsonl"
    path.write_text('{"name":"one"}\n\n{"name":"three"}\n')
    assert [row.number for row in stream_records(path, "jsonl")] == [1, 3]


def test_stream_xlsx_tracks_each_sheet_and_keeps_formula_text(tmp_path: Path) -> None:
    path = tmp_path / "book.xlsx"
    workbook = Workbook(write_only=True)
    sheet = workbook.create_sheet("Rows")
    sheet.append(["head", 4])
    sheet.append([None, "=B1*2"])
    workbook.create_sheet("Other").append(["other"])
    workbook.save(path)
    rows = list(stream_records(path, "xlsx"))
    assert [(row.sheet, row.number, row.value) for row in rows] == [
        ("Rows", 1, ("head", 4)),
        ("Rows", 2, (None, "=B1*2")),
        ("Other", 1, ("other",)),
    ]


def test_copied_pdf_batches_keep_source_page_numbers_and_cells(tmp_path: Path) -> None:
    path = tmp_path / "sample.pdf"
    pages = [{"text": [(80, 700, f"Content for source page {number}", "F1", 12)]} for number in range(1, 6)]
    pages[2]["text"] += [(80, 335, "Name"), (180, 335, "Value"), (80, 315, "Area"), (180, 315, "11")]
    pages[2]["grid"] = (72, 300, 2, 2, 100, 20)
    path.write_bytes(make_pdf(pages))
    profile = DocumentProfile(ocr=OcrMode.OFF, page_renders=True, figures=False)
    batches = list(pdf_batches(path, 2, 2, 4))
    assert [(batch.first, batch.last, batch.source_pages) for batch in batches] == [(2, 3, 5), (4, 4, 5)]
    first, last = [encode_document(extract_pdf_document(b.data, profile, page_offset=b.first - 1)) for b in batches]
    assert "<!-- page 2 -->" in first.markdown and "<!-- page 3 -->" in first.markdown
    assert "Content for source page 4" in last.markdown
    assert first.tables[0].path == "tables/page-3-table-1.csv"
    assert first.tables[0].csv.splitlines() == ["Name,Value", "Area,11"]
    assert [asset.path for asset in first.assets] == ["pages/page-2.png", "pages/page-3.png"]
    with pytest.raises(ValueError, match="outside"):
        list(pdf_batches(path, 1, 5, 6))
