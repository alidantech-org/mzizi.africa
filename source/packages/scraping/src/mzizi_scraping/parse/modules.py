"""Parsing boundary for manifest data: raw YAML/JSON values become typed scraping specs."""

from __future__ import annotations

from pydantic import TypeAdapter

from ..core import JsonValue
from ..extract import ModuleSpec
from ..selectors import Selector
from ..transforms import TransformSpec

_MODULE: TypeAdapter[ModuleSpec] = TypeAdapter(ModuleSpec)
_SELECTORS: TypeAdapter[list[Selector] | Selector] = TypeAdapter(list[Selector] | Selector)
_TRANSFORM: TypeAdapter[TransformSpec] = TypeAdapter(TransformSpec)


def parse_module(raw: JsonValue) -> ModuleSpec:
    return _MODULE.validate_python(raw)


def parse_selectors(raw: JsonValue) -> list[Selector] | Selector:
    return _SELECTORS.validate_python(raw)


def parse_transform(raw: JsonValue) -> TransformSpec:
    return _TRANSFORM.validate_python(raw)
