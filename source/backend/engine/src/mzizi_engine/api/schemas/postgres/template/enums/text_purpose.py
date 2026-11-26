"""Text Purpose: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class TextPurpose(StrEnum):
    CODE = "code"
    CONTACT = "contact"
    DOMAIN = "domain"
    NAME = "name"
