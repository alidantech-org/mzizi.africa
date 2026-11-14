"""How a crawl obtains a page: plain HTTP through the web client, or a real browser under the same policy."""

from __future__ import annotations

import logging
from typing import Protocol

from mzizi_engine.web.browser.adapter import BrowserSession
from mzizi_engine.web.browser.challenge import ChallengeHandler, detect_challenge
from mzizi_engine.web.browser.models import RenderedPage
from mzizi_fetch.web.blocks import Response, detect_block
from mzizi_fetch.web.client import WebClient, WebResponse
from mzizi_fetch.web.policy import scope_decision

log = logging.getLogger(__name__)
RETRYING = frozenset(
    {Response.RETRY.value, Response.BACK_OFF.value, Response.SLOW_DOWN.value, Response.RETRY_LATER.value}
)


class PageBackend(Protocol):
    def get(self, url: str) -> WebResponse: ...


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
    ) -> None:
        self.client, self.session, self.challenges = client, session, challenges
        self.screenshots, self._shots = screenshots, 0

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
