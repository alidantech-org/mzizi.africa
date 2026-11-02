"""Deterministic selectors: css, xpath, jsonpath and regex. No model is involved.

Each selector object may carry a confidence; a list of selectors is tried in confidence order
and the first that yields items wins (the engine records which one matched).
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from typing import Any

from bs4 import BeautifulSoup
from lxml import etree, html as lxml_html


@dataclass
class Match:
    selector_index: int
    items: list[Any]


def _ordered(selectors: Any) -> list[tuple[int, dict]]:
    items = selectors if isinstance(selectors, list) else [selectors]
    indexed = list(enumerate(items))
    return sorted(indexed, key=lambda pair: -float(pair[1].get("confidence", 0.5)))


def _jsonpath(document: Any, expression: str) -> list[Any]:
    """Minimal JSONPath: $, .key, ['key'], [n], [*] and .. is not supported (rejected, not guessed)."""
    if not expression.startswith("$"):
        raise ValueError(f"jsonpath must start with $: {expression}")
    if ".." in expression:
        raise ValueError("recursive descent is not supported")
    tokens = re.findall(r"\.([A-Za-z_][\w-]*)|\['([^']+)'\]|\[(\d+)\]|\[(\*)\]", expression[1:])
    current = [document]
    for dotted, quoted, index, star in tokens:
        nxt: list[Any] = []
        for node in current:
            if star:
                nxt.extend(node if isinstance(node, list) else list(node.values()) if isinstance(node, dict) else [])
            elif index:
                if isinstance(node, list) and int(index) < len(node):
                    nxt.append(node[int(index)])
            else:
                key = dotted or quoted
                if isinstance(node, dict) and key in node:
                    nxt.append(node[key])
        current = nxt
    return current


def _attr_or_text(node: Any, attr: str | None) -> Any:
    if attr:
        return node.get(attr)
    return node.get_text(" ", strip=True) if hasattr(node, "get_text") else node


def select(content: str | bytes | Any, selectors: Any) -> Match:
    """Run the selectors against HTML text, JSON text/objects or plain text; returns the first non-empty result."""
    for index, selector in _ordered(selectors):
        items = _run(content, selector)
        if items:
            return Match(index, items)
    return Match(-1, [])


def _run(content: Any, selector: dict) -> list[Any]:
    attr = selector.get("attr")
    if "css" in selector:
        soup = content if isinstance(content, BeautifulSoup) or hasattr(content, "select") else BeautifulSoup(content, "lxml")
        return [_attr_or_text(node, attr) if attr else node for node in soup.select(selector["css"])]
    if "xpath" in selector:
        tree = content if isinstance(content, etree._Element) else lxml_html.fromstring(content)
        found = tree.xpath(selector["xpath"])
        return [item if not hasattr(item, "text_content") else (item.get(attr) if attr else item.text_content().strip()) for item in found]
    if "jsonpath" in selector:
        document = json.loads(content) if isinstance(content, (str, bytes)) else content
        return _jsonpath(document, selector["jsonpath"])
    if "regex" in selector:
        text = content if isinstance(content, str) else str(content)
        return [m.group(1) if m.groups() else m.group(0) for m in re.finditer(selector["regex"], text)]
    return []
