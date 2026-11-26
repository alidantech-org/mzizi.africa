"""Component Transform: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ComponentTransform(StrEnum):
    AS_IS = "as-is"
    INVERTED = "inverted"
    NORMALISED = "normalised"
