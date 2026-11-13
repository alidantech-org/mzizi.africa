"""Shared scraping types."""

from .json_value import JsonValue
from .models import External, Frozen, ScrapeError

__all__ = ["External", "Frozen", "JsonValue", "ScrapeError"]
