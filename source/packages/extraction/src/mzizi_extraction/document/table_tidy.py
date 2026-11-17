"""Tidy detected table rows: merge split headers, repair spanned cells and drop empty rows and columns.

No cell text is invented or reworded; the function only moves, joins and removes blank structure."""

from __future__ import annotations

import re

from mzizi_extraction.document.table_models import TableRows

MAX_HEADER_ROWS = 3
INDEX_CELL = re.compile(r"\d{1,4}[.)]?")
HEADER_FILL_SHARE = 0.75


def _squash(rows: list[list[str]]) -> list[list[str]]:
    width = max((len(row) for row in rows), default=0)
    padded = [[" ".join(cell.split()) for cell in row] + [""] * (width - len(row)) for row in rows]
    padded = [row for row in padded if any(row)]
    keep = [i for i in range(width) if any(row[i] for row in padded)]
    return [[row[i] for i in keep] for row in padded]


def _numbering(row: list[str]) -> bool:
    """A row of column numbers such as 1, 2, 3 under or above the real headings."""
    filled = [cell for cell in row if cell]
    return (
        len(filled) >= 3
        and all(cell.isdigit() for cell in filled)
        and [int(c) for c in filled] == sorted(int(c) for c in filled)
    )


def _indexed(row: list[str]) -> bool:
    return bool(row) and bool(INDEX_CELL.fullmatch(row[0].strip()))


def _despan(row: list[str]) -> list[str]:
    """A heading spanning columns is repeated by some detectors; keep the first copy and blank the repeats."""
    out = list(row)
    for i in range(1, len(out)):
        if out[i] and out[i] == out[i - 1]:
            out[i] = ""
    return out


def header_row_count(rows: list[list[str]]) -> int:
    if len(rows) < 2:
        return 1
    if _indexed(rows[0]) and not _numbering(rows[0]):
        return 0  # the table continues from an earlier page: its first row is already data (item 1, 2, ...)
    width = len(rows[0])
    count = 1
    while count < min(MAX_HEADER_ROWS, len(rows) - 1):
        current, following = rows[count - 1], rows[count]
        sparse = sum(bool(cell) for cell in current) < HEADER_FILL_SHARE * width
        if _indexed(following):
            break  # an item number (1, 2. or 3)) starts a data row, never a heading
        if sparse or _numbering(following) or not following[0]:
            count += 1
        else:
            break
    return count


def tidy_rows(rows: TableRows) -> tuple[TableRows, int]:
    """The tidied rows and how many of them are header rows."""
    squashed = _squash([list(row) for row in rows])
    if not squashed:
        return rows, 1
    header_rows = header_row_count(squashed)
    squashed[:header_rows] = [_despan(row) for row in squashed[:header_rows]]
    squashed = _squash(squashed)
    header_rows = min(header_rows, max(0, len(squashed) - 1))
    return tuple(tuple(row) for row in squashed), header_rows
