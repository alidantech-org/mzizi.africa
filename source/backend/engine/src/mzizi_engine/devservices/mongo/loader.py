"""Loads a run folder's records into MongoDB: pages, links, resources, errors and Markdown, idempotently."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.devservices.mongo.sandbox import Document, MongoSandbox
from mzizi_engine.jsonvalue import JsonValue

TABLES = ("pages", "paths", "links", "external_hosts", "images", "documents", "files", "media", "errors")
LOADED_FIELDS = ("run_id", "collection", "content_hash")


class LoadReport(BaseModel):
    run_id: str
    folder: str
    collections: dict[str, int]
    changed: int


def _hash(record: Document) -> str:
    return hashlib.sha256(json.dumps(record, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:24]


def _document(run_id: str, collection: str, record: Document) -> Document:
    digest = _hash(record)
    return {
        "_id": f"{run_id}:{collection}:{digest}",
        **record,
        "run_id": run_id,
        "collection": collection,
        "content_hash": digest,
    }


def _read_rows(path: Path) -> list[Document]:
    rows = json.loads(path.read_text(encoding="utf-8"))
    return [row for row in rows if isinstance(row, dict)] if isinstance(rows, list) else []


def _markdown_documents(run_id: str, folder: Path) -> list[Document]:
    sources = sorted((folder / "markdown").glob("*.md")) if (folder / "markdown").is_dir() else []
    if (folder / "document.md").exists():
        sources.append(folder / "document.md")
    documents: list[Document] = []
    for path in sources:
        text = path.read_text(encoding="utf-8")
        record: Document = {"file": path.name, "chars": len(text), "text": text}
        documents.append(_document(run_id, "markdown", record))
    return documents


def load_run(sandbox: MongoSandbox, folder: Path) -> LoadReport:
    """Reads every known table (`<name>.json`) and Markdown file in `folder`; nothing outside it is read."""
    run_id = folder.name
    counts: dict[str, int] = {}
    changed = 0
    for table in TABLES:
        data = folder / f"{table}.json"
        if not data.exists():
            continue
        documents = [_document(run_id, table, row) for row in _read_rows(data)]
        counts[table] = len(documents)
        changed += sandbox.upsert_many(table, documents)
    markdown = _markdown_documents(run_id, folder)
    if markdown:
        counts["markdown"] = len(markdown)
        changed += sandbox.upsert_many("markdown", markdown)
    return LoadReport(run_id=run_id, folder=str(folder), collections=counts, changed=changed)


def parse_filter(text: str) -> Document:
    """The parsing boundary for `mongo find`: a JSON object, nothing else."""
    value: JsonValue = json.loads(text or "{}")
    if not isinstance(value, dict):
        raise ValueError('the filter must be a JSON object, for example {"run_id": "..."}')
    return value
