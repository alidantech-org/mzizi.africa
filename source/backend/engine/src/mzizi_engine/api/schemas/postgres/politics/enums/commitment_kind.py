"""Commitment Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class CommitmentKind(StrEnum):
    CAMPAIGN_PROMISE = "campaign-promise"
    MANIFESTO_PLEDGE = "manifesto-pledge"
    OFFICE_PLEDGE = "office-pledge"
