"""Checker: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Checker(StrEnum):
    AI = "ai"
    HUMAN = "human"
    RULES = "rules"
