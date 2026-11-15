"""Access: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class Access(StrEnum):
    INTERNAL = "internal"
    PRIVATE = "private"
    PUBLIC = "public"
    RESTRICTED = "restricted"
