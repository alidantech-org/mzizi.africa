"""Text Direction: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class TextDirection(StrEnum):
    LTR = "ltr"
    RTL = "rtl"
