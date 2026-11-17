"""The Qdrant adapter of the vector store port, over its REST API.

Qdrant is a derived search copy. Postgres and the seed stay the source of truth: every point carries the table, code and a
content hash, so the sync can tell what changed and any hit can be traced back to its row."""

from __future__ import annotations

import uuid

import httpx

from mzizi_engine.persistence.vector.port import VectorHit, VectorPoint

NAMESPACE = uuid.UUID("6f1c1e0a-3d52-4c8e-9b1a-5d2a8c0e7a11")
BATCH = 256


def point_id(key: str) -> str:
    """The same key always gives the same point id, so a re-sent point replaces itself."""
    return str(uuid.uuid5(NAMESPACE, key))


class QdrantVectorStore:
    def __init__(self, base_url: str = "http://127.0.0.1:6333", client: httpx.Client | None = None) -> None:
        self._client = client or httpx.Client(base_url=base_url, timeout=30)

    def _call(self, method: str, path: str, body: dict[str, object] | None = None) -> dict[str, object]:
        response = self._client.request(method, path, json=body)
        response.raise_for_status()
        body_out: dict[str, object] = response.json()
        return body_out

    def ensure(self, collection: str, size: int) -> bool:
        """Create the collection when it is missing; returns whether it was created."""
        if self._client.get(f"/collections/{collection}").status_code == 200:
            return False
        self._call("PUT", f"/collections/{collection}", {"vectors": {"size": size, "distance": "Cosine"}})
        return True

    def hashes(self, collection: str) -> dict[str, str]:
        """Every point id in the collection with the content hash it was written with."""
        found: dict[str, str] = {}
        offset: object = None
        while True:
            body: dict[str, object] = {"limit": 1000, "with_payload": ["hash"], "with_vector": False}
            if offset is not None:
                body["offset"] = offset
            result = self._call("POST", f"/collections/{collection}/points/scroll", body)["result"]
            assert isinstance(result, dict)
            for point in result["points"]:
                found[str(point["id"])] = str(point.get("payload", {}).get("hash", ""))
            offset = result.get("next_page_offset")
            if offset is None:
                return found

    def upsert(self, collection: str, points: tuple[VectorPoint, ...]) -> int:
        for start in range(0, len(points), BATCH):
            batch = [
                {"id": p.id, "vector": list(p.vector), "payload": p.payload} for p in points[start : start + BATCH]
            ]
            self._call("PUT", f"/collections/{collection}/points?wait=true", {"points": batch})
        return len(points)

    def delete(self, collection: str, ids: tuple[str, ...]) -> int:
        for start in range(0, len(ids), BATCH):
            self._call(
                "POST",
                f"/collections/{collection}/points/delete?wait=true",
                {"points": list(ids[start : start + BATCH])},
            )
        return len(ids)

    def search(
        self, collection: str, vector: tuple[float, ...], limit: int, where: dict[str, str] | None = None
    ) -> tuple[VectorHit, ...]:
        body: dict[str, object] = {"vector": list(vector), "limit": limit, "with_payload": True}
        if where:
            body["filter"] = {"must": [{"key": k, "match": {"value": v}} for k, v in where.items()]}
        result = self._call("POST", f"/collections/{collection}/points/search", body)["result"]
        assert isinstance(result, list)
        return tuple(
            VectorHit(id=str(h["id"]), score=float(h["score"]), payload={k: str(v) for k, v in h["payload"].items()})
            for h in result
        )

    def drop(self, collection: str) -> None:
        self._client.delete(f"/collections/{collection}")
