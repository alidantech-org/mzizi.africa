"""Name Part: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class NamePart(StrEnum):
    FAMILY = "family"
    GIVEN = "given"
    MIDDLE = "middle"
    PREFIX = "prefix"
    SUFFIX = "suffix"
