"""A reusable HTTP client: GET and HEAD, scope and robots decisions, spacing, conditional requests, retries.

Transport only: it returns bytes and metadata and never parses HTML. Every failure is classified (`blocks.py`) and
answered by the configured block policy; each decision and each request is kept as an audit/provenance record.
"""

from __future__ import annotations

import threading
import ssl
import time
from collections.abc import Callable
from concurrent.futures import ThreadPoolExecutor
from datetime import UTC, datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import httpx

from mzizi_fetch.http.cache import CachedResponse, ResponseCache
from mzizi_fetch.http.models import FetchResult
from mzizi_fetch.http.rate import RateLimiter
from mzizi_fetch.models import Frozen
from mzizi_fetch.web.blocks import Block, BlockDecision, BlockPolicy, Response, detect_block
from mzizi_fetch.web.policy import Decision, SourcePolicy, robots_decision, scope_decision
from mzizi_fetch.web.urls import host_of, normalize, origin_of

MAX_REDIRECTS = 10
DEFAULT_TIMEOUT = 30.0
DEFAULT_MAX_BYTES = 32 * 1024 * 1024
HTML_TYPES = ("text/html", "application/xhtml")
SERVER_ERROR_FLOOR = 500
NOT_MODIFIED = 304
OK = 200


class Provenance(Frozen):
    url: str
    final_url: str
    method: str
    status: int
    started_at: str
    seconds: float
    attempts: int
    from_cache: bool
    redirects: tuple[str, ...]
    user_agent: str


class WebResponse(Frozen):
    url: str
    final_url: str
    status: int
    headers: dict[str, str]
    body: bytes
    redirects: tuple[str, ...] = ()
    from_cache: bool = False
    block: Block | None = None
    decision: BlockDecision | None = None
    refused: Decision | None = None  # scope, budget or robots refused the request; nothing was sent
    error: str = ""

    @property
    def content_type(self) -> str:
        return {k.lower(): v for k, v in self.headers.items()}.get("content-type", "").split(";")[0].strip().lower()

    @property
    def content_length(self) -> int | None:
        value = {k.lower(): v for k, v in self.headers.items()}.get("content-length", "")
        return int(value) if value.isdigit() else None

    @property
    def is_html(self) -> bool:
        return self.content_type.startswith(HTML_TYPES) or (
            not self.content_type and b"<html" in self.body[:2000].lower()
        )

    @property
    def text(self) -> str:
        return self.body.decode("utf-8", errors="replace")

    @property
    def usable(self) -> bool:
        return self.refused is None and not self.error and self.block is None and 200 <= self.status < 400


def _trust(extra: Path | None) -> ssl.SSLContext | bool:
    """The system trust store plus one extra CA bundle (for a site that sends an incomplete certificate chain)."""
    if extra is None:
        return True
    context = ssl.create_default_context()
    context.load_verify_locations(cafile=str(extra))
    return context


