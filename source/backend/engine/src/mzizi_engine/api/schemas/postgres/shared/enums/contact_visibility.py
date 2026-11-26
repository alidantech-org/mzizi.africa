"""Contact Visibility: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ContactVisibility(StrEnum):
    PRIVATE = "private"
    PUBLIC = "public"
    RESTRICTED = "restricted"
