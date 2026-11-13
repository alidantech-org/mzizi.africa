"""Field extraction from a discovered item, shared by the dry-run validator and the runner."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass

from bs4 import Tag

from ..core import JsonValue
from ..selectors import Content, Item, Match, jsonpath, select
from ..text import find_first
from ..transforms import apply
from .models import FieldSpec, ModuleSpec

ITEM_TEXT, LINK_TEXT, LINK_HREF = "item_text", "link_text", "link_href"
TOKENS = frozenset({ITEM_TEXT, LINK_TEXT, LINK_HREF})
LISTING_KEYS = ("listing", "api")


@dataclass(frozen=True)
class Extraction:
    """The extracted record and the per-field problems; a bad value is reported, never guessed."""

    record: dict[str, JsonValue]
    errors: tuple[str, ...]


def _text(item: Item) -> JsonValue:
    if isinstance(item, Tag):
        return item.get_text(" ", strip=True)
    return item if isinstance(item, str) else None


def _anchor(item: Item) -> Tag | None:
    if not isinstance(item, Tag):
        return None
    if item.name == "a":
        return item
    inner = item.find("a")
    return inner if isinstance(inner, Tag) else None


def _token(item: Item, token: str) -> JsonValue:
    if token == ITEM_TEXT:
        return _text(item)
    anchor = _anchor(item)
    if anchor is None:
        return None
    if token == LINK_TEXT:
        return anchor.get_text(" ", strip=True)
    href = anchor.get("href")
    return " ".join(href) if isinstance(href, list) else href


def _first(match: Match) -> JsonValue:
    if not match.items:
        return None
    return _text(match.items[0]) if isinstance(match.items[0], Tag) else match.items[0]


def _named(item: Item, name: str, record: Mapping[str, JsonValue]) -> JsonValue:
    if name in TOKENS:
        return _token(item, name)
    if name in record:
        return record[name]
    if name.startswith("$") and not isinstance(item, Tag):
        found = jsonpath(item, name)
        return found[0] if found else None
    return item.get(name) if isinstance(item, dict) else None


def _value(item: Item, spec: FieldSpec, record: Mapping[str, JsonValue]) -> JsonValue:
    if "const" in spec.model_fields_set:
        return spec.const
    source = spec.source
    if source is None:
        value: JsonValue = None
    elif isinstance(source, str):
        value = _named(item, source, record)
    else:
        value = _first(select(item, source))
    if spec.regex is not None and value is not None:
        value = find_first(spec.regex, str(value))
    return value


def extract_item(item: Item, fields: Mapping[str, FieldSpec]) -> Extraction:
    """Extracts every field of a module from one item; later fields may refer to earlier ones by name."""
    record: dict[str, JsonValue] = {}
    errors: list[str] = []
    for name, spec in fields.items():
        try:
            value = _value(item, spec, record)
            if spec.parse is not None and value is not None:
                value = apply(spec.parse, value)
            record[name] = value
        except Exception as problem:  # a bad value is reported on the field, never guessed
            record[name] = None
            errors.append(f"{name}: {problem}")
    return Extraction(record=record, errors=tuple(errors))


def discover_items(content: Content, module: ModuleSpec) -> Match:
    for key in LISTING_KEYS:
        source = getattr(module.discover, key)
        if source is not None:
            return select(content, source.items)
    return Match(selector_index=-1, items=())
