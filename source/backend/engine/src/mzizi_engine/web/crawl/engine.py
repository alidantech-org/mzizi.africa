"""The crawl loop: breadth-first, same-scope, deduplicated, resumable. External URLs are listed, never visited."""

from __future__ import annotations

import logging
import time
from collections import defaultdict, deque
from collections.abc import Callable
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import parse_qsl, urlsplit

from mzizi_engine.web.crawl.backends import PageBackend, PagedBackend
from mzizi_engine.web.crawl.cancel import CANCEL
from mzizi_engine.web.crawl.capture import final_key as _final_key
from mzizi_engine.web.crawl.capture import group_of, now, record_page, resource
from mzizi_engine.web.crawl.evidence import CrawlEvidence
from mzizi_engine.web.crawl.sitemaps import discover_sitemap_urls, partition
from mzizi_engine.web.crawl.state import CrawlState, digest_of, load_state, save_state
from mzizi_engine.web.records import (
    ErrorRecord,
    FrontierItem,
    LinkRecord,
    PageRecord,
    ResourceRecord,
)
from mzizi_engine.web.requests import CrawlRequest
from mzizi_fetch.web.blocks import BlockKind, Response
from mzizi_fetch.web.client import WebClient, WebResponse
from mzizi_fetch.web.urls import Deduplicator, UrlKind, classify, host_of, same_site
from mzizi_fetch.web.vocabulary import vocabulary

log = logging.getLogger("mzizi.crawl")
MAX_QUERY_VARIANTS = 6
RESTRICTED_KINDS = (
    BlockKind.NOTICE,
    BlockKind.FORBIDDEN,
    BlockKind.UNAUTHORIZED,
    BlockKind.SERVER_ERROR,
    BlockKind.CAPTCHA,
    BlockKind.CHALLENGE,
    BlockKind.TIMEOUT,
)
MAX_RESTRICTED_GROUPS = 3  # refusals from this many different parts of a site mean the site refuses us, not one section (a login form, an intranet)
SAVED_PAGE_FACTOR = 20  # pages served from saved copies are free of the fetch budget, up to this many times it
SAVE_EVERY = 10


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
    deferred: list[FrontierItem] = field(default_factory=list)
    evidence: CrawlEvidence = field(default_factory=CrawlEvidence)
    stopped: str = ""
    fetched: int = 0  # pages actually fetched this run (saved copies do not use the page budget)
    query_variants: dict[str, set[str]] = field(default_factory=lambda: defaultdict(set))
    visited_groups: dict[str, int] = field(default_factory=lambda: defaultdict(int))
    restricted_groups: set[str] = field(
        default_factory=set
    )  # parts of the site that say 'access denied' or need a login
    https_hosts: frozenset[str] = frozenset()  # hosts the crawl started on over https
    recorded_finals: set[str] = field(
        default_factory=set
    )  # where pages really ended up, so redirect aliases are not recorded twice
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
            listings=tuple(self.evidence.listings.values()),
            rendered_media=tuple(self.evidence.media.values()),
            deferred=tuple(self.deferred),
            request=self.request,
        )

    def next_item(self) -> FrontierItem:
        """The next page to fetch: from the least visited part of the site first, then the shallowest.

        A plain first-in-first-out order spends a small budget on hundreds of news posts linked from the home page and
        never reaches the sections behind them. Taking from the least visited group keeps coverage broad."""
        best, best_key = 0, None
        for index, item in enumerate(self.frontier):
            key = (self.visited_groups[group_of(item.url)], item.depth, index)
            if best_key is None or key < best_key:
                best, best_key = index, key
        item = self.frontier[best]
        del self.frontier[best]
        return item

    def drop_restricted(self) -> None:
        """Forgets queued pages of a part of the site that refused us: asking again would only repeat the refusal."""
        if self.restricted_groups:
            self.frontier = deque(i for i in self.frontier if group_of(i.url) not in self.restricted_groups)

    def enqueue(self, url: str, depth: int, source: str, anchor: str, *, seed: bool = False) -> None:
        parts = urlsplit(url)
        if (
            parts.scheme == "http" and parts.hostname in self.https_hosts
        ):  # the site is served over https: skip the redirect
            url = url.replace("http://", "https://", 1)
        query = urlsplit(url).query
        keys = {k.lower() for k, _ in parse_qsl(query)}
        identifies_content = bool(keys) and keys <= {k.lower() for k in vocabulary().content_query_keys}
        if (
            query and not identifies_content and not seed and anchor != "next page"
        ):  # many query variants of one path are usually a calendar or filter trap: keep a handful
            variants = self.query_variants[host_of(url) + parts.path]  # the path alone: path_of() carries the query
            if len(variants) >= MAX_QUERY_VARIANTS and query not in variants:
                return
            variants.add(query)
        if self.seen.add(url):
            self.frontier.append(FrontierItem(url=url, depth=depth, source_page=source, anchor_text=anchor))

    def internal(self, url: str) -> bool:
        hosts = self.request.allowed_hosts or self.start_hosts
        return any(same_site(h, host_of(url), self.request.include_subdomains) for h in hosts)


