"""Auth Actor Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AuthActorKind(StrEnum):
    AGENT = "agent"
    PERSON = "person"
    SERVICE = "service"
