"""Keep a vector collection in step with the rows it is built from, doing only the work that changed."""

from __future__ import annotations

import hashlib
from collections.abc import Iterable
from dataclasses import dataclass

from pydantic import BaseModel

from mzizi_engine.persistence.vector.port import VectorPoint
from mzizi_engine.persistence.vector.qdrant import QdrantVectorStore, point_id
from mzizi_patterns import Embedder


@dataclass(frozen=True)
class IndexRow:
    """One text to search by, and where it came from."""

    table: str
    code: str
    text: str
    language: str = ""
    kind: str = ""

    @property
    def key(self) -> str:
        return f"{self.table}|{self.code}|{self.language}|{self.text}"

    @property
    def content_hash(self) -> str:
        return hashlib.sha256(f"{self.key}|{self.kind}".encode()).hexdigest()[:24]


class SyncReport(BaseModel):
    collection: str
    created_collection: bool
    rows: int
    embedded: int
    unchanged: int
    removed: int


def collection_name(prefix: str, embedder: Embedder) -> str:
    """The model is in the name, so changing the model builds a fresh collection instead of mixing vectors."""
    return f"mzizi_{prefix}_{embedder.name}"


def sync(
    store: QdrantVectorStore, collection: str, rows: Iterable[IndexRow], embedder: Embedder, prune: bool = True
) -> SyncReport:
    created = store.ensure(collection, embedder.dimension)
    known = store.hashes(collection)
    wanted = {point_id(r.key): r for r in rows}
    changed = [(pid, r) for pid, r in wanted.items() if known.get(pid) != r.content_hash]
    points = tuple(
        VectorPoint(
            id=pid,
            vector=embedder.embed(r.text),
            payload={
                "hash": r.content_hash,
                "table": r.table,
                "code": r.code,
                "text": r.text,
                "language": r.language,
                "kind": r.kind,
            },
        )
        for pid, r in changed
    )
    store.upsert(collection, points)
    stale = tuple(pid for pid in known if pid not in wanted) if prune else ()
    store.delete(collection, stale)
    return SyncReport(
        collection=collection,
        created_collection=created,
        rows=len(wanted),
        embedded=len(points),
        unchanged=len(wanted) - len(points),
        removed=len(stale),
    )
