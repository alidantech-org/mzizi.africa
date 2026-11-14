"""The crawl loop: breadth-first, same-scope, deduplicated, resumable. External URLs are listed, never visited."""

from __future__ import annotations

import logging
from collections import defaultdict, deque
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import urlsplit

from mzizi_engine.web.crawl.backends import PageBackend
from mzizi_engine.web.crawl.sitemaps import discover_sitemap_urls
from mzizi_engine.web.crawl.state import CrawlState, digest_of, load_state, save_state
from mzizi_engine.web.records import (
    DownloadStatus,
    ErrorRecord,
    FrontierItem,
    LinkRecord,
    PageRecord,
    ResourceRecord,
    Scope,
)
from mzizi_engine.web.requests import CrawlRequest
from mzizi_fetch.web.blocks import Response
from mzizi_fetch.web.client import WebClient, WebResponse
from mzizi_fetch.web.urls import Deduplicator, UrlKind, classify, extension_of, host_of, normalize, path_of, same_site
from mzizi_scraping import extract_references, page_meta
from mzizi_scraping.pagination import detect_pagination

log = logging.getLogger("mzizi.crawl")
MAX_QUERY_VARIANTS = 6
SAVE_EVERY = 10
LINK_KINDS = frozenset({UrlKind.PAGE})


def _now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds")


@dataclass
class Crawl:
    """Mutable working state of one crawl; `snapshot` freezes it for saving and exporting."""

    request: CrawlRequest
    client: WebClient
    backend: PageBackend
    out_dir: Path
    start_hosts: tuple[str, ...]
    digest: str
    frontier: deque[FrontierItem] = field(default_factory=deque)
    seen: Deduplicator = field(default_factory=Deduplicator)
    pages: list[PageRecord] = field(default_factory=list)
    links: list[LinkRecord] = field(default_factory=list)
    resources: list[ResourceRecord] = field(default_factory=list)
    errors: list[ErrorRecord] = field(default_factory=list)
    html: dict[int, str] = field(default_factory=dict)
    stopped: str = ""
    query_variants: dict[str, set[str]] = field(default_factory=lambda: defaultdict(set))
    on_page: Callable[[PageRecord, bytes], None] | None = None  # called with each page as it is fetched
    on_reference: Callable[[LinkRecord], None] | None = None  # called with every link or file reference found

    def snapshot(self, complete: bool) -> CrawlState:
        return CrawlState(
            digest=self.digest,
            complete=complete,
            frontier=tuple(self.frontier),
            seen=tuple(sorted(self.seen.keys())),
            pages=tuple(self.pages),
            links=tuple(self.links),
            resources=tuple(self.resources),
            errors=tuple(self.errors),
            decisions=tuple(self.client.blocks.decisions),
            policy_audit=tuple(self.client.audit),
        )

    def enqueue(self, url: str, depth: int, source: str, anchor: str) -> None:
        query = urlsplit(url).query
        if query:  # many query variants of one path are usually a calendar or filter trap: keep a handful
            variants = self.query_variants[host_of(url) + path_of(url)]
            if len(variants) >= MAX_QUERY_VARIANTS and query not in variants:
                return
            variants.add(query)
        if self.seen.add(url):
            self.frontier.append(FrontierItem(url=url, depth=depth, source_page=source, anchor_text=anchor))

    def internal(self, url: str) -> bool:
        hosts = self.request.allowed_hosts or self.start_hosts
        return any(same_site(h, host_of(url), self.request.include_subdomains) for h in hosts)


def start_crawl(request: CrawlRequest, client: WebClient, backend: PageBackend) -> Crawl:
    out_dir = Path(request.out_dir)
    starts = tuple(request.starts)
    digest = digest_of(request)
    crawl = Crawl(request, client, backend, out_dir, tuple(sorted({host_of(u) for u in starts})), digest)
    resumed = load_state(out_dir, digest) if request.resume else None
    if resumed is not None and not resumed.complete:
        for key in resumed.seen:
            crawl.seen.add(key)
        crawl.frontier.extend(resumed.frontier)
        crawl.pages, crawl.links, crawl.resources, crawl.errors = (
            list(resumed.pages),
            list(resumed.links),
            list(resumed.resources),
            list(resumed.errors),
        )
        for page in crawl.pages:
            raw = out_dir / page.raw_file
            if raw.exists():
                crawl.html[page.n] = raw.read_text(encoding="utf-8", errors="replace")
        log.info("resuming: %d pages done, %d queued", len(crawl.pages), len(crawl.frontier))
        return crawl
    for url in starts:
        crawl.enqueue(url, 0, "", "")
    if request.sitemap:
        for url in discover_sitemap_urls(client, starts):
            if crawl.internal(url):
                crawl.enqueue(url, 1, "sitemap", "")
    return crawl


