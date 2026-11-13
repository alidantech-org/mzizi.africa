"""The parsing boundary for JSON input bytes: the only place untyped JSON enters extraction."""

from __future__ import annotations

import json

from pydantic import TypeAdapter

from ..core import JsonValue

_ADAPTER: TypeAdapter[JsonValue] = TypeAdapter(JsonValue)


class JsonParseError(Exception):
    """The input is not valid UTF-8 JSON."""


def load_json(data: bytes) -> JsonValue:
    try:
        return _ADAPTER.validate_python(json.loads(data))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise JsonParseError(str(error)) from error
