"""Table detection with pdfplumber. Cells keep their order and no value is merged or invented."""

from __future__ import annotations

import io

import pdfplumber

from mzizi_extraction.core import (
    Code,
    Diagnostic,
    ExtractionProfile,
    Locator,
    Segment,
    SegmentKind,
    TableContent,
    info,
    warning,
)

TABLE_CONFIDENCE = 0.7


def clean_table(rows: list[list[str | None]]) -> list[list[str]]:
    """Drops columns that are empty in every row and collapses whitespace; the raw cell text is otherwise unchanged.

    Split headers (a title row and a unit row) stay two rows.
    """
    normalised = [[" ".join(cell.split()) if isinstance(cell, str) else "" for cell in row] for row in rows if row]
    width = max((len(r) for r in normalised), default=0)
    padded = [r + [""] * (width - len(r)) for r in normalised]
    keep = [i for i in range(width) if any(r[i] for r in padded)]
    return [[r[i] for i in keep] for r in padded if any(r[i] for i in keep)]


def read_tables(data: bytes, pages: int, profile: ExtractionProfile) -> tuple[list[Segment], list[Diagnostic]]:
    segments: list[Segment] = []
    diagnostics: list[Diagnostic] = []
    try:
        with pdfplumber.open(io.BytesIO(data)) as plumber:
            for number, page in enumerate(plumber.pages[: profile.limits.table_page_limit], start=1):
                for index, table in enumerate(page.find_tables(), start=1):
                    rows = clean_table(table.extract())
                    if len(rows) < 2 or max(len(r) for r in rows) < 2:
                        continue  # one-cell "tables" are layout boxes, not data
                    bbox = tuple(round(v, 1) for v in table.bbox)
                    segments.append(
                        Segment(
                            key=f"page-{number}-table-{index}",
                            kind=SegmentKind.TABLE,
                            locator=Locator(page=number, table=index),
                            content=TableContent(
                                rows=tuple(tuple(r) for r in rows), bbox=(bbox[0], bbox[1], bbox[2], bbox[3])
                            ),
                            confidence=TABLE_CONFIDENCE,
                        )
                    )
    except Exception as problem:  # table detection is best effort; text is already extracted
        message = f"{type(problem).__name__}: {str(problem)[:200]}"
        diagnostics.append(warning(Code.TABLE_EXTRACTION_FAILED, message))
    if pages > profile.limits.table_page_limit:
        message = f"tables were read on the first {profile.limits.table_page_limit} of {pages} pages"
        diagnostics.append(warning(Code.TABLE_PAGE_LIMIT, message))
    message = f"{len(segments)} tables kept (empty columns dropped; split headers left as rows)"
    diagnostics.append(info(Code.TABLES, message))
    return segments, diagnostics
