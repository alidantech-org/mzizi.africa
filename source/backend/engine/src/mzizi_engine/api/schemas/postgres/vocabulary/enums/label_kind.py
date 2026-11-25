"""Label Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class LabelKind(StrEnum):
    ABBREVIATION = "abbreviation"
    ALTERNATIVE = "alternative"
    DEFINITION = "definition"
    PLURAL = "plural"
    PREFERRED = "preferred"
    SHORT = "short"
