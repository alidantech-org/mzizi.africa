"""Minimal JSONPath over parsed JSON: `$`, `.key`, `['key']`, `[n]`, `[*]`. Recursive descent is rejected."""

from __future__ import annotations

from mzizi_scraping.core import JsonValue
from mzizi_scraping.text import IndexToken, KeyToken, jsonpath_tokens


def jsonpath(document: JsonValue, expression: str) -> list[JsonValue]:
    current: list[JsonValue] = [document]
    for token in jsonpath_tokens(expression):
        following: list[JsonValue] = []
        for node in current:
            if isinstance(token, KeyToken):
                if isinstance(node, dict) and token.name in node:
                    following.append(node[token.name])
            elif isinstance(token, IndexToken):
                if isinstance(node, list) and token.position < len(node):
                    following.append(node[token.position])
            elif isinstance(node, list):
                following.extend(node)
            elif isinstance(node, dict):
                following.extend(node.values())
        current = following
    return current
