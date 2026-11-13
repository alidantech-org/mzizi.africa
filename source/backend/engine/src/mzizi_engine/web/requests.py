"""Typed capability requests: the parsing boundary for every web capability payload."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from mzizi_fetch.web.blocks import Response
from mzizi_fetch.web.policy import Authorization, RobotsMode


class Request(BaseModel):
    model_config = ConfigDict(frozen=True, extra="ignore")


class Render(StrEnum):
    HTTP = "http"
    BROWSER = "browser"


class ExportFormat(StrEnum):
    CSV = "csv"
    JSON = "json"
    JSONL = "jsonl"


class OnBlock(StrEnum):
    BACK_OFF = "backoff"
    SKIP = "skip"
    STOP = "stop"
    HUMAN = "pause"


ON_BLOCK_RESPONSE: dict[OnBlock, Response] = {
    OnBlock.BACK_OFF: Response.BACK_OFF,
    OnBlock.SKIP: Response.SKIP,
    OnBlock.STOP: Response.STOP,
    OnBlock.HUMAN: Response.HUMAN_REVIEW,
}


class Workspace(Request):
    out_dir: str
    downloads_dir: str = ""
    profile_dir: str = ""


class CrawlRequest(Workspace):
    url: str = ""
    urls: tuple[str, ...] = ()
    max_pages: int = 25
    max_depth: int = 2
    delay: float = 1.0
    concurrency: int = 1
    render: Render = Render.HTTP
    headed: bool = False
    on_block: OnBlock = OnBlock.BACK_OFF
    include_subdomains: bool = False
    allowed_hosts: tuple[str, ...] = ()
    allowed_paths: tuple[str, ...] = ()
    excluded_paths: tuple[str, ...] = ()
    sitemap: bool = True
    markdown: bool = True
    resume: bool = False
    resume_from: str = ""
    inspect_resources: bool = False
    robots_mode: RobotsMode = RobotsMode.RESPECT
    authorization: Authorization | None = None
    formats: tuple[ExportFormat, ...] = Field(default=(ExportFormat.CSV, ExportFormat.JSON))

    @property
    def starts(self) -> tuple[str, ...]:
        return (*([self.url] if self.url else []), *self.urls)


class MarkdownRequest(Workspace):
    url: str
    render: Render = Render.HTTP
    headed: bool = False


class UrlRequest(Workspace):
    url: str
    delay: float = 1.0
    headed: bool = False
    headless: bool = False
    hold: bool = False
    actions: str = ""
    target: str = ""
    text: str = ""


class DownloadRequest(Workspace):
    url: str = ""
    urls: tuple[str, ...] = ()
    from_file: str = ""
    background: bool = False
    limit_rate: int = 0
    allow_private: bool = False
    concurrency: int = 2
    allowed_hosts: tuple[str, ...] = ()


class ExportRequest(Workspace):
    source: str
    formats: tuple[ExportFormat, ...] = (ExportFormat.CSV, ExportFormat.JSON, ExportFormat.JSONL)


class SearchRequest(Workspace):
    query: str
    engine: str = "brave"
    count: int = 10
    offset: int = 0
    formats: tuple[ExportFormat, ...] = (ExportFormat.CSV, ExportFormat.JSON)
