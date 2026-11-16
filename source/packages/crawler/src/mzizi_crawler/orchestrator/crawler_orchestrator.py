"""CrawlerOrchestrator: the crawler package's single public class.

It exposes every capability as a typed function (request model in, result model out). The engine decides which of them to
register as operations and under which names; the crawler never names an operation and never imports the engine.
"""

from __future__ import annotations

from mzizi_crawler.features.attachments import attachments
from mzizi_crawler.features.batch import batch
from mzizi_crawler.features.changes import changes
from mzizi_crawler.features.crawl_site import crawl_site
from mzizi_crawler.features.downloads import downloads
from mzizi_crawler.features.inspect import inspect
from mzizi_crawler.features.queue import queue
from mzizi_crawler.features.rank import rank
from mzizi_crawler.features.replay import replay
from mzizi_crawler.features.scrape import scrape
from mzizi_crawler.features.sections import sections
from mzizi_crawler.features.site import site
from mzizi_crawler.features.survey import survey


class CrawlerOrchestrator:
    """Handlers are plain module functions reachable here, so callers import one class and not thirteen modules."""

    attachments = attachments
    batch = batch
    changes = changes
    crawl_site = crawl_site
    downloads = downloads
    inspect = inspect
    queue = queue
    rank = rank
    replay = replay
    scrape = scrape
    sections = sections
    site = site
    survey = survey

    def start(self) -> None:
        """Nothing to open: connections and browsers start per operation."""

    def stop(self) -> None:
        """Nothing to close."""


__all__ = ["CrawlerOrchestrator"]