def run(crawl: Crawl) -> None:
    request, out_dir = crawl.request, crawl.out_dir
    if crawl.on_page is None:
        (out_dir / "raw").mkdir(parents=True, exist_ok=True)
    while crawl.frontier and len(crawl.pages) < request.max_pages and not crawl.stopped:
        item = crawl.frontier.popleft()
        response = crawl.backend.get(item.url)
        if not _accept(crawl, item, response):
            continue
        _record_page(crawl, item, response)
        take = getattr(crawl.backend, "take_extra", None)
        for extra in take(item.url) if take is not None else []:
            if len(crawl.pages) >= request.max_pages:
                break
            _record_page(crawl, item, extra)
        if len(crawl.pages) % SAVE_EVERY == 0:
            save_state(out_dir, crawl.snapshot(False))
    if crawl.frontier and len(crawl.pages) >= request.max_pages and not crawl.stopped:
        crawl.stopped = f"page budget of {request.max_pages} reached"


def _error(crawl: Crawl, url: str, stage: str, kind: str, detail: str, response: str = "", attempt: int = 0) -> None:
    crawl.errors.append(
        ErrorRecord(url=url, stage=stage, kind=kind, detail=detail, response=response, attempt=attempt, at=_now())
    )
    log.warning("%s %s: %s %s", stage, url, kind, detail)


def _accept(crawl: Crawl, item: FrontierItem, response: WebResponse) -> bool:
    """True when `response` is a page to process; otherwise the reason is recorded."""
    if response.refused is not None:
        _error(crawl, item.url, "policy", "refused", response.refused.reason)
        return False
    if response.block is not None and response.decision is not None:
        decision = response.decision
        _error(crawl, item.url, "block", decision.kind, decision.detail, decision.response, decision.attempt)
        if decision.response == Response.STOP.value:
            crawl.stopped = f"stopped: {decision.reason} at {item.url}"
        return False
    if response.error:
        _error(crawl, item.url, "transport", "error", response.error)
        return False
    if not response.is_html:
        _resource(
            crawl,
            item.url,
            classify(response.final_url, "a") if classify(response.final_url) is not UrlKind.PAGE else UrlKind.DOCUMENT,
            item,
            response,
        )
        return False
    return True


def _resource(crawl: Crawl, url: str, kind: UrlKind, item: FrontierItem, response: WebResponse | None = None) -> None:
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
            content_type=response.content_type if response else "",
            status=response.status if response else 0,
            depth=item.depth,
            discovered_at=_now(),
            download_status=DownloadStatus.NOT_DOWNLOADED,
        )
    )


def _record_page(crawl: Crawl, item: FrontierItem, response: WebResponse) -> None:
    n = len(crawl.pages) + 1
    raw_name = f"raw/{n:04d}.html"
    if crawl.on_page is None:  # without a hook the pages are kept for the end-of-crawl exports
        (crawl.out_dir / raw_name).write_bytes(response.body)
        crawl.html[n] = response.text
    final = response.final_url
    crawl.seen.add(final)
    meta = page_meta(response.text, final)
    canonical = meta.canonical or final
    crawl.seen.add(canonical)
    now = _now()
    count = 0
    for ref in extract_references(response.text, final):
        kind = classify(ref.url, ref.tag)
        internal = crawl.internal(ref.url) and kind not in (UrlKind.MAIL, UrlKind.PHONE)
        scope = Scope.INTERNAL if internal else Scope.EXTERNAL
        count += 1
        record = (
            LinkRecord(
                original_url=ref.url,
                normalized_url=normalize(ref.url) if ref.url.startswith("http") else ref.url,
                source_page=final,
                anchor_text=ref.text,
                tag=ref.tag,
                kind=kind.value,
                scope=scope,
                host=host_of(ref.url),
                path=path_of(ref.url) if ref.url.startswith("http") else "",
                extension=extension_of(ref.url),
                depth=item.depth + 1,
                discovered_at=now,
            )
        )
        crawl.links.append(record)
        if crawl.on_reference is not None:
            crawl.on_reference(record)
        if kind in LINK_KINDS:
            if internal and item.depth < crawl.request.max_depth:
                crawl.enqueue(ref.url, item.depth + 1, final, ref.text)
        elif kind not in (UrlKind.MAIL, UrlKind.PHONE):
            _resource(
                crawl,
                ref.url,
                kind,
                FrontierItem(url=ref.url, depth=item.depth + 1, source_page=final, anchor_text=ref.text),
            )
    for later in meta.next_pages:
        if crawl.internal(later):
            crawl.enqueue(later, item.depth, final, "next page")
    if crawl.request.paginate and "#page-" not in final:
        found = detect_pagination(response.text, final).next
        if found is not None and found.url and found.enabled and crawl.internal(found.url):
            crawl.enqueue(found.url, item.depth, final, "next page")
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
            discovered_at=now,
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
    log.info("[%d/%d] %s -> %s", n, crawl.request.max_pages, final, response.status)
    if crawl.on_page is not None:
        crawl.on_page(crawl.pages[-1], response.body)
