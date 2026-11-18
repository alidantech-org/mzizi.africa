"""The crawler package's operations: the engine decides which functions it exposes, under which names.

Each entry adapts a typed function (request model in, result model out) from `mzizi_crawler` to the payload-in, payload-out
shape every front door speaks.
"""

from __future__ import annotations

from mzizi_crawler.features.api_collect import api_collect
from mzizi_crawler.features.batch import batch
from mzizi_crawler.features.changes import changes
from mzizi_crawler.features.crawl_site import crawl_site as crawl
from mzizi_crawler.features.downloads import downloads
from mzizi_crawler.features.inspect import inspect
from mzizi_crawler.features.queue import queue
from mzizi_crawler.features.rank import rank
from mzizi_crawler.features.scrape import scrape
from mzizi_crawler.features.sections import sections
from mzizi_crawler.features.site import site
from mzizi_crawler.features.survey import survey
from mzizi_crawler.shared.requests import (
    ApiCollectRequest,
    BatchRequest,
    CrawlRequest,
    DiffRequest,
    DownloadRequest,
    DraftRequest,
    EnqueueRequest,
    ExportRequest,
    FamilyRequest,
    FetchQueueRequest,
    MarkdownRequest,
    ProfileRequest,
    QueueStatusRequest,
    RankRequest,
    ScrapeFileRequest,
    ScrapeUrlRequest,
    SectionsRequest,
    SelectRequest,
    SurveyRequest,
    UrlRequest,
    WatchRequest,
    Workspace,
)
from mzizi_engine.runtime.assembly.replay import WorkspaceReplayRequest, replay_workspace
from mzizi_engine.runtime.assembly.specs import register_specs
from mzizi_engine.runtime.operations import OperationRegistry, Requirement, operation

NETWORK = frozenset({Requirement.USER_AGENT})
BROWSER = NETWORK | {Requirement.BROWSER}
ACTIVITY = frozenset({Requirement.MONGO})
VERSION = "0.2.0"
PACKAGE = "mzizi-crawler"


