"""Page state, visits and outcomes of the site store, and its tuning constants."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict

from mzizi_crawler.shared.scraping import Change, Fingerprint

GENERATOR = "mzizi-engine site store 1"
VOLATILE_AFTER = 2  # a block that differed on this many visits in a row is treated as changing by itself
VISITED_EVERY = 25  # rewrite visited.txt this often while pages arrive
GONE_AFTER = 3  # misses in a complete crawl before a page is marked gone
STATE_FILE = "state.json"


class PageState(BaseModel):
    model_config = ConfigDict(frozen=True, extra="ignore")

    host: str
    path: str
    url: str
    status: int
    version: int = 1
    first_seen: str
    last_seen: str
    last_changed: str
    visits: int = 1
    raw_changes: int = 0  # bytes differed, nothing meaningful did
    fingerprint: Fingerprint
    flux: dict[str, int] = {}
    etag: str = ""
    last_modified: str = ""
    title: str = ""
    html_file: str = ""
    md_file: str = ""
    png_file: str = ""
    visual_hash: str = ""
    misses: int = 0
    gone: bool = False

    @property
    def volatile(self) -> frozenset[str]:
        return frozenset(name for name, count in self.flux.items() if count >= VOLATILE_AFTER)


class Visit(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    url: str
    final_url: str
    path: str
    query: str = ""
    status: int
    title: str = ""
    html: bytes
    markdown_body: str = ""
    screenshot: bytes | None = None
    etag: str = ""
    last_modified: str = ""
    slug: str


class Outcome(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    path: str
    result: str  # new | changed | unchanged | noise
    version: int
    change: Change | None = None
