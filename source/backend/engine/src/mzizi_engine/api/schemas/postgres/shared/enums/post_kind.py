"""Post Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class PostKind(StrEnum):
    COMMENT = "comment"
    QUESTION = "question"
    REPORT = "report"
    REVIEW = "review"
