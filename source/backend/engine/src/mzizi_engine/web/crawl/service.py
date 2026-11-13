"""Entry point of a crawl: builds the policy and the client, runs the loop, writes the exports."""

from __future__ import annotations

from mzizi_engine.web.crawl.backends import PageBackend
from mzizi_engine.web.crawl.engine import run, start_crawl
from mzizi_engine.web.crawl.inventory import CrawlSummary, finish
from mzizi_engine.web.requests import ON_BLOCK_RESPONSE, CrawlRequest
from mzizi_fetch.web.blocks import BlockKind, BlockPolicy
from mzizi_fetch.web.client import WebClient
from mzizi_fetch.web.policy import SourcePolicy
from mzizi_fetch.web.urls import host_of, validate

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
        max_requests=request.max_pages * 4 + 50,
        max_concurrency=request.concurrency,
        requests_per_second=1.0 / request.delay if request.delay > 0 else 100.0,
    )


def block_policy_for(request: CrawlRequest) -> BlockPolicy:
    response = ON_BLOCK_RESPONSE[request.on_block]
    return BlockPolicy(responses={kind: response for kind in BLOCK_KINDS_WITH_CONFIGURED_RESPONSE})


def client_for(request: CrawlRequest, user_agent: str) -> WebClient:
    for url in request.starts:
        validate(url)
    return WebClient(
        user_agent,
        policy_for(request),
        tuple(sorted({host_of(u) for u in request.starts})),
        blocks=block_policy_for(request),
    )


def run_crawl(request: CrawlRequest, client: WebClient, backend: PageBackend) -> CrawlSummary:
    crawl = start_crawl(request, client, backend)
    run(crawl)
    return finish(crawl)
