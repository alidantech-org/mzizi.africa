"""The background writer: saves pages on a worker thread while the crawler keeps fetching."""

from __future__ import annotations

import queue
import threading
from collections.abc import Callable

from mzizi_crawler.shared.sitestore.models import Outcome, Visit
from mzizi_crawler.shared.sitestore.store import SiteStore


class SiteWriter:
    """Saves pages on a worker thread while the crawler keeps fetching: IO overlaps fetching, a bounded queue stops the
    crawler running far ahead of the disk, and one worker keeps every page's state consistent."""

    _STOP = object()

    def __init__(
        self, store: SiteStore, depth: int = 64, on_saved: Callable[[Outcome, Visit], None] | None = None
    ) -> None:
        self.store = store
        self.on_saved = on_saved
        self.outcomes: list[Outcome] = []
        self._queue: queue.Queue[object] = queue.Queue(maxsize=depth)
        self._error: BaseException | None = None
        self._thread = threading.Thread(target=self._work, name="site-writer", daemon=True)
        self._thread.start()

    def submit_cached(self, path: str) -> None:
        self._queue.put(path)

    def submit(self, visit: Visit) -> None:
        if self._error is not None:
            raise self._error
        self._queue.put(visit)  # blocks while the queue is full

    def _work(self) -> None:
        while True:
            item = self._queue.get()
            if item is self._STOP:
                return
            try:
                if self._error is None and isinstance(item, Visit):
                    outcome = self.store.record(item)
                    self.outcomes.append(outcome)
                    if self.on_saved is not None:
                        self.on_saved(outcome, item)
                elif self._error is None and isinstance(item, str):
                    self.outcomes.append(self.store.record_cached(item))
            except BaseException as problem:  # reported to the caller at close; later pages are dropped, not half-saved
                self._error = problem

    def close(self) -> list[Outcome]:
        """Waits for every queued page to be saved; raises the first error the worker hit."""
        self._queue.put(self._STOP)
        self._thread.join()
        if self._error is not None:
            raise self._error
        return self.outcomes
