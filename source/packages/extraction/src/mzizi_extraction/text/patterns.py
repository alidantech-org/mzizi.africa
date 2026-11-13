"""The one home for regular expressions in `mzizi-extraction` (.docs/rules/typed-code.md).

Only glyph-level, language-neutral conventions live here (bullet characters, numbered-list punctuation). Words such as
"Figure" or "Table" are language knowledge and come from the extraction profile, never from this module.
"""

from __future__ import annotations

import re
from typing import NamedTuple

_BULLET = re.compile(
    r"^\s*(?P<marker>[\u2022\u25aa\u25e6\u2023\u00b7\u25cf\u25cb\u25a0\u25a1\u25ab\u25c6\-\u2013\u2014*])\s+(?P<rest>\S.*)$"
)
_ORDERED = re.compile(r"^\s*(?P<marker>\d{1,3}[.)]|\(?[a-z][.)]|\(\d{1,3}\))\s+(?P<rest>\S.*)$")


class ListMarker(NamedTuple):
    ordered: bool
    marker: str
    rest: str


def list_marker(text: str) -> ListMarker | None:
    """The marker of a bulleted or numbered list line and the text after it, or None."""
    match = _BULLET.match(text)
    if match:
        return ListMarker(False, match["marker"], match["rest"])
    match = _ORDERED.match(text)
    if match:
        return ListMarker(True, match["marker"], match["rest"])
    return None


def starts_with_label(text: str, labels: tuple[str, ...]) -> bool:
    """True when `text` begins with one of the caption labels a profile supplies (case-insensitive, then a word break)."""
    lowered = text.lstrip().lower()
    return any(re.match(re.escape(label.lower()) + r"\b", lowered) for label in labels)
