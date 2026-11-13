"""JSON value types for the capability boundary, where untyped payloads enter and leave the engine."""

from __future__ import annotations

type JsonValue = str | int | float | bool | list[JsonValue] | dict[str, JsonValue] | None
type Payload = dict[str, JsonValue]
