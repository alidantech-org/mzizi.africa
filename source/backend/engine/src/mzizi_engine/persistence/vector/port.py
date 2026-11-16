"""The vector store port and its typed points. Collections, dimensions and models are decided by the caller, not named here."""

from __future__ import annotations

from typing import Protocol

from pydantic import Field

from mzizi_engine.runtime.contracts.base import Frozen


class VectorNotImplementedError(NotImplementedError):
    """Vector persistence is planned and not built yet."""


class VectorPoint(Frozen):
    id: str
    vector: tuple[float, ...] = Field(min_length=1)
    #: Facts stored beside the vector so a hit can be traced back to its source (collection, document id, content hash).
    payload: dict[str, str]


class VectorHit(Frozen):
    id: str
    score: float
    payload: dict[str, str]


class VectorStore(Protocol):
    def upsert(self, collection: str, points: tuple[VectorPoint, ...]) -> int:
        """Idempotent writes keyed by point id; returns how many points were new or changed."""
        ...

    def search(self, collection: str, vector: tuple[float, ...], limit: int) -> tuple[VectorHit, ...]: ...

    def drop(self, collection: str) -> None: ...


class UnimplementedVectorStore:
    def upsert(self, collection: str, points: tuple[VectorPoint, ...]) -> int:
        raise VectorNotImplementedError("vector persistence is not implemented yet")

    def search(self, collection: str, vector: tuple[float, ...], limit: int) -> tuple[VectorHit, ...]:
        raise VectorNotImplementedError("vector persistence is not implemented yet")

    def drop(self, collection: str) -> None:
        raise VectorNotImplementedError("vector persistence is not implemented yet")
