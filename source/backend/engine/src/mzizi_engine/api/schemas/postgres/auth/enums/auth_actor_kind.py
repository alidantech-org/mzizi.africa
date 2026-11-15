"""Auth Actor Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class AuthActorKind(StrEnum):
    PERSON = "person"
    SERVICE = "service"
