"""Vector persistence is a skeleton: the port exists and every call refuses loudly."""

from __future__ import annotations

import pytest

from mzizi_engine.persistence.vector import (
    UnimplementedVectorStore,
    VectorNotImplementedError,
    VectorPoint,
    VectorStore,
)


def test_the_skeleton_satisfies_the_port_and_refuses_every_call() -> None:
    store: VectorStore = UnimplementedVectorStore()
    point = VectorPoint(id="p", vector=(0.1, 0.2), payload={"source": "doc"})
    with pytest.raises(VectorNotImplementedError):
        store.upsert("c", (point,))
    with pytest.raises(VectorNotImplementedError):
        store.search("c", (0.1, 0.2), 3)
    with pytest.raises(VectorNotImplementedError):
        store.drop("c")
