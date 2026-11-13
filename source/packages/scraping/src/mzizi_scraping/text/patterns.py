"""The only module in this package that compiles or runs a regular expression.

Interim home until the shared `patterns` package exists (task TSK-D2BC6AE00DFF), which will provide linear-time
matching; callers here only use the named functions. Manifest-supplied patterns are bounded in length.
"""

from __future__ import annotations

import re
from typing import Literal

from mzizi_scraping.core import Frozen, ScrapeError

MAX_PATTERN_CHARS = 500
MAX_TEXT_CHARS = 2_000_000

_JSONPATH_TOKEN = re.compile(r"\.([A-Za-z_][\w-]*)|\['([^']+)'\]|\[(\d+)\]|\[(\*)\]")
_ORDINAL = re.compile(r"(\d)(st|nd|rd|th)\b")
_NON_NUMERIC = re.compile(r"[^\d.\-]")
_FISCAL_YEAR = re.compile(r"(\d{4})\s*[/\-–]\s*(\d{2,4})")  # noqa: RUF001 (en dash is a real separator)
_NON_SLUG = re.compile(r"[^a-z0-9]+")


class KeyToken(Frozen):
    kind: Literal["key"] = "key"
    name: str


class IndexToken(Frozen):
    kind: Literal["index"] = "index"
    position: int


class WildcardToken(Frozen):
    kind: Literal["wildcard"] = "wildcard"


type JsonPathToken = KeyToken | IndexToken | WildcardToken


def jsonpath_tokens(expression: str) -> list[JsonPathToken]:
    """Tokens of the supported JSONPath subset: `$`, `.key`, `['key']`, `[n]` and `[*]`."""
    if not expression.startswith("$"):
        raise ScrapeError(f"jsonpath must start with $: {expression}")
    if ".." in expression:
        raise ScrapeError("recursive descent is not supported")
    tokens: list[JsonPathToken] = []
    for dotted, quoted, index, star in _JSONPATH_TOKEN.findall(expression[1:]):
        if star:
            tokens.append(WildcardToken())
        elif index:
            tokens.append(IndexToken(position=int(index)))
        else:
            tokens.append(KeyToken(name=dotted or quoted))
    return tokens


def _compile(pattern: str) -> re.Pattern[str]:
    if len(pattern) > MAX_PATTERN_CHARS:
        raise ScrapeError(f"pattern longer than {MAX_PATTERN_CHARS} characters")
    try:
        return re.compile(pattern)
    except re.error as problem:
        raise ScrapeError(f"invalid pattern: {problem}") from problem


def find_all(pattern: str, text: str) -> list[str]:
    """Each match as its first group when the pattern has groups, else the whole match."""
    compiled = _compile(pattern)
    return [m.group(1) if m.groups() else m.group(0) for m in compiled.finditer(text[:MAX_TEXT_CHARS])]


def find_first(pattern: str, text: str) -> str | None:
    found = _compile(pattern).search(text[:MAX_TEXT_CHARS])
    if found is None:
        return None
    return found.group(1) if found.groups() else found.group(0)


def strip_ordinal_suffixes(text: str) -> str:
    """'22nd Jul' becomes '22 Jul'."""
    return _ORDINAL.sub(r"\1", text)


def numeric_characters(text: str) -> str:
    """Only digits, the decimal point and the minus sign."""
    return _NON_NUMERIC.sub("", text)


def fiscal_year_parts(text: str) -> tuple[str, str] | None:
    """Start year and end digits of '2023/24', '2023-24', '2023/2024' or 'FY2023/24'."""
    found = _FISCAL_YEAR.search(text)
    return (found.group(1), found.group(2)) if found else None


def slugify(ascii_lower_text: str) -> str:
    return _NON_SLUG.sub("-", ascii_lower_text).strip("-")
