"""Where a finished crawl is recorded: MongoDB when available (rows, run summary, audit trail), CSV files linked by hash."""

from __future__ import annotations

import hashlib
import json
from collections.abc import Sequence
from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.activity import Activity
from mzizi_engine.devservices.mongo.sandbox import Document
from mzizi_engine.jsonvalue import JsonValue
from mzizi_engine.web.export import read_csv

ROWS_COLLECTION_PREFIX = "crawl_"
FILES_COLLECTION = "crawl_csv_files"
RUNS_COLLECTION = "crawl_runs"


def _digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _doc(run_id: str, collection: str, row: Document) -> Document:
    key = hashlib.sha256(json.dumps(row, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:24]
    return {"_id": f"{run_id}:{collection}:{key}", "run_id": run_id, **row}


def record_tables(activity: Activity, folder: Path, names: Sequence[str]) -> dict[str, int]:
    """Loads each written CSV into `crawl_<name>` and records the CSV itself (path, hash, rows) in `crawl_files`."""
    run_id, counts = folder.name, {}
    files: list[Document] = []
    for name in names:
        path = folder / f"{name}.csv"
        if not path.is_file():
            continue
        rows: list[Document] = [dict(row) for row in read_csv(path)]  # strings as exported; the CSV stays the source
        counts[name] = activity.put(f"{ROWS_COLLECTION_PREFIX}{name}", [_doc(run_id, name, row) for row in rows])
        files.append(
            {
                "_id": f"{run_id}:{name}.csv",
                "run_id": run_id,
                "name": f"{name}.csv",
                "path": str(path),
                "sha256": _digest(path),
                "rows": len(rows),
                "kind": "csv",
            }
        )
    activity.put(FILES_COLLECTION, files)
    return counts


def record_run(activity: Activity, folder: Path, summary: BaseModel, extras: dict[str, JsonValue]) -> None:
    """The run summary plus its audit trail (block decisions, policy audit, site tree) as one document."""
    document: Document = {"_id": folder.name, "run_id": folder.name, "folder": str(folder), **extras}
    document["summary"] = summary.model_dump(mode="json")
    activity.put(RUNS_COLLECTION, [document])


def record_provenance(activity: Activity, run_id: str, lines: Sequence[BaseModel]) -> int:
    return activity.put(
        f"{ROWS_COLLECTION_PREFIX}provenance", [_doc(run_id, "provenance", m.model_dump(mode="json")) for m in lines]
    )