def start_crawl(
    request: CrawlRequest, client: WebClient, backend: PageBackend, evidence: CrawlEvidence | None = None
) -> Crawl:
    out_dir = Path(request.out_dir)
    starts = tuple(request.starts)
    digest = digest_of(request)
    crawl = Crawl(request, client, backend, out_dir, tuple(sorted({host_of(u) for u in starts})), digest)
    if evidence is not None:
        crawl.evidence = evidence
    crawl.https_hosts = frozenset(urlsplit(u).hostname or "" for u in starts if u.startswith("https://"))
    resumed = load_state(out_dir, digest) if request.resume else None
    if resumed is not None and not resumed.complete:
        crawl.evidence.listings.update((view.source_url, view) for view in resumed.listings)
        crawl.evidence.media.update((view.source_url, view) for view in resumed.rendered_media)
        for key in resumed.seen:
            crawl.seen.add(key)
        crawl.frontier.extend(resumed.frontier)
        queued = {item.url for item in resumed.frontier}
        crawl.frontier.extend(item for item in resumed.deferred if item.url not in queued)
        crawl.pages, crawl.links, crawl.resources, crawl.errors = (
            list(resumed.pages),
            list(resumed.links),
            list(resumed.resources),
            list(resumed.errors),
        )
        for page in crawl.pages:
            crawl.visited_groups[group_of(page.final_url)] += 1
            crawl.recorded_finals.add(_final_key(page.final_url))
            raw = out_dir / page.raw_file
            if raw.exists():
                crawl.html[page.n] = raw.read_text(encoding="utf-8", errors="replace")
        log.info("resuming: %d pages done, %d queued", len(crawl.pages), len(crawl.frontier))
        return crawl
    for url in starts:
        crawl.enqueue(url, 0, "", "", seed=True)
    if request.sitemap:
        pages, files = partition(discover_sitemap_urls(client, starts))
        for url in pages:
            if crawl.internal(url):
                crawl.enqueue(url, 1, "sitemap", "")
        for url, kind in files:  # listed by the sitemap but not pages: inventoried for download, never fetched as pages
            if crawl.internal(url):
                resource(crawl, url, kind, FrontierItem(url=url, depth=1, source_page="sitemap", anchor_text=""))
    return crawl


def run(crawl: Crawl) -> None:
    request, out_dir = crawl.request, crawl.out_dir
    if crawl.on_page is None:
        (out_dir / "raw").mkdir(parents=True, exist_ok=True)
    started = time.monotonic()
    while (
        crawl.frontier
        and crawl.fetched < request.max_pages
        and len(crawl.pages) < request.max_pages * SAVED_PAGE_FACTOR
        and not crawl.stopped
    ):
        if CANCEL.is_set():
            crawl.stopped = "interrupted: finishing what was fetched"
            break
        if request.max_seconds and time.monotonic() - started > request.max_seconds:
            crawl.stopped = f"time budget of {request.max_seconds} s reached"
            break
        item = crawl.next_item()
        response = crawl.backend.get(item.url)
        if not _accept(crawl, item, response):
            if response.error or (
                response.block is not None
                and response.block.kind
                in (
                    BlockKind.TIMEOUT,
                    BlockKind.SERVER_ERROR,
                    BlockKind.RATE_LIMITED,
                )
            ):
                crawl.deferred.append(item)
            continue
        if response.headers.get("x-mzizi-via") != "cache":
            crawl.fetched += 1
        record_page(crawl, item, response)
        for extra in crawl.backend.take_extra(item.url) if isinstance(crawl.backend, PagedBackend) else ():
            if len(crawl.pages) >= request.max_pages * SAVED_PAGE_FACTOR:
                break
            record_page(crawl, item, extra)
        if len(crawl.pages) % SAVE_EVERY == 0:
            save_state(out_dir, crawl.snapshot(False))
    if crawl.frontier and crawl.fetched >= request.max_pages and not crawl.stopped:
        crawl.stopped = f"page budget of {request.max_pages} reached"


def _error(crawl: Crawl, url: str, stage: str, kind: str, detail: str, response: str = "", attempt: int = 0) -> None:
    crawl.errors.append(
        ErrorRecord(url=url, stage=stage, kind=kind, detail=detail, response=response, attempt=attempt, at=now())
    )
    log.warning("%s %s: %s %s", stage, url, kind, detail)


def _accept(crawl: Crawl, item: FrontierItem, response: WebResponse) -> bool:
    """True when `response` is a page to process; otherwise the reason is recorded."""
    if response.refused is not None or response.block is not None or response.error:
        crawl.visited_groups[group_of(item.url)] += (
            1  # a failed attempt counts for ordering, so failures do not run back to back
        )
    if response.refused is not None:
        _error(crawl, item.url, "policy", "refused", response.refused.reason)
        if response.refused.reason.startswith("request budget"):  # the ceiling is a stop, not 3,000 separate errors
            crawl.stopped = f"stopped: {response.refused.reason}"
        return False
    if response.block is not None and response.decision is not None:
        decision = response.decision
        _error(crawl, item.url, "block", decision.kind, decision.detail, decision.response, decision.attempt)
        if decision.response == Response.STOP.value:
            group = group_of(item.url)
            if (
                response.block.kind in RESTRICTED_KINDS
                and len(crawl.restricted_groups | {group}) < MAX_RESTRICTED_GROUPS
            ):
                # one section refuses us (an intranet, a members area): leave it alone and carry on with the rest of the site
                crawl.restricted_groups.add(group)
                crawl.client.blocks.consecutive = 0
                crawl.drop_restricted()
                log.info("section %r refuses access or fails (4xx/5xx); skipping it", group)
            else:
                crawl.stopped = f"stopped: {decision.reason} at {item.url}"
        return False
    if response.error:
        _error(crawl, item.url, "transport", "error", response.error)
        return False
    if not response.is_html:
        resource(
            crawl,
            item.url,
            classify(response.final_url, "a") if classify(response.final_url) is not UrlKind.PAGE else UrlKind.DOCUMENT,
            item,
            response,
        )
        return False
    return True
