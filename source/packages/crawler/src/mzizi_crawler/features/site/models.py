"""Constants and report models of site watching."""

from __future__ import annotations

from pydantic import BaseModel

from mzizi_crawler.shared.sitestore import Outcome

INVENTORY_TABLES = (
    "pages",
    "paths",
    "links",
    "internal_urls",
    "external_urls",
    "external_hosts",
    "images",
    "documents",
    "files",
    "media",
    "errors",
)
TRANSIENT = ("raw", "markdown", "screenshots")


class PageRef(BaseModel):
    n: int
    final_url: str
    title: str = ""
    status: int = 200
    raw_file: str
    markdown_file: str = ""


class WatchReport(BaseModel):
    site: str
    host: str
    pages_visited: int
    new: int
    changed: int
    unchanged: int
    noise: int
    fresh: int  # served from the saved copy (fetched recently), not fetched again
    gone: int
    complete: bool
    stopped: str = ""  # why fetching ended early (a time or page budget, a block)
    files_hunted: int = 0
    files_downloaded: int = 0
    markdown_converted: int = 0
    downloads_failed: int = 0
    changes: tuple[Outcome, ...] = ()
