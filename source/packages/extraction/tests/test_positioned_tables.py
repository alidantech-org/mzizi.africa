"""Operator-selected geometry reads real PDF bytes and retains their evidence rather than replacing extraction."""

from __future__ import annotations

import pytest
from pdfmaker import make_pdf
from pydantic import ValidationError

from mzizi_extraction.document.models import TableBlock
from mzizi_extraction.document.positioned_models import PositionedColumn, PositionedTable
from mzizi_extraction.document.positioned_tables import extract_positioned_tables


def selection() -> PositionedTable:
    return PositionedTable(
        page=1,
        bbox=(60.0, 80.0, 350.0, 150.0),
        label_left=65.0,
        label_right=80.0,
        columns=(
            PositionedColumn(name="Area", left=60.0, right=240.0, trim_characters=". "),
            PositionedColumn(name="People", left=240.0, right=350.0, remove_characters=" ,"),
        ),
    )


def test_reads_dot_leaders_and_split_numeric_glyphs_without_inventing_rows() -> None:
    source = make_pdf(
        [
            {
                "text": [
                    (72, 692, "North..........."),
                    (250, 692, "1 234,567"),
                    (95, 672, "A smaller area"),
                    (250, 672, "12"),
                ]
            }
        ]
    )
    document = extract_positioned_tables(source, (selection(),))
    table = document.pages[0].blocks[0]
    assert isinstance(table, TableBlock)
    assert table.rows == (("Area", "People"), ("North", "1234567"))
    assert table.page == 1 and table.bbox == selection().bbox
    assert document.diagnostics[0].code.value == "table_review"


def test_rejects_overlapping_columns_and_pages_outside_source() -> None:
    with pytest.raises(ValidationError, match="overlap"):
        PositionedTable(
            page=1,
            bbox=(0.0, 0.0, 300.0, 300.0),
            columns=(
                PositionedColumn(name="a", left=0.0, right=200.0),
                PositionedColumn(name="b", left=100.0, right=300.0),
            ),
        )
    with pytest.raises(ValueError, match="outside"):
        extract_positioned_tables(make_pdf([{}]), (selection().model_copy(update={"page": 2}),))


def test_selected_columns_are_accepted_from_json_request_geometry() -> None:
    selected = PositionedTable.model_validate_json(selection().model_dump_json())
    assert selected == selection()


def test_empty_selected_page_is_partial_and_non_pdf_is_rejected() -> None:
    selected = selection()
    source = make_pdf([{"text": [(72, 692, "North....."), (250, 692, "1")]}, {}])
    report = extract_positioned_tables(source, (selected, selected.model_copy(update={"page": 2})))
    assert report.status.value == "partial"
    with pytest.raises(ValueError, match="Expected native PDF"):
        extract_positioned_tables(b"not-a-pdf", (selected,))
