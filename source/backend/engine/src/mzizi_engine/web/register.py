"""Registers the web capabilities with the engine registry (all are developer/research tools, not product API)."""

from __future__ import annotations

from mzizi_engine.capabilities import Capability, CapabilityRegistry
from mzizi_engine.jsonvalue import Payload
from mzizi_engine.web.handlers import crawl, downloads, inspect, scrape
from mzizi_engine.web.handlers.common import capability
from mzizi_engine.web.requests import (
    CrawlRequest,
    DownloadRequest,
    ExportRequest,
    MarkdownRequest,
    ScrapeFileRequest,
    ScrapeUrlRequest,
    SearchRequest,
    SelectRequest,
    UrlRequest,
    Workspace,
)

PACKAGE = "mzizi-engine"
VERSION = "0.2.0"
SCHEMA: Payload = {"type": "object"}


def register_web(registry: CapabilityRegistry) -> None:
    for name, description, handler in (
        (
            "scraping.crawl",
            "Crawl one site: pages, links, resources, external hosts, Markdown; resumable",
            capability(CrawlRequest, crawl.crawl_site),
        ),
        (
            "scraping.markdown",
            "One page to Markdown without header, footer and navigation",
            capability(MarkdownRequest, crawl.page_markdown),
        ),
        ("scraping.extract", "Apply a site module to saved HTML", capability(ScrapeFileRequest, scrape.scrape_file)),
        ("scraping.url", "Apply a site module to one source page", capability(ScrapeUrlRequest, scrape.scrape_url)),
        ("scraping.select", "Run a CSS selector on saved HTML", capability(SelectRequest, scrape.select_file)),
        (
            "web.export",
            "Re-export a crawl's inventories as CSV, JSON or JSON Lines",
            capability(ExportRequest, crawl.export_results),
        ),
        ("fetch.url", "One identified, policy-checked HTTP request", capability(UrlRequest, inspect.fetch_one)),
        ("fetch.robots", "The robots.txt decision for a URL, recorded", capability(UrlRequest, inspect.robots_policy)),
        (
            "web.links",
            "Every link, image, media and embed URL on a page, classified",
            capability(UrlRequest, inspect.web_links),
        ),
        (
            "scraping.challenge",
            "Detect an access challenge, CAPTCHA or block notice (detection only)",
            capability(UrlRequest, inspect.inspect_challenge),
        ),
        (
            "browser.open",
            "Open a URL in a real browser and report what rendered",
            capability(UrlRequest, inspect.browser_open),
        ),
        ("browser.snapshot", "Rendered HTML and a screenshot", capability(UrlRequest, inspect.browser_snapshot)),
        (
            "browser.navigate",
            "Run a click/fill/scroll/wait action script",
            capability(UrlRequest, inspect.browser_script),
        ),
        (
            "browser.click",
            "Click one element on a page and report the result",
            capability(UrlRequest, inspect.browser_click),
        ),
        ("browser.fill", "Fill one field on a page", capability(UrlRequest, inspect.browser_fill)),
        ("browser.compare", "HTTP result versus browser result", capability(UrlRequest, inspect.browser_compare)),
        (
            "web.download",
            "Safe, resumable, throttled downloads into quarantine",
            capability(DownloadRequest, downloads.download_files),
        ),
        ("web.downloads", "Status of downloads in a folder", capability(Workspace, downloads.download_status)),
        (
            "search.web",
            "Web search through the official Brave or Google API",
            capability(SearchRequest, inspect.web_search),
        ),
    ):
        registry.register(Capability(name, VERSION, PACKAGE, description, handler, SCHEMA, concurrency=1))
