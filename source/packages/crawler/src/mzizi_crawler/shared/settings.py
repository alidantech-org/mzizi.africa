"""Process configuration supplied by the engine for local crawl and watch paths."""

from pathlib import Path

from pydantic import BaseModel, ConfigDict


class CrawlerSettings(BaseModel):
    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")

    dev_root: Path | None = None
    markdown_workers: int | None = None
    min_free_bytes: int = 8 * 1024**3
    debug_stack_seconds: int | None = None


_settings = CrawlerSettings()


def configure_crawler(settings: CrawlerSettings) -> None:
    global _settings
    _settings = settings


def crawler_settings() -> CrawlerSettings:
    return _settings
