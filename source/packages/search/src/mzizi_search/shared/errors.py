"""The one failure the search package raises."""

from __future__ import annotations


class SearchError(RuntimeError):
    """A provider call failed, the provider is unknown or the provider is not configured."""
