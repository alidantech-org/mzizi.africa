"""Evidence Method: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class EvidenceMethod(StrEnum):
    EXTRACTED = "extracted"
    MANUAL = "manual"
    MATCHED = "matched"
    MODELLED = "modelled"