def register_crawler(registry: OperationRegistry) -> None:
    register_specs(
        registry,
        (
            operation(
                "scraping.crawl",
                "Crawl one site: pages, links, resources, external hosts, Markdown; resumable",
                CrawlRequest,
                crawl.crawl_site,
                1,
                requires=NETWORK,
            ),
            operation(
                "scraping.markdown",
                "One page to Markdown without header, footer and navigation",
                MarkdownRequest,
                crawl.page_markdown,
                1,
                requires=NETWORK,
            ),
            operation(
                "scraping.sections",
                "Capture listing tabs and disclosure panels with coverage and bounded browser traversal",
                SectionsRequest,
                sections.page_sections,
                1,
                requires=NETWORK,
            ),
            operation(
                "scraping.replay",
                "Compare saved captures with expectations inside the engine input workspace",
                WorkspaceReplayRequest,
                replay_workspace,
                1,
            ),
            operation(
                "scraping.extract", "Apply a site module to saved HTML", ScrapeFileRequest, scrape.scrape_file, 1
            ),
            operation(
                "scraping.url",
                "Apply a site module to one source page",
                ScrapeUrlRequest,
                scrape.scrape_url,
                1,
                requires=NETWORK,
            ),
            operation("scraping.select", "Run a CSS selector on saved HTML", SelectRequest, scrape.select_file, 1),
            operation(
                "web.export",
                "Re-export a crawl's inventories as CSV, JSON or JSON Lines",
                ExportRequest,
                crawl.export_results,
                1,
            ),
            operation(
                "web.profile",
                "Profile a crawled site: sections, templates, navigation",
                ProfileRequest,
                survey.profile_run,
                1,
            ),
            operation(
                "web.family", "Compare two crawled sites for a shared template", FamilyRequest, survey.family_runs, 1
            ),
            operation("web.draft", "Draft a site structure bundle from a crawl", DraftRequest, survey.draft_bundle, 1),
            operation(
                "web.survey",
                "Crawl, profile and draft a bundle in one run",
                SurveyRequest,
                survey.survey_site,
                1,
                requires=NETWORK,
            ),
            operation(
                "web.rank",
                "Rank downloaded files against Mzizi targets from manifest rules",
                RankRequest,
                rank.rank_downloads,
                1,
            ),
            operation(
                "download.enqueue",
                "Queue a crawl's files, images and media for download (tracked in MongoDB)",
                EnqueueRequest,
                queue.enqueue,
                1,
                requires=ACTIVITY,
            ),
            operation(
                "download.run",
                "Download queued items and track each in MongoDB",
                FetchQueueRequest,
                queue.fetch_queue,
                1,
                requires=NETWORK | ACTIVITY,
            ),
            operation(
                "download.queue",
                "Counts of queued, running, done and failed downloads",
                QueueStatusRequest,
                queue.queue_status,
                1,
                requires=ACTIVITY,
            ),
            operation(
                "site.watch",
                "Crawl a site by URL; keep hashed, versioned pages and report changes",
                WatchRequest,
                site.watch_site,
                1,
                requires=NETWORK,
            ),
            operation(
                "site.batch",
                "Run many sites at once, resumable, losing nothing",
                BatchRequest,
                batch.run_batch,
                1,
                requires=NETWORK,
            ),
            operation(
                "web.diff", "Compare two crawls: pages added, removed and changed", DiffRequest, changes.diff_crawls, 1
            ),
            operation(
                "api.collect",
                "Collect a public JSON API endpoint page by page and extract fields with a module",
                ApiCollectRequest,
                api_collect.collect_api,
                1,
                requires=NETWORK,
            ),
            operation(
                "fetch.url",
                "One identified, policy-checked HTTP request",
                UrlRequest,
                inspect.fetch_one,
                1,
                requires=NETWORK,
            ),
            operation(
                "fetch.robots",
                "The robots.txt decision for a URL, recorded",
                UrlRequest,
                inspect.robots_policy,
                1,
                requires=NETWORK,
            ),
            operation(
                "web.links",
                "Every link, image, media and embed URL on a page, classified",
                UrlRequest,
                inspect.web_links,
                1,
                requires=NETWORK,
            ),
            operation(
                "scraping.challenge",
                "Detect an access challenge, CAPTCHA or block notice (detection only)",
                UrlRequest,
                inspect.inspect_challenge,
                1,
                requires=NETWORK,
            ),
            operation(
                "browser.open",
                "Open a URL in a real browser and report what rendered",
                UrlRequest,
                inspect.browser_open,
                1,
                requires=BROWSER,
            ),
            operation(
                "browser.snapshot",
                "Rendered HTML and a screenshot",
                UrlRequest,
                inspect.browser_snapshot,
                1,
                requires=BROWSER,
            ),
            operation(
                "browser.navigate",
                "Run a click/fill/scroll/wait action script",
                UrlRequest,
                inspect.browser_script,
                1,
                requires=BROWSER,
            ),
            operation(
                "browser.click",
                "Click one element on a page and report the result",
                UrlRequest,
                inspect.browser_click,
                1,
                requires=BROWSER,
            ),
            operation(
                "browser.fill", "Fill one field on a page", UrlRequest, inspect.browser_fill, 1, requires=BROWSER
            ),
            operation(
                "browser.start",
                "Open the one shared dev browser window",
                UrlRequest,
                inspect.browser_start,
                1,
                requires=BROWSER,
            ),
            operation(
                "browser.stop",
                "Close the shared dev browser",
                UrlRequest,
                inspect.browser_stop,
                1,
                requires=frozenset({Requirement.BROWSER}),
            ),
            operation(
                "browser.compare",
                "HTTP result versus browser result",
                UrlRequest,
                inspect.browser_compare,
                1,
                requires=BROWSER,
            ),
            operation(
                "web.download",
                "Safe, resumable, throttled downloads into quarantine",
                DownloadRequest,
                downloads.download_files,
                1,
                requires=NETWORK,
            ),
            operation("web.downloads", "Status of downloads in a folder", Workspace, downloads.download_status, 1),
        ),
        PACKAGE,
        VERSION,
    )
