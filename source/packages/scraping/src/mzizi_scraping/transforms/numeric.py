"""Number, date and fiscal-year transforms. Values are returned as strings so no precision is lost."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal, InvalidOperation

from mzizi_scraping.core import JsonValue, ScrapeError
from mzizi_scraping.text import fiscal_year_parts, numeric_characters

DEFAULT_DATE_FORMAT = "%Y-%m-%d"


def to_date(value: JsonValue, fmt: JsonValue = DEFAULT_DATE_FORMAT) -> JsonValue:
    if value in (None, ""):
        return None
    return datetime.strptime(str(value).strip(), str(fmt)).date().isoformat()


def to_decimal(value: JsonValue, options: JsonValue = None) -> JsonValue:
    """Parses a number; options: {thousands: ',', decimal: '.'}."""
    if value in (None, ""):
        return None
    opts = options if isinstance(options, dict) else {}
    thousands = str(opts.get("thousands", ","))
    decimal_mark = str(opts.get("decimal", "."))
    text = str(value).strip().replace(thousands, "").replace(" ", "")
    if decimal_mark != ".":
        text = text.replace(decimal_mark, ".")
    try:
        number = Decimal(numeric_characters(text))
    except InvalidOperation as problem:
        raise ScrapeError(f"not a number: {value!r}") from problem
    return format(number, "f")


def fiscal_year(value: JsonValue, _arg: JsonValue = None) -> JsonValue:
    """Normalises 2023/24, 2023-24, 2023/2024 and FY2023/24 to '2023/24'."""
    if value in (None, ""):
        return None
    parts = fiscal_year_parts(str(value))
    if parts is None:
        raise ScrapeError(f"not a fiscal year: {value!r}")
    start, end = parts[0], parts[1][-2:]
    if int(end) != (int(start) + 1) % 100:
        raise ScrapeError(f"fiscal year does not span consecutive years: {value!r}")
    return f"{start}/{end}"


def fy_start(value: JsonValue, start_month: JsonValue = None) -> JsonValue:
    """First day of a fiscal year given as 'YYYY/YY'. `start_month` (1-12) names when that jurisdiction's fiscal
    year begins; it is not guessed, so a manifest must always supply it (there is no universal fiscal calendar)."""
    fiscal = fiscal_year(value)
    if fiscal is None:
        return None
    if not isinstance(start_month, (int, float, str)) or not start_month:
        raise ScrapeError("fy_start needs start_month (1-12); the fiscal year's start month is not universal")
    month = int(start_month)
    if not 1 <= month <= 12:
        raise ScrapeError(f"start_month must be 1-12, got {start_month!r}")
    return date(int(str(fiscal)[:4]), month, 1).isoformat()
