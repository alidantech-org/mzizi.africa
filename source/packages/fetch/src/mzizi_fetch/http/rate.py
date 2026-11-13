"""Request spacing: at least 1/rps seconds between requests, per limiter (one per host)."""

from __future__ import annotations

import time
from collections.abc import Callable


class RateLimiter:
    def __init__(
        self,
        requests_per_second: float,
        clock: Callable[[], float] = time.monotonic,
        sleep: Callable[[float], None] = time.sleep,
    ) -> None:
        self.interval = 1.0 / requests_per_second
        self.clock, self.sleep = clock, sleep
        self._next = 0.0

    def wait(self) -> float:
        now = self.clock()
        delay = max(0.0, self._next - now)
        if delay:
            self.sleep(delay)
        self._next = max(now, self._next) + self.interval
        return delay
