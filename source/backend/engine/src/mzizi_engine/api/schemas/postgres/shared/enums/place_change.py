"""Place Change: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class PlaceChange(StrEnum):
    MERGE = "merge"
    RENAME = "rename"
    SPLIT = "split"
    TRANSFER = "transfer"
