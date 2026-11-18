"""Actor Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ActorKind(StrEnum):
    ACCOUNT = "account"
    DEVICE = "device"
