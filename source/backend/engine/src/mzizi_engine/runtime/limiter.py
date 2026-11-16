"""A resizable concurrency limit: callers wait for a slot, and the ceiling can change while jobs run."""

from __future__ import annotations

import threading
import time


class Limiter:
    def __init__(self, limit: int) -> None:
        self._limit = limit
        self._in_flight = 0
        self._condition = threading.Condition()

    @property
    def limit(self) -> int:
        with self._condition:
            return self._limit

    @property
    def in_flight(self) -> int:
        with self._condition:
            return self._in_flight

    def set_limit(self, limit: int) -> None:
        """Change the ceiling. Running jobs keep their slots; a lower ceiling only blocks new ones."""
        with self._condition:
            self._limit = limit
            self._condition.notify_all()

    def acquire(self, timeout: float | None) -> bool:
        deadline = None if timeout is None else time.monotonic() + timeout
        with self._condition:
            while self._in_flight >= self._limit:
                remaining = None if deadline is None else deadline - time.monotonic()
                if remaining is not None and remaining <= 0:
                    return False
                self._condition.wait(remaining)
            self._in_flight += 1
            return True

    def release(self) -> None:
        with self._condition:
            self._in_flight -= 1
            self._condition.notify_all()

    def wait_idle(self, timeout: float) -> bool:
        deadline = time.monotonic() + timeout
        with self._condition:
            while self._in_flight > 0:
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    return False
                self._condition.wait(remaining)
            return True
