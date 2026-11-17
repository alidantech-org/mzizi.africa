"""Bring the vector collections in step with the seed (and later the database): the one place the sync is started from."""

from __future__ import annotations

from pathlib import Path

from mzizi_engine.persistence.vector.embedders import embedder_from_environment
from mzizi_engine.persistence.vector.qdrant import QdrantVectorStore
from mzizi_engine.persistence.vector.sync import SyncReport, collection_name, sync
from mzizi_engine.runtime.assembly.knowledge import index_rows


def sync_names(
    seed_root: Path, scopes: tuple[str, ...], url: str, prefix: str = "names", prune: bool = True
) -> SyncReport:
    embedder = embedder_from_environment()
    return sync(
        QdrantVectorStore(url), collection_name(prefix, embedder), index_rows(seed_root, scopes), embedder, prune=prune
    )
