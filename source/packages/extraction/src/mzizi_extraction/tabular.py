"""CSV and JSON extraction into the same segment/diagnostic shape as the other extractors."""
from __future__ import annotations

import csv
import io
import json

from .result import Output

MAX_BYTES = 256 * 1024 * 1024


def _diag(level: str, code: str, message: str) -> dict:
    return {"level": level, "code": code, "message": message}


def extract_csv(data: bytes, profile: str | None = None) -> Output:
    """One `row` segment per data row, keyed by header. Ragged rows are reported, never padded silently."""
    if len(data) > MAX_BYTES:
        return Output("failed", diagnostics=[_diag("error", "too_large", "input exceeds the size limit")])
    try:
        text = data.decode("utf-8-sig")
    except UnicodeDecodeError:
        return Output("failed", diagnostics=[_diag("error", "not_utf8", "CSV input is not UTF-8")])
    reader = csv.reader(io.StringIO(text))
    header = next(reader, None)
    if not header:
        return Output("failed", diagnostics=[_diag("error", "empty", "no header row")])
    segments, diagnostics = [], []
    for number, row in enumerate(reader, start=2):
        if not any(cell.strip() for cell in row):
            continue
        if len(row) != len(header):
            diagnostics.append(_diag("warning", "ragged_row", f"line {number} has {len(row)} cells, header has {len(header)}"))
        segments.append({"kind": "row", "line": number, "content": dict(zip(header, row))})
    return Output("partial" if diagnostics else "succeeded", segments, diagnostics)


def extract_json(data: bytes, profile: str | None = None) -> Output:
    """A JSON array becomes one `record` segment per element; any other value is a single segment."""
    if len(data) > MAX_BYTES:
        return Output("failed", diagnostics=[_diag("error", "too_large", "input exceeds the size limit")])
    try:
        document = json.loads(data)
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        return Output("failed", diagnostics=[_diag("error", "invalid_json", str(error))])
    items = document if isinstance(document, list) else [document]
    return Output("succeeded", [{"kind": "record", "index": i, "content": item} for i, item in enumerate(items)])
