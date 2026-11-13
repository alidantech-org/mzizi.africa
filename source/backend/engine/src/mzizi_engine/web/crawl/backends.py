"""How a crawl obtains a page: plain HTTP through the web client, or a real browser under the same policy."""

from __future__ import annotations

from typing import Protocol

from mzizi_engine.web.browser.adapter import BrowserSession
from mzizi_engine.web.browser.challenge import ChallengeHandler, detect_challenge
from mzizi_engine.web.browser.models import RenderedPage
from mzizi_fetch.web.blocks import Response, detect_block
from mzizi_fetch.web.client import WebClient, WebResponse

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

    def __init__(self, client: WebClient, session: BrowserSession, challenges: ChallengeHandler | None = None) -> None:
        self.client, self.session, self.challenges = client, session, challenges

    def get(self, url: str) -> WebResponse:
        refusal = self.client.preflight(url)
        if refusal is not None:
            return refusal
        attempt = 0
        while True:
            page = self.session.goto(url)
            response = to_response(url, page)
            block = detect_challenge(page) or detect_block(page.status, page.headers, response.body, page.error)
            if block is None:
                self.client.blocks.ok()
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
