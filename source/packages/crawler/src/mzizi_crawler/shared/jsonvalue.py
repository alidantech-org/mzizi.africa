"""JSON value types for the crawler's payload boundaries (structurally the same as the engine's, owned here so the package imports nothing from it)."""

from __future__ import annotations

type JsonValue = str | int | float | bool | list[JsonValue] | dict[str, JsonValue] | None
type Payload = dict[str, JsonValue]


def as_int(value: JsonValue, default: int = 0) -> int:
    """A whole number read from a JSON value; anything else (missing, text, null) reads as `default`."""
    return value if isinstance(value, int) and not isinstance(value, bool) else default
