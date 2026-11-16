"""Reference Method: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ReferenceMethod(StrEnum):
    HUMAN = "human"
    MODEL = "model"
    PARSER = "parser"
