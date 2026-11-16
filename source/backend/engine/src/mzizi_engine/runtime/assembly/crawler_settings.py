"""Inject the engine's crawler settings into the acquisition libraries."""

from mzizi_crawler import CrawlerSettings, configure_crawler, configure_user_agent
from mzizi_engine.config import CrawlerConfig
from mzizi_fetch.web.vocabulary import configure_vocabulary


def configure_acquisition(config: CrawlerConfig) -> None:
    configure_crawler(
        CrawlerSettings(
            dev_root=config.dev_root,
            markdown_workers=config.markdown_workers,
            min_free_bytes=config.min_free_bytes,
            debug_stack_seconds=config.debug_stack_seconds,
        )
    )
    configure_user_agent(config.user_agent)
    configure_vocabulary(config.vocabulary_path)
