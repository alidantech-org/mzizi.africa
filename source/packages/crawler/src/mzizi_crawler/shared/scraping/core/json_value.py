"""The recursive type for JSON data whose shape is genuinely open (record values, transform arguments)."""

from __future__ import annotations

type JsonValue = str | int | float | bool | list[JsonValue] | dict[str, JsonValue] | None
