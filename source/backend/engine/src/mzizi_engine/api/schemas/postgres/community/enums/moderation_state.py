"""Moderation State: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ModerationState(StrEnum):
    APPEALED = "appealed"
    FILTERED = "filtered"
    HELD = "held"
    PENDING_REVIEW = "pending_review"
    PUBLISHED = "published"
    RECEIVED = "received"
    REJECTED = "rejected"
    REMOVED = "removed"
