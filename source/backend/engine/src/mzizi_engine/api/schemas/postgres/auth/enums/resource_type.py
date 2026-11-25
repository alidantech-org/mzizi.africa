"""Resource Type: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ResourceType(StrEnum):
    AUTH = "auth"
    CIVIC = "civic"
    COMMUNITY = "community"
    ECONOMY = "economy"
    ELECTION = "election"
    EVENT = "event"
    FILESYSTEM = "filesystem"
    FINANCE = "finance"
    GEOGRAPHY = "geography"
    GOVERNANCE = "governance"
    HISTORY = "history"
    IDENTITY = "identity"
    LEGAL = "legal"
    LEGISLATURE = "legislature"
    MEDIA = "media"
    OFFICIAL = "official"
    POLITICS = "politics"
    PRODUCT = "product"
    REFERENCE = "reference"
    SOURCE = "source"
    STATISTICS = "statistics"
    VOCABULARY = "vocabulary"
