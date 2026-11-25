"""Login Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class LoginKind(StrEnum):
    EMAIL = "email"
    OIDC = "oidc"
    PHONE = "phone"
