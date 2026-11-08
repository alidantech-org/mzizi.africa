"""Reads a budget-style table extracted from a PDF: realigns offset columns, reads unit and scale.

PDF tables come back with merged-cell artefacts (a unit row apart from the header, data cells shifted
left or right of their header). Realignment never invents a value: a data row is aligned to the header
from the right (numbers sit under the last columns, the label under the first), and a row whose number
of cells cannot be reconciled is reported, not guessed.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from decimal import Decimal, InvalidOperation

SCALES = {"thousand": Decimal(10) ** 3, "thousands": Decimal(10) ** 3, "million": Decimal(10) ** 6, "millions": Decimal(10) ** 6, "billion": Decimal(10) ** 9, "billions": Decimal(10) ** 9}
UNIT = re.compile(r"\b(kshs?|kes|usd|us\$)\.?\s*(thousands?|millions?|billions?)?\b", re.I)
NUMBER = re.compile(r"^\(?-?[\d,]+(\.\d+)?\)?$")
CURRENCIES = {"kshs": "KES", "ksh": "KES", "kes": "KES", "usd": "USD", "us$": "USD"}


@dataclass
class ParsedTable:
    columns: list[str]
    rows: list[dict]  # {label, values: {column: Decimal | None}, raw: [cells]}
    currency: str | None
    scale: Decimal
    problems: list[str] = field(default_factory=list)


def parse_amount(cell: str) -> Decimal | None:
    text = cell.strip().replace(" ", "")
    if not text or not NUMBER.match(text):
        return None
    negative = text.startswith("(") or text.startswith("-")
    try:
        value = Decimal(text.strip("()-").replace(",", ""))
    except InvalidOperation:
        return None
    return -value if negative else value


def read_unit(cells: list[str]) -> tuple[str | None, Decimal | None]:
    for cell in cells:
        match = UNIT.search(cell)
        if match:
            scale = SCALES.get((match.group(2) or "").lower(), Decimal(1)) if match.group(2) else None
            return CURRENCIES.get(match.group(1).lower().rstrip(".")), scale
    return None, None


def parse_table(rows: list[list[str]], caption: str | None = None) -> ParsedTable:
    """rows: a cleaned table (see extractors.pdf.clean_table). The first row with several text cells is the header."""
    problems: list[str] = []
    header_at = next((i for i, row in enumerate(rows) if sum(1 for c in row if c and parse_amount(c) is None) >= 2), None)
    if header_at is None:
        return ParsedTable([], [], None, Decimal(1), ["no header row found"])
    header = [c for c in rows[header_at] if c]
    currency, scale = read_unit([*(rows[i][j] for i in range(max(header_at - 1, 0), min(header_at + 2, len(rows))) for j in range(len(rows[i]))), *([caption] if caption else [])])
    data_rows = [row for row in rows[header_at + 1 :] if any(parse_amount(c) is not None for c in row)]
    parsed: list[dict] = []
    columns = header[1:]  # the first header cell titles the label column
    for row in data_rows:
        cells = [c for c in row if c]
        label_cells = [c for c in cells if parse_amount(c) is None]
        numbers = [c for c in cells if parse_amount(c) is not None]
        if len(numbers) > len(columns):
            problems.append(f"row {' '.join(label_cells)[:60]!r}: {len(numbers)} numbers for {len(columns)} columns")
            continue
        offset = len(columns) - len(numbers)  # numbers sit under the last columns
        values = {column: None for column in columns}
        for index, cell in enumerate(numbers):
            values[columns[offset + index]] = parse_amount(cell)
        if offset:
            problems.append(f"row {' '.join(label_cells)[:60]!r}: {offset} leading column(s) empty")
        parsed.append({"label": " ".join(label_cells).strip(), "values": values, "raw": row})
    return ParsedTable(columns, parsed, currency, scale if scale is not None else Decimal(1), problems)
