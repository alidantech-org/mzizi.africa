"""The activity store port: where the crawler records what it did and found, when a store is wired in.

The crawler never opens a database. The engine provides an implementation (MongoDB, with retry and a disk spool) and calls
`configure_activity`; with none configured, `open_activity` returns `None` and callers write files only.
"""

from __future__ import annotations

from collections.abc import Callable, Sequence
from typing import Protocol

from mzizi_crawler.shared.jsonvalue import JsonValue

type Document = dict[str, JsonValue]
READ_LIMIT = 1_000_000


class Activity(Protocol):
    def put(self, collection: str, documents: Sequence[Document]) -> int:
        """Idempotent writes keyed by `_id`; returns how many documents were new or changed."""
        ...

    def get(self, collection: str, query: Document, limit: int = READ_LIMIT) -> list[Document]: ...

    def close(self) -> None: ...


def _nothing() -> Activity | None:
    return None


_opener: Callable[[], Activity | None] = _nothing


def configure_activity(opener: Callable[[], Activity | None]) -> None:
    """Install the function that opens the activity store (the engine does this once, at assembly)."""
    global _opener
    _opener = opener


def open_activity() -> Activity | None:
    return _opener()
