"""MongoDB capabilities."""

from __future__ import annotations

from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.devservices.mongo.loader import LoadReport, load_run, parse_filter
from mzizi_engine.devservices.mongo.sandbox import Document, MongoSandbox
from mzizi_engine.devservices.requests import FindRequest, NoRequest, RunRequest
from mzizi_engine.devservices.settings import load_settings
from mzizi_engine.jsonvalue import JsonValue

TEXT_PREVIEW = 400


class MongoStatus(BaseModel):
    url: str
    database: str
    version: str
    round_trip: bool
    collections: dict[str, int]


class FindResult(BaseModel):
    collection: str
    count: int
    documents: list[Document]


class DropResult(BaseModel):
    dropped: str


def mongo_test(request: NoRequest) -> MongoStatus:
    settings = load_settings()
    sandbox = MongoSandbox(settings)
    try:
        version = sandbox.ping()
        return MongoStatus(
            url=settings.mongo_url,
            database=settings.mongo_database,
            version=version,
            round_trip=sandbox.round_trip(),
            collections=sandbox.counts(),
        )
    finally:
        sandbox.close()


def mongo_load(request: RunRequest) -> LoadReport:
    folder = Path(request.source)
    if not folder.is_dir():
        raise FileNotFoundError(f"not a run folder: {folder}")
    sandbox = MongoSandbox(load_settings())
    try:
        return load_run(sandbox, folder)
    finally:
        sandbox.close()


def _preview(document: Document) -> Document:
    """Long text fields are shortened for display; the stored document is untouched."""
    shown: dict[str, JsonValue] = {}
    for key, value in document.items():
        shown[key] = f"{value[:TEXT_PREVIEW]}…" if isinstance(value, str) and len(value) > TEXT_PREVIEW else value
    return shown


def mongo_find(request: FindRequest) -> FindResult:
    sandbox = MongoSandbox(load_settings())
    try:
        found = sandbox.find(request.collection, parse_filter(request.query), request.limit)
    finally:
        sandbox.close()
    return FindResult(collection=request.collection, count=len(found), documents=[_preview(d) for d in found])


def mongo_stats(request: NoRequest) -> MongoStatus:
    return mongo_test(request)


def mongo_drop(request: NoRequest) -> DropResult:
    sandbox = MongoSandbox(load_settings())
    try:
        return DropResult(dropped=sandbox.drop_dev_database())
    finally:
        sandbox.close()
