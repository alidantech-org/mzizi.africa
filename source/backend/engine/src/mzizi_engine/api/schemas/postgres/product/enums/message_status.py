"""Message Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class MessageStatus(StrEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    REVIEWED = "reviewed"
