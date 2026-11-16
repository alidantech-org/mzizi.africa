"""Cooperative cancellation: the runtime sets a token, a running job checks it between steps."""

from __future__ import annotations

import threading

from mzizi_engine.runtime.contracts.errors import JobCancelledError


class CancellationToken:
    def __init__(self) -> None:
        self._event = threading.Event()

    def cancel(self) -> None:
        self._event.set()

    @property
    def cancelled(self) -> bool:
        return self._event.is_set()

    def raise_if_cancelled(self) -> None:
        if self._event.is_set():
            raise JobCancelledError("the job was cancelled")
