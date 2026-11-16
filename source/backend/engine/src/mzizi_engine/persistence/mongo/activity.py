"""The activity store: MongoDB holds what the engine did and found; large files stay files, linked by path and hash.

This implements the crawler's `Activity` port. One MongoDB connection is shared by the whole process (many connections
exhausted the server's file handles when several sites ran at once). Writes retry through a short outage and, if MongoDB
stays unreachable, are spooled to disk and replayed the next time it is reachable, so a record is never lost.
`ENGINE_ACTIVITY_STORE=files` turns the store off (tests, CI); an unreachable MongoDB at the start falls back to files.
"""

from __future__ import annotations

import json
import logging
import os
import threading
import time
from collections.abc import Callable, Mapping, Sequence
from pathlib import Path

from mzizi_crawler.shared.layout import DevLayout
from mzizi_engine.persistence.mongo.settings import MongoSettings, MongoSettingsError
from mzizi_engine.persistence.mongo.store import Document, MongoStore, MongoUnavailable

log = logging.getLogger(__name__)
STORE_ENV = "ENGINE_ACTIVITY_STORE"
READ_LIMIT = 1_000_000
RETRY_WAITS = (0.5, 1.0, 2.0, 4.0, 8.0)  # seconds between attempts through a short outage
SPOOL_DIR = "spool"

_lock = threading.Lock()
_shared: MongoStore | None = None


def _transient(problem: BaseException) -> bool:
    """A connection-level failure (the server restarting, a dropped socket), as opposed to a bad request."""
    return type(problem).__name__ in {
        "AutoReconnect",
        "ServerSelectionTimeoutError",
        "NetworkTimeout",
        "ConnectionFailure",
        "NotPrimaryError",
    } or isinstance(problem, (MongoUnavailable, ConnectionError, TimeoutError))


def _shared_store(settings: MongoSettings) -> MongoStore:
    global _shared
    with _lock:
        if _shared is None:
            _shared = MongoStore(settings)  # never closed by us: the OS closes it at exit, after every thread is done
        return _shared


class MongoActivity:
    """A handle on the shared store. `close()` does nothing: the connection lives for the process."""

    def __init__(self, store: MongoStore) -> None:
        self._store = store

    def _retry[T](self, action: Callable[[], T]) -> T:
        for wait in (*RETRY_WAITS, None):
            try:
                return action()
            except Exception as problem:
                if wait is None or not _transient(problem):
                    raise
                log.warning("MongoDB unavailable (%s); retrying in %.1fs", type(problem).__name__, wait)
                time.sleep(wait)
        raise AssertionError("unreachable: the final attempt re-raises")

    def put(self, collection: str, documents: Sequence[Document]) -> int:
        if not documents:
            return 0
        try:
            return self._retry(lambda: self._store.upsert_many(collection, documents))
        except Exception as problem:
            if not _transient(problem):
                raise
            _spool(collection, documents)  # MongoDB stayed down: keep the records on disk, replay them later
            return 0

    def get(self, collection: str, query: Document, limit: int = READ_LIMIT) -> list[Document]:
        return self._retry(lambda: self._store.find(collection, query, limit))

    def close(self) -> None:
        return None


def _spool_dir() -> Path:
    return DevLayout.locate().root / SPOOL_DIR


def _spool(collection: str, documents: Sequence[Document]) -> None:
    folder = _spool_dir()
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{os.getpid()}.jsonl"
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps({"collection": collection, "documents": list(documents)}, default=str) + "\n")
    log.error("MongoDB unreachable: %d %s record(s) spooled to %s", len(documents), collection, path)


def replay_spool(activity: MongoActivity) -> int:
    """Writes any spooled records to MongoDB; a spool file is removed only after all of it was written."""
    folder = _spool_dir()
    replayed = 0
    for path in sorted(folder.glob("*.jsonl")) if folder.is_dir() else []:
        try:
            lines = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
            for entry in lines:
                activity.put(entry["collection"], entry["documents"])
                replayed += len(entry["documents"])
        except Exception as problem:
            log.warning("spool %s not replayed yet: %s", path.name, problem)
            continue
        path.unlink()
    return replayed


def activity_opener(env: Mapping[str, str]) -> Callable[[], MongoActivity | None]:
    """The function the crawler calls to open the store: `None` when it is off, unconfigured or unreachable."""

    def open_activity() -> MongoActivity | None:
        if env.get(STORE_ENV) == "files":
            return None
        try:
            store = _shared_store(MongoSettings.from_env(env))
            store.ping()
        except (MongoSettingsError, MongoUnavailable, ImportError) as problem:
            log.warning("activity store unavailable, writing files instead: %s", problem)
            return None
        activity = MongoActivity(store)
        replay_spool(activity)
        return activity

    return open_activity
