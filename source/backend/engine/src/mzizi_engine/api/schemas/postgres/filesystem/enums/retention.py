"""Retention: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Retention(StrEnum):
    PRESERVE_HISTORY = "preserve_history"
    REPLACE_CURRENT = "replace_current"
