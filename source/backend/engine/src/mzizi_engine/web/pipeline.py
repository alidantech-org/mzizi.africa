"""Work that runs beside the crawl instead of after it: Markdown conversion in worker processes, downloads in threads.

Pages are converted and files fetched as soon as they are known, so a crawl is not followed by a long tail of waiting.
Every stage is bounded (queues, worker counts) so a fast crawl cannot run far ahead of the disk or the network, and
every stage is drained before the run reports, so nothing is left half done.
"""

from __future__ import annotations

import multiprocessing
import os
import queue
import threading
from concurrent.futures import Future, ProcessPoolExecutor

from mzizi_engine.activity import Activity
from mzizi_engine.layout import DevLayout
from mzizi_engine.sitestore import SiteStore
from mzizi_engine.web.handlers.downloads import FoundAt
from mzizi_engine.web.handlers.queue import QUEUE, FileFetcher, State, queue_item
from mzizi_engine.web.requests import FetchQueueRequest
from mzizi_extraction import extract_html_document, learn_boilerplate
from mzizi_extraction.document import render_markdown
from mzizi_extraction.document.boilerplate import Boilerplate

SAMPLE_PAGES = 8  # pages seen before repeated header/footer blocks are learned; earlier pages wait for it
DOWNLOAD_QUEUE_DEPTH = 500
DOWNLOAD_WORKERS = 2  # polite to the site: files are fetched beside the crawl, not in a flood


def convert(html: str, url: str, boilerplate: Boilerplate) -> str:
    """HTML to Markdown (runs in a worker process)."""
    output, _title, _removed = extract_html_document(html, url, boilerplate)
    return render_markdown(output.pages).replace("<!-- page 1 -->\n\n", "", 1)


class MarkdownPool:
    """Converts saved pages to Markdown in worker processes while the crawl continues."""

    def __init__(self, store: SiteStore, workers: int | None = None) -> None:
        self.store = store
        count = workers or int(os.environ.get("MZIZI_MARKDOWN_WORKERS") or max(1, min(4, (os.cpu_count() or 2) - 1)))
        self._executor = ProcessPoolExecutor(max_workers=count, mp_context=multiprocessing.get_context("spawn"))
        self._lock = threading.Lock()
        self._samples: list[str] = []
        self._pending: list[tuple[str, str, str, str]] = []
        self._boilerplate: Boilerplate | None = None
        self.errors: list[BaseException] = []
        self.converted = 0

    def add(self, path: str, html: str, url: str, raw_sha: str) -> None:
        with self._lock:
            if self._boilerplate is None:
                self._samples.append(html)
                self._pending.append((path, html, url, raw_sha))
                if len(self._samples) >= SAMPLE_PAGES:
                    self._learn()
                return
            self._submit(path, html, url, raw_sha)

    def _learn(self) -> None:
        self._boilerplate = learn_boilerplate(self._samples)
        for job in self._pending:
            self._submit(*job)
        self._pending.clear()

    def _submit(self, path: str, html: str, url: str, raw_sha: str) -> None:
        assert self._boilerplate is not None
        future = self._executor.submit(convert, html, url, self._boilerplate)
        future.add_done_callback(lambda done: self._done(done, path, raw_sha))

    def _done(self, future: Future[str], path: str, raw_sha: str) -> None:
        try:
            self.store.write_markdown_for(path, future.result(), raw_sha)
            self.converted += 1
        except BaseException as problem:
            self.errors.append(problem)

    def close(self) -> None:
        with self._lock:
            if self._boilerplate is None:
                self._learn()
        self._executor.shutdown(wait=True)


class DownloadPool:
    """Fetches files while the crawl discovers them. Everything offered is queued in MongoDB (once per URL); the
    workers take items until `limit` files are done, and the rest stay queued for the next run."""

    _STOP = object()

    def __init__(self, request: FetchQueueRequest, activity: Activity, layout: DevLayout, limit: int) -> None:
        self.activity, self.layout, self.limit = activity, layout, limit
        self.site = layout.website(request.site)
        self.host = self.site.address.host
        self._seen: set[str] = set()
        self._queue: queue.Queue[object] = queue.Queue(maxsize=DOWNLOAD_QUEUE_DEPTH)
        self._lock = threading.Lock()
        self.counts = {"done": 0, "failed": 0, "skipped": 0}
        self._threads = []
        for number in range(DOWNLOAD_WORKERS):
            fetcher = FileFetcher(activity, self.site, layout, f"w{number}", request)
            thread = threading.Thread(target=self._work, args=(fetcher,), name=f"download-{number}", daemon=True)
            thread.start()
            self._threads.append(thread)

    def offer(self, url: str, kind: str, found: FoundAt) -> None:
        if url in self._seen:
            return
        self._seen.add(url)
        item = queue_item(self.host, url, kind, found)
        existing = self.activity.get(QUEUE, {"_id": item["_id"]}, 1)
        if existing:
            if existing[0].get("state") in (State.DONE.value, State.SKIPPED.value, State.MISSING.value) or existing[0].get("attempts", 0) >= 3:
                return  # already fetched, refused or given up on: never again
            item = existing[0]
        else:
            self.activity.put(QUEUE, [item])
        with self._lock:
            room = self.counts["done"] + self._queue.qsize() < self.limit
        if room:
            self._queue.put(item)

    def _work(self, fetcher: FileFetcher) -> None:
        try:
            while True:
                item = self._queue.get()
                if item is self._STOP:
                    return
                with self._lock:
                    if self.counts["done"] >= self.limit:
                        continue
                outcome = fetcher.process(item)  # type: ignore[arg-type]
                with self._lock:
                    self.counts[outcome] += 1
        finally:
            fetcher.close()

    def close(self) -> None:
        for _ in self._threads:
            self._queue.put(self._STOP)
        for thread in self._threads:
            thread.join()
