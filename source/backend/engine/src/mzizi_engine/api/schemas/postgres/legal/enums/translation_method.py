"""Translation Method: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class TranslationMethod(StrEnum):
    HUMAN = "human"
    MACHINE = "machine"
