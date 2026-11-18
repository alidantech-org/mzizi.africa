"""Theme Choice: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ThemeChoice(StrEnum):
    DARK = "dark"
    LIGHT = "light"
    SYSTEM = "system"
