"""Provision Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ProvisionKind(StrEnum):
    ARTICLE = "article"
    CHAPTER = "chapter"
    CLAUSE = "clause"
    DEFINITION = "definition"
    ITEM = "item"
    PARAGRAPH = "paragraph"
    PART = "part"
    PREAMBLE = "preamble"
    SCHEDULE = "schedule"
    SUBPARAGRAPH = "subparagraph"
