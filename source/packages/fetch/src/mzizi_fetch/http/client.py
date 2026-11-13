"""Polite, bounded, identified HTTP access. Every request passes the collection gate first.

No stealth, no proxies, no identity rotation, no credential use. A refusal or challenge stops the run and trips the
circuit breaker; nothing here retries around a restriction.
"""

from __future__ import annotations

import random
import time
from collections.abc import Callable
from dataclasses import dataclass, field
from pathlib import Path
from urllib import robotparser
from urllib.parse import urlparse

import httpx

from ..policy import (
    Decision,
    Denied,
    FetchMode,
    GateCheck,
    GateRequest,
    Limits,
    Purpose,
    RobotsDisallowed,
    StopRun,
    UpstreamError,
)
from .cache import CachedResponse, ResponseCache
from .models import CacheHit, Fetched, FetchEvent, FetchResult, RobotsBlocked, Stopped
from .rate import RateLimiter
from .transport import RawResponse, get_once

type ChallengeCheck = Callable[[int, dict[str, str], bytes], str | None]

STOP_STATUSES = frozenset({401, 403, 429})
ROBOTS_NOT_PUBLISHED = frozenset({404, 410})
REPEATED_5XX = 3
CHALLENGE_SAMPLE_BYTES = 8000
MAX_BACKOFF_SECONDS = 60.0
ROBOTS_RESPECT = "respect"


