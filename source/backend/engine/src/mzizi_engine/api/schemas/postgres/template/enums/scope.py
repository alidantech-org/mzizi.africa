"""Scope: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Scope(StrEnum):
    LEVEL = "level"
    LIST = "list"
    SINGLE = "single"
    WITHIN = "within"
