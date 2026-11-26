"""Language Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class LanguageKind(StrEnum):
    LANGUAGE = "language"
    MACROLANGUAGE = "macrolanguage"
    SPECIAL = "special"
    VARIETY = "variety"
