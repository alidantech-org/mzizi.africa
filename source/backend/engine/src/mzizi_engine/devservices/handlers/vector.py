"""Qdrant capabilities."""

from __future__ import annotations

from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.devservices.errors import ServiceUnavailable
from mzizi_engine.devservices.requests import ClassifyRequest, NoRequest, RunRequest, SearchRequest
from mzizi_engine.devservices.settings import load_settings
from mzizi_engine.devservices.vector.embedders import HashEmbedder, make_embedder
from mzizi_engine.devservices.vector.indexing import index_run
from mzizi_engine.devservices.vector.labels import read_labels
from mzizi_engine.devservices.vector.models import ClassificationReport, IndexReport, SearchReport, ServiceStatus
from mzizi_engine.devservices.vector.querying import classify_text, search_chunks
from mzizi_engine.devservices.vector.store import Point, QdrantStore

PROBE = "probe"


class ProbeResult(BaseModel):
    url: str
    reachable: bool
    round_trip: bool
    collections: dict[str, int]


class DropReport(BaseModel):
    dropped: tuple[str, ...]


def _store() -> QdrantStore:
    store = QdrantStore(load_settings())
    if not store.reachable():
        raise ServiceUnavailable(
            f"Qdrant at {store.settings.vector_url} is not reachable: start it (see the dev services guide) or set DEV_VECTOR_URL"
        )
    return store


def vector_test(request: NoRequest) -> ProbeResult:
    """Writes and reads back one point with a tiny hashing vector; needs no embedding model."""
    store = _store()
    try:
        embedder = HashEmbedder()
        store.ensure(PROBE, embedder.dimensions)
        vector = embedder.embed(["connectivity probe"])[0]
        store.upsert(PROBE, [Point(key="probe", vector=tuple(vector), payload={"probe": True})])
        found = store.search(PROBE, vector, 1, {})
        round_trip = bool(found and found[0].payload.get("probe") is True)
        return ProbeResult(
            url=store.settings.vector_url, reachable=True, round_trip=round_trip, collections=store.collections()
        )
    finally:
        store.close()


def vector_status(request: NoRequest) -> ServiceStatus:
    store = QdrantStore(load_settings())
    try:
        reachable = store.reachable()
        return ServiceStatus(
            url=store.settings.vector_url, reachable=reachable, collections=store.collections() if reachable else {}
        )
    finally:
        store.close()


def vector_index(request: RunRequest) -> IndexReport:
    folder = Path(request.source)
    if not folder.is_dir():
        raise FileNotFoundError(f"not a run folder: {folder}")
    store = _store()
    try:
        return index_run(store, make_embedder(store.settings), folder)
    finally:
        store.close()


def vector_search(request: SearchRequest) -> SearchReport:
    store = _store()
    try:
        return search_chunks(store, make_embedder(store.settings), request.query, request.limit, request.run_id)
    finally:
        store.close()


def vector_classify(request: ClassifyRequest) -> ClassificationReport:
    store = _store()
    try:
        text = Path(request.input).read_text(encoding="utf-8")
        return classify_text(store, make_embedder(store.settings), text, read_labels(Path(request.labels)))
    finally:
        store.close()


def vector_drop(request: NoRequest) -> DropReport:
    store = _store()
    try:
        names = tuple(store.collections())
        for name in names:
            store.drop(name)
        return DropReport(dropped=names)
    finally:
        store.close()
