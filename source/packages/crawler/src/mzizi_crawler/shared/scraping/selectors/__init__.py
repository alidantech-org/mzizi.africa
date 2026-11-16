"""Selector fallback chains over HTML, XML and JSON content."""

from mzizi_crawler.shared.scraping.selectors.engine import Content, select
from mzizi_crawler.shared.scraping.selectors.jsonpath import jsonpath
from mzizi_crawler.shared.scraping.selectors.models import (
    CssSelector,
    Item,
    JsonPathSelector,
    Match,
    RegexSelector,
    Selector,
    XpathSelector,
)

__all__ = [
    "Content",
    "CssSelector",
    "Item",
    "JsonPathSelector",
    "Match",
    "RegexSelector",
    "Selector",
    "XpathSelector",
    "jsonpath",
    "select",
]
