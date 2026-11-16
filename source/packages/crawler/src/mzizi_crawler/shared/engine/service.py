"""Entry point of a crawl: builds the policy and the client, runs the loop, writes the exports."""

from __future__ import annotations

from collections.abc import Callable
from pathlib import Path

from mzizi_crawler.shared.engine.backends import PageBackend
from mzizi_crawler.shared.engine.engine import run, start_crawl
from mzizi_crawler.shared.engine.evidence import CrawlEvidence
from mzizi_crawler.shared.engine.governor import active_governor, permit
from mzizi_crawler.shared.engine.inventory import CrawlSummary, finish
from mzizi_crawler.shared.layout import DevLayout, address_of
from mzizi_crawler.shared.records import LinkRecord, PageRecord
from mzizi_crawler.shared.requests import ON_BLOCK_RESPONSE, CrawlRequest
from mzizi_fetch.web.blocks import BlockKind, BlockPolicy, Response
from mzizi_fetch.web.client import WebClient
from mzizi_fetch.web.policy import SourcePolicy
from mzizi_fetch.web.urls import host_of, validate

# requests include redirect hops, missing pages, robots and sitemaps, so the ceiling is a multiple of the page budget
REQUESTS_PER_PAGE = 25
REQUEST_HEADROOM = 500
BLOCK_KINDS_WITH_CONFIGURED_RESPONSE = (
    BlockKind.RATE_LIMITED,
    BlockKind.FORBIDDEN,
    BlockKind.CAPTCHA,
    BlockKind.CHALLENGE,
    BlockKind.NOTICE,
)


def policy_for(request: CrawlRequest) -> SourcePolicy:
    hosts = request.allowed_hosts or tuple(sorted({host_of(u) for u in request.starts}))
    return SourcePolicy(
        robots_mode=request.robots_mode,
        authorization=request.authorization,
        allowed_hosts=hosts,
        allowed_paths=request.allowed_paths,
        excluded_paths=request.excluded_paths,
        include_subdomains=request.include_subdomains,
        max_requests=request.max_pages * REQUESTS_PER_PAGE + REQUEST_HEADROOM,
        max_concurrency=request.concurrency,
        requests_per_second=1.0 / request.delay if request.delay > 0 else 100.0,
    )


def block_policy_for(request: CrawlRequest) -> BlockPolicy:
    response = ON_BLOCK_RESPONSE[request.on_block]
    responses = {kind: response for kind in BLOCK_KINDS_WITH_CONFIGURED_RESPONSE}
    responses[BlockKind.RATE_LIMITED] = Response.BACK_OFF  # a 429 asks us to slow down; it is never a reason to stop
    return BlockPolicy(responses=responses)


def extra_ca_bundle(host: str) -> Path | None:
    """`.dev/secure/<registrable label>-ca-bundle.pem` when present (for example `knbs-ca-bundle.pem` for knbs.or.ke)."""
    group = address_of(host).group
    candidate = DevLayout.locate().root / "secure" / f"{group[-1]}-ca-bundle.pem"
    return candidate if candidate.is_file() else None


def client_for(request: CrawlRequest, user_agent: str) -> WebClient:
    for url in request.starts:
        validate(url)
    first = host_of(request.starts[0]) if request.starts else ""
    return WebClient(
        user_agent,
        policy_for(request),
        tuple(sorted({host_of(u) for u in request.starts})),
        blocks=block_policy_for(request),
        permit=permit if active_governor() is not None else None,
        extra_ca_bundle=extra_ca_bundle(first) if first else None,
    )


def run_crawl(
    request: CrawlRequest,
    client: WebClient,
    backend: PageBackend,
    on_page: Callable[[PageRecord, bytes], None] | None = None,
    on_reference: Callable[[LinkRecord], None] | None = None,
    evidence: CrawlEvidence | None = None,
) -> CrawlSummary:
    crawl = start_crawl(request, client, backend, evidence)
    crawl.on_page = on_page
    crawl.on_reference = on_reference
    run(crawl)
    return finish(crawl)
