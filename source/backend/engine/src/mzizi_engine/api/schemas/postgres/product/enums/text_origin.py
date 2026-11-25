"""Text Origin: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class TextOrigin(StrEnum):
    HUMAN = "human"
    MACHINE = "machine"
    ORIGINAL = "original"
