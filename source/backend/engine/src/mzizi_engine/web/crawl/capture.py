"""Preserve crawl captures and record the references attached to each view."""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from typing import TYPE_CHECKING
from urllib.parse import urlsplit

from bs4 import BeautifulSoup

from mzizi_engine.web.browser.traversal import End, static_listing
from mzizi_engine.web.hunt import has_download_query, looks_like_download
from mzizi_engine.web.records import DownloadStatus, FrontierItem, LinkRecord, PageRecord, ResourceRecord, Scope
from mzizi_fetch.web.client import WebResponse
from mzizi_fetch.web.urls import UrlKind, classify, extension_of, host_of, is_api_url, normalize, path_of
from mzizi_scraping import extract_references, page_meta
from mzizi_scraping.pagination import detect_pagination

if TYPE_CHECKING:
    from mzizi_engine.web.crawl.engine import Crawl

log = logging.getLogger("mzizi.crawl")
LINK_KINDS = frozenset({UrlKind.PAGE})
ARTICLE_SLUG_WORDS = 5


def group_of(url: str) -> str:
    """The part of a site a page belongs to: its first path segment, with long single-segment slugs (articles) together."""
    segments = [part for part in urlsplit(url).path.split("/") if part]
    if not segments:
        return "(home)"
    if len(segments) == 1:
        return "(article)" if segments[0].count("-") + 1 >= ARTICLE_SLUG_WORDS else "(page)"
    return segments[0]


def now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds")


def resource(crawl: Crawl, url: str, kind: UrlKind, item: FrontierItem, response: WebResponse | None = None) -> None:
    host = host_of(url)
    scope = Scope.INTERNAL if crawl.internal(url) else Scope.EXTERNAL
    crawl.resources.append(
        ResourceRecord(
            original_url=url,
            normalized_url=normalize(url),
            final_url=response.final_url if response else url,
            kind=kind.value,
            scope=scope,
            extension=extension_of(url),
            host=host,
            path=path_of(url),
            source_page=item.source_page,
            anchor_text=item.anchor_text,
            nearby_heading=item.nearby_heading,
            content_type=response.content_type if response else "",
            status=response.status if response else 0,
            depth=item.depth,
            discovered_at=now(),
            download_status=DownloadStatus.NOT_DOWNLOADED,
        )
    )


def final_key(url: str) -> str:
    """A page's identity after redirects: its normalised address (a virtual `#page-N` keeps its fragment)."""
    base, _, fragment = url.partition("#")
    return normalize(base) + (f"#{fragment}" if fragment else "")


def record_page(crawl: Crawl, item: FrontierItem, response: WebResponse) -> None:
    key = final_key(response.final_url)
    if key in crawl.recorded_finals:  # an alias of a page already fetched in this crawl (a redirect, a trailing slash)
        return
    crawl.recorded_finals.add(key)
    n = len(crawl.pages) + 1
    raw_name = f"raw/{n:04d}.html"
    html = response.text
    if crawl.on_page is None:  # without a hook the pages are kept for the end-of-crawl exports
        (crawl.out_dir / raw_name).write_bytes(response.body)
        crawl.html[n] = html
    final = response.final_url
    crawl.seen.add(final)
    soup = BeautifulSoup(html, "lxml")
    meta = page_meta(soup, final)
    canonical = meta.canonical or final
    crawl.seen.add(canonical)
    discovered = now()
    count = 0
    listing = crawl.evidence.listings.get(final)
    fallback = listing is not None and listing.stop_reason is End.BROWSER_UNAVAILABLE
    if (listing is None or fallback) and "#page-" not in final:
        static = static_listing(
            final,
            html,
            paginate=crawl.request.paginate,
            scope=crawl.request.listing_selector,
            items=crawl.request.item_selector,
        )
        crawl.evidence.listings[final] = (
            static.model_copy(update={"stop_reason": End.BROWSER_UNAVAILABLE}) if fallback else static
        )
    for later in meta.next_pages if crawl.request.paginate else ():
        if crawl.internal(later):
            crawl.enqueue(later, item.depth, final, "next page")
    if crawl.request.paginate and "#page-" not in final:
        found = detect_pagination(soup, final).next
        if found is not None and found.url and found.enabled and crawl.internal(found.url):
            crawl.enqueue(found.url, item.depth, final, "next page")
    for ref in crawl.evidence.references(final, extract_references(soup, final, retain_context=True)):
        kind = classify(ref.url, ref.tag)
        if kind is UrlKind.PAGE and is_api_url(ref.url):
            kind = UrlKind.DATA  # a JSON endpoint: kept and downloaded as data, not fetched as a page
        internal = crawl.internal(ref.url) and kind not in (UrlKind.MAIL, UrlKind.PHONE)
        scope = Scope.INTERNAL if internal else Scope.EXTERNAL
        count += 1
        record = LinkRecord(
            original_url=ref.url,
            normalized_url=normalize(ref.url) if ref.url.startswith("http") else ref.url,
            source_page=final,
            anchor_text=ref.text,
            nearby_heading=ref.heading,
            tag=ref.tag,
            kind=kind.value,
            scope=scope,
            host=host_of(ref.url),
            path=path_of(ref.url) if ref.url.startswith("http") else "",
            extension=extension_of(ref.url),
            depth=item.depth + 1,
            discovered_at=discovered,
        )
        crawl.links.append(record)
        if crawl.on_reference is not None:
            crawl.on_reference(record)
        if kind in LINK_KINDS:
            deferred = has_download_query(ref.url) or (
                crawl.request.references_only and looks_like_download(ref.url, ref.text)
            )
            if internal and item.depth < crawl.request.max_depth and not deferred:
                crawl.enqueue(ref.url, item.depth + 1, final, ref.text)
        elif kind not in (UrlKind.MAIL, UrlKind.PHONE):
            resource(
                crawl,
                ref.url,
                kind,
                FrontierItem(
                    url=ref.url,
                    depth=item.depth + 1,
                    source_page=final,
                    anchor_text=ref.text,
                    nearby_heading=ref.heading,
                ),
            )
    crawl.pages.append(
        PageRecord(
            n=n,
            original_url=item.url,
            normalized_url=normalize(item.url),
            final_url=final,
            canonical_url=canonical,
            source_page=item.source_page,
            anchor_text=item.anchor_text,
            title=meta.title,
            status=response.status,
            content_type=response.content_type,
            extension=extension_of(final),
            depth=item.depth,
            scope=Scope.INTERNAL,
            discovered_at=discovered,
            path=path_of(final),
            bytes=len(response.body),
            redirects=len(response.redirects),
            links=count,
            chrome_removed=0,
            fetched_via=response.headers.get("x-mzizi-via", "http"),
            raw_file=raw_name,
            markdown_file="",
        )
    )
    crawl.visited_groups[group_of(final)] += 1
    log.info("[%d/%d] %s -> %s", n, crawl.request.max_pages, final, response.status)
    if crawl.on_page is not None:
        crawl.on_page(crawl.pages[-1], response.body)
