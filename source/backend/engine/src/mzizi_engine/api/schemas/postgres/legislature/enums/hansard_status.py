"""Hansard Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class HansardStatus(StrEnum):
    FINAL = "final"
    PROVISIONAL = "provisional"
