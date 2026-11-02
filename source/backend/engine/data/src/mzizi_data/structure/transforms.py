"""The fixed transform library. A transform not listed here fails validation; nothing executes arbitrary code."""
from __future__ import annotations

import re
import unicodedata
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from typing import Any, Callable


def _trim(value: Any, _arg: Any = None) -> Any:
    return value.strip() if isinstance(value, str) else value


def _collapse(value: Any, _arg: Any = None) -> Any:
    return re.sub(r"\s+", " ", value).strip() if isinstance(value, str) else value


def _nfc(value: Any, _arg: Any = None) -> Any:
    return unicodedata.normalize("NFC", value) if isinstance(value, str) else value


def _upper(value: Any, _arg: Any = None) -> Any:
    return value.upper() if isinstance(value, str) else value


def _lower(value: Any, _arg: Any = None) -> Any:
    return value.lower() if isinstance(value, str) else value


def _normalise_name(value: Any, _arg: Any = None) -> Any:
    if not isinstance(value, str):
        return value
    return _collapse(_nfc(value))


def _date(value: Any, fmt: Any = "%Y-%m-%d") -> str | None:
    if value in (None, ""):
        return None
    return datetime.strptime(str(value).strip(), fmt).date().isoformat()


def _decimal(value: Any, options: Any = None) -> str | None:
    """Parses a number; options: {thousands: ',', decimal: '.', scale: 2}. Returns a string so no precision is lost."""
    if value in (None, ""):
        return None
    options = options or {}
    text = str(value).strip().replace(options.get("thousands", ","), "").replace(" ", "")
    if options.get("decimal", ".") != ".":
        text = text.replace(options["decimal"], ".")
    text = re.sub(r"[^\d.\-]", "", text)
    try:
        number = Decimal(text)
    except InvalidOperation as error:
        raise ValueError(f"not a number: {value!r}") from error
    return format(number, "f")


def _fiscal_year(value: Any, _arg: Any = None) -> str | None:
    """Normalises 2023/24, 2023-24, 2023/2024 and FY2023/24 to '2023/24'."""
    if value in (None, ""):
        return None
    match = re.search(r"(\d{4})\s*[/\-–]\s*(\d{2,4})", str(value))
    if not match:
        raise ValueError(f"not a fiscal year: {value!r}")
    start, end = match.group(1), match.group(2)[-2:]
    if int(end) != (int(start) + 1) % 100:
        raise ValueError(f"fiscal year does not span consecutive years: {value!r}")
    return f"{start}/{end}"


def _fy_start(value: Any, start_month: Any = 7) -> str | None:
    """First day of a fiscal year given as 'YYYY/YY'; the start month is configurable (Kenya: July)."""
    fiscal = _fiscal_year(value)
    return None if fiscal is None else date(int(fiscal[:4]), int(start_month or 7), 1).isoformat()


def _regex(value: Any, pattern: Any) -> Any:
    match = re.search(str(pattern), str(value))
    return (match.group(1) if match and match.groups() else match.group(0)) if match else None


def _lookup(value: Any, table: Any) -> Any:
    """Maps a value through an inline table; an unmapped value is an error, never a guess."""
    if not isinstance(table, dict):
        raise ValueError("lookup needs a table")
    if value not in table:
        raise ValueError(f"no mapping for {value!r}")
    return table[value]


LIBRARY: dict[str, Callable[..., Any]] = {
    "trim": _trim,
    "collapse_whitespace": _collapse,
    "nfc": _nfc,
    "upper": _upper,
    "lower": _lower,
    "normalise_name": _normalise_name,
    "date": _date,
    "decimal": _decimal,
    "fiscal_year": _fiscal_year,
    "fy_start": _fy_start,
    "regex": _regex,
    "lookup": _lookup,
}


def split(spec: Any) -> tuple[str, Any]:
    """A transform is a name or a one-key object {name: argument}."""
    if isinstance(spec, str):
        return spec, None
    (name, argument), = spec.items()
    return name, argument


def known(spec: Any) -> bool:
    return split(spec)[0] in LIBRARY


def apply(spec: Any, value: Any) -> Any:
    name, argument = split(spec)
    if name not in LIBRARY:
        raise ValueError(f"unknown transform: {name}")
    return LIBRARY[name](value, argument)
