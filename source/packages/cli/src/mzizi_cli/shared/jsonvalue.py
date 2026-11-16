"""JSON value types for the gateway boundary, where untyped payloads enter and leave the CLI."""

from __future__ import annotations

type JsonValue = str | int | float | bool | list[JsonValue] | dict[str, JsonValue] | None
type Payload = dict[str, JsonValue]


def as_int(value: JsonValue, default: int = 0) -> int:
    """A whole number read from a JSON value; anything else (missing, text, null) reads as `default`."""
    return value if isinstance(value, int) and not isinstance(value, bool) else default
