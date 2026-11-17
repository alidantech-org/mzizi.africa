"""Decide whether a detected grid is really a table, and check that a table's numbers are coherent.

A table is addressed by row and column: each cell is a short, atomic value and the meaning is at the intersection.
Prose is narrative that merely lines up on the page. These checks separate them using evidence on the page, with
no knowledge of any publisher or language."""

from __future__ import annotations

from decimal import Decimal, InvalidOperation

from mzizi_extraction.document.table_models import TableRows

SENTENCE_WORDS = 8  # a cell this long is a sentence fragment, not a label or a value
MAX_SENTENCE_SHARE = 0.35
MIN_ROWS_FOR_STRUCTURE = 3
TOTAL_WORDS = ("total", "sum", "jumla")  # a caller-visible heuristic label; sums are only compared, never invented
TOLERANCE = Decimal("0.01")


def sentence_share(rows: TableRows) -> float:
    """Share of filled cells that read as running text."""
    cells = [cell for row in rows for cell in row if cell]
    if not cells:
        return 0.0
    sentences = sum(
        len(cell.split()) >= SENTENCE_WORDS or (cell.endswith(".") and len(cell.split()) >= 5) for cell in cells
    )
    return sentences / len(cells)


def column_fill_stability(rows: TableRows) -> float:
    """How alike the rows are in which columns they fill (1.0 means every row fills the same columns)."""
    patterns = [tuple(bool(cell) for cell in row) for row in rows]
    if not patterns:
        return 0.0
    common = max(set(patterns), key=patterns.count)
    return patterns.count(common) / len(patterns)


def looks_like_prose(rows: TableRows) -> bool:
    """Text alignment found columns in running text: long fragments and rows that fill different columns."""
    if len(rows) < MIN_ROWS_FOR_STRUCTURE:
        return False
    return sentence_share(rows) > MAX_SENTENCE_SHARE and column_fill_stability(rows) < 0.6


def _number(value: str) -> Decimal | None:
    cleaned = value.replace(",", "").replace(" ", "").strip()
    try:
        number = Decimal(cleaned)
    except InvalidOperation:
        return None
    return number if number.is_finite() else None


def totals_mismatch(rows: TableRows) -> bool:
    """True when a row labelled as a total disagrees with the sum of the numbers above it in some column."""
    for index, row in enumerate(rows):
        if index < 2 or not any(word in " ".join(row).casefold() for word in TOTAL_WORDS):
            continue
        for column in range(len(row)):
            total = _number(row[column])
            above = [_number(r[column]) for r in rows[1:index] if column < len(r) and r[column]]
            if total is None or len(above) < 2 or any(value is None for value in above):
                continue
            if abs(sum(v for v in above if v is not None) - total) > TOLERANCE:
                return True
    return False
