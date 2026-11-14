"""The engine's activity store: MongoDB holds what the engine did and found; large files stay files, linked by path and hash.

`ENGINE_ACTIVITY_STORE=files` turns the store off (tests, CI); otherwise a reachable MongoDB is used and an unreachable
one falls back to files so no result is lost.
"""

from __future__ import annotations

import logging
import os
from collections.abc import Sequence

from mzizi_engine.devservices.errors import ServiceUnavailable
from mzizi_engine.devservices.mongo.sandbox import Document, MongoSandbox
from mzizi_engine.devservices.settings import load_settings

log = logging.getLogger(__name__)
STORE_ENV = "ENGINE_ACTIVITY_STORE"
READ_LIMIT = 1_000_000


class Activity:
    def __init__(self, sandbox: MongoSandbox) -> None:
        self._sandbox = sandbox

    def put(self, collection: str, documents: Sequence[Document]) -> int:
        return self._sandbox.upsert_many(collection, documents) if documents else 0

    def get(self, collection: str, query: Document, limit: int = READ_LIMIT) -> list[Document]:
        return self._sandbox.find(collection, query, limit)

    def close(self) -> None:
        self._sandbox.close()


def open_activity() -> Activity | None:
    """The MongoDB activity store, or None when it is switched off or unreachable (callers then write files)."""
    if os.environ.get(STORE_ENV) == "files":
        return None
    try:
        sandbox = MongoSandbox(load_settings())
        sandbox.ping()
    except (ServiceUnavailable, ImportError) as problem:
        log.warning("activity store unavailable, writing files instead: %s", problem)
        return None
    return Activity(sandbox)
