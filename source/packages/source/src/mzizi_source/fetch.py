"""Polite, bounded, identified HTTP access. Every request passes the collection gate first.

No stealth, no proxies, no identity rotation, no credential use. A refusal or challenge stops the run
and trips the circuit breaker; nothing here retries around a restriction.
"""

from __future__ import annotations

import hashlib
import json
import random
import time
from collections.abc import Callable
from dataclasses import dataclass, field
from pathlib import Path
from urllib import robotparser
from urllib.parse import urlparse

import httpx

from .compliance import Denied, Limits, RateLimiter, StopRun, detect_challenge
from .gate import Decision

GateCheck = Callable[[dict], Decision]


class RobotsDisallowed(Exception):
    pass


class TooLarge(Exception):
    pass


@dataclass
class FetchResult:
    url: str
    status: int
    headers: dict[str, str]
    body: bytes
    from_cache: bool = False
    assessment_id: str | None = None


@dataclass
class PoliteFetcher:
    user_agent: str
    limits: Limits
    gate: GateCheck
    site_id: str
    fetch_mode: str = "http"
    client: httpx.Client | None = None
    cache_dir: Path | None = None
    sleep: Callable[[float], None] = time.sleep
    clock: Callable[[], float] = time.monotonic
    robots_policy: str = "respect"
    # Path prefixes of a documented machine API that robots.txt (written for web crawlers) disallows; those requests skip the robots
    # check but still pass the gate, the rate limit and the stop-on-restriction rules. Used only for the Wikimedia API (DEC-WIKIMEDIA-API-ACCESS).
    robots_exempt_paths: tuple[str, ...] = ()
    log: list[dict] = field(default_factory=list)
    _limiters: dict[str, RateLimiter] = field(default_factory=dict)
    _robots: dict[str, robotparser.RobotFileParser | None] = field(default_factory=dict)
    _consecutive_5xx: int = 0
    tripped: StopRun | None = None

    def __post_init__(self) -> None:
        self.client = self.client or httpx.Client(follow_redirects=False)

    # ------------------------------------------------------------------------------------------
    def _gate(self, host: str, scheme: str, path: str, purpose: str) -> Decision:
        decision = self.gate(
            {
                "siteId": self.site_id,
                "host": host,
                "scheme": scheme,
                "path": path,
                "method": "GET",
                "fetchMode": self.fetch_mode,
                "purpose": purpose,
                "requestsPerSecond": self.limits.requests_per_second,
            }
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

    def _cache_path(self, url: str) -> Path | None:
        return self.cache_dir / (hashlib.sha256(url.encode()).hexdigest() + ".json") if self.cache_dir else None

    def _load_cache(self, url: str) -> dict | None:
        path = self._cache_path(url)
        if path and path.exists():
            data = json.loads(path.read_text())
            data["body"] = bytes.fromhex(data["body"])
            return data
        return None

    def _store_cache(self, url: str, response: FetchResult) -> None:
        path = self._cache_path(url)
        validators = {k: v for k, v in response.headers.items() if k.lower() in ("etag", "last-modified")}
        if path and validators:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps({"headers": validators, "body": response.body.hex()}))

    def _trip(self, kind: str, message: str) -> StopRun:
        self.tripped = StopRun(kind, message)
        self.log.append({"event": "stop", "kind": kind, "message": message})
        return self.tripped

    def _request(self, url: str, conditional: bool) -> httpx.Response:
        headers = {"User-Agent": self.user_agent, "Accept": "*/*"}
        cached = self._load_cache(url) if conditional else None
        if cached:
            if "etag" in {k.lower() for k in cached["headers"]}:
                headers["If-None-Match"] = next(v for k, v in cached["headers"].items() if k.lower() == "etag")
            if "last-modified" in {k.lower() for k in cached["headers"]}:
                headers["If-Modified-Since"] = next(
                    v for k, v in cached["headers"].items() if k.lower() == "last-modified"
                )
        assert self.client is not None  # set in __post_init__
        with self.client.stream("GET", url, headers=headers, timeout=self.limits.timeout_seconds) as response:
            declared = int(response.headers.get("content-length", "0") or 0)
            if declared > self.limits.max_response_bytes:
                raise TooLarge(f"{declared} bytes declared, limit {self.limits.max_response_bytes}")
            chunks, size = [], 0
            for chunk in response.iter_bytes():
                size += len(chunk)
                if size > self.limits.max_response_bytes:
                    raise TooLarge(f"response exceeds {self.limits.max_response_bytes} bytes")
                chunks.append(chunk)
            response._content = b"".join(chunks)
        response.extensions["mzizi_cached"] = cached
        return response

    # ------------------------------------------------------------------------------------------
    def robots_allows(self, scheme: str, host: str, path: str) -> bool:
        if self.robots_policy != "respect":
            return True
        if host not in self._robots:
            parser: robotparser.RobotFileParser | None = robotparser.RobotFileParser()
            try:
                result = self.get(f"{scheme}://{host}/robots.txt", purpose="assess", _robots=True)
                if result.status in (404, 410):
                    parser = robotparser.RobotFileParser()
                    parser.parse([])  # no robots file: nothing is disallowed
                elif result.status >= 500:
                    parser = None  # robots unavailable: treat as disallow all
                else:
                    parser = robotparser.RobotFileParser()
                    parser.parse(result.body.decode("utf-8", errors="ignore").splitlines())
            except StopRun:
                raise
            self._robots[host] = parser
        parser = self._robots[host]
        return bool(parser and parser.can_fetch(self.user_agent, path))

    def get(self, url: str, purpose: str = "collect", _robots: bool = False) -> FetchResult:
        if self.tripped:
            raise self.tripped
        parsed = urlparse(url)
        host, path = parsed.netloc, parsed.path or "/"
        decision = self._gate(host, parsed.scheme, path, purpose)
        if (
            not _robots
            and not path.startswith(self.robots_exempt_paths or ("\0",))
            and not self.robots_allows(parsed.scheme, host, path)
        ):
            self.log.append({"event": "robots_disallowed", "url": url})
            raise RobotsDisallowed(url)
        limiter = self._limiter(host, decision)
        attempts = 0
        while True:
            limiter.wait()
            attempts += 1
            try:
                response = self._request(url, conditional=True)
            except (httpx.TimeoutException, httpx.TransportError):
                if attempts > self.limits.max_retries:
                    raise
                self.sleep(min(60.0, 2**attempts) * random.uniform(0.5, 1.5))
                continue
            status = response.status_code
            if _robots and status in (
                401,
                403,
            ):  # RFC 9309: a robots.txt that is unavailable to us means no rules were published
                return FetchResult(url, 404, {}, b"", False, decision.assessment_id)
            if status in (401, 403, 429):
                raise self._trip(str(status), f"{url} answered {status}; stopping (no retry around a restriction)")
            if status >= 500:
                self._consecutive_5xx += 1
                if self._consecutive_5xx >= 3:
                    raise self._trip("repeated_5xx", f"{url} answered {status} repeatedly")
                if attempts > self.limits.max_retries:
                    raise httpx.HTTPStatusError(f"{status} from {url}", request=response.request, response=response)
                self.sleep(min(60.0, 2**attempts) * random.uniform(0.5, 1.5))
                continue
            self._consecutive_5xx = 0
            headers = dict(response.headers)
            reason = detect_challenge(status, headers, response.content[:8000])
            if reason:
                raise self._trip("access_challenge", f"{url} looks like an access challenge ({reason})")
            if status == 304 and response.extensions.get("mzizi_cached"):
                self.log.append({"event": "cache_hit", "url": url})
                return FetchResult(
                    url,
                    200,
                    response.extensions["mzizi_cached"]["headers"],
                    response.extensions["mzizi_cached"]["body"],
                    True,
                    decision.assessment_id,
                )
            result = FetchResult(url, status, headers, response.content, False, decision.assessment_id)
            if status == 200:
                self._store_cache(url, result)
            self.log.append({"event": "fetch", "url": url, "status": status, "bytes": len(result.body)})
            return result
