"""How a crawl obtains a page: plain HTTP through the web client, or a real browser under the same policy."""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Protocol

from mzizi_engine.web.browser.adapter import BrowserSession
from mzizi_engine.web.browser.challenge import ChallengeHandler, detect_challenge
from mzizi_engine.web.browser.models import RenderedPage
from mzizi_fetch.web.blocks import Response, detect_block
from mzizi_fetch.web.client import WebClient, WebResponse
from mzizi_fetch.web.policy import scope_decision
from mzizi_scraping.pagination import needs_browser

log = logging.getLogger(__name__)
RETRYING = frozenset(
    {Response.RETRY.value, Response.BACK_OFF.value, Response.SLOW_DOWN.value, Response.RETRY_LATER.value}
)


class PageBackend(Protocol):
    def get(self, url: str) -> WebResponse: ...


class CachedBackend:
    """Serves a page from what is already saved when it is still fresh; otherwise asks the real backend.

    A served page is a normal response (its links still feed the crawl) marked `x-mzizi-via: cache`, so unchanged
    pages are not fetched or re-rendered again within the freshness window."""

    def __init__(self, inner: PageBackend, lookup: Callable[[str], WebResponse | None]) -> None:
        self.inner, self.lookup = inner, lookup

    def get(self, url: str) -> WebResponse:
        cached = self.lookup(url)
        return cached if cached is not None else self.inner.get(url)

    def __getattr__(self, name: str):  # noqa: ANN204 - `take_extra` and friends belong to the wrapped backend
        return getattr(self.inner, name)


class HybridBackend:
    """Plain HTTP first; a browser only for a page whose static HTML is not the real content (an app shell, a notice that
    scripts are required, button pagination). Most pages are static, and HTTP is many times cheaper than rendering."""

    def __init__(self, http: PageBackend, browser: Callable[[], PageBackend]) -> None:
        self.http, self._make_browser = http, browser
        self._browser: PageBackend | None = None
        self.rendered = 0

    def _browser_backend(self) -> PageBackend:
        if self._browser is None:
            self._browser = self._make_browser()
        return self._browser

    def get(self, url: str) -> WebResponse:
        response = self.http.get(url)
        if not response.usable or not response.is_html or response.block is not None or response.refused is not None:
            return response
        if not needs_browser(response.text, response.final_url):
            return response
        self.rendered += 1
        return self._browser_backend().get(url)

    def take_extra(self, url: str) -> list[WebResponse]:
        return self._browser.take_extra(url) if self._browser is not None and hasattr(self._browser, "take_extra") else []


class HttpBackend:
    def __init__(self, client: WebClient) -> None:
        self.client = client

    def get(self, url: str) -> WebResponse:
        return self.client.get(url)


def to_response(url: str, page: RenderedPage) -> WebResponse:
    headers = {**page.headers}
    headers.setdefault("content-type", "text/html")
    headers["x-mzizi-via"] = "browser"
    return WebResponse(
        url=url,
        final_url=page.final_url or url,
        status=page.status,
        headers=headers,
        body=page.html.encode("utf-8"),
        redirects=page.redirects,
        error=page.error,
    )


class BrowserBackend:
    """Fetches with a browser session. Scope, budget and robots are decided by the client first; blocks and challenges
    follow the client's block policy, and a challenge may be handed to a person through the optional handler."""

    def __init__(
        self,
        client: WebClient,
        session: BrowserSession,
        challenges: ChallengeHandler | None = None,
        screenshots: bool = False,
        paginate_pages: int = 0,
    ) -> None:
        self.client, self.session, self.challenges = client, session, challenges
        self.screenshots, self._shots = screenshots, 0
        self.paginate_pages = paginate_pages
        self._extra: dict[str, list[WebResponse]] = {}

    def take_extra(self, url: str) -> list[WebResponse]:
        """The further pages (`#page-N`) walked behind `url`, handed over once."""
        return self._extra.pop(url, [])

    def get(self, url: str) -> WebResponse:
        attempt = 0
        while True:
            refusal = self.client.preflight(url)
            if refusal is not None:
                return refusal
            self.client.wait_for_slot(url)
            page = self.session.goto(url)
            response = to_response(url, page)
            if not page.error:
                allowed, reason = scope_decision(self.client.policy, response.final_url, self.client.start_hosts)
                if not allowed:
                    return response.model_copy(update={"body": b"", "error": f"navigation left scope: {reason}"})
                if response.final_url != url:
                    robots = self.client.robots_for(response.final_url)
                    if not robots.allowed:
                        return response.model_copy(update={"body": b"", "refused": robots})
            block = detect_challenge(page) or detect_block(page.status, page.headers, response.body, page.error)
            if block is None:
                self.client.blocks.ok()
                if self.paginate_pages > 1 and not page.error and hasattr(self.session, "paginate"):
                    try:
                        extra = self.session.paginate(self.paginate_pages)
                    except Exception as problem:  # pagination is best effort: the first page is already good
                        log.warning("pagination of %s failed: %s", url, str(problem)[:120])
                        extra = ()
                    self._extra[url] = [to_response(snap.final_url, snap) for snap in extra]
                if self.screenshots and not page.error:
                    self._shots += 1
                    try:
                        self.session.screenshot(f"{self._shots:04d}", True)
                    except Exception as problem:  # a missed screenshot never stops a crawl
                        log.warning("screenshot of %s failed: %s", url, str(problem)[:120])
                return response
            decision = self.client.blocks.decide(url, block, attempt, page.headers)
            response = response.model_copy(update={"block": block, "decision": decision})
            if decision.response in RETRYING:
                self.client.sleep(decision.wait_seconds)
                attempt += 1
                continue
            needs_person = decision.response in (Response.HUMAN_REVIEW.value, Response.PAUSE.value)
            if needs_person and self.challenges is not None and self.challenges.resolve(page, block):
                attempt += 1
                continue
            return response
