"""Shared scraping types."""

from mzizi_crawler.shared.scraping.core.json_value import JsonValue
from mzizi_crawler.shared.scraping.core.models import External, Frozen, ScrapeError

__all__ = ["External", "Frozen", "JsonValue", "ScrapeError"]
