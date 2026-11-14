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
    AUTO = "auto"  # plain HTTP, and a browser only for pages that need one


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
    adapter: str = "playwright"
    reuse_browser: bool = False


class CrawlRequest(Workspace):
    url: str = ""
    urls: tuple[str, ...] = ()
    max_pages: int = 25
    max_depth: int = 2
    delay: float = 1.0
    concurrency: int = 1
    render: Render = Render.HTTP
    headed: bool = False
    screenshots: bool = False
    paginate: bool = True  # follow next links and, in a browser, click next buttons, load more and infinite scroll
    max_list_pages: int = 25  # at most this many pages per listing (the first page included)
    record: bool = True  # False: the caller (site watch) keeps its own site-level records
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
    formats: tuple[ExportFormat, ...] = Field(default=(ExportFormat.CSV,))  # rows are in MongoDB; CSV is the linked file

    @property
    def starts(self) -> tuple[str, ...]:
        return (*([self.url] if self.url else []), *self.urls)


class WatchRequest(CrawlRequest):
    """A crawl kept as hashed, versioned pages in the site folder, then a hunt for files and their download."""

    download: bool = True
    download_limit: int = 200  # files fetched per run; the queue keeps the rest for the next run
    hunt: bool = True
    min_age_hours: float = 12.0  # a page fetched more recently than this is not fetched again; its saved copy feeds the crawl


class SurveyRequest(CrawlRequest):
    """A crawl followed by a profile and a draft bundle."""


class MarkdownRequest(Workspace):
    url: str
    render: Render = Render.HTTP
    headed: bool = False


class ScrapeFileRequest(Request):
    source: str
    html_base64: str
    module_yaml: str
    module_source: str = "site module"


class ScrapeUrlRequest(MarkdownRequest):
    module_yaml: str
    module_source: str = "site module"


class SelectRequest(Request):
    html_base64: str
    css: str


class UrlRequest(Workspace):
    url: str = ""
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


class DiffRequest(Workspace):
    baseline: str
    current: str


class ProfileRequest(Workspace):
    source: str


class FamilyRequest(Workspace):
    left: str
    right: str


class DraftRequest(Workspace):
    source: str
    site: str = ""
    browser: bool = False


class RankRequest(Workspace):
    source: str  # a downloads folder holding catalog.json
    rules: str  # a ranking.yml
    record: str = "auto"  # "auto": MongoDB when reachable, else a ledger file; "ledger" forces the file


class EnqueueRequest(Workspace):
    site: str  # the site's URL or host; its inventory lists the files
    kinds: tuple[str, ...] = ("document", "image", "media", "file", "candidate")


class FetchQueueRequest(Workspace):
    site: str
    limit: int = 100
    limit_rate: int = 0
    allow_private: bool = False
    concurrency: int = 2
    allowed_hosts: tuple[str, ...] = ()


class QueueStatusRequest(Workspace):
    site: str = ""


class ExportRequest(Workspace):
    source: str
    formats: tuple[ExportFormat, ...] = (ExportFormat.CSV, ExportFormat.JSON, ExportFormat.JSONL)


class SearchRequest(Workspace):
    query: str
    engine: str = "brave"
    count: int = 10
    offset: int = 0
    formats: tuple[ExportFormat, ...] = (ExportFormat.CSV, ExportFormat.JSON)
