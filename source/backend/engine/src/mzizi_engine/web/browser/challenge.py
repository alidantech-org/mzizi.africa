"""Access challenges in the browser: detection, and a separate, authorised resolution step.

Detection reports what the page shows. Resolution is never automatic here: `ManualChallengeHandler` asks a person to
complete the check in the visible window. An adapter approved by the source owner can implement `ChallengeHandler` too.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import Protocol

from mzizi_engine.web.browser.models import RenderedPage
from mzizi_fetch.web.blocks import Block, detect_block


class ChallengeHandler(Protocol):
    def resolve(self, page: RenderedPage, block: Block) -> bool: ...


def detect_challenge(page: RenderedPage) -> Block | None:
    return detect_block(page.status, page.headers, page.html.encode("utf-8"), page.error)


class ManualChallengeHandler:
    """Hands the window to a person. `wait` blocks until they say the check is done and returns True to continue."""

    def __init__(self, wait: Callable[[str, str], bool]) -> None:
        self._wait = wait

    def resolve(self, page: RenderedPage, block: Block) -> bool:
        return self._wait(page.final_url, block.detail)
