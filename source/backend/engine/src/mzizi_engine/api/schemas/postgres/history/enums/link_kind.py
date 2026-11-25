"""Link Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class LinkKind(StrEnum):
    CAUSED = "caused"
    FOLLOWED = "followed"
    LED_TO = "led-to"
    PART_OF = "part-of"
    REPLACED = "replaced"
