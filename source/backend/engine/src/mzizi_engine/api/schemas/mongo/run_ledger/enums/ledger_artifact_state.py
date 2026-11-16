"""Ledger Artifact State: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class LedgerArtifactState(StrEnum):
    PROMOTED = "promoted"
    REJECTED = "rejected"
    STAGED = "staged"
