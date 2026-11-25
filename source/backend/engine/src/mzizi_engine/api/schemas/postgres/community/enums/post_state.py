"""Post State: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class PostState(StrEnum):
    DRAFT = "draft"
    PENDING = "pending"
    PUBLISHED = "published"
    REJECTED = "rejected"
    REMOVED = "removed"