@dataclass
class PoliteFetcher:
    user_agent: str
    limits: Limits
    gate: GateCheck
    site_id: str
    fetch_mode: FetchMode = FetchMode.HTTP
    client: httpx.Client = field(default_factory=lambda: httpx.Client(follow_redirects=False))
    cache_dir: Path | None = None
    sleep: Callable[[float], None] = time.sleep
    clock: Callable[[], float] = time.monotonic
    robots_policy: str = ROBOTS_RESPECT
    # Injected response check (for example mzizi_scraping.detect_challenge); returns a reason to stop the run.
    challenge_check: ChallengeCheck | None = None
    # Path prefixes of a documented machine API that robots.txt (written for crawlers) disallows. Such requests skip
    # the robots check but still pass the gate, the rate limit and the stop rules (DEC-WIKIMEDIA-API-ACCESS).
    robots_exempt_paths: tuple[str, ...] = ()
    log: list[FetchEvent] = field(default_factory=list)
    tripped: StopRun | None = None
    _limiters: dict[str, RateLimiter] = field(default_factory=dict)
    _robots: dict[str, robotparser.RobotFileParser | None] = field(default_factory=dict)
    _consecutive_5xx: int = 0

    def __post_init__(self) -> None:
        self._cache = ResponseCache(self.cache_dir)

    # -- gate, limits, stop ---------------------------------------------------------------------
    def _gate(self, host: str, scheme: str, path: str, purpose: Purpose) -> Decision:
        decision = self.gate(
            GateRequest(
                site_id=self.site_id,
                host=host,
                scheme=scheme,
                path=path,
                fetch_mode=self.fetch_mode,
                purpose=purpose,
                requests_per_second=self.limits.requests_per_second,
            )
        )
        if not decision.allowed:
            raise Denied(decision.reasons, decision.assessment_id)
        return decision

    def _limiter(self, host: str, decision: Decision) -> RateLimiter:
        rps = min(self.limits.requests_per_second, decision.requests_per_second or self.limits.requests_per_second)
        limiter = self._limiters.get(host)
        if limiter is None or limiter.interval < 1.0 / rps:
            limiter = RateLimiter(rps, self.clock, self.sleep)
            self._limiters[host] = limiter
        return limiter

    def _trip(self, kind: str, message: str) -> StopRun:
        self.tripped = StopRun(kind, message)
        self.log.append(Stopped(kind=kind, message=message))
        return self.tripped

    def _backoff(self, attempts: int) -> None:
        self.sleep(min(MAX_BACKOFF_SECONDS, 2**attempts) * random.uniform(0.5, 1.5))

    # -- one request ----------------------------------------------------------------------------
    def _request(self, url: str, cached: CachedResponse | None) -> RawResponse:
        headers = {"User-Agent": self.user_agent, "Accept": "*/*"}
        if cached is not None:
            if (etag := cached.validator("etag")) is not None:
                headers["If-None-Match"] = etag
            if (modified := cached.validator("last-modified")) is not None:
                headers["If-Modified-Since"] = modified
        return get_once(self.client, url, headers, self.limits)

    # -- robots ---------------------------------------------------------------------------------
    def robots_allows(self, scheme: str, host: str, path: str) -> bool:
        if self.robots_policy != ROBOTS_RESPECT:
            return True
        if host not in self._robots:
            result = self.get(f"{scheme}://{host}/robots.txt", purpose=Purpose.ASSESS, _robots=True)
            parser: robotparser.RobotFileParser | None
            if result.status >= 500:
                parser = None  # robots unavailable: treat as disallow all
            else:
                parser = robotparser.RobotFileParser()
                published = result.status not in ROBOTS_NOT_PUBLISHED
                parser.parse(result.body.decode("utf-8", errors="ignore").splitlines() if published else [])
            self._robots[host] = parser
        parser = self._robots[host]
        return bool(parser and parser.can_fetch(self.user_agent, path))

    # -- public ---------------------------------------------------------------------------------
    def get(self, url: str, purpose: Purpose = Purpose.COLLECT, _robots: bool = False) -> FetchResult:
        if self.tripped:
            raise self.tripped
        parsed = urlparse(url)
        host, path = parsed.netloc, parsed.path or "/"
        decision = self._gate(host, parsed.scheme, path, purpose)
        exempt = bool(self.robots_exempt_paths) and path.startswith(self.robots_exempt_paths)
        if not _robots and not exempt and not self.robots_allows(parsed.scheme, host, path):
            self.log.append(RobotsBlocked(url=url))
            raise RobotsDisallowed(url)
        limiter = self._limiter(host, decision)
        cached = self._cache.load(url)
        attempts = 0
        while True:
            limiter.wait()
            attempts += 1
            try:
                raw = self._request(url, cached)
            except (httpx.TimeoutException, httpx.TransportError):
                if attempts > self.limits.max_retries:
                    raise
                self._backoff(attempts)
                continue
            if raw.status >= 500 and not _robots:
                self._consecutive_5xx += 1
                if self._consecutive_5xx >= REPEATED_5XX:
                    raise self._trip("repeated_5xx", f"{url} answered {raw.status} repeatedly")
                if attempts > self.limits.max_retries:
                    raise UpstreamError(url, raw.status)
                self._backoff(attempts)
                continue
            return self._finish(url, raw, cached, decision, _robots)

    def _finish(
        self, url: str, raw: RawResponse, cached: CachedResponse | None, decision: Decision, robots: bool
    ) -> FetchResult:
        assessment = decision.assessment_id
        if robots and raw.status in (401, 403):  # RFC 9309: an unavailable robots.txt means no rules were published
            return FetchResult(url=url, status=404, headers={}, body=b"", assessment_id=assessment)
        if raw.status in STOP_STATUSES:
            raise self._trip(str(raw.status), f"{url} answered {raw.status}; stopping (no retry around a restriction)")
        self._consecutive_5xx = 0
        reason = (
            self.challenge_check(raw.status, raw.headers, raw.body[:CHALLENGE_SAMPLE_BYTES])
            if self.challenge_check
            else None
        )
        if reason:
            raise self._trip("access_challenge", f"{url} looks like an access challenge ({reason})")
        if raw.status == 304 and cached is not None:
            self.log.append(CacheHit(url=url))
            return FetchResult(
                url=url,
                status=200,
                headers=cached.headers,
                body=cached.content,
                from_cache=True,
                assessment_id=assessment,
            )
        result = FetchResult(url=url, status=raw.status, headers=raw.headers, body=raw.body, assessment_id=assessment)
        if raw.status == 200:
            self._cache.store(url, result)
        self.log.append(Fetched(url=url, status=raw.status, size=len(raw.body)))
        return result
