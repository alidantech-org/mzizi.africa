"""Typed selectors. A list of selectors is tried in confidence order; the first that yields items wins."""

from __future__ import annotations

from dataclasses import dataclass

from bs4 import Tag

from ..core import External, JsonValue

DEFAULT_CONFIDENCE = 0.5


class CssSelector(External):
    css: str
    attr: str | None = None
    confidence: float = DEFAULT_CONFIDENCE


class XpathSelector(External):
    xpath: str
    attr: str | None = None
    confidence: float = DEFAULT_CONFIDENCE


class JsonPathSelector(External):
    jsonpath: str
    confidence: float = DEFAULT_CONFIDENCE


class RegexSelector(External):
    regex: str
    confidence: float = DEFAULT_CONFIDENCE


type Selector = CssSelector | XpathSelector | JsonPathSelector | RegexSelector

#: One thing a selector found: an HTML node, or text/JSON data.
type Item = Tag | JsonValue


@dataclass(frozen=True)
class Match:
    """The selector (by position in the caller's list) that matched, and what it found. `-1` means none matched."""

    selector_index: int
    items: tuple[Item, ...]
