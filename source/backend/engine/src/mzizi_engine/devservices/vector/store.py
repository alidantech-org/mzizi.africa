"""The vector store port and its Qdrant implementation. Point ids are deterministic, so re-indexing is idempotent."""

from __future__ import annotations

import importlib
import uuid
from collections.abc import Sequence
from typing import TYPE_CHECKING, Protocol

from pydantic import BaseModel, ConfigDict

from mzizi_engine.devservices.errors import ServiceRefused, ServiceUnavailable
from mzizi_engine.devservices.settings import ServiceSettings
from mzizi_engine.jsonvalue import JsonValue

if TYPE_CHECKING:
    from qdrant_client import QdrantClient

type Payload = dict[str, JsonValue]
POINT_NAMESPACE = uuid.UUID("6f1d7a4e-3c0b-4d55-9a57-2b1c0b7e5a11")
UPSERT_BATCH = 64
PROBE_COLLECTION = "probe"


class Point(BaseModel):
    model_config = ConfigDict(frozen=True)

    key: str  # deterministic identity (for chunks: text hash + model + preprocessing version)
    vector: tuple[float, ...]
    payload: Payload


class Scored(BaseModel):
    model_config = ConfigDict(frozen=True)

    score: float
    payload: Payload


class VectorStore(Protocol):
    def ensure(self, collection: str, dimensions: int) -> None: ...

    def upsert(self, collection: str, points: Sequence[Point]) -> int: ...

    def search(self, collection: str, vector: Sequence[float], limit: int, match: dict[str, str]) -> list[Scored]: ...

    def collections(self) -> dict[str, int]: ...

    def drop(self, collection: str) -> None: ...


def point_id(key: str) -> str:
    return str(uuid.uuid5(POINT_NAMESPACE, key))


class QdrantStore:
    def __init__(self, settings: ServiceSettings) -> None:
        try:
            module = importlib.import_module("qdrant_client")
        except ModuleNotFoundError as problem:
            raise ServiceUnavailable(
                "qdrant-client is not installed: run `uv sync --all-packages --extra services`"
            ) from problem
        self.settings = settings
        self._models = importlib.import_module("qdrant_client.models")
        self._client: QdrantClient = module.QdrantClient(url=settings.vector_url, timeout=10, check_compatibility=False)

    def _name(self, collection: str) -> str:
        return f"{self.settings.collection_prefix}{collection}"

    def reachable(self) -> bool:
        try:
            self._client.get_collections()
        except Exception:
            return False
        return True

    def ensure(self, collection: str, dimensions: int) -> None:
        name = self._name(collection)
        try:
            if self._client.collection_exists(name):
                return
            params = self._models.VectorParams(size=dimensions, distance=self._models.Distance.COSINE)
            self._client.create_collection(collection_name=name, vectors_config=params)
        except Exception as problem:
            raise ServiceUnavailable(f"Qdrant at {self.settings.vector_url} failed: {str(problem)[:150]}") from problem

    def upsert(self, collection: str, points: Sequence[Point]) -> int:
        name, total = self._name(collection), 0
        for start in range(0, len(points), UPSERT_BATCH):
            batch = [
                self._models.PointStruct(id=point_id(p.key), vector=list(p.vector), payload=dict(p.payload))
                for p in points[start : start + UPSERT_BATCH]
            ]
            self._client.upsert(collection_name=name, points=batch, wait=True)
            total += len(batch)
        return total

    def search(self, collection: str, vector: Sequence[float], limit: int, match: dict[str, str]) -> list[Scored]:
        conditions = [
            self._models.FieldCondition(key=k, match=self._models.MatchValue(value=v)) for k, v in match.items()
        ]
        flt = self._models.Filter(must=conditions) if conditions else None
        reply = self._client.query_points(
            collection_name=self._name(collection), query=list(vector), limit=limit, query_filter=flt, with_payload=True
        )
        return [Scored(score=float(p.score), payload=dict(p.payload or {})) for p in reply.points]

    def collections(self) -> dict[str, int]:
        found: dict[str, int] = {}
        for item in self._client.get_collections().collections:
            if item.name.startswith(self.settings.collection_prefix):
                found[item.name.removeprefix(self.settings.collection_prefix)] = int(
                    self._client.count(collection_name=item.name, exact=True).count
                )
        return dict(sorted(found.items()))

    def drop(self, collection: str) -> None:
        name = self._name(collection)
        if not name.startswith(self.settings.collection_prefix):
            raise ServiceRefused(f"refusing to drop {name!r}: not a dev collection")
        self._client.delete_collection(name)

    def close(self) -> None:
        self._client.close()
