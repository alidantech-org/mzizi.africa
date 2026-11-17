"""What a column's cells look like: numbers, dates, codes, names, addresses and so on.

These are format tests, not word lists: they carry no language or publisher knowledge."""

from __future__ import annotations

import re

from mzizi_patterns.shared.contracts import Shape

MONEY = re.compile(
    r"^(?:[A-Za-z]{2,4}\.?\s*)?[-+]?\d{1,3}(?:[, ]\d{3})*(?:\.\d{1,2})?$|^(?:[A-Za-z]{2,4}\.?\s*)?[-+]?\d+(?:\.\d{1,2})?$"
)
INTEGER = re.compile(r"^\d+\.?$")
PERCENT = re.compile(r"^\d+(?:\.\d+)?\s*%$")
DATE = re.compile(
    r"^(?:\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}"
    r"|\d{1,2}(?:st|nd|rd|th)?[ -]+[A-Za-z]{3,9}[,.]?[ -]+\d{2,4}|[A-Za-z]{3,9}\.? \d{1,2}(?:st|nd|rd|th)?,? \d{4})$"
)
URL = re.compile(r"^(?:https?://|www\.)\S+$", re.IGNORECASE)
EMAIL = re.compile(r"^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$")
PHONE = re.compile(r"^\+?\d[\d\s().-]{6,}$")
CODE = re.compile(r"^(?=.*[A-Za-z0-9])[A-Z0-9][A-Za-z0-9./_-]{0,24}$")
NAME = re.compile(r"^[A-Z][^\d@:/]{2,}$")


def _is(shape: Shape, cell: str) -> bool:
    match shape:
        case Shape.MONEY:
            return bool(MONEY.match(cell)) and (len(cell) >= 4 or not INTEGER.match(cell))
        case Shape.INTEGER:
            return bool(INTEGER.match(cell))
        case Shape.PERCENTAGE:
            return bool(PERCENT.match(cell))
        case Shape.DATE:
            return bool(DATE.match(cell))
        case Shape.URL:
            return bool(URL.match(cell))
        case Shape.EMAIL:
            return bool(EMAIL.match(cell))
        case Shape.PHONE:
            return bool(PHONE.match(cell)) and not DATE.match(cell)
        case Shape.CODE:
            return bool(CODE.match(cell)) and " " not in cell
        case Shape.NAME:
            return bool(NAME.match(cell)) and (len(cell.split()) >= 2 or not cell.isupper())
        case Shape.TEXT:
            return True


def shape_shares(samples: tuple[str, ...]) -> tuple[tuple[Shape, float], ...]:
    """The share of non-empty cells that fit each shape, strongest first. `text` fits everything and is left out."""
    cells = [c.strip() for c in samples if c.strip()]
    if not cells:
        return ()
    shares = [
        (shape, sum(_is(shape, cell) for cell in cells) / len(cells)) for shape in Shape if shape is not Shape.TEXT
    ]
    return tuple(sorted((s for s in shares if s[1] > 0), key=lambda s: -s[1]))
