"""Deterministic selectors: css, xpath, jsonpath and regex. No model is involved."""

from __future__ import annotations

import json

from bs4 import BeautifulSoup, Tag
from lxml import html as lxml_html
from pydantic import TypeAdapter

from ..core import JsonValue, ScrapeError
from ..text import find_all
from .jsonpath import jsonpath
from .models import CssSelector, Item, JsonPathSelector, Match, RegexSelector, Selector, XpathSelector

#: What a selector can run against: HTML or JSON text, a parsed HTML node, or parsed JSON.
type Content = str | bytes | Tag | JsonValue

_JSON: TypeAdapter[JsonValue] = TypeAdapter(JsonValue)


def _attribute(node: Tag, name: str) -> str | None:
    value = node.get(name)
    if isinstance(value, list):
        return " ".join(value)
    return value


def _soup(content: Content) -> Tag:
    if isinstance(content, Tag):
        return content
    if isinstance(content, (str, bytes)):
        return BeautifulSoup(content, "lxml")
    raise ScrapeError("css selectors need HTML content")


def _css(content: Content, selector: CssSelector) -> list[Item]:
    nodes = _soup(content).select(selector.css)
    if selector.attr is None:
        return list(nodes)
    return [_attribute(node, selector.attr) for node in nodes]


def _xpath(content: Content, selector: XpathSelector) -> list[Item]:
    if not isinstance(content, (str, bytes)):
        raise ScrapeError("xpath selectors need HTML text")
    tree = lxml_html.fromstring(content)
    result = tree.xpath(selector.xpath)
    if not isinstance(result, list):
        return [result if isinstance(result, bool | int | float) else str(result)]
    found: list[Item] = []
    for entry in result:
        if isinstance(entry, lxml_html.HtmlElement):
            found.append(entry.get(selector.attr) if selector.attr else entry.text_content().strip())
        elif isinstance(entry, str):
            found.append(str(entry))
    return found


def _jsonpath(content: Content, selector: JsonPathSelector) -> list[Item]:
    document = _JSON.validate_python(json.loads(content)) if isinstance(content, (str, bytes)) else content
    if isinstance(document, Tag):
        raise ScrapeError("jsonpath selectors need JSON content")
    return list(jsonpath(document, selector.jsonpath))


def _regex(content: Content, selector: RegexSelector) -> list[Item]:
    text = content if isinstance(content, str) else str(content)
    return list(find_all(selector.regex, text))


def _run(content: Content, selector: Selector) -> list[Item]:
    if isinstance(selector, CssSelector):
        return _css(content, selector)
    if isinstance(selector, XpathSelector):
        return _xpath(content, selector)
    if isinstance(selector, JsonPathSelector):
        return _jsonpath(content, selector)
    return _regex(content, selector)


def select(content: Content, selectors: list[Selector] | Selector) -> Match:
    """Runs the selectors in confidence order; returns the first non-empty result."""
    chosen = selectors if isinstance(selectors, list) else [selectors]
    ordered = sorted(enumerate(chosen), key=lambda pair: -pair[1].confidence)
    for index, selector in ordered:
        items = _run(content, selector)
        if items:
            return Match(selector_index=index, items=tuple(items))
    return Match(selector_index=-1, items=())
