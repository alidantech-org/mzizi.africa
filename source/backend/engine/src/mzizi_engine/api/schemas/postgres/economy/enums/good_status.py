"""Good Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class GoodStatus(StrEnum):
    ACTIVE = "active"
    RETIRED = "retired"
