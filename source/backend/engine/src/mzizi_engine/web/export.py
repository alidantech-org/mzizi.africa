"""Deterministic CSV, JSON and JSON Lines exports of typed records."""

from __future__ import annotations

import csv
import json
from collections.abc import Sequence
from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.jsonvalue import JsonValue
from mzizi_engine.web.requests import ExportFormat


def _rows(records: Sequence[BaseModel], columns: Sequence[str]) -> list[dict[str, JsonValue]]:
    """Rows sorted by the exported columns, in column order, so the same records always give the same file."""
    rows = [record.model_dump(mode="json") for record in records]
    return sorted(rows, key=lambda row: tuple(json.dumps(row.get(c), ensure_ascii=False) for c in columns))


def write_table(
    folder: Path,
    name: str,
    records: Sequence[BaseModel],
    columns: Sequence[str],
    formats: Sequence[ExportFormat] = (ExportFormat.CSV, ExportFormat.JSON),
    ordered: bool = False,
) -> list[str]:
    """Writes `<name>.csv|json|jsonl`. Columns are stable; rows keep their order when `ordered`, else are sorted."""
    folder.mkdir(parents=True, exist_ok=True)
    rows = [r.model_dump(mode="json") for r in records] if ordered else _rows(records, columns)
    written: list[str] = []
    if ExportFormat.CSV in formats:
        with (folder / f"{name}.csv").open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(columns), extrasaction="ignore", lineterminator="\n")
            writer.writeheader()
            writer.writerows(rows)
        written.append(f"{name}.csv")
    if ExportFormat.JSON in formats:
        (folder / f"{name}.json").write_text(json.dumps(rows, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        written.append(f"{name}.json")
    if ExportFormat.JSONL in formats:
        (folder / f"{name}.jsonl").write_text(
            "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows), encoding="utf-8"
        )
        written.append(f"{name}.jsonl")
    return written


def read_csv(path: Path) -> list[dict[str, str]]:
    """Rows of a CSV export (the parsing boundary for reading crawl tables back)."""
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def columns_of(model: type[BaseModel]) -> list[str]:
    return list(model.model_fields)


def site_tree(paths: Sequence[str]) -> dict[str, JsonValue]:
    """Nested path segments of every internal page, for a quick picture of the site's shape."""
    root: dict[str, JsonValue] = {}
    for path in sorted(set(paths)):
        node = root
        for segment in [s for s in path.split("?")[0].split("/") if s] or ["/"]:
            child = node.setdefault(segment, {})
            if not isinstance(child, dict):
                break
            node = child
    return root
