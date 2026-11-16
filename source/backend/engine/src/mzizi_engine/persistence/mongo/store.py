"""A thin, typed wrapper over one MongoDB database: idempotent upserts, queries and counts."""

from __future__ import annotations

from collections.abc import Sequence
from typing import TYPE_CHECKING

from mzizi_engine.config import MongoConfig
from mzizi_engine.jsonvalue import JsonValue

if TYPE_CHECKING:
    from pymongo import MongoClient
    from pymongo.collection import Collection

type Document = dict[str, JsonValue]
SERVER_SELECTION_MS = 2000
POOL_SIZE = 16  # one process, a few threads: a small pool keeps the server's file handles free


class MongoUnavailable(RuntimeError):
    """MongoDB cannot be reached or its client library is missing."""


class MongoStore:
    def __init__(self, settings: MongoConfig) -> None:
        import pymongo

        self.settings = settings
        self._client: MongoClient[Document] = pymongo.MongoClient(
            settings.url, serverSelectionTimeoutMS=SERVER_SELECTION_MS, maxPoolSize=POOL_SIZE
        )
        self._database = self._client[settings.database]

    def _collection(self, name: str) -> Collection[Document]:
        collection: Collection[Document] = self._database[name]
        return collection

    def ping(self) -> str:
        """The server version; raises `MongoUnavailable` when MongoDB cannot be reached."""
        try:
            return str(self._client.server_info().get("version", "unknown"))
        except Exception as problem:
            raise MongoUnavailable(
                f"MongoDB at {self.settings.url} is not reachable: {str(problem)[:150]}"
            ) from problem

    def upsert_many(self, collection: str, documents: Sequence[Document]) -> int:
        """Idempotent writes keyed by `_id`; returns how many documents were new or changed."""
        target, changed = self._collection(collection), 0
        for document in documents:
            result = target.replace_one({"_id": document["_id"]}, document, upsert=True)
            changed += int(result.upserted_id is not None or result.modified_count > 0)
        return changed

    def find(self, collection: str, query: Document, limit: int) -> list[Document]:
        return list(self._collection(collection).find(query).limit(max(1, limit)))

    def counts(self) -> dict[str, int]:
        return {
            name: self._collection(name).estimated_document_count()
            for name in sorted(self._database.list_collection_names())
        }

    def close(self) -> None:
        self._client.close()
