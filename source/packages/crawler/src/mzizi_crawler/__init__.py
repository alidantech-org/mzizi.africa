"""Web acquisition: crawling, scraping, survey, sections, attachments, downloads, ranking, inspection and site watching."""

from mzizi_crawler.features.replay.replay import ReplayReport, ReplaySuite
from mzizi_crawler.orchestrator.crawler_orchestrator import CrawlerOrchestrator
from mzizi_crawler.shared.activity import Activity, configure_activity
from mzizi_crawler.shared.identity import configure_user_agent
from mzizi_crawler.shared.settings import CrawlerSettings, configure_crawler

__all__ = [
    "Activity",
    "CrawlerOrchestrator",
    "CrawlerSettings",
    "ReplayReport",
    "ReplaySuite",
    "configure_activity",
    "configure_crawler",
    "configure_user_agent",
]
