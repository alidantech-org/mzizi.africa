"""Reply Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ReplyStatus(StrEnum):
    PUBLISHED = "published"
    RECEIVED = "received"
    WITHDRAWN = "withdrawn"
