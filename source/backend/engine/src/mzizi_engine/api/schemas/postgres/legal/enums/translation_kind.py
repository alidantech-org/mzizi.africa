"""Translation Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class TranslationKind(StrEnum):
    MACHINE_PROPOSED = "machine-proposed"
    OFFICIAL = "official"
    PROPOSED_DRAFT = "proposed-draft"
    UNOFFICIAL = "unofficial"
