"""Holder End: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class HolderEnd(StrEnum):
    DEATH = "death"
    REMOVAL = "removal"
    RESIGNATION = "resignation"
    TERM_END = "term-end"
