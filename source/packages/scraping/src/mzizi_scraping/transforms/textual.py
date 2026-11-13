"""Text transforms. Non-text values pass through unchanged."""

from __future__ import annotations

import unicodedata

from mzizi_scraping.core import JsonValue, ScrapeError
from mzizi_scraping.text import find_first, slugify, strip_ordinal_suffixes


def trim(value: JsonValue, _arg: JsonValue = None) -> JsonValue:
    return value.strip() if isinstance(value, str) else value


def collapse(value: JsonValue, _arg: JsonValue = None) -> JsonValue:
    return " ".join(value.split()) if isinstance(value, str) else value


def nfc(value: JsonValue, _arg: JsonValue = None) -> JsonValue:
    return unicodedata.normalize("NFC", value) if isinstance(value, str) else value


def upper(value: JsonValue, _arg: JsonValue = None) -> JsonValue:
    return value.upper() if isinstance(value, str) else value


def lower(value: JsonValue, _arg: JsonValue = None) -> JsonValue:
    return value.lower() if isinstance(value, str) else value


def normalise_name(value: JsonValue, _arg: JsonValue = None) -> JsonValue:
    return collapse(nfc(value))


def clean_ordinal(value: JsonValue, _arg: JsonValue = None) -> JsonValue:
    """Removes English ordinal suffixes after day numbers."""
    return strip_ordinal_suffixes(value) if isinstance(value, str) else value


def regex(value: JsonValue, pattern: JsonValue = None) -> JsonValue:
    if not isinstance(pattern, str):
        raise ScrapeError("regex needs a pattern")
    return find_first(pattern, str(value))


def slug_code(value: JsonValue, prefix: JsonValue = "") -> JsonValue:
    """A hierarchical business code from a name: lowercase ASCII, apostrophes dropped, other runs become hyphens."""
    if value in (None, ""):
        return None
    ascii_text = unicodedata.normalize("NFKD", str(value)).encode("ascii", "ignore").decode().lower()
    cleaned = ascii_text.replace("'", "").replace(chr(0x2019), "")
    return f"{prefix or ''}{slugify(cleaned)}"


def prefix(value: JsonValue, text: JsonValue = "") -> JsonValue:
    return None if value in (None, "") else f"{text}{value}"


def suffix(value: JsonValue, text: JsonValue = "") -> JsonValue:
    return None if value in (None, "") else f"{value}{text}"
