"""Flow Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class FlowKind(StrEnum):
    ALLOCATION = "allocation"
    DISBURSEMENT = "disbursement"
    PAYMENT = "payment"
    RECEIPT = "receipt"
    TRANSFER = "transfer"
