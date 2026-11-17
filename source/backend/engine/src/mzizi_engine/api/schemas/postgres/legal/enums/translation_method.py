"""Translation Method: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class TranslationMethod(StrEnum):
    ASSISTED = "assisted"
    HUMAN = "human"
    MACHINE = "machine"
