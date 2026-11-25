"""Form Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class FormStatus(StrEnum):
    FINAL = "final"
    PROVISIONAL = "provisional"
