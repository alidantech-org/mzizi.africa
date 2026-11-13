"""Failures and blocks, told apart, each with a configured response and a recorded reason.

Responses are the ones a considerate client has: retry, back off, slow down, pause, retry later, skip, stop, or ask a
person. Challenge *detection* is here; *resolution* is a separate, authorised step (a person, or an adapter the source
owner approved) and is never performed by this module.
"""

from __future__ import annotations

import random
from enum import StrEnum

from mzizi_fetch.models import Frozen
from mzizi_fetch.web.vocabulary import vocabulary

MAX_WAIT = 300.0


class BlockKind(StrEnum):
    CONNECTION = "connection"
    DNS = "dns"
    TIMEOUT = "timeout"
    UNAUTHORIZED = "http_401"
    FORBIDDEN = "http_403"
    NOT_FOUND = "http_404"
    RATE_LIMITED = "http_429"
    SERVER_ERROR = "http_5xx"
    CAPTCHA = "captcha"
    CHALLENGE = "challenge"
    NOTICE = "block_notice"


class Response(StrEnum):
    RETRY = "retry"
    BACK_OFF = "back_off"
    SLOW_DOWN = "slow_down"
    PAUSE = "pause"
    RETRY_LATER = "retry_later"
    SKIP = "skip"
    STOP = "stop"
    HUMAN_REVIEW = "human_review"


class Block(Frozen):
    kind: BlockKind
    detail: str
    status: int = 0


class BlockDecision(Frozen):
    url: str
    kind: str
    detail: str
    status: int
    response: str
    wait_seconds: float
    attempt: int
    reason: str


def _b(kind: BlockKind, detail: str, status: int = 0) -> Block:
    return Block(kind=kind, detail=detail, status=status)


def classify_failure(error: str) -> BlockKind | None:
    """Maps a transport error description to a kind (the transport layer names the exception class)."""
    lowered = error.lower()
    if "timeout" in lowered:
        return BlockKind.TIMEOUT
    if "name or service" in lowered or "gaierror" in lowered or "nodename" in lowered or "dns" in lowered:
        return BlockKind.DNS
    if error:
        return BlockKind.CONNECTION
    return None


def detect_block(status: int, headers: dict[str, str], body: bytes, error: str = "") -> Block | None:
    """The block, challenge or failure a response represents, or None for a usable response."""
    if error:
        kind = classify_failure(error)
        return _b(kind or BlockKind.CONNECTION, error)
    lowered = {k.lower(): v for k, v in headers.items()}
    text = body[:8000].decode("utf-8", errors="ignore").lower()
    if lowered.get("cf-mitigated", "").lower() == "challenge":
        return _b(BlockKind.CHALLENGE, "challenge header", status)
    markers = vocabulary().challenge_markers
    for marker in markers.captcha:
        if marker in text:
            return _b(BlockKind.CAPTCHA, f"marker {marker!r}", status)
    for marker in markers.challenge:
        if marker in text:
            return _b(BlockKind.CHALLENGE, f"marker {marker!r}", status)
    for marker in markers.notice:
        if marker in text and status >= 400:
            return _b(BlockKind.NOTICE, f"marker {marker!r}", status)
    return {
        401: _status(BlockKind.UNAUTHORIZED, status),
        403: _status(BlockKind.FORBIDDEN, status),
        404: _status(BlockKind.NOT_FOUND, status),
        429: _status(BlockKind.RATE_LIMITED, status),
    }.get(status, _b(BlockKind.SERVER_ERROR, f"HTTP {status}", status) if status >= 500 else None)


def _status(kind: BlockKind, status: int) -> Block:
    return _b(kind, f"HTTP {status}", status)


def retry_after(headers: dict[str, str]) -> float | None:
    value = {k.lower(): v for k, v in headers.items()}.get("retry-after", "").strip()
    return min(float(value), MAX_WAIT) if value.isdigit() else None


class BlockPolicy:
    """Chooses and records the response to each failure. Escalates to `stop` after repeated consecutive blocks."""

    def __init__(
        self,
        responses: dict[BlockKind, Response] | None = None,
        max_retries: int = 2,
        stop_after: int = 8,
        base_wait: float = 5.0,
        jitter: bool = True,
    ) -> None:
        defaults = {BlockKind(kind): Response(value) for kind, value in vocabulary().block_responses.items()}
        self.responses = {**defaults, **(responses or {})}
        self.max_retries = max_retries
        self.stop_after = stop_after
        self.base_wait = base_wait
        self.jitter = jitter
        self.consecutive = 0
        self.decisions: list[BlockDecision] = []

    def ok(self) -> None:
        self.consecutive = 0

    def decide(self, url: str, block: Block, attempt: int, headers: dict[str, str] | None = None) -> BlockDecision:
        self.consecutive += 1
        response = self.responses[block.kind]
        reason = f"{block.kind.value}: configured response {response.value}"
        if self.consecutive >= self.stop_after:
            response, reason = Response.STOP, f"{self.consecutive} consecutive blocks; stopping"
        elif response in (Response.RETRY, Response.BACK_OFF, Response.SLOW_DOWN) and attempt >= self.max_retries:
            response, reason = Response.SKIP, f"{block.kind.value}: {attempt} retries used; skipping"
        wait = 0.0
        if response in (Response.RETRY, Response.BACK_OFF, Response.SLOW_DOWN, Response.RETRY_LATER):
            wait = retry_after(headers or {}) or self.base_wait * (2**attempt) * (
                random.uniform(0.5, 1.5) if self.jitter else 1.0
            )
            wait = min(wait, MAX_WAIT)
        decision = BlockDecision(
            url=url,
            kind=block.kind.value,
            detail=block.detail,
            status=block.status,
            response=response.value,
            wait_seconds=round(wait, 2),
            attempt=attempt + 1,
            reason=reason,
        )
        self.decisions.append(decision)
        return decision
