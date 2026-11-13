"""Shared value types for the developer CLI."""

from __future__ import annotations

from enum import Enum

type JsonValue = str | int | float | bool | list[JsonValue] | dict[str, JsonValue] | None
type Payload = dict[str, JsonValue]
type ArgValue = str | int | bool | None
type ArgValues = dict[str, ArgValue]


class ExitCode(int, Enum):
    OK = 0
    FAILED = 1
    USAGE = 2
    NOT_YET_ADDED = 3
    UNAVAILABLE = 4
    CANCELLED = 130