class WebClient:
    def __init__(
        self,
        user_agent: str,
        policy: SourcePolicy,
        start_hosts: tuple[str, ...],
        *,
        blocks: BlockPolicy | None = None,
        cache_dir: Path | None = None,
        timeout: float = DEFAULT_TIMEOUT,
        max_bytes: int = DEFAULT_MAX_BYTES,
        headers: dict[str, str] | None = None,
        transport: httpx.BaseTransport | None = None,
        extra_ca_bundle: Path | None = None,
        sleep: Callable[[float], None] = time.sleep,
        clock: Callable[[], float] = time.monotonic,
    ) -> None:
        policy.validate_authorization()
        self.user_agent, self.policy, self.start_hosts = user_agent, policy, start_hosts
        self.blocks = blocks or BlockPolicy()
        self.max_bytes, self.sleep, self.clock = max_bytes, sleep, clock
        self.headers = {"User-Agent": user_agent, "Accept": "*/*", **(headers or {})}
        self.http = httpx.Client(
            follow_redirects=False, timeout=timeout, transport=transport, verify=_trust(extra_ca_bundle)
        )
        self.cache = ResponseCache(cache_dir)
        self.provenance: list[Provenance] = []
        self.audit: list[Decision] = []
        self.requests_made = 0
        self.interval_scale = 1.0
        self._limiters: dict[str, RateLimiter] = {}
        self._robots: dict[str, RobotFileParser | None] = {}
        self._lock = threading.RLock()

    # --- policy ------------------------------------------------------------------------------------------
    def robots_for(self, url: str) -> Decision:
        """The robots decision for `url` under the source policy; the observation is recorded."""
        origin = origin_of(url)
        with self._lock:
            known = origin in self._robots
        if not known:
            parser = self._load_robots(origin)
            with self._lock:
                self._robots[origin] = parser
        parser = self._robots[origin]
        if parser is None:
            observation = "unavailable"
        else:
            observation = "allowed" if parser.can_fetch(self.user_agent, url) else "disallowed"
        decision = robots_decision(self.policy, url, observation)
        with self._lock:
            self.audit.append(decision)
        return decision

    def _load_robots(self, origin: str) -> RobotFileParser | None:
        parser = RobotFileParser()
        try:
            response = self.http.get(f"{origin}/robots.txt", headers=self.headers)
        except httpx.HTTPError:
            return None
        if response.status_code >= SERVER_ERROR_FLOOR:
            return None
        parser.parse(response.text.splitlines() if response.status_code == 200 else [])
        return parser

    def crawl_delay(self, url: str) -> float | None:
        parser = self._robots.get(origin_of(url))
        delay = parser.crawl_delay(self.user_agent) if parser else None
        return float(delay) if delay else None

    def _refuse(self, url: str, reason: str, observation: str = "not_checked") -> WebResponse:
        decision = Decision(
            url=url,
            allowed=False,
            reason=reason,
            robots_mode=self.policy.robots_mode.value,
            robots_observation=observation,
        )
        with self._lock:
            self.audit.append(decision)
        return WebResponse(url=url, final_url=url, status=0, headers={}, body=b"", refused=decision)

    def _limiter(self, host: str) -> RateLimiter:
        with self._lock:
            limiter = self._limiters.get(host)
            if limiter is None:
                limiter = RateLimiter(self.policy.requests_per_second / self.interval_scale, self.clock, self.sleep)
                self._limiters[host] = limiter
            return limiter

    def slow_down(self) -> None:
        with self._lock:
            self.interval_scale = min(self.interval_scale * 2, 60.0)
            self._limiters.clear()

    def wait_for_slot(self, url: str) -> None:
        """Apply the source's request spacing to an HTTP request or browser navigation."""
        self._limiter(host_of(url)).wait()

    # --- requests ----------------------------------------------------------------------------------------
    def get(self, url: str, *, conditional: bool = True) -> WebResponse:
        return self._request("GET", url, conditional)

    def head(self, url: str) -> WebResponse:
        return self._request("HEAD", url, False)

    def get_many(self, urls: list[str]) -> list[WebResponse]:
        """Fetches concurrently (bounded by the policy); the result order matches `urls`."""
        with ThreadPoolExecutor(max_workers=max(1, self.policy.max_concurrency)) as pool:
            return list(pool.map(self.get, urls))

    def preflight(self, url: str) -> WebResponse | None:
        """Scope, request budget and robots for `url`. A refusal is returned (and audited); None means go ahead, and the
        request is counted against the budget. Adapters that fetch by other means (a browser) call this first."""
        allowed, why = scope_decision(self.policy, url, self.start_hosts)
        if not allowed:
            return self._refuse(url, why)
        with self._lock:
            if self.requests_made >= self.policy.max_requests:
                return self._refuse(url, f"request budget of {self.policy.max_requests} used")
        robots = self.robots_for(url)
        if not robots.allowed:
            return WebResponse(url=url, final_url=url, status=0, headers={}, body=b"", refused=robots)
        with self._lock:
            self.requests_made += 1
        return None

    def _request(self, method: str, url: str, conditional: bool) -> WebResponse:
        refusal = self.preflight(url)
        if refusal is not None:
            return refusal
        started, begin = datetime.now(UTC).isoformat(timespec="seconds"), self.clock()
        cached = self.cache.load(url) if conditional and method == "GET" else None
        response, attempt = self._attempts(method, url, cached)
        if response.status == NOT_MODIFIED and cached:
            response = WebResponse(
                url=url,
                final_url=response.final_url,
                status=200,
                headers=cached.headers,
                body=cached.content,
                from_cache=True,
                redirects=response.redirects,
            )
        elif method == "GET" and response.status == OK and response.block is None:
            self.cache.store(url, FetchResult(url=url, status=200, headers=response.headers, body=response.body))
        with self._lock:
            self.provenance.append(
                Provenance(
                    url=url,
                    final_url=response.final_url,
                    method=method,
                    status=response.status,
                    started_at=started,
                    seconds=round(self.clock() - begin, 3),
                    attempts=attempt + 1,
                    from_cache=response.from_cache,
                    redirects=response.redirects,
                    user_agent=self.user_agent,
                )
            )
        return response

    def _attempts(self, method: str, url: str, cached: CachedResponse | None) -> tuple[WebResponse, int]:
        """Sends the request until it succeeds or the block policy says to stop retrying; returns the last response."""
        attempt = 0
        retrying = (Response.RETRY.value, Response.BACK_OFF.value, Response.SLOW_DOWN.value, Response.RETRY_LATER.value)
        while True:
            self.wait_for_slot(url)
            response = self._once(method, url, cached)
            block = detect_block(response.status, response.headers, response.body, response.error)
            if block is None or (response.status == NOT_MODIFIED and cached):
                self.blocks.ok()
                return response, attempt
            decision = self.blocks.decide(url, block, attempt, response.headers)
            response = response.model_copy(update={"block": block, "decision": decision})
            if decision.response not in retrying:
                return response, attempt
            if decision.response == Response.SLOW_DOWN.value:
                self.slow_down()
            self.sleep(decision.wait_seconds)
            attempt += 1

    def _once(self, method: str, url: str, cached: CachedResponse | None) -> WebResponse:
        headers = dict(self.headers)
        if cached is not None:
            if (etag := cached.validator("etag")) is not None:
                headers["If-None-Match"] = etag
            if (modified := cached.validator("last-modified")) is not None:
                headers["If-Modified-Since"] = modified
        chain: list[str] = []
        current = url
        try:
            for _ in range(MAX_REDIRECTS + 1):
                with self.http.stream(method, current, headers=headers) as reply:
                    if reply.is_redirect and reply.headers.get("location"):
                        target = urljoin(current, reply.headers["location"])
                        chain.append(target)
                        allowed, why = scope_decision(self.policy, target, self.start_hosts)
                        if not allowed:
                            return WebResponse(
                                url=url,
                                final_url=current,
                                status=reply.status_code,
                                headers=dict(reply.headers),
                                body=b"",
                                redirects=tuple(chain),
                                error=f"redirect left the allowed scope: {why}",
                            )
                        current = target
                        continue
                    body = bytearray()
                    for chunk in reply.iter_bytes():
                        body.extend(chunk)
                        if len(body) > self.max_bytes:
                            return WebResponse(
                                url=url,
                                final_url=current,
                                status=reply.status_code,
                                headers=dict(reply.headers),
                                body=bytes(body),
                                redirects=tuple(chain),
                                error=f"body exceeds {self.max_bytes} bytes",
                            )
                    return WebResponse(
                        url=url,
                        final_url=normalize(current) if urlparse(current).path == "" else current,
                        status=reply.status_code,
                        headers=dict(reply.headers),
                        body=bytes(body),
                        redirects=tuple(chain),
                    )
            return WebResponse(
                url=url,
                final_url=current,
                status=0,
                headers={},
                body=b"",
                redirects=tuple(chain),
                error="too many redirects",
            )
        except httpx.HTTPError as problem:
            return WebResponse(
                url=url,
                final_url=current,
                status=0,
                headers={},
                body=b"",
                redirects=tuple(chain),
                error=f"{type(problem).__name__}: {str(problem)[:150]}",
            )

    def close(self) -> None:
        self.http.close()
