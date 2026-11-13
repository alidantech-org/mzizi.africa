"""Parsing boundary for manifest data: raw YAML/JSON values become typed scraping specs."""

from __future__ import annotations

from pydantic import TypeAdapter

from mzizi_scraping.core import JsonValue
from mzizi_scraping.extract import ModuleSpec
from mzizi_scraping.selectors import Selector
from mzizi_scraping.transforms import TransformSpec

_MODULE: TypeAdapter[ModuleSpec] = TypeAdapter(ModuleSpec)
_SELECTORS: TypeAdapter[list[Selector] | Selector] = TypeAdapter(list[Selector] | Selector)
_TRANSFORM: TypeAdapter[TransformSpec] = TypeAdapter(TransformSpec)


def parse_module(raw: JsonValue) -> ModuleSpec:
    return _MODULE.validate_python(raw)


def parse_selectors(raw: JsonValue) -> list[Selector] | Selector:
    return _SELECTORS.validate_python(raw)


def parse_transform(raw: JsonValue) -> TransformSpec:
    return _TRANSFORM.validate_python(raw)
