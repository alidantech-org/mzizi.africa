"""Sitemap discovery: robots.txt `Sitemap:` lines and the conventional location, expanded through sitemap indexes."""

from __future__ import annotations

from mzizi_fetch.web.client import WebClient
from mzizi_fetch.web.urls import UrlKind, classify, origin_of
from mzizi_scraping import parse_sitemap, sitemaps_from_robots

MAX_SITEMAP_FILES = 20
MAX_SITEMAP_URLS = 5000
CONVENTIONAL_PATH = "/sitemap.xml"


def discover_sitemap_urls(client: WebClient, starts: tuple[str, ...]) -> list[str]:
    queue: list[str] = []
    for start in starts:
        origin = origin_of(start)
        robots = client.get(f"{origin}/robots.txt", conditional=False)
        queue.extend(sitemaps_from_robots(robots.text) if robots.usable else ())
        queue.append(f"{origin}{CONVENTIONAL_PATH}")
    urls: list[str] = []
    done: set[str] = set()
    while queue and len(done) < MAX_SITEMAP_FILES and len(urls) < MAX_SITEMAP_URLS:
        location = queue.pop(0)
        if location in done:
            continue
        done.add(location)
        response = client.get(location, conditional=False)
        if not response.usable:
            continue
        content = parse_sitemap(response.body)
        urls.extend(content.urls)
        queue.extend(content.child_sitemaps)
    return urls[:MAX_SITEMAP_URLS]


def partition(urls: list[str]) -> tuple[list[str], list[tuple[str, UrlKind]]]:
    """Splits sitemap addresses into pages to crawl and files (an image sitemap lists images, not pages)."""
    pages: list[str] = []
    files: list[tuple[str, UrlKind]] = []
    for url in urls:
        kind = classify(url)
        (pages.append(url) if kind is UrlKind.PAGE else files.append((url, kind)))
    return pages, files
