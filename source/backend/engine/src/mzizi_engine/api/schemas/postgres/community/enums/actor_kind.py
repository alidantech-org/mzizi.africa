"""Actor Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ActorKind(StrEnum):
    MEMBER = "member"
    VISITOR = "visitor"
