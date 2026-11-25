"""Name Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class NameKind(StrEnum):
    ALTERNATIVE = "alternative"
    PLURAL = "plural"
    PREFERRED = "preferred"
    SHORT = "short"
