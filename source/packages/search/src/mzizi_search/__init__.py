"""Web search through official provider APIs behind one typed orchestrator."""

from mzizi_search.orchestrator import SearchOrchestrator, SearchSettings
from mzizi_search.shared.contracts import (
    ProviderName,
    SearchOutcome,
    SearchPage,
    SearchQuery,
    SearchResult,
)
from mzizi_search.shared.errors import SearchError

__all__ = [
    "ProviderName",
    "SearchError",
    "SearchOrchestrator",
    "SearchOutcome",
    "SearchPage",
    "SearchQuery",
    "SearchResult",
    "SearchSettings",
]
