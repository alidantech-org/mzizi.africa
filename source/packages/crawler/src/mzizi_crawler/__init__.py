"""Web acquisition: crawling, scraping, survey, sections, attachments, downloads, ranking, inspection and site watching."""

from mzizi_crawler.orchestrator.crawler_orchestrator import CrawlerOrchestrator
from mzizi_crawler.shared.activity import Activity, configure_activity

__all__ = ["Activity", "CrawlerOrchestrator", "configure_activity"]
